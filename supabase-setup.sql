-- ══════════════════════════════════════════════════════
-- DR-CAFTA Curso · Supabase Setup
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ══════════════════════════════════════════════════════

-- 1. Tabla de perfiles de usuario
create table if not exists public.user_profiles (
  id          uuid references auth.users on delete cascade primary key,
  display_name text not null default 'Usuario',
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Tabla de progreso por módulo
create table if not exists public.module_progress (
  user_id    uuid references auth.users on delete cascade,
  module_id  integer not null,
  pct        integer not null default 0,
  completed  boolean not null default false,
  updated_at timestamptz default now(),
  primary key (user_id, module_id)
);

-- 3. Row Level Security (RLS)
alter table public.user_profiles  enable row level security;
alter table public.module_progress enable row level security;

-- Políticas para user_profiles
create policy "select own profile"
  on public.user_profiles for select using (auth.uid() = id);

create policy "insert own profile"
  on public.user_profiles for insert with check (auth.uid() = id);

create policy "update own profile"
  on public.user_profiles for update using (auth.uid() = id);

-- Políticas para module_progress
create policy "select own progress"
  on public.module_progress for select using (auth.uid() = user_id);

create policy "insert own progress"
  on public.module_progress for insert with check (auth.uid() = user_id);

create policy "update own progress"
  on public.module_progress for update using (auth.uid() = user_id);

-- 4. Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
