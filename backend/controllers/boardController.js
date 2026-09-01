/**
 * Assigned to: Hiruka (Board Controller & Real-Time)
 * Description: Controller for Board CRUD, OCC conflict detection, and Socket.io broadcasts.
 */
import Board from '../models/Board.js';

/**
 * Helper to emit Socket.io updates to a board's room
 */
function broadcastBoardUpdate(req, boardId, event, data) {
  const io = req.app.get('io');
  if (io) {
    io.to(`board:${boardId}`).emit(event, data);
  }
}

/**
 * @route   GET /api/boards
 * @desc    Get all boards for authenticated user (owned + shared)
 * @access  Private
 */
export async function getBoards(req, res, next) {
  try {
    const userBoards = await Board.findAllForUser(req.user.id, req.user.email);
    return res.status(200).json(userBoards);
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/boards/:id
 * @desc    Get single board by ID
 * @access  Private
 */
export async function getBoardById(req, res, next) {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Access check: Owner or Collaborator
    const isOwner = board.ownerId === req.user.id;
    const isCollaborator = board.collaborators?.some(
      (c) => c.email && c.email.toLowerCase() === (req.user.email || '').toLowerCase()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this board' });
    }

    return res.status(200).json(board);
  } catch (error) {
    next(error);
  }
}

/**
 * @route   POST /api/boards
 * @desc    Create a new board
 * @access  Private
 */
export async function createBoard(req, res, next) {
  try {
    const { title, description, accent } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Board title is required' });
    }

    const board = await Board.create({
      title,
      description,
      accent,
      ownerId: req.user.id,
    });

    return res.status(201).json(board);
  } catch (error) {
    next(error);
  }
}

/**
 * @route   PUT /api/boards/:id
 * @desc    Update board columns, cards, metadata with Optimistic Concurrency Control (OCC)
 * @access  Private
 */
export async function updateBoard(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, accent, columns, collaborators, expectedVersion } = req.body;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Access check
    const isOwner = board.ownerId === req.user.id;
    const isCollaborator = board.collaborators?.some(
      (c) => c.email && c.email.toLowerCase() === (req.user.email || '').toLowerCase()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to edit this board' });
    }

    // Perform versioned update with OCC
    const updatedBoard = await Board.updateWithOCC(
      id,
      { title, description, accent, columns, collaborators },
      expectedVersion
    );

    // Broadcast live change to connected Socket.io clients
    broadcastBoardUpdate(req, id, 'board:updated', updatedBoard);

    return res.status(200).json(updatedBoard);
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        message: error.message,
        currentVersion: error.currentVersion,
        latestBoard: error.latestBoard,
      });
    }
    next(error);
  }
}

/**
 * @route   DELETE /api/boards/:id
 * @desc    Delete board (owner only)
 * @access  Private
 */
export async function deleteBoard(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Board.deleteById(id, req.user.id);

    // Notify connected room members
    broadcastBoardUpdate(req, id, 'board:deleted', { id });

    return res.status(200).json({ message: 'Board deleted successfully', id: deleted.id });
  } catch (error) {
    if (error.statusCode === 403) {
      return res.status(403).json({ message: error.message });
    }
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
}

/**
 * @route   POST /api/boards/:id/collaborators
 * @desc    Invite collaborator by email
 * @access  Private
 */
export async function inviteCollaborator(req, res, next) {
  try {
    const { id } = req.params;
    const { email, name, role } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid collaborator email' });
    }

    const collaborators = await Board.addCollaborator(id, { email, name, role });

    // Broadcast update
    const board = await Board.findById(id);
    broadcastBoardUpdate(req, id, 'board:updated', board);

    return res.status(200).json({
      message: 'Collaborator invited successfully',
      collaborators,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
}

export default {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  inviteCollaborator,
};
