
# SyncBoard — Project Report

## 1. Introduction 
SyncBoard is a lightweight kanban-style project management web application built by our team as the first assignment of our full-stack group project. This deliverable is the static front-end skeleton: a fully navigable, interactive single-page application with no backend, authentication server, or external API — all data is mock data held in React state and persisted to the browser via `localStorage`. 

The app lets a user create, list, and delete boards from a dashboard; open a board to an interactive kanban canvas with columns and task cards; add, edit, delete, and drag cards between columns; rename, add, and remove columns; invite collaborators; and manage a profile. It also includes a landing page, login and register pages with client-side validation, and a custom 404 page. The design system is a handcrafted sage-green and woody-neutral theme with flat solid colors, a glass navbar, hover/focus states, and full responsiveness. 

**Tech stack:** Vite 5, React 18, `react-router-dom` v6, plain CSS design tokens. No backend, no auth service, no API calls — static front-end only. 

---

## 2. Team 
The codebase is divided into 9 logical parts.  

| Member | Division | Role | Files to commit |
| :--- | :--- | :--- | :--- |
| **Udeshi** | Dashboard, board cards & board store | Owns the main task-card listing and management logic of the app: the dashboard page (create/delete boards via modal, board listing, empty state), the `BoardCard` component, and the `localStorage` board store (`boardStore.js`). | `src/pages/Dashboard.jsx`<br>`src/pages/Dashboard.css`<br>`src/components/BoardCard.jsx`<br>`src/components/BoardCard.css`<br>`src/data/boardStore.js` |
| **Panchalee** | Layout shell (Navbar & Footer) | Owns the app-wide navigation bar (responsive glass navbar with hamburger menu) and the footer, including their styles. | `src/components/Navbar.jsx`<br>`src/components/Navbar.css`<br>`src/components/Footer.jsx`<br>`src/components/Footer.css` |
| **Yash** | Global design system | Owns the global CSS token palette (sage-green/woody neutrals, typography, radii, shadows) and shared layout primitives: buttons, cards, form fields, modals, container/grid utilities. | `src/styles/theme.css`<br>`src/styles/layout.css` |
| **Adeev** | Landing page | Owns the public landing page (hero, feature highlights, call-to-action) and its styles. | `src/pages/Home.jsx`<br>`src/styles/home.css` |
| **Leeza** | Auth pages (Login & Register) | Owns the login and register pages with client-side form validation and mock auth state, plus the shared auth styles. | `src/pages/Login.jsx`<br>`src/pages/Register.jsx`<br>`src/styles/auth.css` |
| **Ravishka** | Kanban board page | Owns the board page: board state management, drag-and-drop move logic, column add/remove/rename handlers, the add/edit card modals, collaborator invite modal, board styles, and the seed board data. | `src/pages/Board.jsx`<br>`src/pages/Board.css`<br>`src/data/board.js` |
| **Hiruka** | Kanban components (Column & TaskCard) | Owns the interactive kanban building blocks: the `Column` component (inline rename, add-card form, delete confirmation, drag-over drop target) and the `TaskCard` component (draggable card, edit/remove actions). | `src/components/Column.jsx`<br>`src/components/TaskCard.jsx` |
| **Imandie** | Profile pages | Owns the profile page (editable profile persisted to `localStorage`, driving the current-user initials across the app). | `src/pages/Profile.jsx`<br>`src/pages/Profile.css` |
| **James** | App entry point, routing & 404 Pages | Owns the application entry point (`main.jsx`) and the router configuration (`App.jsx`) wiring all routes together, along with the custom 404 Not Found page, including their styles. | `src/main.jsx`<br>`src/App.jsx`<br>`src/pages/NotFound.jsx`<br>`src/pages/NotFound.css` |

---

## 3. GitHub 
* **Repository:** [https://github.com/Neo-Designs/Kanban_Board](https://github.com/Neo-Designs/Kanban_Board) 

---

## 4. How to run 
**Prerequisites:** Node.js 18+ and `npm`. 

1. **Clone the repository:** 
   ```bash
   git clone [https://github.com/Neo-Designs/Kanban_Board](https://github.com/Neo-Designs/Kanban_Board) 
   cd Kanban_Board

```

2. **Install dependencies:**
```bash
cd client 
npm install

```


3. **Start the dev server:**
```bash
npm run dev

```


4. **Open application:**
Open `http://localhost:5173` in your browser.

* **Production sanity check:** `npm run build && npm run preview`
* **Routes:** `/` (landing), `/login`, `/register`, `/dashboard` (board list/create/delete), `/boards/:id` (kanban board), `/profile`, and any unknown path renders the 404 page.

```

```
