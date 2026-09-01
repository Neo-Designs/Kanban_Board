/**
 * Assigned to: Udeshi (Client API Services & Automated Testing)
 * Description: Supertest integration test suite for Board CRUD, Authorization, and OCC Concurrency.
 */
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Board from '../models/Board.js';

describe('Board API & Concurrency Endpoints', () => {
  let alexToken;
  let samToken;

  beforeEach(async () => {
    User.reset();
    Board.reset();

    // Login Alex
    const alexRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alex@syncboard.dev', password: 'password123' });
    alexToken = alexRes.body.token;

    // Login Sam
    const samRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'sam@syncboard.dev', password: 'password123' });
    samToken = samRes.body.token;
  });

  describe('Board CRUD Lifecycle', () => {
    it('should create a new board with initial columns and version 1', async () => {
      const res = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${alexToken}`)
        .send({
          title: 'Q4 Launch Plan',
          description: 'Ship version 2.0 deliverables',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Q4 Launch Plan');
      expect(res.body.version).toBe(1);
      expect(res.body.columns.length).toBe(3);
      expect(res.body.columns[0].title).toBe('To Do');
    });

    it('should retrieve all boards accessible to user', async () => {
      const res = await request(app)
        .get('/api/boards')
        .set('Authorization', `Bearer ${alexToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should retrieve single board by ID for authorized member', async () => {
      const res = await request(app)
        .get('/api/boards/b-demo-product-roadmap')
        .set('Authorization', `Bearer ${alexToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe('b-demo-product-roadmap');
      expect(res.body.columns).toBeDefined();
    });
  });

  describe('Optimistic Concurrency Control (OCC)', () => {
    it('should successfully update board and increment version on matching expectedVersion', async () => {
      const boardRes = await request(app)
        .get('/api/boards/b-demo-product-roadmap')
        .set('Authorization', `Bearer ${alexToken}`);

      const currentBoard = boardRes.body;
      const initialVersion = currentBoard.version;

      const updateRes = await request(app)
        .put('/api/boards/b-demo-product-roadmap')
        .set('Authorization', `Bearer ${alexToken}`)
        .send({
          title: 'Product Roadmap (Updated)',
          expectedVersion: initialVersion,
        });

      expect(updateRes.statusCode).toBe(200);
      expect(updateRes.body.title).toBe('Product Roadmap (Updated)');
      expect(updateRes.body.version).toBe(initialVersion + 1);
    });

    it('should reject stale update with 409 Conflict when expectedVersion is outdated', async () => {
      // Step 1: User A updates board, advancing version from 1 to 2
      await request(app)
        .put('/api/boards/b-demo-product-roadmap')
        .set('Authorization', `Bearer ${alexToken}`)
        .send({
          title: 'First Edit by Alex',
          expectedVersion: 1,
        });

      // Step 2: User B tries to save with stale version 1
      const conflictRes = await request(app)
        .put('/api/boards/b-demo-product-roadmap')
        .set('Authorization', `Bearer ${samToken}`)
        .send({
          title: 'Conflicting Edit by Sam',
          expectedVersion: 1, // Outdated! Current version is now 2
        });

      expect(conflictRes.statusCode).toBe(409);
      expect(conflictRes.body.message).toMatch(/conflict/i);
      expect(conflictRes.body.currentVersion).toBe(2);
    });
  });

  describe('Collaborators & Authorization', () => {
    it('should allow board owner to invite a collaborator', async () => {
      const res = await request(app)
        .post('/api/boards/b-demo-product-roadmap/collaborators')
        .set('Authorization', `Bearer ${alexToken}`)
        .send({
          email: 'collab@team.dev',
          name: 'Collab Dev',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.collaborators.some((c) => c.email === 'collab@team.dev')).toBe(true);
    });

    it('should forbid non-owners from deleting the board (403 Forbidden)', async () => {
      // Sam is collaborator, not owner of b-demo-product-roadmap
      const res = await request(app)
        .delete('/api/boards/b-demo-product-roadmap')
        .set('Authorization', `Bearer ${samToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/forbidden/i);
    });
  });
});
