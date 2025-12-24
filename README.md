# ThreadTalk — Frontend

ThreadTalk is a production-ready frontend for a lightweight threaded discussion/forum application. Built with Next.js and TypeScript, it provides a modern, responsive UI for community-driven discussions with authentication, topic management, post creation, and nested comment threads.

## Features

- **Authentication**: Secure cookie-based authentication with signup, login, and logout
- **Topic Management**: Browse and create discussion topics/communities
- **Post System**: Create and view posts within topics with search functionality
- **Threaded Comments**: Nested comment threads with reply functionality
- **Real-time Updates**: Automatic refresh after creating posts and comments
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Production Ready**: Error handling, input validation, retry logic, and rate limit handling

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS
- **HTTP Client**: Axios with cookie support
- **State Management**: React Context API (AuthProvider)
- **Validation**: Client-side validation matching backend rules

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (auth/dashboard)
│   ├── post/[post_id]/    # Post detail page
│   └── topic/[topic_id]/  # Topic page with posts
├── components/
│   ├── forum/             # Forum-specific components
│   │   ├── CommentItem.tsx
│   │   ├── CommentSection.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   ├── TopicCard.tsx
│   │   └── TopicList.tsx
│   ├── ui/                # Reusable UI components
│   │   └── ErrorToast.tsx
│   ├── AuthPage.tsx       # Authentication page
│   ├── Dashboard.tsx      # Main dashboard
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── Navbar.tsx
├── hooks/
│   └── AuthProvider.tsx   # Authentication context
└── lib/
    ├── api.ts             # API client with retry/rate limit logic
    └── validation.ts      # Input validation utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended for Next.js 16)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Replace `http://localhost:4000` with your backend API URL.

3. Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## API Integration

The frontend communicates with a REST API backend. The API client (`src/lib/api.ts`) includes:

- **Retry Logic**: Automatic retry with exponential backoff for retryable errors (408, 500, 503)
- **Rate Limiting**: Handles 429 responses with proper backoff
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Cookie Authentication**: Uses HTTP-only cookies for secure authentication
- **Flexible Response Types**: Handles both wrapped and direct API responses

### API Endpoints Used

- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `POST /auth/logout` - User logout
- `GET /api/profile` - Get authenticated user profile
- `GET /topics` - List all topics
- `POST /api/topics` - Create a new topic
- `GET /topics/:topic_id/posts` - Get posts in a topic (with pagination and search)
- `POST /api/posts` - Create a new post
- `GET /posts/:post_id` - Get post details with comments
- `POST /api/comments` - Create a comment (or reply)

## Input Validation

Client-side validation is implemented to match backend rules:

- **Username**: 3-50 characters, alphanumeric + underscore
- **Password**: Minimum 8 characters
- **Post Title**: 5-250 characters
- **Post Content**: Maximum 600 characters
- **Comment Content**: Maximum 2000 characters
- **Topic Name**: 1-50 characters
- **Topic Description**: Maximum 600 characters

## Error Handling

- All API errors are caught and displayed with user-friendly messages
- Error toast notifications auto-dismiss after 5 seconds
- Form validation errors are shown inline
- Network errors are handled gracefully with retry logic

## Performance Optimizations

- **Debounced Search**: 300ms debounce on search input to reduce API calls
- **Parallel API Calls**: Independent API calls are parallelized where possible
- **Optimized Re-renders**: Proper use of React hooks and callbacks

## Authentication Flow

1. User signs up or logs in via `/auth/signup` or `/auth/login`
2. Backend sets an HTTP-only cookie (`auth_token`)
3. Frontend automatically includes cookies in subsequent requests via `withCredentials: true`
4. `AuthProvider` checks authentication status on app load via `getProfile()`
5. Protected routes and features are conditionally rendered based on auth state

## Development

### Key Components

- **AuthProvider**: Manages authentication state and provides auth methods to the app
- **Dashboard**: Main page showing all topics with search and create functionality
- **TopicPage**: Displays posts within a topic with search and post creation
- **PostPage**: Shows post details with nested comment threads
- **CommentSection**: Handles comment creation and displays comment tree

### Code Style

- TypeScript for type safety
- Functional components with React hooks
- Tailwind CSS for styling
- ESLint for code quality

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |

## Backend Requirements

The backend should:

- Expose all endpoints listed in the API Integration section
- Support CORS with credentials (cookies)
- Return errors in format: `{ error: "message" }`
- Set HTTP-only cookies for authentication
- Support pagination via `cursor` parameter for posts
- Support search via `search` query parameter

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check for issues
5. Test your changes locally
6. Submit a pull request

## License

No license is specified. Add a `LICENSE` file if you want to make the project open source.
