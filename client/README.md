````markdown name=client/README.md
```markdown
# Whisk Client (React)

Quick start (local development)

1. Install dependencies
   cd client
   npm install

2. Create env file
   - Copy `.env.example` to `.env.local` (or to `.env`) and update values as necessary.
   - Example:
     REACT_APP_API_BASE_URL=http://localhost:5000/api

3. Start the development server
   npm run dev
   - The CRA dev server runs on http://localhost:3000 by default.
   - Because `proxy` is set in package.json to http://localhost:5000, API calls to paths like `/api/...` will be proxied to the server for local development.

4. Build for production
   npm run build
   - The built static files will be created in `client/build`. Ensure the server is configured to serve files from that directory in production.

Notes
- Use `REACT_APP_`-prefixed environment variables so Create React App exposes them to the client.
- If your server binds to a different port, update the `proxy` value in package.json or set `REACT_APP_API_BASE_URL` to the full server URL and update client API calls to use that base.
```
````