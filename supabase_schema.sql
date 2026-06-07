-- Supabase schema for Pantry app
-- Run this in the Supabase SQL editor or via psql against your Supabase Postgres.

-- Enable the pgcrypto extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- Households table: stores shared pantry/recipes/orders/settings state as JSONB
create table if not exists households (
  id uuid default gen_random_uuid() primary key,
  name text,
  owner uuid references auth.users(id) on delete set null,
  state jsonb,
  created_at timestamptz default now()
);

-- Members: link users to households with role & status
create table if not exists household_members (
  id uuid default gen_random_uuid() primary key,
  household_id uuid references households(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'member', -- member | admin | owner
  status text default 'active', -- active | invited | removed
  invited_by uuid references auth.users(id),
  created_at timestamptz default now(),
  unique (household_id, user_id)
);

-- Row-level-security: restrict access to households and members
alter table households enable row level security;

-- Allow owners or household members to select households
create policy "households_select_for_members" on households
  for select using (
    auth.uid() is not null and (
      owner = auth.uid() or exists (
        select 1 from household_members hm where hm.household_id = households.id and hm.user_id = auth.uid() and hm.status = 'active'
      )
    )
  );

-- Allow owners to insert households (owner field must match auth.uid())
create policy "households_insert_owner" on households
  for insert with check (auth.uid() is not null and owner = auth.uid());

-- Allow owners or active members to update household state
create policy "households_update_members" on households
  for update using (
    auth.uid() is not null and (
      owner = auth.uid() or exists (
        select 1 from household_members hm where hm.household_id = households.id and hm.user_id = auth.uid() and hm.status = 'active'
      )
    )
  ) with check (
    auth.uid() is not null and (
      owner = auth.uid() or exists (
        select 1 from household_members hm where hm.household_id = households.id and hm.user_id = auth.uid() and hm.status = 'active'
      )
    )
  );

-- Household members table: enable RLS
alter table household_members enable row level security;

-- Allow users to view their own membership rows
create policy "household_members_select_self_or_household" on household_members
  for select using (
    auth.uid() is not null and (
      user_id = auth.uid() or exists (
        select 1 from household_members hm2 where hm2.household_id = household_members.household_id and hm2.user_id = auth.uid() and hm2.status = 'active'
      )
    )
  );

-- Allow household owners or invited users to insert membership rows
create policy "household_members_insert" on household_members
  for insert with check (
    auth.uid() is not null and (
      -- allow if auth is the inviter or auth is the household owner
      invited_by = auth.uid() or exists (select 1 from households h where h.id = household_members.household_id and h.owner = auth.uid())
    )
  );

-- Allow users to update their own membership (for example to accept invite)
create policy "household_members_update_self" on household_members
  for update using (auth.uid() is not null and user_id = auth.uid()) with check (auth.uid() is not null and user_id = auth.uid());

-- Indexes for performance
create index if not exists idx_households_owner on households(owner);
create index if not exists idx_household_members_household on household_members(household_id);
create index if not exists idx_household_members_user on household_members(user_id);

-- Example: grant usage to anon public (Supabase edge runtime needs this for client access)
-- Note: Supabase projects often use RLS+policies; ensure the anon key has only necessary rights.
-- RECOMMENDATION: Review policies after applying and customize for your needs.


-- End of schema

-- Invitations: track pending invites by email
create table if not exists household_invitations (
  id uuid default gen_random_uuid() primary key,
  household_id uuid references households(id) on delete cascade,
  email text not null,
  token text,
  invited_by uuid references auth.users(id),
  status text default 'pending', -- pending|accepted|revoked
  created_at timestamptz default now()
);

alter table household_invitations enable row level security;
create policy "invitations_select_household_members" on household_invitations
  for select using (
    auth.uid() is not null and exists (
      select 1 from household_members hm where hm.household_id = household_invitations.household_id and hm.user_id = auth.uid() and hm.status = 'active'
    )
  );

create policy "invitations_insert_by_owner_or_member" on household_invitations
  for insert with check (
    auth.uid() is not null and exists (
      select 1 from household_members hm where hm.household_id = household_invitations.household_id and hm.user_id = auth.uid() and hm.status = 'active'
    )
  );

create index if not exists idx_invites_email on household_invitations(email);

