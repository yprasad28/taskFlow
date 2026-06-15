# TaskFlow

A full-stack task management application with role-based access control, built with Next.js 15 and Express.js.

## Features

### Core

- **Task CRUD** — Create, read, update, and delete tasks
- **Board View** — Drag-and-drop Kanban board with 4 columns (To Do, In Progress, In Review, Completed)
- **List View** — Paginated table with inline editing
- **Search & Sort** — Search by title, sort by due date / priority / created date
- **Status & Priority Filtering** — Filter tasks by status and priority level
- **Pagination** — Server-side pagination with configurable page size
- **Optimistic UI** — Instant UI updates with automatic rollback on API failure
- **Calendar View** — Monthly calendar with task visualization via `react-big-calendar`
- **Dark Mode** — Class-based theme toggle with localStorage persistence

### Authentication & Authorization

- JWT-based authentication with access tokens (15 min) and refresh tokens (7 days)
- Role-based access control (USER / ADMIN)
- Protected routes via Next.js middleware and Express middleware
- Automatic token refresh on expiration

### Admin Dashboard

- Global statistics (total users, tasks by status, overdue tasks, tasks by priority)
- User management with task counts and completion rates
- Task management across all users (reassign, edit, delete)
- Global activity log

### User Dashboard

- Personalized greeting with time-of-day awareness
- Task KPIs (total, completed, pending, in progress, in review)
- Circular progress chart showing completion percentage
- Today's tasks with checkbox toggling
- Recent activity feed from the activity log
- Quick inline task creation

### Activity Logging

- Automatic logging for all CRUD operations
- Human-readable activity messages with user names and task titles
- User-scoped and admin-scoped activity feeds

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3, `next-themes` |
| Forms | React Hook Form, Zod validation |
| State | TanStack React Query |
| DnD | @hello-pangea/dnd |
| Calendar | react-big-calendar, moment.js |
| Notifications | sonner (toast) |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (jsonwebtoken), bcrypt |
| Security | Helmet, CORS, rate limiting |

## Project Structure

```
TaskFlow/
├── apps/
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Database schema
│   │   │   ├── seed.ts                # Seed script (demo + admin users)
│   │   │   └── migrations/            # PostgreSQL migrations
│   │   ├── src/
│   │   │   ├── config/                # env.ts, prisma.ts, cors.ts
│   │   │   ├── middleware/            # auth.ts, validate.ts, errorHandler.ts, rateLimiter.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/              # Register, login, refresh, /me
│   │   │   │   ├── tasks/             # Task CRUD, KPIs, activity logs
│   │   │   │   └── admin/             # Admin dashboard, user/task management, activity log
│   │   │   ├── utils/                 # apiError.ts, password.ts, jwt.ts, user.ts, labels.ts, enums.ts
│   │   │   ├── types/                 # roles.ts
│   │   │   ├── app.ts                 # Express app configuration
│   │   │   └── server.ts              # Server entry point
│   │   ├── .env                       # Environment variables
│   │   ├── .env.example               # Environment template
│   │   ├── Dockerfile                 # Multi-stage Docker build
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/             # Login, register pages
│       │   │   ├── (user)/             # User dashboard, tasks, calendar
│       │   │   ├── (admin)/            # Admin dashboard, tasks
│       │   │   └── middleware.ts       # Route protection
│       │   ├── components/
│       │   │   ├── auth/               # LoginForm, RegisterForm
│       │   │   ├── dashboard/          # StatCards, WelcomeSection, RecentActivity, etc.
│       │   │   ├── tasks/              # BoardView, TaskForm, CreateTaskModal, EditTaskModal
│       │   │   ├── layout/             # UserSidebar, Sidebar (admin)
│       │   │   └── ui/                 # Modal, Badge, Pagination, Button, Input
│       │   ├── hooks/                  # useAuth, useTasks, useTaskEvents, useUsers
│       │   ├── lib/                    # api.ts, constants.ts, utils.ts
│       │   ├── types/                  # task.ts, admin.ts, user.ts, api.ts
│       │   └── validations/            # task.ts, auth.ts
│       ├── .env.local                  # Frontend environment variables
│       ├── .env.example
│       └── package.json
└── README.md
```

## Environment Variables

### Backend (`apps/backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | — | Secret for signing access tokens (min 32 chars) |
| `JWT_EXPIRES_IN` | No | `15m` | Access token expiry |
| `JWT_REFRESH_SECRET` | Yes | — | Secret for signing refresh tokens (min 32 chars) |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token expiry |
| `PORT` | No | `4000` | Server port |
| `NODE_ENV` | No | `development` | `development`, `production`, or `test` |
| `FRONTEND_URL` | No | `http://localhost:3000` | Allowed CORS origin |

### Frontend (`apps/frontend/.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:4000/api/v1` | Backend API base URL |

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE taskflow;
```

2. Update `apps/backend/.env` with your PostgreSQL connection string:

```
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow?schema=public"
```

3. Run migrations:

```bash
cd apps/backend
npx prisma migrate dev
```

4. Seed the database with demo users and sample tasks:

```bash
npm run db:seed
```

This creates:

| User | Email | Password | Role |
|---|---|---|---|
| Demo User | `demo@taskflow.com` | `password123` | USER |
| Admin User | `admin@taskflow.com` | `password123` | ADMIN |

### Running Backend

```bash
cd apps/backend
npm install
npm run dev
```

Backend starts at `http://localhost:4000`. Health check: `GET /health`.

### Running Frontend

```bash
cd apps/frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:3000`.

### Running Tests

```bash
cd apps/backend
npm test
```

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Register a new user (always USER role) |
| POST | `/api/v1/auth/login` | No | Login and receive tokens |
| POST | `/api/v1/auth/refresh` | No | Refresh access token |
| GET | `/api/v1/auth/me` | Yes | Get current user profile |

### Tasks (User)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/tasks` | Yes | List user's tasks (paginated, filterable, sortable) |
| GET | `/api/v1/tasks/:id` | Yes | Get a specific task |
| POST | `/api/v1/tasks` | Yes | Create a task |
| PATCH | `/api/v1/tasks/:id` | Yes | Update a task |
| DELETE | `/api/v1/tasks/:id` | Yes | Delete a task |
| GET | `/api/v1/tasks/kpis` | Yes | Get task count by status |
| GET | `/api/v1/tasks/activity` | Yes | Get user's activity logs |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/v1/admin/users` | Admin | List all users with task counts |
| GET | `/api/v1/admin/tasks` | Admin | List all tasks across users |
| PATCH | `/api/v1/admin/tasks/:id` | Admin | Update any task (reassign, edit) |
| DELETE | `/api/v1/admin/tasks/:id` | Admin | Delete any task |
| GET | `/api/v1/admin/activity` | Admin | Global activity log |

### Task Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 200) |
| `status` | string | — | Filter: `PENDING`, `IN_PROGRESS`, `IN_REVIEW`, `COMPLETED` |
| `priority` | string | — | Filter: `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `search` | string | — | Search by title (partial match) |
| `sortBy` | string | `createdAt` | Sort: `createdAt`, `dueDate`, `priority`, `title` |
| `sortOrder` | string | `desc` | Sort direction: `asc` or `desc` |

### Consistent Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [
      { "field": "title", "message": "Title is required" }
    ]
  }
}
```

## Authentication

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days (stored in HTTP cookie)
- The frontend automatically refreshes expired tokens via an Axios interceptor
- Passwords are hashed with bcrypt (12 salt rounds)
- Registration always creates USER accounts; ADMIN accounts are created via the seed script only

## Admin Features

- View all users with their task counts and completion rates
- View and manage all tasks across users
- Reassign tasks between users
- Delete any task
- View global activity log
- Dashboard statistics (total users, tasks by status, overdue tasks, priority distribution)

## Bonus Features

| Feature | Status |
|---|---|
| Optimistic UI with rollback | Implemented |
| Activity logging | Implemented |
| Dark mode with persistence | Implemented |
| Drag-and-drop board view | Implemented |
| Role-based access control | Implemented |
| Rate limiting | Implemented (500/15min global, 10/15min auth) |
| Security headers (helmet) | Implemented |
| Automatic token refresh | Implemented |

## Assumptions

- PostgreSQL is available locally (or via Docker/cloud)
- The application runs in development mode by default
- Demo accounts use `password123` (seed script)
- Admin accounts can only be created via the seed script, not through registration

## Trade-offs

- **SQLite to PostgreSQL**: The schema was designed to be PostgreSQL-compatible from the start. SQLite was used during initial development for convenience.
- **No WebSocket/SSE**: Real-time updates are achieved through client-side custom DOM events and TanStack Query cache invalidation rather than WebSocket connections. This simplifies the backend but means updates only appear on user interaction.
- **No file uploads**: Task attachments are not implemented to keep the scope focused on core task management features.
- **Activity log uses database polling**: The activity feed refreshes on user actions rather than pushing live updates.

## Deployment

### Docker Compose (Recommended)

The fastest way to run the full application stack:

```bash
# Start all services (PostgreSQL + Backend + Frontend)
docker compose up --build

# Run in background
docker compose up --build -d

# Stop all services
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v
```

This starts:
- **PostgreSQL** on `localhost:5432`
- **Backend** on `localhost:4000`
- **Frontend** on `localhost:3000`

### Docker (Individual Services)

**Backend:**

```bash
cd apps/backend
docker build -t taskflow-backend .
docker run -p 4000:4000 --env-file .env taskflow-backend
```

**Frontend:**

```bash
cd apps/frontend
docker build -t taskflow-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1 taskflow-frontend
```

### Manual Setup (Without Docker)

Requires PostgreSQL installed locally:

```bash
# Backend
cd apps/backend
npm install
npx prisma migrate dev
npm run db:seed
npm run dev

# Frontend (separate terminal)
cd apps/frontend
npm install
npm run dev
```

### Environment

Set `NODE_ENV=production` and configure appropriate `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `FRONTEND_URL` for your deployment.

## License

MIT
