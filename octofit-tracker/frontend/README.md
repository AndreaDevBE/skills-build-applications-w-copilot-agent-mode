# Octofit Tracker presentation tier

This React 19 and Vite application uses React Router for navigation and Bootstrap
for styling. Its views load activities, leaderboard entries, teams, users, and
workouts from the matching `/api/.../` endpoint.

## Configure the API host

For Codespaces, define `VITE_CODESPACE_NAME` in a local environment file at
`octofit-tracker/frontend/.env.local`:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

This variable must be defined when using the Codespaces-hosted API. Vite reads
it through `import.meta.env`; the frontend uses
`https://<VITE_CODESPACE_NAME>-8000.app.github.dev` as the API base URL. When
the variable is unset or invalid, the frontend safely falls back to
`http://localhost:8000`.

## Run locally

From the repository root, start the Vite development server with:

```bash
npm run dev --prefix octofit-tracker/frontend
```

The development server is available on port `5173`.
