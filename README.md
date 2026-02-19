# Expense Tracker — MERN Full-Stack App

A minimal, production-quality personal expense tracker built with **MongoDB**, **Express**, **React**, and **Node.js**.

## Features

- **Create expenses** with amount, category, description, and date
- **View expenses** in a sortable, filterable table
- **Filter by category** — dropdown with preset categories
- **Sort by date** — newest or oldest first
- **Total display** — shows sum of currently visible expenses
- **Category breakdown** — visual bar chart of spending per category
- **Idempotent API** — safe against double-clicks and network retries
- **Input validation** — both client-side and server-side
- **Loading & error states** — graceful handling of slow/failed requests
- **Responsive design** — works on mobile and desktop

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Database** | MongoDB Atlas (cloud) |
| **Backend** | Node.js, Express, Mongoose |
| **Frontend** | React 18, Vite |
| **Styling** | Vanilla CSS (dark theme) |

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- A MongoDB Atlas cluster (free tier works)

### 1. Clone & Setup

```bash
cd expense-tracker
```

### 2. Backend Setup

```bash
cd server
npm install
```

Edit `server/.env` and replace the `MONGO_URI` with your MongoDB Atlas connection string:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/expense_tracker?retryWrites=true&w=majority
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## API Endpoints

### `POST /api/expenses`

Create a new expense.

**Request body:**
```json
{
  "amount": 250.50,
  "category": "Food",
  "description": "Lunch at office",
  "date": "2026-02-18",
  "idempotencyKey": "uuid-v4-string"
}
```

- `idempotencyKey` is optional but recommended — prevents duplicate entries on retries.

### `GET /api/expenses`

List all expenses. Supports query parameters:

| Param | Description |
|-------|------------|
| `category` | Filter by category (e.g., `?category=Food`) |
| `sort` | `date_desc` (default, newest first) or `date_asc` |

---

## Key Design Decisions

1. **MongoDB Atlas** — Cloud-hosted for zero local DB setup. Mongoose ODM provides schema validation and clean data modeling.

2. **Decimal128 for amounts** — Avoids floating-point arithmetic errors common with JavaScript `Number`. Money is stored precisely in the database.

3. **Idempotency keys** — Each expense form submission generates a UUID. If the same key is submitted again (network retry, double-click), the API returns the existing record instead of creating a duplicate. Uses a unique sparse index for race-condition safety.

4. **Server-side filtering/sorting** — Filtering and sorting happen in MongoDB queries, not in the frontend. This scales better as the dataset grows.

5. **Vite dev proxy** — The Vite dev server proxies `/api` requests to the Express backend, avoiding CORS complexity during development.

---

## Trade-offs

- **No authentication** — kept out of scope to focus on core expense tracking functionality.
- **No pagination** — for a personal finance tool with moderate data volume, loading all expenses is acceptable. Would add cursor-based pagination for production scale.
- **Category list is hardcoded** — a quick pragmatic choice. Could be made dynamic/user-configurable.
- **No delete/edit** — focused on the required CRUD operations (create + read). Adding update/delete would be a natural next step.

---

## What I Intentionally Did Not Do

- **No Redux/state management library** — React's built-in `useState` + `useCallback` is sufficient for this scale.
- **No CSS framework** — hand-written CSS gives full control over the dark theme aesthetic without bundle bloat.
- **No WebSocket/real-time updates** — polling or manual refresh is adequate for a single-user tool.
