# ThreadTalk — Frontend

ThreadTalk is the frontend for a lightweight threaded discussion/forum application. It's a Next.js + TypeScript app that provides authentication, topic and post listings, post detail views, and threaded comments. This repo implements the UI and client-side API contract; a separate backend is expected to provide the REST API.

## Repo Summary
- Framework: Next.js (App Router)
- Language: TypeScript
- UI: Tailwind CSS
- HTTP: Axios (client with cookie support)

Key folders:
- `src/app` — routes and pages (App Router)
- `src/components` — UI components (Navbar, Auth page, Forum pieces)
- `src/hooks` — client-side hooks (notably `AuthProvider`)
- `src/lib` — API client and TypeScript interfaces (`src/lib/api.ts`)

## Tech Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- ESLint

## Run Frontend Locally
1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` at the project root with at least the API base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

3. Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

Notes:
- Node.js 18+ is recommended for Next.js 16.
- The frontend expects the backend to support credentialed requests (cookies). See `src/lib/api.ts` for details.

## How the Frontend Works
- Routing: Uses Next.js App Router under `src/app` for pages and layouts.
- Authentication: `AuthProvider` (in `src/hooks/AuthProvider.tsx`) attempts to initialize the logged-in user by calling `getProfile()` on load. Sign-up, login, and logout are implemented via the API client.
- API client: `src/lib/api.ts` exports typed calls (signup, login, logout, getTopics, createPost, getPostDetails, createComment, etc.). The axios instance uses `baseURL` from `NEXT_PUBLIC_API_URL` and `withCredentials: true` so cookies are sent with requests.
- UI: Small component set for topic list, post list, post details, comments and simple auth pages.

## Environment / Backend Requirements
- `NEXT_PUBLIC_API_URL` — base URL for the backend REST API (required).
- Backend should:
	- expose endpoints used by `src/lib/api.ts` (`/auth/signup`, `/auth/login`, `/auth/logout`, `/api/profile`, `/topics`, `/posts`, `/comments`, etc.)
	- allow credentialed requests (CORS + cookies) if running on a different origin.

## API Contract & Types
See `src/lib/api.ts` for the canonical TypeScript interfaces and the available client functions. If you change backend routes or request/response shapes, update that file accordingly.

## Contributing
- Open issues or PRs for bugs and features.
- Run `npm run lint` and validate the app locally before submitting a PR.

## License
No license is specified in the repository. Add a `LICENSE` file if you want to make the project open source.

---

If you'd like, I can also add a short example `.env.local.example`, or add a short development checklist to this README. Want me to do that now?