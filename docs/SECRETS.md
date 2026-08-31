How to store secrets for this Next.js app

Local development
- Create a file named .env.local at the project root and add your environment variables there.
- Do NOT commit .env.local — it's ignored by .gitignore.
- Use the provided .env.example as a template (contains placeholder keys for Firebase).

Next.js conventions
- NEXT_PUBLIC_* variables are embedded into the client bundle and are visible to anyone who inspects the app.
  - Use NEXT_PUBLIC_* only for non-sensitive Firebase web config values (apiKey, authDomain, etc.).
- Server-only secrets (service account keys, admin API keys) must NOT be prefixed with NEXT_PUBLIC_ and must be kept server-side.
  - For server-only code (API routes, getServerSideProps, or middleware) use process.env.MY_SECRET (set in hosting provider or CI).

Production / hosting
- Use the hosting provider's secret manager / environment variable UI:
  - Vercel: Project Settings -> Environment Variables
  - Netlify: Site Settings -> Build & deploy -> Environment
  - AWS: Systems Manager Parameter Store or Secrets Manager
  - Render, Fly, Railway, etc. all provide secure env var storage
- Add the same variables names used locally (no NEXT_PUBLIC_ for server-only secrets).

CI / GitHub Actions
- Store secrets in the repository or organization secrets and reference them in workflows.
- Do NOT echo secrets in logs or write them to committed files during CI.

Firebase Admin (server-side)
- If you need admin privileges (e.g., verifying tokens, server-side writes with Admin SDK), use the Firebase Admin SDK and authenticate with a service account.
- Store the service account JSON in a secure secret manager and load it at runtime on the server.
  - Example approaches:
    - On Vercel: store the JSON as a secret and write it to a temporary file at build/start time (careful with logs)
    - On Node servers: load SERVICE_ACCOUNT value from env and parse JSON

Security checklist
- Never commit real keys, service account files, or credentials to git.
- Use .env.example to show the required variables with placeholder values.
- Rotate keys if a secret leaks.
- Restrict Firebase rules (Firestore / Storage) to limit exposure even if client keys are public (they are not sufficient alone to bypass rules).

Troubleshooting
- If builds fail due to missing env vars during static prerender, ensure client-only initialization is gated (this repo uses a getFirebaseAuth() helper that returns null during SSR).
- If using third-party providers (Google) ensure OAuth redirect URIs are configured in Firebase console and match your dev/prod URLs.

If you want, I can:
- Add a small startup script to copy .env.example -> .env.local for new devs (without secrets filled)
- Add a CI step template that injects required env vars for builds
- Add an example of securely loading Firebase Admin credentials on a server
