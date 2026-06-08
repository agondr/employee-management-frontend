# Employee Management Frontend

A React-based dashboard for managing employees, departments, tasks, authentication, and user account actions. This frontend connects to a separate Express.js Employee Management API.

## Tech Stack

- React 19
- Vite 7
- Redux Toolkit and React Redux
- React Router DOM
- Tailwind CSS 4
- shadcn/ui-style components built on Radix UI primitives
- React Hook Form
- Zod validation
- Sonner toast notifications
- Lucide React icons
- Fetch API through a reusable `apiFetch` helper
- JWT-based authentication with token/session data stored in `localStorage`
- ESLint

## Main Features

- Public landing page with navigation to login and registration.
- Login form with Zod validation and JWT session storage.
- Registration form with password confirmation validation.
- Protected dashboard routes through `PrivateRoute`.
- Auth watcher that redirects unauthenticated users away from private routes.
- Reusable API helper that attaches JWT bearer tokens, handles `401`, `403`, and `404` responses, and stores refreshed tokens from the `x-new-token` response header.
- Dashboard overview statistics for departments, total users, total tasks, and completed tasks.
- Department management with create, list/table view, grid/card view, edit navigation, delete action, and employee counts.
- Employee management with create employee dialog, paginated employee table, search, status filtering, department filtering, page-size controls, role/status updates, department assignment, profile edit dialog, account enable/disable, assigned task view, and admin password change.
- Task management with create task dialog, paginated task table, search, status filtering, priority filtering, assigned-user filtering, inline title editing, status/priority updates, multi-user assignment, and delete confirmation.
- Audit logs page for admin users with search, action/entity/user filters, pagination, readable action summaries, and a details dialog.
- Account dropdown with My Account, Change Password, and Logout actions.
- User change-password dialog with show/hide password controls.
- Shared table utilities for search input, page-size selection, and pagination controls.
- Reusable UI components under `src/components/ui`.
- Toast-based success and error feedback with Sonner.
- Redux-backed pagination/filter state for employees, tasks, and audit logs.

## Project Structure

```txt
employee-management-frontend/
├── public/                     # Static public assets
├── src/
│   ├── assets/                 # Images and logo assets
│   ├── components/
│   │   ├── audit/              # Audit log table and detail dialog
│   │   ├── employees/          # Employee edit dialog
│   │   ├── shared/             # Auth, dashboard, navbar, table, and landing components
│   │   └── ui/                 # shadcn/ui-style reusable UI primitives
│   ├── lib/                    # API helper, auth route helpers, utility functions
│   ├── pages/                  # Landing, auth, dashboard, employees, tasks, audit pages
│   ├── store/                  # Redux Toolkit store and feature slices
│   ├── App.jsx                 # Application routing
│   ├── main.jsx                # React entry point and Redux provider
│   └── index.css               # Global Tailwind styles
├── components.json             # shadcn/ui configuration
├── vite.config.js              # Vite, Tailwind, alias, and dev server config
└── package.json
```

## Installation

```bash
npm install
```

## Environment Variables

Create a local `.env` file in the frontend root. Use placeholders only and do not commit real environment files.

```env
VITE_API_URL=http://localhost:5302
```

The frontend expects the backend routes to be available under this base URL, for example `http://localhost:5302/api/auth/login`.

## Run Locally

```bash
npm run dev
```

The Vite dev server is configured to use port `5300`.

## Available NPM Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

- `dev` - start the Vite development server.
- `build` - create a production build.
- `lint` - run ESLint.
- `preview` - preview the production build locally.

## Backend Connection

This frontend requires the Employee Management Express backend API to be running separately. Configure the API base URL with `VITE_API_URL`.

Do not hardcode private production URLs, tokens, database credentials, or API secrets in frontend code. Production deployments should use environment-specific configuration.

## Screenshots

Add project screenshots in `docs/screenshots/`.

```txt
docs/screenshots/login.png
docs/screenshots/dashboard.png
docs/screenshots/employees.png
docs/screenshots/tasks.png
```

## Live Demo

Live Demo: TODO

Recommended URL format:

```txt
https://employee-management.dragobuzhda.com
```

## Security Notes

- Do not commit `.env` files.
- Do not expose production API secrets, tokens, or private URLs.
- Use HTTPS in production.
- JWT handling in the frontend improves user experience, but the backend must enforce authentication and authorization.
- Frontend validation is not enough without backend validation.
- Keep protected API behavior on the backend; frontend route guards are not a security boundary.

## Roadmap

- Add automated frontend tests for forms, route guards, and Redux flows.
- Improve consistency of loading and error states across all dialogs and tables.
- Add more granular role-based UI visibility for non-admin users where appropriate.
- Add export options for audit logs or reports.
- Improve responsive behavior for dense tables on small screens.
- Add profile editing for the currently authenticated user if supported by the backend.
