# Helpdesk App

A full-stack helpdesk ticketing system with a React frontend and Node.js/Express/MongoDB backend. The app allows users to sign up, log in, and manage support tickets securely via a RESTful API.

---

## Features

- User authentication (JWT-based signup/login)
- Create, view, update, and delete support tickets
- Assign tickets to users
- Ticket status management (open, in progress, closed)
- RESTful API with Swagger docs
- Rate limiting, security headers, and CORS
- React frontend (template, ready for customization)

---

## Tech Stack

- **Frontend:** React (Create React App)
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT
- **API Docs:** Swagger (OpenAPI)
- **Other:** Helmet, CORS, express-rate-limit

---

## Project Structure

```
helpdesk-app/
  client/      # React frontend
  server/      # Express backend
  tests/       # API HTTP request examples
  requirements.txt  # Setup instructions for Node/MongoDB
```

---

## Installation & Setup

### Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or cloud)

### 1. Backend Setup

```sh
cd server
npm install
```

#### Environment Variables

Create a `.env` file in `server/` with:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/helpdesk
TOKEN_SECRET=your_jwt_secret
```

### 2. Frontend Setup

```sh
cd ../client
npm install
```

---

## Running the App

### Start MongoDB

- macOS: `brew services start mongodb-community`
- Windows: Use MongoDB Community installer

### Start Backend

```sh
cd server
npm run dev   # or: make dev
```

### Start Frontend

```sh
cd client
npm start
```

- Backend: http://localhost:3000/api
- Frontend: http://localhost:3000/ (or another port if 3000 is in use)
- API Docs: http://localhost:3000/api-docs

---

## API Overview

### Auth

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Tickets (JWT required)

- `POST /api/tickets` — Create ticket
- `GET /api/tickets` — List all tickets
- `GET /api/tickets/:id` — Get ticket by ID
- `PUT /api/tickets/:id` — Update ticket
- `PATCH /api/tickets/:id` — Partial update
- `DELETE /api/tickets/:id` — Delete ticket

See [tests/api.http](tests/api.http) for example requests.

#### Example: Signup & Login

```http
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "s3cret123"
}

POST /api/auth/login
{
  "email": "user@example.com",
  "password": "s3cret123"
}
// Response: { "token": "..." }
```

#### Example: Create Ticket

```http
POST /api/tickets
Authorization: Bearer <token>
{
  "title": "Cannot log in",
  "description": "User gets error when trying to log in."
}
```

---

## Development

- Backend scripts: `npm run dev` (nodemon), `npm start`
- Frontend scripts: `npm start`, `npm test`, `npm run build`
- Makefile in `server/` for quick start
- API docs auto-generated at `/api-docs`

---

## Contributing

1. Fork & clone the repo
2. Create a feature branch
3. Commit and push your changes
4. Open a pull request

---

## License

[MIT](LICENSE) (add a LICENSE file if needed)
