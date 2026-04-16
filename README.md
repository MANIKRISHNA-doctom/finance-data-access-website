# 💰 Finance Data Access Website

A full-stack personal finance management application built with **React + Vite** (frontend) and **Node.js + Express** (backend), featuring JWT cookie-based authentication, role-based access control, financial record management, and a real-time analytics dashboard.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | [https://finance-data-access-backend.vercel.app](https://finance-data-access-backend.vercel.app) |
| Backend API | [https://finance-data-access-api.onrender.com](https://finance-data-access-api.onrender.com) |

---

## 🧱 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 8 | Build tool & dev server |
| React Router DOM v7 | Client-side routing |
| Axios | HTTP requests with cookie support |
| Tailwind CSS v4 | Utility-first styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js (ES Modules) | Runtime |
| Express.js v5 | Web framework |
| Prisma ORM | Database access |
| PostgreSQL | Relational database |
| JWT (jsonwebtoken) | Authentication tokens |
| bcrypt | Password hashing |
| dotenv | Environment configuration |
| cookie-parser | HTTP cookie handling |
| cors | Cross-origin resource sharing |

---

## 📁 Project Structure

```
finance-data-access-website/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── CSS_files/
│   │   │   ├── Login.css
│   │   │   └── SignUp.css
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page with JWT auth
│   │   │   ├── SignUp.jsx         # User self-registration
│   │   │   ├── home.jsx           # Dashboard (role-aware)
│   │   │   ├── CreateRecord.jsx   # Admin: create financial record
│   │   │   ├── Delete_record.jsx  # Admin: soft/permanent delete record
│   │   │   ├── AddUser.jsx        # Admin: add new user
│   │   │   └── DeleteUser.jsx     # Admin: soft/permanent delete user
│   │   ├── App.jsx                # Route definitions
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx               # App entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── finance-backend/
    ├── index.js                        # Server entry point
    ├── middle_ware/
    │   └── authRoleMiddleware.js        # JWT auth & role guard
    ├── routes/
    │   ├── user_route.js               # User management endpoints
    │   ├── record_route.js             # Financial record endpoints
    │   └── dashboard.js                # Dashboard analytics endpoints
    └── prisma/
        └── schema.prisma               # Database schema
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- npm or yarn

---

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/MANIKRISHNA-doctom/finance-data-access-website.git
cd finance-data-access-website/finance-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section below)

# Run Prisma migrations
npx prisma migrate dev

# Start the server
node index.js
```

The API will be running at `http://localhost:5000`.

### Frontend Setup

```bash
cd finance-data-access-website/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at `http://localhost:5173`.

---

### Environment Variables (Backend)

Create a `.env` file in the `finance-backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/financedb
SECRET=your_jwt_secret_key
PORT=5000
```

---

## 🔐 Authentication

Authentication uses **JWT stored in HTTP-only cookies**. Tokens expire after **1 hour**.

To log in, send a POST request to `/user/user_ver`. The server sets a `token` cookie automatically, which is included in all subsequent requests.

### Demo Credentials

```json
{
  "email": "john@gmail.com",
  "password": "123"
}
```

---

## 👥 Roles & Permissions

| Action | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| Login / Logout | ✅ | ✅ | ✅ |
| View own records | ✅ | ✅ | ✅ |
| View dashboard summary | ✅ | ✅ | ✅ |
| View monthly/weekly trends & profit/loss | ❌ | ✅ | ✅ |
| Create / Update records | ❌ | ❌ | ✅ |
| Soft delete / Restore records | ❌ | ❌ | ✅ |
| Permanently delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## 🖥️ Frontend Pages

| Route | Page | Access |
|---|---|---|
| `/` | Login | Public |
| `/sign_up` | Sign Up | Public |
| `/home` | Dashboard | All authenticated users |
| `/create_record` | Create Financial Record | Admin only |
| `/delete_record` | Delete Financial Record | Admin only |
| `/add_user` | Add New User | Admin only |
| `/delete_user` | Delete User | Admin only |

### Page Descriptions

**Login (`/`)** — Email/password login form. On success, JWT cookie is set and the user is redirected to the dashboard.

**Sign Up (`/sign_up`)** — Self-registration form. Users can choose a role (Viewer, Analyst, Admin).

**Dashboard (`/home`)** — Role-aware dashboard displaying total income, total expenses, net balance, and recent records. ANALYST and ADMIN users also see monthly/weekly trends and profit/loss. ADMIN users see an admin panel with links to manage records and users.

**Create Record (`/create_record`)** — Admin form to create a new financial record for any user, specifying amount, type (Income/Expense), category, date, notes, and target user ID.

**Delete Record (`/delete_record`)** — Admin panel to soft delete or permanently delete a financial record by ID.

**Add User (`/add_user`)** — Admin form to create a new user with name, email, password, and role.

**Delete User (`/delete_user`)** — Admin panel to soft delete or permanently delete a user by ID.

---

## 🗄️ Database Schema

### User

| Field | Type | Notes |
|---|---|---|
| id | Int | Auto-increment primary key |
| name | String | |
| email | String | Unique |
| password | String | bcrypt hashed (12 rounds) |
| role | Role | VIEWER / ANALYST / ADMIN (default: VIEWER) |
| status | Status | ACTIVE / INACTIVE (default: ACTIVE) |
| deleted | Boolean | Soft delete flag (default: false) |
| createdAt | DateTime | Auto-set on creation |
| updatedAt | DateTime | Auto-updated |

### FinancialRecord

| Field | Type | Notes |
|---|---|---|
| id | Int | Auto-increment primary key |
| amount | Float | |
| type | RecordType | INCOME / EXPENSE |
| category | String | |
| date | DateTime | Defaults to now() |
| notes | String? | Optional |
| userId | Int | Foreign key → User |
| deleted | Boolean | Soft delete flag (default: false) |
| createdAt | DateTime | Auto-set on creation |
| updatedAt | DateTime | Auto-updated |

---

## 🔌 API Reference

### Base URLs

- **Local:** `http://localhost:5000`
- **Production:** `https://finance-data-access-api.onrender.com`

---

### User Routes — `/user`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/user/create` | No | — | Register one or multiple users |
| POST | `/user/user_ver` | No | — | Login (sets JWT cookie) |
| DELETE | `/user/logout` | Yes | Any | Logout (clears cookie) |
| DELETE | `/user/soft_delete/:id` | Yes | ADMIN | Soft delete a user |
| GET | `/user/restoring_user/:id` | Yes | ADMIN | Restore a soft-deleted user |
| DELETE | `/user/delete/:id` | Yes | ADMIN | Permanently delete a user |

---

### Record Routes — `/user_records`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/user_records/create` | Yes | ADMIN | Create one or multiple records |
| GET | `/user_records/records` | Yes | Any | Get all records for logged-in user |
| GET | `/user_records/records/:id` | Yes | Any | Get a single record by ID |
| PATCH | `/user_records/update` | Yes | ADMIN | Update a record |
| POST | `/user_records/records` | Yes | Any | Filter records by type/category/date/amount |
| DELETE | `/user_records/soft_delete/:id` | Yes | ADMIN | Soft delete a record |
| GET | `/user_records/restoring_record/:id` | Yes | ADMIN | Restore a soft-deleted record |
| DELETE | `/user_records/delete/:id` | Yes | ADMIN | Permanently delete a record |

---

### Dashboard Route — `/user_dashboard`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/user_dashboard` | Yes | Any | Returns financial summary and analytics |

**Response includes:**
- Total income and total expenses
- Net balance
- Category-wise totals (by type)
- Last 20 recent transactions
- Monthly income/expense trends *(ANALYST & ADMIN only)*
- Weekly income/expense trends *(ANALYST & ADMIN only)*
- Monthly profit/loss with percentage change *(ANALYST & ADMIN only)*

---

## 🔍 Filtering Records

Send a `POST` to `/user_records/records` with any combination of the following filters:

```json
{
  "type": "EXPENSE",
  "category": "Food",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31",
  "minAmount": 100,
  "maxAmount": 5000
}
```

If no date range is provided, the API defaults to the **last 30 days**. Results are limited to **30 records**, ordered by date (newest first).

---

## 🗑️ Soft Delete vs Permanent Delete

This application supports **soft deletion** for both users and records:

- **Soft Delete** — marks the item with `deleted: true` and sets the user status to `INACTIVE`. Items are excluded from normal queries but can be **restored** at any time by an ADMIN.
- **Permanent Delete** — removes the data from the database entirely, along with all associated records.

---

## 📦 Frontend Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🔒 Security Notes

- Passwords are hashed using **bcrypt with 12 salt rounds**
- JWT tokens are stored in **HTTP-only, secure, SameSite=None cookies** to prevent XSS attacks
- CORS is configured to allow only the frontend origin with credentials
- Role-based middleware protects all sensitive routes

---

## 👤 Author

**MANIKRISHNA** — [GitHub Profile](https://github.com/MANIKRISHNA-doctom)
