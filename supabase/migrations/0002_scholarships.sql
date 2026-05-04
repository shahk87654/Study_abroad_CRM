create table if not exists public.scholarships (
  id text primary key,
  name text not null,
  country text not null,
  min_ielts numeric(3,1) not null,
  degree_level text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

alter table public.scholarships enable row level security;

drop policy if exists "scholarships_all" on public.scholarships;
create policy "scholarships_all" on public.scholarships
for select using (true);

insert into public.scholarships (id, name, country, min_ielts, degree_level, summary)
values
  ('chevening', 'Chevening', 'United Kingdom', 6.5, 'Masters', 'Leadership-focused UK scholarship covering tuition and living support.'),
  ('daad', 'DAAD', 'Germany', 6.0, 'Masters', 'German scholarship program for postgraduate study and research.'),
  ('erasmus', 'Erasmus Mundus', 'Europe', 6.5, 'Masters', 'Multi-country joint degree scholarship across European institutions.'),
  ('commonwealth', 'Commonwealth Scholarship', 'United Kingdom', 6.5, 'Masters', 'Commonwealth-funded postgraduate scholarship for high-potential applicants.')
on conflict (id) do nothing;
