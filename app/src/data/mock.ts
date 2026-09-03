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
