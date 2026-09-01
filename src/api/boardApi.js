/**
 * Assigned to: Udeshi (Client API Services & Automated Testing)
 * Description: Client API service for board CRUD, column/card moves, OCC conflict handling.
 */
import { apiClient } from './client.js';

export const boardApi = {
  async getBoards() {
    return apiClient.get('/boards');
  },

  async getBoardById(id) {
    return apiClient.get(`/boards/${id}`);
  },

  async createBoard(boardData) {
    return apiClient.post('/boards', boardData);
  },

  async updateBoard(id, updates, expectedVersion) {
    return apiClient.put(`/boards/${id}`, {
      ...updates,
      expectedVersion,
    });
  },

  async deleteBoard(id) {
    return apiClient.delete(`/boards/${id}`);
  },

  async inviteCollaborator(id, collaboratorData) {
    return apiClient.post(`/boards/${id}/collaborators`, collaboratorData);
  },
};

export default boardApi;
