# Global Grads CRM

Production-style internal CRM for a study abroad consultancy, built for Global Grads Consulting in Lahore, Pakistan.

This app is designed for counsellors and admins to manage students, track applications, review documents, follow stage movement, and work from a single admissions dashboard.

## Stack

- Next.js 14 App Router
- TypeScript
- Supabase
  - PostgreSQL
  - Auth
  - Storage
  - Realtime
- Tailwind CSS
- Vercel-ready deployment structure

## Current Product Scope

The repository currently includes:

- Dashboard with operational stats, activity feed, and pipeline distribution
- Student intake form and searchable directory
- Unique student codes in `GG-001` format through Supabase sequence generation
- Student profile side panel with:
  - overview
  - documents
  - applications
  - timeline
  - messages
- Pipeline kanban with stage updates
- Documents review workspace with direct upload by student ID and category
- Scholarships page with live on-page matching and filters
- API routes for students, documents, messages, applications, login/logout helpers
- Supabase SQL migration for schema, RLS, stages, and student code generation

## Project Structure

```text
app/
  (auth)/
  (crm)/
  api/

components/
  auth/
  dashboard/
  documents/
  layout/
  pipeline/
  profile/
  scholarships/
  students/
  ui/

lib/
  demo/
  queries/
  supabase/
  utils/

supabase/
  migrations/

types/
```

## Authentication

There are two ways to access the app right now:

1. Supabase auth
2. Hardcoded local test admin path for quick testing

### Test Admin Login

The repo currently includes a hardcoded local-only admin login:

- Email: `testadmin@globalgrads.local`
- Password: `GlobalGrads123!`

This is implemented through:

- `app/api/auth/test-login/route.ts`
- `app/api/auth/logout/route.ts`
- `lib/supabase/test-auth.ts`

Important:

- This is not suitable for production.
- Remove or replace this flow before real deployment.

## Environment Variables

Create a local `.env` or `.env.local` using the values below:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

A placeholder example file is included in `.env.example`.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
pnpm build
pnpm start
```

## Supabase Setup

Run the migration:

```text
supabase/migrations/0001_global_grads_crm.sql
```

Then create:

- a private storage bucket named `student-documents`
- auth users in Supabase if using real auth
- matching rows in `public.users` for role-aware access

## Database Notes

The migration includes:

- `users`
- `students`
- `stages`
- `applications`
- `documents`
- `messages`
- `stage_history`

It also sets up:

- stage definitions 0 through 9
- row-level security
- `generate_student_code()` for `GG-001` style IDs
- update triggers for activity timestamps

## Main Routes

### App routes

- `/login`
- `/magic-link`
- `/crm`
- `/crm/students`
- `/crm/pipeline`
- `/crm/documents`
- `/crm/scholarships`

### API routes

- `POST /api/students`
- `PATCH /api/students/[id]`
- `PATCH /api/students/[id]/stage`
- `POST /api/documents/upload`
- `PATCH /api/documents/[id]/review`
- `GET /api/documents/[id]/download`
- `POST /api/messages`
- `POST /api/applications`
- `POST /api/auth/test-login`
- `POST /api/auth/logout`

## UX Notes

The frontend has been reworked toward a denser internal-tool layout:

- fixed left navigation
- operational dashboard hierarchy
- searchable student directory by unique student code
- document upload directly from review workspace
- live scholarship matching surface

## Known Limitations

The current repo is functional, but still has some product gaps:

- the hardcoded test-admin login should be removed for production
- the app uses custom UI primitives rather than a full shadcn-generated component install
- some “action” buttons are still presentational shortcuts rather than fully connected workflows
- scholarship matching is live against CRM student data, but not connected to an external live scholarship source

## Verification

The current codebase has been verified with:

```bash
pnpm lint
pnpm build
```

## Deployment

This repo is structured for Vercel deployment:

1. import the repository into Vercel
2. set the environment variables
3. connect the Supabase project
4. deploy

## Repository Hygiene

Do not commit:

- `.env`
- Supabase service role secrets
- local logs
- generated local artifacts
