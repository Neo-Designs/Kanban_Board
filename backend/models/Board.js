import fs from 'fs';
import path from 'path';
import { config } from '../config/env.js';
import { initialBoards } from '../data/mockData.js';

let boards = [];

export const BOARD_ACCENTS = ['#6b8f62', '#8a7a52', '#a07850', '#5f7d6e', '#96795b', '#7c8b5f'];
export const COLUMN_ACCENTS = ['#6b8f62', '#8a7a52', '#a07850', '#b08d3f', '#5e7d5a', '#5f7d6e'];

function defaultColumns() {
  return [
    {
      id: 'col-todo',
      title: 'To Do',
      accent: '#6b8f62',
      cards: [],
    },
    {
      id: 'col-doing',
      title: 'In Progress',
      accent: '#8a7a52',
      cards: [],
    },
    {
      id: 'col-done',
      title: 'Done',
      accent: '#5e7d5a',
      cards: [],
    },
  ];
}

/**
 * Load boards from persistence or initialize with seeds
 */
function loadData() {
  try {
    if (fs.existsSync(config.dataFile)) {
      const content = fs.readFileSync(config.dataFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.boards)) {
        boards = parsed.boards;
        return;
      }
    }
  } catch (error) {
    console.warn('[Board Model] Could not read db file, using seed data.');
  }
  boards = JSON.parse(JSON.stringify(initialBoards));
  saveData();
}

/**
 * Save data to JSON file
 */
function saveData() {
  try {
    const dir = path.dirname(config.dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let existing = {};
    if (fs.existsSync(config.dataFile)) {
      try {
        existing = JSON.parse(fs.readFileSync(config.dataFile, 'utf-8'));
      } catch {}
    }
    existing.boards = boards;
    fs.writeFileSync(config.dataFile, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Board Model] Failed to persist data:', error.message);
  }
}

// Initial load
loadData();

export const Board = {
  /**
   * Find all boards accessible by a user (owned or collaborated)
   */
  async findAllForUser(userId, userEmail) {
    const cleanEmail = (userEmail || '').toLowerCase().trim();
    return boards.filter((b) => {
      if (b.ownerId === userId) return true;
      if (b.collaborators && b.collaborators.some((c) => c.email && c.email.toLowerCase() === cleanEmail)) {
        return true;
      }
      return false;
    });
  },

  /**
   * Find a single board by ID
   */
  async findById(id) {
    if (!id) return null;
    return boards.find((b) => String(b.id) === String(id)) || null;
  },

  /**
   * Create a new board with default columns
   */
  async create({ title, description = '', accent, ownerId }) {
    if (!title || !title.trim()) {
      const err = new Error('Board title is required');
      err.statusCode = 400;
      throw err;
    }

    const selectedAccent = accent || BOARD_ACCENTS[boards.length % BOARD_ACCENTS.length];

    const newBoard = {
      id: `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      accent: selectedAccent,
      ownerId,
      collaborators: [],
      columns: defaultColumns(),
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    boards.push(newBoard);
    saveData();

    return newBoard;
  },

  /**
   * Update board with Optimistic Concurrency Control (OCC)
   * If expectedVersion is supplied and does not match, a 409 Conflict error is thrown.
   */
  async updateWithOCC(id, updates, expectedVersion) {
    const index = boards.findIndex((b) => String(b.id) === String(id));
    if (index === -1) {
      const err = new Error('Board not found');
      err.statusCode = 404;
      throw err;
    }

    const current = boards[index];

    // Optimistic Concurrency Control check
    if (expectedVersion !== undefined && expectedVersion !== null) {
      if (Number(expectedVersion) !== Number(current.version)) {
        const conflictErr = new Error('Conflict: Board has been modified by another member.');
        conflictErr.statusCode = 409;
        conflictErr.currentVersion = current.version;
        conflictErr.latestBoard = current;
        throw conflictErr;
      }
    }

    // Apply allowed updates
    if (updates.title !== undefined) current.title = updates.title.trim();
    if (updates.description !== undefined) current.description = updates.description.trim();
    if (updates.accent !== undefined) current.accent = updates.accent;
    if (updates.columns !== undefined) current.columns = updates.columns;
    if (updates.collaborators !== undefined) current.collaborators = updates.collaborators;

    // Increment document version
    current.version = (current.version || 1) + 1;
    current.updatedAt = new Date().toISOString();

    boards[index] = current;
    saveData();

    return current;
  },

  /**
   * Delete board (restricted to owner)
   */
  async deleteById(id, userId) {
    const index = boards.findIndex((b) => String(b.id) === String(id));
    if (index === -1) {
      const err = new Error('Board not found');
      err.statusCode = 404;
      throw err;
    }

    if (boards[index].ownerId !== userId) {
      const err = new Error('Forbidden: Only the board owner can delete this board');
      err.statusCode = 403;
      throw err;
    }

    const deleted = boards.splice(index, 1)[0];
    saveData();
    return deleted;
  },

  /**
   * Add a collaborator to the board
   */
  async addCollaborator(boardId, { email, name, role = 'editor' }) {
    const board = await this.findById(boardId);
    if (!board) {
      const err = new Error('Board not found');
      err.statusCode = 404;
      throw err;
    }

    const cleanEmail = email.toLowerCase().trim();
    board.collaborators = board.collaborators || [];

    // Avoid duplicate invites
    const existing = board.collaborators.find((c) => c.email && c.email.toLowerCase() === cleanEmail);
    if (existing) {
      return board.collaborators;
    }

    board.collaborators.push({
      email: cleanEmail,
      name: name ? name.trim() : cleanEmail.split('@')[0],
      role,
    });

    board.version = (board.version || 1) + 1;
    board.updatedAt = new Date().toISOString();
    saveData();

    return board.collaborators;
  },

  /**
   * Reset store (used for test teardown)
   */
  reset() {
    boards = JSON.parse(JSON.stringify(initialBoards));
    saveData();
  }
};

export default Board;
