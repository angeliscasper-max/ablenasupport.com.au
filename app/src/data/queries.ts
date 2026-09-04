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

export async function fetchMyWorkerProfile(profileId: string): Promise<WorkerProfile | null> {
  const { data, error } = await supabase.from('worker_profiles').select('*').eq('profile_id', profileId).maybeSingle();
  if (error) throw error;
  return data as WorkerProfile | null;
}

// ── Verification ────────────────────────────────────────────────────────

export type VerificationStatus = 'verified' | 'in_review' | 'upload_needed' | 'not_started';

export type WorkerVerification = {
  id: string;
  worker_profile_id: string;
  label: string;
  status: VerificationStatus;
  created_at: string;
  updated_at: string;
};

const DEFAULT_VERIFICATION_LABELS = [
  'NDIS Worker Screening Check',
  'Working with Children Check (WWCC)',
  'Right to Work',
  'Police check',
  'First Aid and CPR',
  "Driver's Licence",
  'Vaccinations',
  'Worker Orientation Modules',
];

export async function fetchMyVerifications(workerProfileId: string): Promise<WorkerVerification[]> {
  const { data, error } = await supabase
    .from('worker_verifications')
    .select('*')
    .eq('worker_profile_id', workerProfileId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  if (data && data.length > 0) return data as WorkerVerification[];

  // First time this worker has ever opened a verification screen — every
  // account created before this table existed has no rows yet either.
  const { data: created, error: createError } = await supabase
    .from('worker_verifications')
    .insert(DEFAULT_VERIFICATION_LABELS.map((label) => ({ worker_profile_id: workerProfileId, label })))
    .select('*');
  if (createError) throw createError;
  return (created ?? []) as WorkerVerification[];
}

// ── Reviews ─────────────────────────────────────────────────────────────

export type Review = {
  id: string;
  application_id: string;
  worker_profile_id: string;
  author_profile_id: string;
  author_name: string;
  stars: number;
  text: string;
  created_at: string;
};

export async function fetchReviewsForWorker(workerProfileId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('worker_profile_id', workerProfileId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Review[];
}

export async function fetchReviewForApplication(applicationId: string): Promise<Review | null> {
  const { data, error } = await supabase.from('reviews').select('*').eq('application_id', applicationId).maybeSingle();
  if (error) throw error;
  return data as Review | null;
}

export async function submitReview(params: {
  applicationId: string;
  workerProfileId: string;
  authorProfileId: string;
  authorName: string;
  stars: number;
  text: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('reviews').insert({
    application_id: params.applicationId,
    worker_profile_id: params.workerProfileId,
    author_profile_id: params.authorProfileId,
    author_name: params.authorName,
    stars: params.stars,
    text: params.text,
  });
  if (!error) return { error: null };
  if (error.code === '23505') return { error: "You've already reviewed this booking." };
  return { error: error.message };
}

export async function updateVerificationStatus(
  id: string,
  status: VerificationStatus
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('worker_verifications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error?.message ?? null };
}

// ── Messages ────────────────────────────────────────────────────────────

export type ConversationRow = {
  id: string;
  worker_profile_id: string;
  participant_profile_id: string;
  worker_name: string;
  participant_name: string;
  last_message_body: string | null;
  last_message_at: string;
};

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export async function fetchMyConversations(profileId: string): Promise<ConversationRow[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`worker_profile_id.eq.${profileId},participant_profile_id.eq.${profileId}`)
    .order('last_message_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ConversationRow[];
}

export async function fetchConversation(conversationId: string): Promise<ConversationRow | null> {
  const { data, error } = await supabase.from('conversations').select('*').eq('id', conversationId).maybeSingle();
  if (error) throw error;
  return data as ConversationRow | null;
}

export async function findOrCreateConversation(params: {
  workerProfileId: string;
  workerName: string;
  participantProfileId: string;
  participantName: string;
}): Promise<ConversationRow> {
  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('*')
    .eq('worker_profile_id', params.workerProfileId)
    .eq('participant_profile_id', params.participantProfileId)
    .maybeSingle();
  if (findError) throw findError;
  if (existing) return existing as ConversationRow;

  const { data: created, error: createError } = await supabase
    .from('conversations')
    .insert({
      worker_profile_id: params.workerProfileId,
      participant_profile_id: params.participantProfileId,
      worker_name: params.workerName,
      participant_name: params.participantName,
    })
    .select('*')
    .single();
  if (createError) throw createError;
  return created as ConversationRow;
}

export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ChatMessage[];
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  body: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: senderId, body });
  if (error) return { error: error.message };
  await supabase
    .from('conversations')
    .update({ last_message_body: body, last_message_at: new Date().toISOString() })
    .eq('id', conversationId);
  return { error: null };
}
