# Bookmark Manager API Guide

Base URL (local): http://localhost:4000

Endpoints:

- GET /bookmarks
  - Fetch all bookmarks
  - Example:
    ```bash
    curl http://localhost:4000/bookmarks
    ```

- POST /bookmarks
  - Create a new bookmark. Body JSON: `{ "title": "Name", "url": "https://...", "tags": ["x"] }`
  - Example:
    ```bash
    curl -X POST http://localhost:4000/bookmarks \
      -H "Content-Type: application/json" \
      -d '{"title":"Example","url":"https://example.com","tags":["sample"]}'
    ```

- PUT /bookmarks/:id
  - Update an existing bookmark. `:id` must be a valid MongoDB ObjectId.
  - Example:
    ```bash
    curl -X PUT http://localhost:4000/bookmarks/<id> \
      -H "Content-Type: application/json" \
      -d '{"title":"Updated title"}'
    ```

- DELETE /bookmarks/:id
  - Delete a bookmark by id (must be a valid ObjectId)
  - Example:
    ```bash
    curl -X DELETE http://localhost:4000/bookmarks/<id>
    ```

Notes:
- The server validates `:id` using `mongoose.Types.ObjectId.isValid` and returns `400` for invalid ids.
- Updates use `runValidators: true` so schema validators are enforced on PUT.
- Use `npm run dev --prefix backend` to start the backend in development (root repo has `dev:all` to run both client + backend concurrently).

Environment:
- Configure `MONGO_URI` in a `.env` at the project root or `backend/.env` (optional). Default: `mongodb://localhost:27017/bookmarks`.
