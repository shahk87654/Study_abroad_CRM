create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('admin', 'counsellor', 'student')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.stages (
  id uuid primary key default gen_random_uuid(),
  stage_index int not null unique check (stage_index between 0 and 9),
  key text not null unique,
  label text not null,
  description text not null,
  color_token text not null check (color_token in ('primary', 'warning', 'success'))
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  student_code text not null unique,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  assigned_counsellor_id uuid references public.users(id) on delete set null,
  current_stage int not null default 0 check (current_stage between 0 and 9),
  ielts_score numeric(3,1),
  gpa numeric(3,2),
  passport_number text,
  program_interest text,
  country_preferences text[] not null default '{}',
  intake_term text,
  private_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  university_name text not null,
  program_name text not null,
  country text not null,
  deadline date,
  decision_status text not null check (decision_status in ('draft', 'submitted', 'under_review', 'offer_received', 'rejected', 'visa_process', 'closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  category text not null,
  file_name text not null,
  storage_path text not null unique,
  mime_type text not null,
  status text not null default 'pending' check (status in ('pending', 'uploaded', 'under_review', 'approved', 'rejected')),
  rejection_reason text,
  reviewer_id uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  document_id uuid references public.documents(id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.stage_history (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  from_stage int check (from_stage between 0 and 9),
  to_stage int not null check (to_stage between 0 and 9),
  changed_by uuid not null references public.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

create sequence if not exists public.student_code_seq start 1;

create or replace function public.generate_student_code()
returns text
language plpgsql
security definer
as $$
declare
  next_value bigint;
begin
  next_value := nextval('public.student_code_seq');
  return 'EN-' || lpad(next_value::text, 3, '0');
end;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.last_activity_at = now();
  return new;
end;
$$;

drop trigger if exists students_touch_updated_at on public.students;
create trigger students_touch_updated_at
before update on public.students
for each row execute function public.touch_updated_at();

alter table public.users enable row level security;
alter table public.students enable row level security;
alter table public.applications enable row level security;
alter table public.documents enable row level security;
alter table public.messages enable row level security;
alter table public.stage_history enable row level security;

create or replace function public.current_role()
returns text
language sql
stable
as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.student_visible(target_student_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.students s
    where s.id = target_student_id
      and (
        public.current_role() = 'admin'
        or (public.current_role() = 'counsellor' and s.assigned_counsellor_id = auth.uid())
        or (public.current_role() = 'student' and s.id = auth.uid())
      )
  )
$$;

create policy "students_select" on public.students
for select using (public.student_visible(id));

create policy "students_update_admin_counsellor" on public.students
for update using (public.current_role() in ('admin', 'counsellor'))
with check (public.current_role() in ('admin', 'counsellor'));

create policy "students_insert_admin_counsellor" on public.students
for insert with check (public.current_role() in ('admin', 'counsellor'));

create policy "applications_all" on public.applications
for all using (public.student_visible(student_id))
with check (public.student_visible(student_id));

create policy "documents_all" on public.documents
for all using (public.student_visible(student_id))
with check (public.student_visible(student_id));

create policy "messages_all" on public.messages
for all using (public.student_visible(student_id))
with check (public.student_visible(student_id));

create policy "stage_history_all" on public.stage_history
for all using (public.student_visible(student_id))
with check (public.student_visible(student_id));

insert into public.stages (stage_index, key, label, description, color_token)
values
  (0, 'new_lead', 'New Lead', 'Initial inquiry and registration.', 'primary'),
  (1, 'counselling', 'Counselling', 'Profile evaluation and shortlist.', 'primary'),
  (2, 'documents', 'Documents', 'Document collection and validation.', 'warning'),
  (3, 'applications', 'Applications', 'University applications in progress.', 'warning'),
  (4, 'offer_received', 'Offer Received', 'Offer letters received.', 'success'),
  (5, 'scholarship', 'Scholarship', 'Scholarship opportunities under review.', 'primary'),
  (6, 'visa_filing', 'Visa Filing', 'Visa documents being filed.', 'warning'),
  (7, 'visa_interview', 'Visa Interview', 'Interview scheduling and prep.', 'warning'),
  (8, 'visa_approved', 'Visa Approved', 'Visa decision approved.', 'success'),
  (9, 'enrolled', 'Enrolled', 'Student enrolled and journey closed.', 'success')
on conflict (stage_index) do nothing;
