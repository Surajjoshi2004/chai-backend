# Chai Backend (YouTube-like MERN)

This project is a Node.js/Express backend for a YouTube-style application, built as part of a backend tutorial series.

## Architecture Overview

- `src/index.js`: entrypoint, loads `.env`, connects to MongoDB, starts Express server.
- `src/app.js`: vanilla Express app, global middleware (`cors`, `json`, `urlencoded`, `cookie-parser`, static files), mounts `/api/v1/users` routes.
- `src/routes/user.routes.js`: user auth endpoints.
- `src/controllers/user.controller.js`: register/login/logout/refresh token logic.
- `src/middlewares/auth.middleware.js`: JWT verification and `req.user` population.
- `src/db/index.js`: MongoDB connection using Mongoose.
- `src/models`: user/video/subscription schemas + methods.
- `src/utils`: response/error wrappers, async handler, Cloudinary helper.

## API Endpoints

- `POST /api/v1/users/register`
  - multipart form: `avatar` (required), `coverImage` (optional), plus `fullName`, `email`, `username`, `password`.
  - saves user, uploads media to Cloudinary.
- `POST /api/v1/users/login`
  - `email` or `username`, plus `password`.
  - returns cookies `accessToken`, `refreshToken` and user object.
- `POST /api/v1/users/logout` (protected)
  - clears access and refresh cookies.
- `POST /api/v1/users/refresh-token`
  - accepts refresh token cookie/body; issues new tokens.

## Environment Variables

- `PORT` (default 5000)
- `MONGODB_URI`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `CORS_ORIGIN`
- Cloudinary keys (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)

## Quick Start

1. `npm install`
2. create `.env`
3. `npm run dev`

## Diagram (Mermaid)

```mermaid
flowchart TD
  A[Client] -->|POST /api/v1/users/register| B[Express App]
  A -->|POST /api/v1/users/login| B
  A -->|POST /api/v1/users/logout| B
  A -->|POST /api/v1/users/refresh-token| B
  B --> C[Middleware (CORS, JSON, URLencoded, Cookies, Static)]
  B --> D[User Routes]
  D --> F[Controllers: register, login, logout, refresh]
  F --> G[User Model/MongoDB]
  F --> H[Cloudinary Util]
  D --> I[JWT Auth Middleware]
  B --> J[MongoDB (Mongoose)]
```

## Notes

- Update README as features expand (video routes, subscriptions, likes, comments, etc.).
