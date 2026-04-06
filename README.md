# Finance Data Access Backend API

A secure, role-based RESTful backend API built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL** for managing personal or organizational financial records. The API supports user authentication, role-based access control, financial record management, and a rich analytics dashboard.

---

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) via HTTP-only cookies
- **Password Hashing:** bcrypt
- **Environment Config:** dotenv

---

## Project Structure

```
finance-backend/
├── index.js                        # App entry point
├── middle_ware/
│   └── authRoleMiddleware.js       # JWT auth & role guard
├── routes/
│   ├── user_route.js               # User management endpoints
│   ├── record_route.js             # Financial record endpoints
│   └── dashboard.js                # Dashboard analytics endpoints
└── prisma/
    └── schema.prisma               # Database schema
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MANIKRISHNA-doctom/finance-data-access-backend.git
cd finance-data-access-backend/finance-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and fill in the values

# Run Prisma migrations
npx prisma migrate dev

# Start the server
node index.js
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/financedb
SECRET=your_jwt_secret_key
PORT=5000
```

---

## Database Schema

### User

| Field     | Type     | Notes                        |
|-----------|----------|------------------------------|
| id        | Int      | Auto-increment primary key   |
| name      | String   |                              |
| email     | String   | Unique                       |
| password  | String   | bcrypt hashed                |
| role      | Role     | VIEWER / ANALYST / ADMIN     |
| status    | Status   | ACTIVE / INACTIVE            |
| deleted   | Boolean  | Soft delete flag             |

### FinancialRecord

| Field    | Type       | Notes                      |
|----------|------------|----------------------------|
| id       | Int        | Auto-increment primary key |
| amount   | Float      |                            |
| type     | RecordType | INCOME / EXPENSE           |
| category | String     |                            |
| date     | DateTime   |                            |
| notes    | String?    | Optional                   |
| userId   | Int        | Foreign key → User         |
| deleted  | Boolean    | Soft delete flag           |

---

## Roles & Permissions

| Action                        | VIEWER | ANALYST | ADMIN |
|-------------------------------|--------|---------|-------|
| Login / Logout                | ✅     | ✅      | ✅    |
| View own records              | ✅     | ✅      | ✅    |
| View dashboard summary        | ✅     | ✅      | ✅    |
| View monthly/weekly trends    | ❌     | ✅      | ✅    |
| Create / Update records       | ❌     | ❌      | ✅    |
| Soft delete / Restore records | ❌     | ❌      | ✅    |
| Permanently delete records    | ❌     | ❌      | ✅    |
| Manage users                  | ❌     | ❌      | ✅    |

---

## API Endpoints

### Base URL

```
http://localhost:5000
```

---

### User Routes — `/user`

| Method | Endpoint                   | Auth Required | Role   | Description                    |
|--------|----------------------------|---------------|--------|--------------------------------|
| POST   | `/user/create`             | No            | —      | Register one or multiple users |
| POST   | `/user/user_ver`           | No            | —      | Login (returns JWT cookie)     |
| DELETE | `/user/logout`             | Yes           | Any    | Logout (clears cookie)         |
| DELETE | `/user/soft_delete/:id`    | Yes           | ADMIN  | Soft delete a user             |
| GET    | `/user/restoring_user/:id` | Yes           | ADMIN  | Restore a soft-deleted user    |
| DELETE | `/user/delete/:id`         | Yes           | ADMIN  | Permanently delete a user      |

---

### Record Routes — `/user_records`

| Method | Endpoint                          | Auth Required | Role   | Description                          |
|--------|-----------------------------------|---------------|--------|--------------------------------------|
| POST   | `/user_records/create`            | Yes           | ADMIN  | Create one or multiple records       |
| GET    | `/user_records/records`           | Yes           | Any    | Get all records for logged-in user   |
| GET    | `/user_records/records/:id`       | Yes           | Any    | Get a single record by ID            |
| PATCH  | `/user_records/update`            | Yes           | ADMIN  | Update a record                      |
| POST   | `/user_records/records`           | Yes           | Any    | Filter records by type/category/date/amount |
| DELETE | `/user_records/soft_delete/:id`   | Yes           | ADMIN  | Soft delete a record                 |
| GET    | `/user_records/restoring_record/:id` | Yes        | ADMIN  | Restore a soft-deleted record        |
| DELETE | `/user_records/delete/:id`        | Yes           | ADMIN  | Permanently delete a record          |

---

### Dashboard Routes — `/user_dashboard`

| Method | Endpoint           | Auth Required | Role           | Description                             |
|--------|--------------------|---------------|----------------|-----------------------------------------|
| GET    | `/user_dashboard/` | Yes           | Any            | Returns financial summary and analytics |

**Dashboard Response includes:**
- Total income and total expenses
- Net balance
- Category-wise totals (by type)
- Last 20 recent transactions
- Monthly income/expense trends *(ANALYST & ADMIN only)*
- Weekly income/expense trends *(ANALYST & ADMIN only)*
- Monthly profit/loss with percentage change *(ANALYST & ADMIN only)*

---

## Authentication

Authentication uses **JWT stored in HTTP-only cookies**. Tokens expire after **1 hour**.

To access protected routes, log in first:

```bash
POST /user/user_ver
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

The server sets a `token` cookie automatically. Subsequent requests use this cookie for authentication.

---

## Filtering Records

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

## Soft Delete vs Permanent Delete

This API supports **soft deletion** for both users and records. Soft-deleted items are marked with `deleted: true` and excluded from normal queries, but can be **restored** at any time by an ADMIN. Permanent deletion removes the data from the database entirely, along with all associated records.

---

## License

This project is open source. Feel free to use and modify it for your own projects.
