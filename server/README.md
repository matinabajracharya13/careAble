# my-backend

Express.js + TypeScript REST API backend.

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and configure
cp .env.example .env

# Start dev server (hot reload)
npm run dev

# Build for production
npm run build
npm start
```

## Project Structure

```
src/
├── index.ts              # Entry point
├── app.ts                # Express app + middleware setup
├── routes/               # Route definitions
│   ├── healthRoutes.ts
│   └── userRoutes.ts
├── controllers/          # Business logic
│   ├── healthController.ts
│   └── userController.ts
├── middleware/           # Custom middleware
│   ├── errorHandler.ts
│   └── requestLogger.ts
└── types/                # Shared TypeScript types
    └── index.ts
```

## API Endpoints

### Health
| Method | URL | Description |
|---|---|---|
| GET | `/api/health` | Server health check |

### Users
| Method | URL | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

## Example Requests

```bash
# Health check
curl http://localhost:5000/api/health

# Get all users
curl http://localhost:5000/api/users

# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane", "email": "jane@example.com"}'
```

## Adding More Routes

1. Create a controller in `src/controllers/`
2. Create a route file in `src/routes/`
3. Register it in `src/app.ts`
