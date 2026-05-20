# FinFlow — Personal Finance & Subscription Manager

A full-stack personal finance dashboard built with React + Vite (frontend) and Node.js + Express + PostgreSQL + Prisma (backend).

---

## ✨ Features

- **Dashboard** — Real-time overview with charts, metric cards, recent transactions, and upcoming renewals
- **Transactions** — Full CRUD with filters, search, sorting, and CSV export
- **Subscriptions** — Track all recurring bills with renewal badges and monthly cost summary
- **Budgets** — Monthly category budgets with animated progress bars and over-budget alerts
- **Analytics** — Multi-tab charts: spending trends, category breakdown, subscription analysis
- **Settings** — Profile management, password change, theme toggle, notification preferences
- **Dark / Light Mode** — Persistent theme preference
- **JWT Auth** — Secure login, register, and protected routes
- **CSV Export** — Export transactions and subscriptions

---

## 🗂 Project Structure

```
finflow/
├── backend/                        # Node.js + Express API
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── seed.js                 # Demo data seeder
│   ├── src/
│   │   ├── index.js                # Express server entry point
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── transaction.controller.js
│   │   │   ├── subscription.controller.js
│   │   │   ├── budget.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── transaction.routes.js
│   │   │   ├── subscription.routes.js
│   │   │   ├── budget.routes.js
│   │   │   └── dashboard.routes.js
│   │   └── middleware/
│   │       ├── auth.middleware.js   # JWT verification
│   │       ├── error.middleware.js  # Global error handler
│   │       └── validate.middleware.js
│   ├── .env.example
│   └── package.json
│
├── frontend/                       # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx                 # Router + providers
│   │   ├── main.jsx                # React entry point
│   │   ├── index.css               # CSS variables + global styles
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TransactionsPage.jsx
│   │   │   ├── SubscriptionsPage.jsx
│   │   │   ├── BudgetsPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── components/
│   │   │   ├── ui/index.jsx        # Card, Button, Modal, Badge, Input, etc.
│   │   │   └── layout/
│   │   │       └── AppLayout.jsx   # Sidebar + Header layout
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Authentication state
│   │   │   └── ThemeContext.jsx    # Dark/light mode
│   │   ├── hooks/
│   │   │   └── useData.js          # React Query hooks for all data
│   │   ├── services/
│   │   │   └── api.js              # Axios API service layer
│   │   └── utils/
│   │       └── helpers.js          # fmt, fmtDate, exportToCSV, etc.
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── package.json
│
└── index.html                      # 🚀 Standalone demo (no server needed!)
```

---

## 🚀 Quick Start (Standalone)

Open `index.html` directly in any browser — no installation required!

**Demo credentials:** `alex@finflow.app` / `demo1234`

---

## 🛠 Full Stack Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally
- npm or yarn

### 1. Backend Setup

```bash
cd finflow/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and set your DATABASE_URL, JWT_SECRET

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed with demo data
node prisma/seed.js

# Start development server
npm run dev
# → API running at http://localhost:5000
```

### 2. Frontend Setup

```bash
cd finflow/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
# → App running at http://localhost:5173
```

### 3. Open the app

Navigate to **http://localhost:5173**

Login: `alex@finflow.app` / `demo1234`

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List with filters |
| GET | `/api/transactions/summary` | Totals + category breakdown |
| POST | `/api/transactions` | Create |
| PUT | `/api/transactions/:id` | Update |
| DELETE | `/api/transactions/:id` | Delete |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions` | List all |
| GET | `/api/subscriptions/upcoming` | Renewals in next N days |
| POST | `/api/subscriptions` | Create |
| PUT | `/api/subscriptions/:id` | Update |
| DELETE | `/api/subscriptions/:id` | Delete |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | List with actual spending |
| POST | `/api/budgets` | Create |
| PUT | `/api/budgets/:id` | Update |
| DELETE | `/api/budgets/:id` | Delete |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Full dashboard data |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/password` | Change password |
| GET | `/api/users/notifications` | List notifications |

---

## 🗄 Database Schema

```prisma
model User {
  id            Int            @id @default(autoincrement())
  name          String
  email         String         @unique
  password      String         // bcrypt hashed
  currency      String         @default("USD")
  transactions  Transaction[]
  subscriptions Subscription[]
  budgets       Budget[]
  notifications Notification[]
}

model Transaction {
  id       Int      @id @default(autoincrement())
  title    String
  amount   Float
  type     String   // "income" | "expense"
  category String
  date     DateTime
  method   String
  notes    String?
  userId   Int
}

model Subscription {
  id          Int       @id @default(autoincrement())
  name        String
  category    String
  amount      Float
  cycle       String    // "weekly" | "monthly" | "yearly"
  startDate   DateTime
  nextRenewal DateTime?
  method      String
  status      String    // "active" | "paused" | "cancelled"
  notes       String?
  userId      Int
}

model Budget {
  id       Int    @id @default(autoincrement())
  category String
  limit    Float
  month    String // "YYYY-MM"
  userId   Int
}
```

---

## 🧪 Demo Data

The seed script creates:
- **1 demo user:** `alex@finflow.app` / `demo1234`
- **20 transactions** across Jan–Mar 2024 (income + expenses)
- **10 subscriptions** (Netflix, Spotify, GitHub Copilot, Adobe CC, etc.)
- **8 budget limits** across common spending categories
- **2 sample notifications**

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Framer Motion |
| Styling | Tailwind CSS, CSS Variables |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Query + Context API |
| HTTP | Axios |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcryptjs |
| Validation | Zod |

---

## 🎓 Notes for Project Review

- All pages are fully functional in the standalone `index.html` demo
- Backend is production-structured with controller/route/middleware separation
- Frontend uses proper React patterns: context, custom hooks, service layer
- JWT stored in localStorage with automatic header injection
- Full error handling on both frontend and backend
- CSV export works on both transactions and subscriptions pages
- Responsive design for mobile, tablet, and desktop
