import { supabase } from '../lib/supabase';

export type Participant = {
  id: string;
  name: string;
  age: number;
  suburb: string;
  bio: string;
  needs: string[];
};

export type Shift = {
  id: string;
  participant_id: string;
  category: string;
  distance_km: number;
  match_score: number;
  title: string;
  description: string;
  tags: string[];
  day_label: string;
  time_label: string;
  rate: string;
  status: 'open' | 'filled';
  participant: Participant;
};

export type Booking = {
  id: string;
  status: 'applied' | 'confirmed';
  created_at: string;
  shift: Shift;
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
