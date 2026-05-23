# JSON Server Setup for Todo API

This project uses [json-server](https://github.com/typicode/json-server) to provide a local REST API for the Todo feature.

## Setup

### 1. Install Dependencies

```bash
npm install
```

This will install `json-server` and `concurrently` as dev dependencies.

### 2. Start JSON Server

You have two options to run the JSON server:

#### Option A: Run JSON Server Only
```bash
npm run json-server
```

This will start json-server on port 3001 with the `db.json` file.

#### Option B: Run Both JSON Server and Vite Dev Server
```bash
npm run dev:server
```

This will start both json-server (port 3001) and Vite dev server (port 5173) concurrently.

### 3. Verify JSON Server is Running

Once started, you can access:
- JSON Server: http://localhost:3001
- Todos API: http://localhost:3001/todos
- Vite Dev Server: http://localhost:5173

## API Endpoints

The JSON server provides the following REST endpoints for todos:

- `GET /todos` - Get all todos
- `GET /todos?userId=1` - Get todos by user ID
- `GET /todos?completed=false` - Get todos by completion status
- `GET /todos?priority=high` - Get todos by priority
- `GET /todos/:id` - Get a single todo by ID
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo (full update)
- `PATCH /todos/:id` - Update a todo (partial update)
- `DELETE /todos/:id` - Delete a todo

## Data Structure

Todos have the following structure:

```json
{
  "id": 1,
  "userId": 1,
  "title": "Complete project documentation",
  "completed": false,
  "description": "Write comprehensive documentation",
  "priority": "high",
  "dueDate": "2025-01-20",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z",
  "tags": ["documentation", "project"]
}
```

## Proxy Configuration

The Vite dev server is configured to proxy `/todos` requests to the JSON server on port 3001. This means:

- Frontend requests to `/todos` are automatically forwarded to `http://localhost:3001/todos`
- No CORS issues in development
- Seamless integration with the React app

## Regenerating db.json

If you modify the dummy data in `src/dummyData/dummyTodo.js`, you can regenerate `db.json`:

```bash
npm run generate-db
```

## Configuration

JSON server configuration is in `json-server.json`:

- Port: 3001
- Watch mode: enabled (auto-reloads on db.json changes)
- Delay: 200ms (simulates network latency)
- Read-only: false (allows POST, PUT, PATCH, DELETE)

## Notes

- The `db.json` file is automatically watched and reloaded when changed
- All changes made through the API are persisted to `db.json`
- The server supports filtering, sorting, and pagination out of the box
- For production, replace json-server with a real backend API

