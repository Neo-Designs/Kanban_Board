import User from '../models/User.js';
import Board from '../models/Board.js';

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
export async function updateProfile(req, res, next) {
  try {
    const { name, role, email, bio } = req.body;

    const updatedUser = await User.updateById(req.user.id, {
      name,
      role,
      email,
      bio,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
}

/**
 * @route   GET /api/users/stats
 * @desc    Get live stats for user profile (boards, tasks done, teams)
 * @access  Private
 */
export async function getProfileStats(req, res, next) {
  try {
    const userBoards = await Board.findAllForUser(req.user.id, req.user.email);

    let tasksDoneCount = 0;
    const teamEmails = new Set();

    userBoards.forEach((b) => {
      // Count tasks in "Done" columns
      const doneCol = b.columns?.find((c) => c.title.toLowerCase().includes('done'));
      if (doneCol && doneCol.cards) {
        tasksDoneCount += doneCol.cards.length;
      }
      // Count unique collaborator teams/members
      if (b.collaborators) {
        b.collaborators.forEach((c) => {
          if (c.email) teamEmails.add(c.email.toLowerCase());
        });
      }
    });

    return res.status(200).json({
      boardsCount: userBoards.length,
      tasksDoneCount,
      teamsCount: teamEmails.size > 0 ? teamEmails.size : 1,
    });
  } catch (error) {
    next(error);
  }
}

export default { updateProfile, getProfileStats };
