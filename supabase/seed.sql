-- Sample data — the same 3 shifts/participants the design mockups show.
-- Run once after schema.sql. Safe to re-run (upserts on fixed ids).

insert into public.participants (id, name, age, suburb, bio, needs) values
  ('11111111-1111-1111-1111-111111111111', 'Priya', 34, 'Fairfield',
   'Priya has cerebral palsy and lives with her sister. She loves gardening podcasts and needs a steady, cheerful hand in the mornings.',
   array['Personal care', 'Manual handling', 'Meal prep']),
  ('22222222-2222-2222-2222-222222222222', 'Tom', 22, 'Marrickville',
   'Tom is training for a swim carnival and loves company at the pool. He''s chatty, independent, and just needs a spotter and some encouragement.',
   array['Physical support', 'Community access']),
  ('33333333-3333-3333-3333-333333333333', 'Grace', 16, 'Fairfield',
   'Grace is settling into a new routine this term. She likes a calm bedtime and needs help getting organised for school in the morning.',
   array['Overnight', 'Routine care'])
on conflict (id) do update set
  name = excluded.name, age = excluded.age, suburb = excluded.suburb,
  bio = excluded.bio, needs = excluded.needs;

insert into public.shifts
  (id, participant_id, category, distance_km, match_score, title, description, tags, day_label, time_label, rate) values
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
   'Personal care', 2.4, 94, 'Morning routine with Priya',
   'Hoist transfer, shower support and breakfast. Priya likes a chatty start to the day.',
   array['Manual handling', 'Non-verbal comms'], 'Tue', '7:00–9:00am', '$58.20/hr'),
  ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
   'Community access', 5.1, 88, 'Gym session with Tom',
   'Spotting and encouragement at the local pool — Tom''s training for a swim carnival.',
   array['Physical support'], 'Wed', '4:00–5:30pm', '$52.60/hr'),
  ('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333',
   'Overnight', 6.8, 91, 'Overnight stay with Grace',
   'Sleepover shift — settle Grace at 9pm, on call, help her get ready for school.',
   array['Overnight', 'Routine care'], 'Fri', '9:00pm–7:00am', '$41.10/hr')
on conflict (id) do update set
  category = excluded.category, distance_km = excluded.distance_km, match_score = excluded.match_score,
  title = excluded.title, description = excluded.description, tags = excluded.tags,
  day_label = excluded.day_label, time_label = excluded.time_label, rate = excluded.rate;

insert into public.worker_profiles (id, name, category, availability, bio, skills, rating, review_count) values
  ('b1111111-1111-1111-1111-111111111111', 'Amara N.', 'Personal care', 'Available Tue',
   'Verified support worker with a steady, warm approach to morning routines.',
   array['Manual handling', 'Non-verbal comms'], 4.98, 132),
  ('b2222222-2222-2222-2222-222222222222', 'Josh R.', 'Community access', 'Available Wed',
   'Energetic and reliable — great for gym sessions and getting out into the community.',
   array['Physical support', 'Driving'], 4.9, 61)
on conflict (id) do update set
  name = excluded.name, category = excluded.category, availability = excluded.availability,
  bio = excluded.bio, skills = excluded.skills, rating = excluded.rating, review_count = excluded.review_count;

insert into public.worker_verifications (worker_profile_id, label, status)
select w.id, label, 'verified'
from public.worker_profiles w
cross join (values
  ('NDIS Worker Screening Check'),
  ('Working with Children Check (WWCC)'),
  ('Right to Work'),
  ('Police check'),
  ('First Aid and CPR'),
  ('Driver''s Licence'),
  ('Vaccinations'),
  ('Worker Orientation Modules')
) as checks(label)
where w.id in ('b1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222')
on conflict (worker_profile_id, label) do update set status = excluded.status;
