# ThreadTalk Frontend

Threadtalk-frontend is a production-ready frontend for a lightweight threaded discussion/forum application. Built with Next.js and TypeScript, it provides a modern, responsive UI for community-driven discussions with authentication, topic management, post creation, and nested comment threads.

**Live Deployment:** [https://threadtalk-app.vercel.app](https://threadtalk-app.vercel.app)  
**Backend Repository:** [https://github.com/v1-nce/threadtalk-backend](https://github.com/v1-nce/threadtalk-backend)

---

## Features

- 🔐 **Authentication** — Secure cookie-based authentication with signup, login, and logout
- 🗂️ **Topic Management** — Browse and create discussion topics/communities
- 📝 **Post System** — Create and view posts within topics with search functionality
- � **Share System** — Non-users can view posts and comments without signing up
- �💬 **Threaded Comments** — Nested comment threads with unlimited depth and reply functionality
- � **Real-time Updates** — Automatic refresh after creating posts and comments
- 📱 **Responsive Design** — Mobile-first design with Tailwind CSS
- 🛡️ **Production Ready** — Comprehensive error handling, input validation, retry logic, and rate limit handling

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js (App Router) | 16.0.8 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.1.17 |
| **HTTP Client** | Axios | 1.13.2 |
| **State Management** | Zustand | 5.x |
| **UI Components** | Custom (forum/, ui/) | - |

### Prerequisites

- Node.js 18+ (recommended for Next.js 16)
- npm or yarn

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (auth/dashboard)
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Tailwind configuration & design tokens
│   ├── post/[post_id]/    # Post detail page
│   └── topic/[topic_id]/  # Topic page with posts
├── components/
│   ├── forum/             # Forum-specific components
│   │   ├── CommentItem.tsx      # Individual comment with replies
│   │   ├── CommentSection.tsx   # Comment list & input
│   │   ├── PostCard.tsx         # Post preview card
│   │   ├── PostList.tsx         # Post list with loading states
│   │   ├── TopicCard.tsx        # Topic preview card
│   │   └── TopicList.tsx        # Topic list with loading states
│   ├── ui/                # Reusable UI components
│   │   ├── ConfirmDialog.tsx    # Confirmation modal
│   │   └── ErrorToast.tsx       # Error notification
│   ├── AuthPage.tsx       # Authentication page with tab switching
│   ├── Dashboard.tsx      # Main dashboard with topics
│   ├── LoginForm.tsx      # Login form with validation
│   ├── RegisterForm.tsx   # Registration form with validation
│   └── Navbar.tsx         # Navigation bar
├── stores/                # Zustand state management
│   ├── authStore.ts       # Auth state (user, login, logout)
│   ├── topicStore.ts      # Topics state & actions
│   ├── postStore.ts       # Posts & comments state
│   └── index.ts           # Barrel exports
└── lib/
    ├── api.ts             # API client with retry/rate limit logic
    └── validation.ts      # Input validation utilities
```

---

## Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/v1-nce/threadtalk-frontend.git
cd threadtalk-frontend
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> **Note:** Replace with your backend API URL. The default backend runs on port 8080.

### 3. Development

Run the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 4. Production Build

Build and start the production server:

```bash
npm run build
npm start
```

### 5. Linting

Check code quality:

```bash
npm run lint
```

---

## API Integration

The frontend communicates with a REST API backend via `src/lib/api.ts`. The API client includes robust error handling and retry mechanisms.

### Features

- **Retry Logic** — Automatic retry with exponential backoff for retryable errors (408, 500, 503)
- **Rate Limiting** — Handles 429 responses with proper backoff using `Retry-After` header
- **Error Handling** — Comprehensive error handling with user-friendly messages
- **Cookie Authentication** — Uses HTTP-only cookies for secure authentication with `withCredentials: true`
- **Flexible Response Types** — Handles both wrapped (`{ message, user }`) and direct API responses

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/signup` | User registration | No |
| `POST` | `/auth/login` | User authentication | No |
| `POST` | `/auth/logout` | User logout | Yes |
| `GET` | `/api/profile` | Get authenticated user profile | Yes |
| `GET` | `/topics` | List all topics | No |
| `POST` | `/api/topics` | Create a new topic | Yes |
| `GET` | `/topics/:topic_id/posts` | Get posts in a topic (paginated, searchable) | No |
| `POST` | `/api/posts` | Create a new post | Yes |
| `DELETE` | `/api/posts/:id` | Delete a post | Yes |
| `GET` | `/posts/:post_id` | Get post details with comments | No |
| `POST` | `/api/comments` | Create a comment or reply | Yes |
| `DELETE` | `/api/comments/:id` | Delete a comment | Yes |

---

## Input Validation

Client-side validation is implemented in `src/lib/validation.ts` to match backend rules:

| Field | Rules |
|-------|-------|
| **Username** | 3-50 characters, alphanumeric + underscore only |
| **Password** | Minimum 8 characters |
| **Post Title** | 5-250 characters |
| **Post Content** | Maximum 600 characters (optional) |
| **Comment Content** | Maximum 2000 characters |
| **Topic Name** | 1-50 characters |
| **Topic Description** | Maximum 600 characters (optional) |

---

## Authentication Flow

1. User signs up or logs in via `/auth/signup` or `/auth/login`
2. Backend sets an HTTP-only cookie (`auth_token`)
3. Frontend automatically includes cookies in subsequent requests via `withCredentials: true`
4. `authStore` initializes on app load, checking session via `getProfile()`
5. Protected routes and features are conditionally rendered based on auth state
6. User can logout, which clears the cookie and resets Zustand state

---

## Key Components

### Zustand Stores (`src/stores/`)

| Store | Responsibility |
|-------|----------------|
| `authStore` | User session, login/signup/logout actions |
| `topicStore` | Topics list, create topic, lookup by ID |
| `postStore` | Posts per topic, comments, CRUD operations |

- **No provider wrappers** — stores imported directly where needed
- **Automatic state refresh** — mutations trigger data re-fetch
- **Selector optimization** — components subscribe only to needed slices

### Dashboard (`src/components/Dashboard.tsx`)

- Main page showing all topics with search and create functionality
- Uses `topicStore` for centralized topic state
- Mobile-responsive with sticky sidebar

### TopicPage (`src/app/topic/[topic_id]/page.tsx`)

- Displays posts within a specific topic
- Uses `topicStore` + `postStore` for data
- Includes search with 300ms debounce to reduce API calls

### PostPage (`src/app/post/[post_id]/page.tsx`)

- Shows post details with metadata (author, date, comment count)
- Uses `postStore` for post and comments state
- Share functionality (native share API or clipboard fallback)

### CommentItem (`src/components/forum/CommentItem.tsx`)

- Renders individual comments with reply functionality
- Supports nested replies with visual indentation (recursive component)
- Uses `authStore` for ownership checks, `postStore` for mutations

---

## Error Handling

- All API errors are caught and displayed with user-friendly messages via `ErrorToast`
- Error toast notifications auto-dismiss after 5 seconds
- Form validation errors are shown inline with red text
- Network errors are handled gracefully with automatic retry logic
- Deleted posts/comments show `[deleted]` state instead of removing from UI

---

## Performance Optimizations

- **Debounced Search** — 300ms debounce on search input to reduce API calls
- **Parallel API Calls** — Independent API calls (topics + posts) are parallelized where possible
- **Optimized Re-renders** — Proper use of `useCallback` and `useMemo` to prevent unnecessary renders
- **Auto-expanding Textareas** — Dynamic height adjustment reduces need for scrolling

---

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | ✅ Yes | - |

---

## Backend Requirements

The backend must implement the following to work with this frontend:

- **Expose all endpoints** listed in the API Integration section
- **Support CORS** with credentials (cookies) enabled
- **Return errors** in format: `{ error: "message" }`
- **Set HTTP-only cookies** for `auth_token` upon successful authentication
- **Support pagination** via `cursor` query parameter for posts
- **Support search** via `search` query parameter for posts
- **Delete behavior** — Mark posts/comments as deleted rather than removing from database

---

## Code Style

- **TypeScript** for type safety across the entire codebase
- **Functional components** with React hooks (no class components)
- **Tailwind CSS** for styling with design system tokens in `globals.css`
- **ESLint** for code quality enforcement
- **Consistent naming** — PascalCase for components, camelCase for functions

---

## Development Workflow

1. Make changes to source files
2. Development server auto-reloads on file changes
3. Check browser console for errors
4. Run `npm run lint` and `npm run build`before committing
5. Test authentication flow, CRUD operations, and error states
6. Build production bundle to verify no build errors

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run `npm run lint` to check for issues
5. Test your changes locally with the backend
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

---

## AI Declaration

Gemini 3.0 Pro was only used for research, information gathering and to tutor myself to learn new technologies.