create table if not exists public.store_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  customers jsonb not null default '[]'::jsonb,
  shop_info jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.store_data enable row level security;

drop policy if exists "Store owners can read their own data" on public.store_data;
create policy "Store owners can read their own data"
  on public.store_data for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Store owners can create their own data" on public.store_data;
create policy "Store owners can create their own data"
  on public.store_data for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Store owners can update their own data" on public.store_data;
create policy "Store owners can update their own data"
  on public.store_data for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.store_data to authenticated;

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
