import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true
  }
});

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({ provider: 'google' });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export function onAuthStateChange(cb) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => cb(event, session?.user || null));
  return data?.subscription;
}

export async function listHouseholds(ownerUid) {
  // Note: this expects a `households` table with an `owner` text column
  return supabase.from('households').select('*').eq('owner', ownerUid);
}

export async function createHousehold(name, ownerUid, state) {
  return supabase.from('households').insert([{ name, owner: ownerUid, state }]).select().single();
}

export async function loadHouseholdState(householdId) {
  return supabase.from('households').select('state').eq('id', householdId).single();
}

export async function saveHouseholdState(householdId, state) {
  return supabase.from('households').update({ state }).eq('id', householdId);
}

export async function createInvitation(householdId, email, invitedBy) {
  return supabase.from('household_invitations').insert([{ household_id: householdId, email, invited_by: invitedBy }]).select().single();
}

export function subscribeToHousehold(householdId, onChange) {
  if (!householdId) return null;
  const channel = supabase.channel('public:households')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'households', filter: `id=eq.${householdId}` }, (payload) => {
      try { onChange && onChange(payload); } catch (e) { console.error(e); }
    })
    .subscribe();
  return channel;
}
