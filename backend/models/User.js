/**
 * Assigned to: Yash (User Model & Seed Data)
 * Description: User data model with bcrypt password hashing and repository methods.
 * Architecture: Designed to seamlessly map to Mongoose User schema in future milestone.
 */
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env.js';
import { initialUsers } from '../data/mockData.js';

let users = [];

/**
 * Load users from persistence or initialize with seeds
 */
function loadData() {
  try {
    if (fs.existsSync(config.dataFile)) {
      const content = fs.readFileSync(config.dataFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.users)) {
        users = parsed.users;
        return;
      }
    }
  } catch (error) {
    console.warn('[User Model] Could not read db file, using seed data.');
  }
  users = JSON.parse(JSON.stringify(initialUsers));
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
    existing.users = users;
    fs.writeFileSync(config.dataFile, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (error) {
    console.error('[User Model] Failed to persist data:', error.message);
  }
}

// Initial load
loadData();

export const User = {
  /**
   * Find user by email
   */
  async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    return users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  /**
   * Find user by ID
   */
  async findById(id) {
    if (!id) return null;
    return users.find((u) => u.id === id) || null;
  },

  /**
   * Create a new user with hashed password
   */
  async create({ name, email, password, role = 'Member', bio = '' }) {
    const cleanEmail = email.toLowerCase().trim();
    const existing = await this.findByEmail(cleanEmail);
    if (existing) {
      const err = new Error('A user with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role.trim(),
      bio: bio.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveData();

    return newUser;
  },

  /**
   * Compare entered password with hashed password
   */
  async matchPassword(enteredPassword, hashedPassword) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  },

  /**
   * Update user details (e.g. Profile)
   */
  async updateById(id, updates) {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const current = users[index];

    // If updating email, check for uniqueness
    if (updates.email && updates.email.toLowerCase() !== current.email.toLowerCase()) {
      const cleanEmail = updates.email.toLowerCase().trim();
      const duplicate = users.find((u) => u.email.toLowerCase() === cleanEmail && u.id !== id);
      if (duplicate) {
        const err = new Error('Email is already taken by another account');
        err.statusCode = 409;
        throw err;
      }
      current.email = cleanEmail;
    }

    if (updates.name !== undefined) current.name = updates.name.trim();
    if (updates.role !== undefined) current.role = updates.role.trim();
    if (updates.bio !== undefined) current.bio = updates.bio.trim();
    current.updatedAt = new Date().toISOString();

    users[index] = current;
    saveData();

    return current;
  },

  /**
   * Reset store (used for test teardown)
   */
  reset() {
    users = JSON.parse(JSON.stringify(initialUsers));
    saveData();
  }
};

export default User;
