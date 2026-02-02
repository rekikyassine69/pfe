
  # Smart Plant Care Platform UI/UX

  This is a code bundle for Smart Plant Care Platform UI/UX. The original project is available at https://www.figma.com/design/yODciSNeplHB9nTqfJZN71/Smart-Plant-Care-Platform-UI-UX.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## MongoDB backend

  1. Create a `.env` file at the project root using [.env.example](.env.example) as a template.
  2. Update `MONGODB_URI` with your MongoDB connection string.
  3. Start the API server with `npm run dev:server`.

  ## Import JSON database files

  1. Ensure your JSON files are in [data/json](data/json).
  2. Set `MONGODB_URI` in your `.env`.
  3. Optional: set `IMPORT_DB` to force the database name.
  4. Run `npm run import:json` to import the collections.

  To wipe collections before import, set `IMPORT_DROP=true` in `.env`.

  API endpoints:
  - `GET /api/health`
  - `GET /api/plants`
  - `POST /api/plants`

  ## Auth

  - `POST /api/auth/login` (body: `email`, `password`, optional `userType`)
  - `POST /api/auth/register` (client only: `nom`, `email`, `password`)
  - `GET /api/auth/me`
  - `POST /api/auth/logout`

  Use `Authorization: Bearer <token>` for protected endpoints.

  ## Collections API

  - `GET /api/collections/:collection`
  - `GET /api/collections/:collection/:id`
  - `POST /api/collections/:collection`
  - `PATCH /api/collections/:collection/:id`
  - `DELETE /api/collections/:collection/:id`

  Admin-only (same endpoints): `/api/admin/collections/:collection`

  ## Docker (production)

  Build and run the full stack with MongoDB:
  - `docker compose up --build`

  The app will be available at http://localhost:4000 (API + UI).
  