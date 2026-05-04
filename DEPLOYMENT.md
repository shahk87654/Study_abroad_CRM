# Production Deployment Guide

This guide outlines the steps required to deploy the Enrollio CRM portal to a production environment.

## 1. Environment Variables

Ensure the following environment variables are configured in your hosting provider (e.g., Vercel, Netlify, Railway).

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g., `https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key for client-side queries. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Keep secret! Used for admin operations). |
| `ADMIN_SESSION_SECRET` | A long, random string used to sign admin session cookies. |

> [!IMPORTANT]
> Change the `ADMIN_SESSION_SECRET` before deploying. Use a secure generator like `openssl rand -base64 32`.

## 2. Supabase Setup

### Database Schema
Apply the migrations found in the `supabase/migrations` directory. You can do this via the Supabase Dashboard SQL Editor or using the Supabase CLI:
```bash
supabase db push
```

### Storage Buckets
The application requires a private storage bucket for student documents:
1. Go to **Storage** in your Supabase Dashboard.
2. Create a new bucket named **`student-documents`**.
3. Set the bucket to **Private**.
4. (Optional) Set up CORS if you experience issues with file uploads from your production domain.

### Authentication
The CRM uses a custom admin session managed via cookies. 
1. Ensure your production domain is added to the **Site URL** and **Redirect URLs** in Supabase Auth settings.
2. The initial admin user is created via the SQL migration (`testadmin@globalgrads.local`). You should update this email and password (if applicable) in the `public.users` table for production.

## 3. Build & Deployment

### Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Vercel will automatically detect the Next.js project.
4. Add the [Environment Variables](#1-environment-variables).
5. Deploy.

### Manual Build
If deploying to a VPS or Docker container:
```bash
# Install dependencies
pnpm install

# Build the production bundle
pnpm build

# Start the server
pnpm start
```

## 4. Security Checklist

- [ ] `ADMIN_SESSION_SECRET` is changed from the default.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT exposed in the frontend.
- [ ] The `student-documents` bucket is strictly **Private**.
- [ ] Environment variables are NOT committed to version control.
- [ ] HTTPS is enabled on the production domain.

## 5. Maintenance

### Monitoring
Check the Supabase **Logs** and **API** tabs for any request failures. Standard Next.js error logs will be available via your hosting provider's dashboard.

### Updates
When pushing updates, ensure you run any new migrations against the production Supabase instance before deploying the application code.
