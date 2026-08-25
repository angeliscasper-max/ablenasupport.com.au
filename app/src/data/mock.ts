export type VerificationStatus = 'verified' | 'in_review' | 'upload_needed' | 'not_started';

export type VerificationItem = { label: string; status: VerificationStatus };

// The 8 checks the user specified, in order, all verified — shown on the
// worker's own Profile screen.
export const verificationChecklist: VerificationItem[] = [
  { label: 'NDIS Worker Screening Check', status: 'verified' },
  { label: 'Working with Children Check (WWCC)', status: 'verified' },
  { label: 'Right to Work', status: 'verified' },
  { label: 'Police check', status: 'verified' },
  { label: 'First Aid and CPR', status: 'verified' },
  { label: "Driver's Licence", status: 'verified' },
  { label: 'Vaccinations', status: 'verified' },
  { label: 'Worker Orientation Modules', status: 'verified' },
];

// The in-progress version shown on the "Get verified" onboarding screen.
export const onboardingChecklist: VerificationItem[] = [
  { label: 'Photo ID', status: 'verified' },
  { label: 'NDIS Worker Screening Check', status: 'verified' },
  { label: 'Working with Children Check', status: 'in_review' },
  { label: 'Police check', status: 'upload_needed' },
  { label: 'First Aid and CPR', status: 'upload_needed' },
  { label: "Driver's Licence", status: 'upload_needed' },
  { label: 'Vaccinations', status: 'upload_needed' },
  { label: 'Worker Orientation Modules', status: 'not_started' },
];

export const todayShift = {
  timeLabel: '7:00 – 9:00AM',
  title: 'Morning routine with Priya',
  address: '14 Grove St, Fairfield',
};

export type WeekEntry = { label: string; status: 'Completed' | 'Upcoming' };
export const thisWeek: WeekEntry[] = [
  { label: 'Mon · Tom B.', status: 'Completed' },
  { label: 'Sat · Grace L.', status: 'Upcoming' },
];

export type Message = { id: string; fromMe: boolean; text: string };
export type Conversation = { id: string; participantId: string; name: string; verified: boolean; messages: Message[] };

export const conversations: Conversation[] = [
  {
    id: 'conv-priya',
    participantId: 'priya',
    name: 'Priya M.',
    verified: true,
    messages: [
      { id: 'm1', fromMe: false, text: 'Hi! Looking forward to Tuesday morning.' },
      { id: 'm2', fromMe: true, text: "Me too — I'll bring the podcast list you mentioned." },
      { id: 'm3', fromMe: false, text: 'Perfect. My sister will be home too if you need anything.' },
    ],
  },
  {
    id: 'conv-tom',
    participantId: 'tom',
    name: 'Tom B.',
    verified: true,
    messages: [
      { id: 'm1', fromMe: false, text: 'Hey! Still on for the pool Wednesday?' },
      { id: 'm2', fromMe: true, text: "Yep, see you at 4! I'll bring a spare towel just in case." },
    ],
  },
  {
    id: 'conv-grace',
    participantId: 'grace',
    name: "Grace's family",
    verified: true,
    messages: [
      { id: 'm1', fromMe: false, text: 'Thanks for confirming Friday night — Grace is excited.' },
      { id: 'm2', fromMe: true, text: "No worries at all, we'll have a great night." },
    ],
  },
];

export type PayoutShift = { id: string; label: string; amount: string };
export const thisWeekPayouts: PayoutShift[] = [
  { id: 'p1', label: 'Mon · Tom B. · 1.5hr', amount: '$78.90' },
  { id: 'p2', label: 'Tue · Priya M. · 2hr', amount: '$116.40' },
  { id: 'p3', label: 'Fri · Grace L. · 10hr', amount: '$411.00' },
];
export const nextPayout = { amount: '$612.00', dayLabel: 'Fri' };

export type Review = { id: string; author: string; stars: number; text: string };
export const reviews: Review[] = [
  { id: 'r1', author: 'Priya M.', stars: 5, text: "Amara is punctual, gentle and remembers small things — like which podcast I'm up to." },
  { id: 'r2', author: 'Tom B.', stars: 5, text: 'Great energy at the gym, always on time, communicates clearly beforehand.' },
];
export const ratingSummary = { average: 4.98, count: 132, wouldRebookPct: 98 };

export const worker = {
  name: 'Amara N.',
  rating: 4.98,
  reviewCount: 132,
  weekEarnings: '$612',
  weekHours: 48,
  weekShifts: 6,
};

export type BrowseWorker = {
  id: string;
  name: string;
  category: string;
  availability: string;
  match: number;
  rating: number;
  reviewCount: number;
  skills: string;
};

export const browseWorkers: BrowseWorker[] = [
  { id: 'w1', name: 'Amara N.', category: 'Personal care', availability: 'Available Tue', match: 96, rating: 4.98, reviewCount: 132, skills: 'Manual handling, non-verbal comms' },
  { id: 'w2', name: 'Josh R.', category: 'Community access', availability: 'Available Wed', match: 90, rating: 4.9, reviewCount: 61, skills: 'Physical support, driving' },
];
