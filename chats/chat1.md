# Disability support worker marketplace

_Started 2026-08-19 05:40 UTC_

---

## User

Design a mobile app for disability support workers to connect with disability participants and gain work. think of the app just like 'Mable (referred to as clients) are older Australians and people with disability who use the online platform to find, choose, and manage independent, verified local support workers for personal care, nursing, and social or community participation.' but better!!!

## Assistant



## Assistant

_[tool: ask_user]_

_[tool: ask_user]_

Waiting on your answers about focus, flows, and priorities before I start designing.

## User

Answered — primary_user: Both, worker-focused; core_flows: Browse/match with participants, Worker profile & verification (ID, police check, quals), Booking & scheduling, In-app messaging, Shift check-in/out & notes, Payments & invoicing, Ratings & reviews, J…; differentiators: Faster/smarter matching (skills, personality, availability), Trust & safety transparency (live verification status), Simpler, warmer visual tone, Better real-time communication, Fairer pay/pricing tr…; scope: 6; tone: Warm & personal; device: Both (fewer screens each); open_questions: 1. there should be the ability to u…

## Assistant

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: copy_starter_component]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

Built "Kindred" — 6 worker-facing screens (iOS: unlock/Face ID, shift feed, match detail; Android: shift check-in, messages, profile/earnings) in the Industry design system, covering all 8 flows you picked plus Face ID at login and check-in. Verification running in background.

## User

This needs to be consistent across all pages, allowing the  participants and workers to go from screen to screen.

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Added the same tab bar (Feed/Schedule/Messages/Profile) to all four main screens with correct active state per screen, so navigation reads consistently across the app.

_[tool: ready_for_verification]_

Done — consistent bottom nav now on Feed, Schedule, Messages, and Profile screens.

## User

this page also needs to have it at the bottom also make 'FEED, SCHEDULE, MESSAGES AND PROFILE' need to be in caps and bold. 03 · Match detail — iOS

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Added the nav bar to screen 03 and made all nav labels bold uppercase.

_[tool: ready_for_verification]_

Done.

## User

give this to me as just IOS and then just Android

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Split into two labeled sections — "iOS" row (screens 01–03) and "Android" row (04–06) — stacked vertically.

_[tool: ready_for_verification]_

Done.

## User

no. I want the 6 pages formatted for IOS and then format the 6 pages for Android

## Assistant

_[tool: dc_write]_

All 6 screens now appear twice — once in the iOS row, once in the Android row.

_[tool: ready_for_verification]_

Done — verification running in background.

## User

Found issues — fixing…

## User

Found issues — fixing…

## User

Verification status needs to be updated to read. NDIS Worker Screening Check, Working with Children Check (WWCC), Right to Work, Police check, First Aid and CPR, Driver’s Licence, Vaccinations and Worker Orientation Modules

## Assistant

_[tool: dc_html_str_replace]_

Updated the Verification status list to the full 8 checks on both iOS and Android profile screens.

_[tool: ready_for_verification]_

Done.

## User

company name Ablena Support
Connecting people. Enabling independence

## Assistant

_[tool: grep]_

_[tool: run_script]_

Rebranded to Ablena Support with the new tagline across all screens.

_[tool: ready_for_verification]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Fixed the status bar overlap on the iOS nav bars.

## User

company domain name ablenasupport.com.au , ABN 72 847 553 487

## Assistant

_[tool: dc_html_str_replace]_

Added the domain and ABN under the design brief header.

_[tool: ready_for_verification]_

Done.

## User

what do I do now to finish the creation of this app and then launch it?

## Assistant

This deliverable is a visual design mockup (6 screens × iOS/Android), not a working app — it can't be "launched" as-is. To go from here to a real, live app:

1. **Design**: expand to remaining flows (onboarding/signup, booking calendar, payments/invoicing detail, ratings/reviews, the participant-side app) and get user testing/feedback on this mockup first.
2. **Prototype interactivity**: if you want a clickable prototype to test flows before dev, I can wire these screens together with real navigation/taps — say the word.
3. **Engineering build**: hand this off to developers (or connect a GitHub repo here) to build native/cross-platform (iOS+Android), backend (auth, matching, payments, messaging, Face ID/biometric integration, verification checks with real providers), and comply with NDIS/privacy requirements.
4. **Legal/compliance**: NDIS registration requirements, privacy policy, worker screening data handling, payment/Stripe-type integration for invoicing.
5. **App Store/Play Store submission**: once built, submit for review under Ablena Support branding with your ABN/domain.

Want me to: (a) add the missing screens, (b) make this clickable as a prototype, or (c) prep a developer handoff package?

## User

action all three ';: (a) add the missing screens, (b) make this clickable as a prototype, or (c) prep a developer handoff package?'

## Assistant

_[tool: read_skill_prompt]_

_[tool: read_file]_

_[tool: dc_write]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now the developer handoff package.

_[tool: write_file]_

_[tool: copy_files]_

_[tool: ready_for_verification]_

_[tool: present_fs_item_for_download]_

All three done: (a) added 5 new screens (verification checklist, booking/calendar, payments/invoicing, ratings/reviews, participant browse) to the gallery; (b) built a clickable prototype — `Ablena Support Prototype.dc.html` — with real tap navigation through login→feed→detail→apply→schedule→messages→profile; (c) developer handoff package above, ready to download.

