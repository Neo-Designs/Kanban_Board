
const KEY = 'syncboard-boards';

export const BOARD_ACCENTS = ['#6b8f62', '#8a7a52', '#a07850', '#5f7d6e', '#96795b', '#7c8b5f'];

export function loadBoards() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveBoards(boards) {
  localStorage.setItem(KEY, JSON.stringify(boards));
}

export function getBoard(id) {
  return loadBoards().find((b) => String(b.id) === String(id)) ?? null;
}

export function createBoard({ title, description = '' }) {
  const boards = loadBoards();
  const board = {
    id: `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    description,
    accent: BOARD_ACCENTS[boards.length % BOARD_ACCENTS.length],
    createdAt: new Date().toISOString(),
  };
  saveBoards([...boards, board]);
  return board;
}

export function deleteBoard(id) {
  saveBoards(loadBoards().filter((b) => String(b.id) !== String(id)));
  localStorage.removeItem(`syncboard-board-${id}`);
}
