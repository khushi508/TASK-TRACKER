# Task Tracker (MERN Stack)

A full-stack Task Tracker web app — create, view, update, and delete tasks with filtering, sorting, and a responsive UI.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)

## Features
- Full CRUD for tasks (title, description, status, priority, due date)
- Server-side + client-side form validation
- REST API (`/api/tasks`)
- Filtering by status/priority, sorting by date
- Toast notifications on actions
- Fully responsive layout
- Dynamic updates via fetch — no page reloads

## Project Structure
```
task-tracker/
├── server/      # Express + MongoDB API
│   ├── models/Task.js
│   ├── routes/tasks.js
│   └── server.js
└── client/      # React (Vite) frontend
    └── src/
        ├── api/tasks.js
        ├── components/
        └── App.jsx
```

## Local Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
# edit .env and paste your MongoDB Atlas connection string into MONGO_URI
npm run dev
```
Server runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env
# .env already points to http://localhost:5000/api by default
npm run dev
```
App runs on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint          | Description       |
|--------|-------------------|--------------------|
| GET    | /api/tasks        | Get all tasks (supports `?status=`, `?priority=`, `?sort=`) |
| GET    | /api/tasks/:id    | Get single task   |
| POST   | /api/tasks        | Create a new task |
| PUT    | /api/tasks/:id    | Update a task     |
| DELETE | /api/tasks/:id    | Delete a task     |

## Deployment

### MongoDB Atlas
1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user + allow network access from anywhere (0.0.0.0/0) for deployment
3. Copy the connection string into your backend's `MONGO_URI`

### Backend → Render
1. Push this repo to GitHub
2. On Render, create a **Web Service**, point it at the `server` folder
3. Build command: `npm install` | Start command: `npm start`
4. Add environment variable `MONGO_URI` (your Atlas string)
5. Deploy — copy the resulting URL (e.g. `https://your-app.onrender.com`)

### Frontend → Vercel
1. On Vercel, import the same repo, set root directory to `client`
2. Add environment variable `VITE_API_URL` = `https://your-app.onrender.com/api`
3. Deploy

## Author
Khushi Naik
