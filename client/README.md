# TaskFlow client

The React + TypeScript frontend for TaskFlow. For the project overview,
features, tech stack and quick start, see the [main README](../README.md).

All commands below run from this folder.

## Scripts

| Command                   | What it does                            |
| ------------------------- | --------------------------------------- |
| `yarn dev`                | Start the dev server                    |
| `yarn build`              | Type-check and build for production     |
| `yarn preview`            | Serve the production build locally      |
| `yarn lint`               | Run ESLint                              |
| `yarn format`             | Format files with Prettier              |
| `yarn format:check`       | Check formatting without changing files |
| `yarn test:unit`          | Run unit and component tests            |
| `yarn test:unit:coverage` | Run unit tests with a coverage report   |
| `yarn test:watch`         | Run unit tests in watch mode            |
| `yarn test:e2e`           | Run end-to-end tests                    |
| `yarn test:e2e:ui`        | Open Playwright's UI mode               |
| `yarn test:e2e:report`    | Open the last E2E HTML report           |

E2E tests build the app and serve it on port 4173 automatically. If you
already have `yarn preview` running on that port, they reuse it.

## How data is stored

The app currently runs entirely in the browser. Data is stored in
`localStorage` and seeded with sample projects, tasks and users on first load
(see `src/mockData/`). To start over with fresh sample data, clear the site's
local storage in your browser's dev tools.

## Project structure

```
e2e/              Playwright end-to-end tests
src/
├── app/          App shell, routes, route guards
├── features/     Feature modules (auth, dashboard, kanban, projects, tasks, layout)
├── components/   Shared UI components
├── pages/        Route-level pages
├── models/       Shared TypeScript types
├── services/     Storage and notification helpers
├── mockData/     Seed data loaded on first run
├── theme/        MUI theme
└── utils/        Shared utilities
```

Each folder under `features/` keeps its own components, hooks, services and
tests together.

## Conventions

- Code that exists only because there's no backend yet is tagged with
  `// NO-BACKEND:` so it's easy to find and remove later.
