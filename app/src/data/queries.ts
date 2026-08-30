import { supabase } from '../lib/supabase';

export type Participant = {
  id: string;
  profile_id: string | null;
  name: string;
  age: number | null;
  suburb: string;
  bio: string;
  needs: string[];
};

export type Shift = {
  id: string;
  participant_id: string;
  category: string;
  distance_km: number | null;
  match_score: number | null;
  title: string;
  description: string;
  tags: string[];
  day_label: string;
  time_label: string;
  rate: string;
  status: 'open' | 'filled';
  created_at: string;
  participant: Participant;
};

export type Booking = {
  id: string;
  status: 'applied' | 'confirmed';
  created_at: string;
  shift: Shift;
};

export type WorkerProfile = {
  id: string;
  profile_id: string | null;
  name: string;
  category: string;
  availability: string;
  bio: string;
  skills: string[];
  rating: number;
  review_count: number;
};

export type Applicant = {
  id: string;
  status: 'applied' | 'confirmed';
  created_at: string;
  worker: { id: string; full_name: string };
};

const SHIFT_SELECT = '*, participant:participants(*)';

export async function fetchShifts(): Promise<Shift[]> {
  const { data, error } = await supabase
    .from('shifts')
    .select(SHIFT_SELECT)
    .eq('status', 'open')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Shift[];
}

export async function fetchShift(shiftId: string): Promise<Shift | null> {
  const { data, error } = await supabase
    .from('shifts')
    .select(SHIFT_SELECT)
    .eq('id', shiftId)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Shift | null;
}

export async function applyToShift(shiftId: string, workerId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('applications').insert({ shift_id: shiftId, worker_id: workerId });
  if (!error) return { error: null };
  // Postgres unique_violation
  if (error.code === '23505') return { error: "You've already applied to this shift." };
  return { error: error.message };
}

export async function fetchMyBookings(workerId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('applications')
    .select(`id, status, created_at, shift:shifts(${SHIFT_SELECT})`)
    .eq('worker_id', workerId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Booking[];
}

// ── Participant side ────────────────────────────────────────────────────

export async function fetchMyParticipant(profileId: string): Promise<Participant | null> {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('profile_id', profileId)
    .maybeSingle();
  if (error) throw error;
  return data as Participant | null;
}

export async function fetchMyPostedShifts(participantId: string): Promise<Shift[]> {
  const { data, error } = await supabase
    .from('shifts')
    .select(SHIFT_SELECT)
    .eq('participant_id', participantId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Shift[];
}

export type NewShift = {
  category: string;
  title: string;
  description: string;
  tags: string[];
  day_label: string;
  time_label: string;
  rate: string;
};

export async function createShift(participantId: string, shift: NewShift): Promise<{ error: string | null }> {
  const { error } = await supabase.from('shifts').insert({ participant_id: participantId, ...shift });
  return { error: error?.message ?? null };
}

export async function fetchApplicantsForShift(shiftId: string): Promise<Applicant[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('id, status, created_at, worker:profiles(id, full_name)')
    .eq('shift_id', shiftId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Applicant[];
}

export async function confirmApplicant(applicationId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('applications').update({ status: 'confirmed' }).eq('id', applicationId);
  return { error: error?.message ?? null };
}

export async function fetchWorkers(): Promise<WorkerProfile[]> {
  const { data, error } = await supabase.from('worker_profiles').select('*').order('rating', { ascending: false });
  if (error) throw error;
  return (data ?? []) as WorkerProfile[];
}

export async function fetchWorker(workerId: string): Promise<WorkerProfile | null> {
  const { data, error } = await supabase.from('worker_profiles').select('*').eq('id', workerId).maybeSingle();
  if (error) throw error;
  return data as WorkerProfile | null;
}
