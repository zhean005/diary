# diary1

Simple diary app (Next.js) — client-side only, stores data in localStorage.

Features:
- Create / edit / delete diary entries
- Search and filter by tags
- Export entries to JSON or Markdown
- Single-page UI, deployable to Vercel

Quick start (local)
1. Install:
   npm install
2. Run dev server:
   npm run dev
3. Open http://localhost:3000

Deploy to Vercel
1. Push this repo to GitHub.
2. In Vercel: New Project → Import Git Repository → choose `zhean/diary`.
3. Vercel will auto-detect Next.js. Deploy.

Notes
- Entries are stored in the browser (localStorage). If you want server persistence, I can add a backend (Supabase, SQLite API, or GitHub-backed storage).
- Remove any secrets before making this repo public (there are none in this scaffold).

License
MIT# diary
