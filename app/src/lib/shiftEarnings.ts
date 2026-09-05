import type { Booking } from '../data/queries';

// shifts.rate and shifts.time_label are free text (the create-shift form
// enforces no format), so parsing can and does fail — callers must treat
// null as "unknown", never coerce it to 0.
export function parseHourlyRate(rate: string): number | null {
  const match = rate.match(/\$([\d,]+(?:\.\d+)?)\s*\/\s*hr/i);
  if (!match) return null;
  const value = parseFloat(match[1].replace(/,/g, ''));
  return Number.isFinite(value) ? value : null;
}

function parseClockTime(raw: string, inferredMeridiem?: 'am' | 'pm'): number | null {
  const match = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = (match[3]?.toLowerCase() as 'am' | 'pm' | undefined) ?? inferredMeridiem;
  if (!meridiem || hour < 1 || hour > 12 || minute > 59) return null;
  if (meridiem === 'am') hour = hour === 12 ? 0 : hour;
  else hour = hour === 12 ? 12 : hour + 12;
  return hour + minute / 60;
}

export function parseShiftHours(timeLabel: string): number | null {
  const parts = timeLabel.split(/[–-]/);
  if (parts.length !== 2) return null;
  const [startRaw, endRaw] = parts;
  const endMeridiemMatch = endRaw.match(/(am|pm)/i);
  const endMeridiem = endMeridiemMatch?.[0].toLowerCase() as 'am' | 'pm' | undefined;
  const start = parseClockTime(startRaw, endMeridiem);
  const end = parseClockTime(endRaw);
  if (start == null || end == null) return null;
  const diff = end - start;
  return diff > 0 ? diff : diff + 24; // overnight shift wraps past midnight
}

export type EarningsSummary = { totalAmount: number; totalHours: number; shiftCount: number };

export function summarizeConfirmedBookings(bookings: Booking[]): EarningsSummary {
  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  let totalAmount = 0;
  let totalHours = 0;
  for (const b of confirmed) {
    const rate = parseHourlyRate(b.shift.rate);
    const hours = parseShiftHours(b.shift.time_label);
    if (rate != null && hours != null) totalAmount += rate * hours;
    if (hours != null) totalHours += hours;
  }
  return { totalAmount, totalHours, shiftCount: confirmed.length };
}
