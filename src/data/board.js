// yash
export const COLUMN_ACCENTS = ['#6b8f62', '#8a7a52', '#a07850', '#b08d3f', '#5e7d5a', '#5f7d6e'];

export function seedBoard(boardId) {
  return {
    id: boardId,
    columns: [
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
    ],
  };
}

export default seedBoard;
