/**
 * Assigned to: Yash (User Model & Seed Data)
 * Description: Initial mock seed data for users and sample boards.
 */
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

export const initialUsers = [
  {
    id: 'user-alex',
    name: 'Alex Kim',
    email: 'alex@syncboard.dev',
    password: bcrypt.hashSync('password123', salt),
    role: 'Frontend Lead',
    bio: 'Keeping boards tidy and pixel-perfect.',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'user-sam',
    name: 'Sam Taylor',
    email: 'sam@syncboard.dev',
    password: bcrypt.hashSync('password123', salt),
    role: 'Backend Architect',
    bio: 'Building reliable APIs and real-time flows.',
    createdAt: '2026-08-02T11:00:00.000Z',
    updatedAt: '2026-08-02T11:00:00.000Z',
  }
];

export const initialBoards = [
  {
    id: 'b-demo-product-roadmap',
    title: 'Product Roadmap',
    description: 'Quarterly feature deliverables and design improvements.',
    accent: '#6b8f62',
    ownerId: 'user-alex',
    collaborators: [
      { email: 'sam@syncboard.dev', name: 'Sam Taylor', role: 'editor' }
    ],
    version: 1,
    createdAt: '2026-08-03T12:00:00.000Z',
    updatedAt: '2026-08-03T12:00:00.000Z',
    columns: [
      {
        id: 'col-todo',
        title: 'To Do',
        accent: '#6b8f62',
        cards: [
          {
            id: 'c-1',
            title: 'Design Dark Mode tokens',
            label: 'Design',
            labelColor: '#A07850',
            assignee: 'Alex Kim',
            due: 'Aug 28',
            createdAt: '2026-08-03T12:30:00.000Z',
          },
          {
            id: 'c-2',
            title: 'Audit accessibility on modal forms',
            label: 'Frontend',
            labelColor: '#6B8F62',
            assignee: 'Alex Kim',
            due: 'Sep 02',
            createdAt: '2026-08-03T12:45:00.000Z',
          }
        ],
      },
      {
        id: 'col-doing',
        title: 'In Progress',
        accent: '#8a7a52',
        cards: [
          {
            id: 'c-3',
            title: 'Implement REST endpoints for Kanban',
            label: 'Backend',
            labelColor: '#5F7D6E',
            assignee: 'Sam Taylor',
            due: 'Aug 25',
            createdAt: '2026-08-04T09:00:00.000Z',
          }
        ],
      },
      {
        id: 'col-done',
        title: 'Done',
        accent: '#5e7d5a',
        cards: [
          {
            id: 'c-4',
            title: 'Create React 19 UI prototype',
            label: 'Frontend',
            labelColor: '#6B8F62',
            assignee: 'Alex Kim',
            due: 'Aug 20',
            createdAt: '2026-08-01T15:00:00.000Z',
          }
        ],
      },
    ],
  }
];

export default { initialUsers, initialBoards };
