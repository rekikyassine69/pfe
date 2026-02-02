# User Actions — Smart Plant Care ✅

A concise inventory of user-related actions (auth, admin user management, settings, navigation) found in the codebase.

---

## 1) Authentication 🔐
- `handleLogin(email, password)` — `src/app/App.tsx`
  - Mock auth: sets user role (`admin` if email contains `'admin'`, else `client`) and navigates to `admin-dashboard` or `dashboard`.
- `handleSignup(name, email, password)` — `src/app/App.tsx` (mock signup; sets role to `client`).
- `handleLogout()` — `src/app/App.tsx` (clears role and navigates to `landing`).
- UI: `src/app/components/pages/LoginPage.tsx` (`onLogin`) and `src/app/components/pages/SignupPage.tsx` (`onSignup`).

## 2) Admin — Users Management 👥
- `AdminUsersPage` handlers (`src/app/components/pages/AdminUsersPage.tsx`):
  - `handleAddUser(user)` — adds user to local `users` state.
  - `handleEdit(user)` — sets `selectedUser` and opens edit modal.
  - `handleUpdateUser(id, updatedData)` — updates user in local state.
  - `handleDeleteClick(user)` — opens delete confirmation modal.
  - `handleDeleteConfirm()` — removes user from local state and shows a success toast.
- Modals:
  - `AddUserModal` (`src/app/components/modals/AddUserModal.tsx`) — form -> calls `onAdd(newUser)`.
  - `EditUserModal` (`src/app/components/modals/EditUserModal.tsx`) — form -> calls `onUpdate(id, updatedData)`.
  - `DeleteConfirmModal` — confirms deletion.
- Note: CRUD is implemented client-side using component state — no backend persistence.

## 3) Settings & Profile ⚙️
- `handleSave()` — `src/app/components/pages/SettingsPage.tsx` (shows toast confirmation).
- UI features present: change password, enable 2FA, manage sessions, notification toggles, language/timezone, units.
  - Several controls are UI-only and lack wired-up handlers (need implementation/back-end integration).

## 4) Navigation & UI interactions 🧭
- `handleNavigate(page)` — `src/app/App.tsx` (used by `Sidebar`, `AdminSidebar`, `PublicNavbar`).
- `onLogout` passed to sidebars to call `handleLogout()`.
- Login page toggles sign-up view and toggles password visibility.

## 5) Notes & Suggested Next Steps 🔧
- Persist user actions to a backend (API) instead of component state.
- Implement missing Settings handlers (password change, 2FA, session management).
- Add unit and integration tests for auth flows and admin CRUD.
- Optional: add role-based route protection and API integration for user listing/pagination.

---

### Key files (scanned)
- `src/app/App.tsx`
- `src/app/components/pages/AdminUsersPage.tsx`
- `src/app/components/modals/AddUserModal.tsx`
- `src/app/components/modals/EditUserModal.tsx`
- `src/app/components/modals/DeleteConfirmModal.tsx`
- `src/app/components/pages/LoginPage.tsx`
- `src/app/components/pages/SignupPage.tsx`
- `src/app/components/pages/SettingsPage.tsx`

---

## Dev: Mock API (MSW) added 🧪
To accelerate client use-case development I added a simple mock API using **MSW** (Mock Service Worker). This runs in development and provides the following endpoints:

- POST `/api/auth/login` -> { token, user }
- POST `/api/auth/signup` -> { token, user }
- GET `/api/users` -> list users
- POST `/api/users` -> create user
- PUT `/api/users/:id` -> update user
- DELETE `/api/users/:id` -> delete user
- GET `/api/pots` -> list pots (filter by `?ownerId=`)
- POST `/api/pots` -> create pot
- PUT `/api/pots/:id` -> update pot
- DELETE `/api/pots/:id` -> delete pot
- POST `/api/orders` -> create a simple order

Files added:
- `src/mocks/data.ts` (seed data)
- `src/mocks/handlers.ts` (MSW handlers)
- `src/mocks/browser.ts` (worker setup)
- `src/lib/api.ts` (small API client)

Start the dev server (`npm run dev`) — MSW starts automatically in development.

---

If you want, I can:
1. Create a feature branch and wire backend calls for user CRUD, or
2. Add tests for the existing auth + admin flows, or
3. Wire the missing Settings handlers.

Tell me which option you'd like next.