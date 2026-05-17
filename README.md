# TradeBoard — Service Request Board

A full-stack web application where homeowners post service requests and tradespeople browse, manage, and update them. Built as a technical assessment for GlobalTNA.

---

## Screenshots

> Add your own screenshots here once running locally or deployed.

| Home Page      | Job Detail     | Create Job     |
| -------------- | -------------- | -------------- |
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

---

## Tech Stack

| Layer       | Technology                                        |
| ----------- | ------------------------------------------------- |
| Frontend    | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Forms       | React Hook Form + Zod                             |
| Animations  | Framer Motion                                     |
| HTTP client | Axios                                             |
| Backend     | Node.js, Express.js                               |
| Database    | MongoDB Atlas (Mongoose)                          |
| Validation  | express-validator                                 |

---

## Project Structure

```
service-request-board/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── jobController.js   # Route handlers
│   ├── middleware/
│   │   ├── errorHandler.js    # Global error handler
│   │   └── validate.js        # express-validator rules
│   ├── models/
│   │   └── JobRequest.js      # Mongoose schema
│   ├── routes/
│   │   └── jobs.js            # Express router
│   ├── utils/
│   │   ├── asyncHandler.js    # Async wrapper
│   │   ├── AppError.js        # Custom error class
│   │   └── seed.js            # Sample data seeder
│   ├── .env.example
│   ├── render.yaml
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx              # Home — job list
    │   │   ├── layout.tsx            # Root layout
    │   │   ├── globals.css
    │   │   └── jobs/
    │   │       ├── new/page.tsx      # Create job form
    │   │       └── [id]/page.tsx     # Job detail
    │   ├── components/
    │   │   ├── layout/
    │   │   │   └── Navbar.tsx
    │   │   ├── jobs/
    │   │   │   ├── JobCard.tsx
    │   │   │   ├── JobFilters.tsx
    │   │   │   └── EmptyState.tsx
    │   │   └── ui/
    │   │       ├── StatusBadge.tsx
    │   │       ├── CategoryBadge.tsx
    │   │       ├── Skeleton.tsx
    │   │       └── ConfirmModal.tsx
    │   ├── hooks/
    │   │   ├── useJobs.ts
    │   │   └── useJob.ts
    │   ├── lib/
    │   │   ├── api.ts             # Axios service layer
    │   │   └── validations.ts     # Zod schemas
    │   └── types/
    │       └── index.ts           # TypeScript interfaces
    ├── .env.local.example
    ├── vercel.json
    └── package.json
```

---

## Local Development

### Prerequisites

- Node.js 18+
- A free MongoDB Atlas account (or local MongoDB install)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/service-request-board.git
cd service-request-board
```

### 2. Backend setup

```bash
cd backend
npm install
# Cross-platform: use the included npm script to copy the example env file
# (works on Windows, macOS, Linux):
npm run copyenv
# Or on Windows PowerShell you can run:
# Copy-Item .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/service-request-board
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev        # development (nodemon)
npm start          # production
```

The API will be available at `http://localhost:5000`.

### 3. Seed sample data (optional)

```bash
cd backend
npm run seed
```

This inserts 8 realistic sample job requests into the database.

### 4. Frontend setup

```bash
cd frontend
npm install
# Cross-platform: use the included npm script to copy the example env file
# (works on Windows, macOS, Linux):
npm run copyenv
# Or on Windows PowerShell you can run:
# Copy-Item .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app will be at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                     | Example                 |
| -------------- | ------------------------------- | ----------------------- |
| `PORT`         | Server port                     | `5000`                  |
| `MONGODB_URI`  | MongoDB Atlas connection string | `mongodb+srv://...`     |
| `NODE_ENV`     | Environment                     | `development`           |
| `FRONTEND_URL` | Allowed CORS origin(s)          | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)

| Variable              | Description          | Example                     |
| --------------------- | -------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## API Documentation

Base URL: `http://localhost:5000/api`

### GET `/jobs`

Returns all job requests. Supports optional query parameters.

| Param      | Type   | Description                             |
| ---------- | ------ | --------------------------------------- |
| `category` | string | Filter by category                      |
| `status`   | string | Filter by status                        |
| `search`   | string | Keyword search in title and description |

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [ ...jobObjects ]
}
```

---

### GET `/jobs/:id`

Returns a single job request by ID.

**Response:**

```json
{
  "success": true,
  "data": { ...jobObject }
}
```

---

### POST `/jobs`

Creates a new job request.

**Request body:**

```json
{
  "title": "Leaking kitchen tap",
  "description": "The mixer tap in my kitchen is dripping...",
  "category": "Plumbing",
  "location": "Colombo",
  "contactName": "Jane Smith",
  "contactEmail": "jane@example.com"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Job request created successfully",
  "data": { ...jobObject }
}
```

---

### PATCH `/jobs/:id`

Updates the status of an existing job.

**Request body:**

```json
{ "status": "In Progress" }
```

Valid values: `"Open"` | `"In Progress"` | `"Closed"`

**Response:** `200 OK`

---

### DELETE `/jobs/:id`

Permanently deletes a job request.

**Response:** `200 OK`

```json
{ "success": true, "message": "Job request deleted successfully", "data": {} }
```

---

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Job request not found with id: abc123"
}
```

Validation errors include a field-level breakdown:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "title", "message": "Title is required" }]
}
```

---

## Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to GitHub.
2. Connect the repo in [vercel.com](https://vercel.com).
3. Set the **Root Directory** to `frontend`.
4. Add environment variable: `NEXT_PUBLIC_API_URL` → your Render backend URL.
5. Deploy.

### Backend → Render

1. Push the `backend/` folder to GitHub.
2. Create a new **Web Service** in [render.com](https://render.com).
3. Set **Root Directory** to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI` → your Atlas connection string
   - `FRONTEND_URL` → your Vercel deployment URL
   - `NODE_ENV` → `production`
7. Deploy.

---

## Bonus Features Implemented

- ✅ Keyword search across title and description
- ✅ Seed script (`npm run seed`)
- ✅ Category + status filtering
- ✅ Skeleton loaders during fetch
- ✅ Toast notifications
- ✅ Confirmation modal before delete
- ✅ Framer Motion animations
- ✅ Optimistic status update (no page reload)
- ✅ Custom React hooks (`useJobs`, `useJob`)
- ✅ Reusable API service layer (`src/lib/api.ts`)
- ✅ Type-safe forms with Zod + React Hook Form
- ✅ Debounced search input
- ✅ Mobile-responsive layout

### Prepared for extension

- JWT auth scaffolding: add `middleware/auth.js` and wrap POST/DELETE routes
- Role-based access: extend the user model with a `role` field

---

## Submission

**Deadline:** 18 May 2026, 12:00 PM

Send the GitHub repository link and live demo URL to your GlobalTNA contact.  
CC: nimeshsago@gmail.com
