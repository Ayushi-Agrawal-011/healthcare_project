# Healthcare Backend (Node.js)

REST API for managing patients, doctors and patient–doctor mappings with JWT authentication.

**Stack:** Node.js, Express, PostgreSQL, Sequelize ORM, JWT, bcryptjs, Zod.

## Setup

```bash
npm install
cp .env.example .env        # then edit DATABASE_URL and JWT_SECRET
npm run dev                 # tables are created automatically on first start
```

Create the (empty) database first: `createdb healthcare_db` (or via pgAdmin). Sequelize creates the tables from `src/models/index.js`.

## Environment variables

| Name | Description |
|------|-------------|
| `PORT` | Server port (default 5000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1d` |

## API

All endpoints except `/api/auth/*` need `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register (name, email, password) |
| POST | `/api/auth/login/` | Login, returns JWT |
| POST | `/api/patients/` | Add patient |
| GET | `/api/patients/` | Patients created by the logged-in user |
| GET | `/api/patients/:id/` | Patient details (with assigned doctors) |
| PUT | `/api/patients/:id/` | Update patient |
| DELETE | `/api/patients/:id/` | Delete patient |
| POST | `/api/doctors/` | Add doctor |
| GET | `/api/doctors/` | All doctors |
| GET | `/api/doctors/:id/` | Doctor details |
| PUT | `/api/doctors/:id/` | Update doctor (creator only) |
| DELETE | `/api/doctors/:id/` | Delete doctor (creator only) |
| POST | `/api/mappings/` | Assign doctor to patient (`patientId`, `doctorId`) |
| GET | `/api/mappings/` | Mappings of the user's patients |
| GET | `/api/mappings/:patientId/` | Doctors assigned to a patient |
| DELETE | `/api/mappings/:id/` | Remove a doctor from a patient |

## Design notes

- Passwords hashed with bcrypt; JWT verified by middleware on all protected routes.
- **Ownership:** a user can only see/modify their own patients. Other users' patients return 404.
- Doctors are readable by all authenticated users, but only the creator can edit/delete.
- Input validated with Zod; a central error handler maps validation, unique-constraint and auth errors to proper HTTP codes (400/401/403/404/409).
- A patient–doctor pair is unique (duplicate assignment returns 409).

## Example

```bash
curl -X POST localhost:5000/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Ayushi","email":"ayushi@example.com","password":"password123"}'

curl -X POST localhost:5000/api/patients -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ravi","age":45,"gender":"male"}'
```
