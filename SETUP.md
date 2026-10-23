# UniManage local setup

## Run in VS Code

1. Open the project root folder (the folder containing `pnpm-workspace.yaml`).
2. Install [Node.js 20+](https://nodejs.org) and pnpm.
3. Open a terminal and run:

   ```bash
   pnpm install
   pnpm dev
   ```

4. Open `http://localhost:5173`.

The API starts at `http://localhost:3001`. No `.env` file or database is needed
for the current sample-data version.

In VS Code, you can instead open **Run and Debug** and select **Launch All**.

## Local demo sign-ins

- Administration: ID `admin`, password `admin123`
- Teacher: ID `teacher`, password `teacher123`

Change the sign-ins in **Settings → Security**. These demo credentials and
browser-side access checks are for local demonstration only; do not use this
login to protect real student or university records.

Students can browse the read-only student directory, courses, timetable, exams,
notices, and library catalogue without signing in. Teacher and admin pages
require sign-in; settings and administration-only areas require the admin login.

## Useful commands

```bash
pnpm dev          # start the frontend and API
pnpm run typecheck # check TypeScript
pnpm run build     # build packages
```
