# TaskFlow Todo App

TaskFlow is a full-stack todo application for creating an account, signing in, and managing a personal task list.

## Features

- Sign up and log in with JWT-based authentication
- Create, complete, and delete tasks
- View tasks by all, pending, or completed status
- See task totals and completion progress
- Keep each user's tasks associated with their account

## Tech Stack

- **Frontend:** React 19, Vite, React Router, CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JSON Web Tokens and bcryptjs

## Project Structure

```text
.
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── fronted/
    ├── src/
    ├── public/
    └── package.json
```

## Prerequisites

- Node.js and npm
- MongoDB running locally

## Run Locally

1. Clone the repository and open its directory.
2. Start MongoDB. The backend connects to `mongodb://127.0.0.1:27017/taskflow`.
3. In a terminal, install dependencies and start the backend:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   The API runs at `http://127.0.0.1:5000`.

4. In a second terminal, install dependencies and start the frontend:

   ```bash
   cd fronted
   npm install
   npm run dev
   ```

   Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## API

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create an account |
| `POST` | `/api/auth/login` | Sign in and receive a JWT |

### Tasks

Task endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/todos` | List the signed-in user's tasks |
| `POST` | `/api/todos` | Create a task |
| `PUT` | `/api/todos/:id` | Update a task title or completion status |
| `DELETE` | `/api/todos/:id` | Delete a task |

## Available Scripts

Run scripts from their respective package directory.

| Directory | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | Start the API with Node watch mode |
| `fronted` | `npm run dev` | Start the Vite development server |
| `fronted` | `npm run build` | Create a production frontend build |
| `fronted` | `npm run lint` | Run Oxlint |
| `fronted` | `npm run preview` | Preview the production build |

## Production Note

The current backend uses a hard-coded JWT secret and local MongoDB connection, and the frontend points to a local API URL. Replace these with secure environment-based configuration before deploying; never commit `.env` files, credentials, or production secrets.
