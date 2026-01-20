# GitHub PAT Studio (React + Vite + Bootstrap + Lucide)

A professional single-page app to manage your GitHub repositories with a **Personal Access Token (PAT)**:

- List your repositories
- Explore repo files/folders (tree browsing)
- View & edit files (with commit messages & branches)
- Create / delete files
- List & create branches
- Create repositories
- Create Pull Requests (basic)
- List Issues (basic)

> ⚠️ **Security Note**: This is a client-side app. Any token exposed in `.env` with `VITE_` prefix is bundled in the browser and visible to anyone who can load the app. Use this for local/internal workflows only. For production, use a backend proxy or GitHub OAuth.

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and paste your token
npm run dev
```

## Environment Variables

- `VITE_PAT_TOKEN` — your GitHub Personal Access Token.
  - Scopes recommended: `repo`, `read:user`, `user:email` (add more as needed: `workflow`, `admin:repo_hook`, etc.)

> Vite **only** exposes variables prefixed with `VITE_` to the browser. While we also try `PAT_TOKEN`, Vite will not pass it through unless custom plugins are used.

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Tech Stack

- React + Vite
- Bootstrap 5
- Lucide React (icons)
- Axios
- React Router DOM

## Folder Structure

```
src/
  api/
  components/
  pages/
  styles/
  App.jsx
  main.jsx
```

## Notes

- Folders in GitHub are logical; creating a folder is equivalent to creating a file with a path like `dir/subdir/file.txt`.
- File content is sent/received as Base64 per GitHub API.
- Branch operations use the Git Data API and Contents API.

