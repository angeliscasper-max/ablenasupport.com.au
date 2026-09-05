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
