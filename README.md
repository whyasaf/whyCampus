# whyCampus

A student dashboard for organising university life in one place: courses, weekly schedule, notes, tasks, materials, assignments, exams and a calendar. Built with React and Vite.

> Currently a front-end only app. All data is mock data held in React state, so changes reset on page reload.

## Features

- **Dashboard**: overview of today's classes, tasks and upcoming deadlines
- **Schedule** and **Calendar**: weekly timetable and calendar view
- **Courses**: course list and per-course detail pages
- **Notes**: create notes per course (via a course selector), edit, delete, sorted by last update
- **Tasks**, **Assignments**, **Exams**, **Materials**: track work and resources
- **Command menu**: press `Cmd/Ctrl + K` to jump around quickly
- **Dark / light mode** and a **Settings** page
- Responsive layout with a mobile navigation bar

## Tech stack

- [React 19](https://react.dev) and [Vite](https://vite.dev)
- [lucide-react](https://lucide.dev) icons
- [canvas-confetti](https://github.com/catdad/canvas-confetti) for celebrations
- [Oxlint](https://oxc.rs) for linting

## Getting started

Requires Node.js 18+ (a current LTS is recommended).

```bash
git clone <repo-url>
cd whyCampus
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server with HMR        |
| `npm run build`   | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Lint the project with Oxlint         |

## Project structure

```
src/
├── App.jsx              # App shell, global state, tab routing
├── main.jsx             # Entry point
├── index.css, App.css   # Styles
├── components/          # One component per view (Dashboard, Notes, Tasks, ...)
└── data/mockData.js     # Sample user, courses, schedule, notes, tasks, exams
```

Navigation is handled by a `currentTab` state in `App.jsx` rather than a router.

## Customising the data

Edit [src/data/mockData.js](src/data/mockData.js) to change the user profile, courses, weekly schedule and the initial notes, tasks, materials, assignments and exams. Dates are generated relative to today, so the sample data always looks current.

## Roadmap ideas

- Persist data (localStorage or a backend)
- Real "current class" detection from the system clock
- Authentication and multi-user support
