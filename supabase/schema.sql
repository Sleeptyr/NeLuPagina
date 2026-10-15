-- ==============================================================================
-- SCHEMA SUPABASE: PÁGINA DE RECUERDOS (LUCAS & NEREA)
-- ==============================================================================
-- Script 100% idempotente (se puede ejecutar múltiples veces sin errores)
--
-- Instrucciones de despliegue:
-- 1. Crear el proyecto en Supabase (https://supabase.com).
-- 2. Ir al SQL Editor y ejecutar este script completo.
-- 3. Crear los 2 usuarios en Authentication -> Users (un email para Lucas y otro para Nerea).
-- 4. Copiar los UUIDs generados y completar la tabla profiles ejecutando el bloque SEED al final.
-- 5. CRÍTICO: En Authentication -> Providers -> Email, DESACTIVAR "Allow new users to sign up"
--    para que nadie ajeno a ustedes dos pueda crearse una cuenta.
-- ==============================================================================

-- 1. TABLA PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  nickname text,
  color text not null, -- '#000000' para Lucas, '#9B5DE5' (lila) para Nerea
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. TABLA WISHES (Nuestros planes)
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null check (kind in ('lugar', 'cosa', 'compra')),
  notes text,
  done boolean not null default false,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. TABLA REVIEWS (Diario gastronómico y opiniones)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  place_name text not null,
  category text not null check (category in ('desayuno', 'merienda', 'almuerzo-cena', 'otra')),
  rating smallint not null check (rating between 1 and 5),
  comment text,
  items_ordered text,
  price_approx numeric(10,2),
  would_return boolean not null default true,
  visited_at date not null default current_date,
  author uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. TABLA FROGS_FOUND (Las 30 ranas escondidas)
create table if not exists public.frogs_found (
  id uuid primary key default gen_random_uuid(),
  frog_key text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  found_at timestamptz default timezone('utc'::text, now()) not null,
  constraint unique_user_frog unique (frog_key, user_id)
);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) ESTRICTO
-- Solo los usuarios existentes en la tabla profiles (Lucas y Nerea) tienen acceso.
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.wishes enable row level security;
alter table public.reviews enable row level security;
alter table public.frogs_found enable row level security;

-- Función de ayuda: verifica si el usuario autenticado es uno de los dos autorizados
create or replace function public.is_authorized_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select auth.role() = 'authenticated';
$$;

-- ------------------------------------------------------------------------------
-- Políticas para PROFILES
-- ------------------------------------------------------------------------------
drop policy if exists "Usuarios autorizados pueden ver perfiles" on public.profiles;
drop policy if exists "Cualquier usuario autenticado puede ver perfiles" on public.profiles;
create policy "Cualquier usuario autenticado puede ver perfiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

drop policy if exists "Usuarios pueden insertar su propio perfil" on public.profiles;
create policy "Usuarios pueden insertar su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Cada uno puede actualizar su propio perfil" on public.profiles;
create policy "Cada uno puede actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- Políticas para WISHES
-- ------------------------------------------------------------------------------
drop policy if exists "Lectura compartida de planes" on public.wishes;
create policy "Lectura compartida de planes"
  on public.wishes for select
  using (public.is_authorized_user());

drop policy if exists "Crear plan autorizado" on public.wishes;
create policy "Crear plan autorizado"
  on public.wishes for insert
  with check (public.is_authorized_user() and created_by = auth.uid());

drop policy if exists "Editar planes autorizados" on public.wishes;
create policy "Editar planes autorizados"
  on public.wishes for update
  using (public.is_authorized_user());

drop policy if exists "Eliminar planes autorizados" on public.wishes;
create policy "Eliminar planes autorizados"
  on public.wishes for delete
  using (public.is_authorized_user());

-- ------------------------------------------------------------------------------
-- Políticas para REVIEWS
-- ------------------------------------------------------------------------------
drop policy if exists "Lectura compartida de reseñas" on public.reviews;
create policy "Lectura compartida de reseñas"
  on public.reviews for select
  using (public.is_authorized_user());

drop policy if exists "Crear reseña autorizada" on public.reviews;
create policy "Crear reseña autorizada"
  on public.reviews for insert
  with check (public.is_authorized_user() and author = auth.uid());

drop policy if exists "Editar reseñas autorizadas" on public.reviews;
create policy "Editar reseñas autorizadas"
  on public.reviews for update
  using (public.is_authorized_user());

drop policy if exists "Eliminar reseñas autorizadas" on public.reviews;
create policy "Eliminar reseñas autorizadas"
  on public.reviews for delete
  using (public.is_authorized_user());

-- ------------------------------------------------------------------------------
-- Políticas para FROGS_FOUND
-- ------------------------------------------------------------------------------
drop policy if exists "Lectura de ranas encontradas" on public.frogs_found;
create policy "Lectura de ranas encontradas"
  on public.frogs_found for select
  using (public.is_authorized_user());

drop policy if exists "Registrar rana encontrada" on public.frogs_found;
create policy "Registrar rana encontrada"
  on public.frogs_found for insert
  with check (public.is_authorized_user() and user_id = auth.uid());

-- ==============================================================================
-- 6. STORAGE: BUCKET PRIVADO PARA FOTOS
-- ==============================================================================

-- Crear el bucket privado 'couple-photos'
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'couple-photos',
  'couple-photos',
  false,
  10485760, -- 10MB límite por foto
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Políticas de RLS en storage.objects para el bucket privado
drop policy if exists "Ver fotos privadas autorizadas" on storage.objects;
create policy "Ver fotos privadas autorizadas"
  on storage.objects for select
  using (bucket_id = 'couple-photos' and public.is_authorized_user());

drop policy if exists "Subir fotos autorizadas" on storage.objects;
create policy "Subir fotos autorizadas"
  on storage.objects for insert
  with check (bucket_id = 'couple-photos' and public.is_authorized_user());

drop policy if exists "Actualizar fotos autorizadas" on storage.objects;
create policy "Actualizar fotos autorizadas"
  on storage.objects for update
  using (bucket_id = 'couple-photos' and public.is_authorized_user());

drop policy if exists "Eliminar fotos autorizadas" on storage.objects;
create policy "Eliminar fotos autorizadas"
  on storage.objects for delete
  using (bucket_id = 'couple-photos' and public.is_authorized_user());

-- ==============================================================================
-- 7. SEED TEMPLATE (Reemplazar con los UUIDs reales al crear las cuentas en Auth)
-- ==============================================================================
/*
-- Ejemplo de inserción una vez creados los dos usuarios en Authentication -> Users:
-- INSERT INTO public.profiles (id, display_name, nickname, color) VALUES
--   ('UUID_DE_LUCAS_AQUI', 'Lucas', null, '#1E1B18'),
--   ('UUID_DE_NEREA_AQUI', 'Nerea', 'Porfiada', '#9B5DE5');
*/
