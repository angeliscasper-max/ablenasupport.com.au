# Handoff: Ablena Support — Support Worker App

## Overview
Ablena Support ("Connecting people. Enabling independence.") is a two-sided marketplace app (like Mable) connecting disability support workers with NDIS participants/older Australians. This package covers the worker-facing app: finding shifts, getting verified, booking, messaging, shift check-in, payments, and reputation — plus a small participant-side screen.

## About the Design Files
The files in this bundle (`Kindred Support Worker App.dc.html`, `Ablena Support Prototype.dc.html`) are **design references built in HTML** — they show intended look, content, and navigation behavior. They are not production code. Recreate these designs natively for iOS and Android (Swift/SwiftUI + Kotlin/Jetpack Compose, or a cross-platform framework like React Native/Flutter if preferred) using the target codebase's existing patterns and libraries.

## Fidelity
**High-fidelity for layout, copy, and information architecture. Low-fidelity for exact pixel styling** — colors, type, spacing, and component shapes come from the "Industry" design-system tokens documented below and should be treated as the intended visual direction, not a pixel-locked spec (e.g. corner "+" registration marks and square-cornered blueprint framing are a stylistic choice, adjust weight as needed for a native mobile idiom).

## Screens
1. **Unlock (login)** — Face ID prompt, "Continue" / "Use passcode instead", link to sign-up.
2. **Shift feed** — segmented control (For you / Nearby / Saved), scrollable cards with match %, tags, rate, "View & apply".
3. **Match detail** — participant photo, bio, required skills, "you meet every requirement" verification match card, sticky footer with rate + Message/Apply.
4. **Shift check-in** — today's shift card, "Check in with Face ID" primary action, shift notes textarea, weekly shift list.
5. **Messages** — 1:1 thread with a verified badge on the participant, message input.
6. **Profile & earnings** — avatar, rating, full verification checklist (8 items — see below), weekly earnings, payout history link.
7. **Get verified** — full onboarding checklist with per-item status (Verified / In review / Upload needed / Not started).
8. **Booking & calendar** — week/month toggle, shift cards with Confirmed / Awaiting response status.
9. **Payments & invoicing** — next payout total, per-shift rate breakdown, "Download tax invoice".
10. **Ratings & reviews** — aggregate rating + rebook %, individual review cards.
11. **Participant — browse workers** — participant-side: search, worker cards with match %, rating, skills, "View profile".

All screens repeat in both iOS and Android device frames (screens 1–6) to show platform-specific status/nav bar treatment; 7–11 are shown once and mirror the same layout on both platforms.

### Verification checklist (exact copy, used on Profile and Get Verified)
NDIS Worker Screening Check, Working with Children Check (WWCC), Right to Work, Police check, First Aid and CPR, Driver's Licence, Vaccinations, Worker Orientation Modules.

## Interactions & Behavior
See `Ablena Support Prototype.dc.html` for a working clickable flow:
- Login "Continue" → Feed
- Tapping a shift card or "View & apply" → Match detail
- Match detail "Apply" → confirmation screen → "Go to Schedule" → Schedule
- Match detail "Message" → Messages
- Bottom tab bar (Feed / Schedule / Messages / Profile) is present on every logged-in screen and always navigates directly (no back-stack needed for tabs)
- Profile "Log out" → back to Login

Face ID is used at two trust moments: app unlock and shift check-in — treat both as native biometric auth (`LocalAuthentication`/`BiometricPrompt`), with passcode/PIN fallback.

## State Management
- `screen`: current route/tab (login, feed, detail, applied, schedule, messages, profile, …)
- `selectedShift` / `selectedParticipant`: which card was tapped, carried into detail view
- `verificationStatus`: per-check enum (verified / in_review / upload_needed / not_started) per worker
- `shiftNotes`: draft text per shift, submitted on check-in
- Auth/session state gating Face ID vs passcode fallback

## Design Tokens (Industry design system)
- Background: `#f2f2f3`, Text: `#1d1f20`, Accent: `#5980a6` (single accent, 100–900 OKLCH ramp)
- Headings: Barlow Condensed; Body: Barlow
- Cards/buttons/figures: square corners, hairline border, "+" corner registration marks (`.blueprint` pattern) — the primary button is the one solid accent-filled object
- Full token sheet: `_ds/styles.css` in this bundle (CSS custom properties `--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`)

## Assets
- Two `<image-slot>` placeholders (participant photo, worker avatar) — replace with real user-uploaded photos.
- Icons are inline Lucide-style SVGs at 1.5px stroke — swap for the Lucide icon library in the native build.

## Files in this bundle
- `Kindred Support Worker App.dc.html` — full static screen gallery (11 screens × iOS/Android where noted)
- `Ablena Support Prototype.dc.html` — clickable prototype demonstrating navigation
- `_ds/` — Industry design system tokens/stylesheet referenced above
- `ios-frame.jsx`, `android-frame.jsx` — device bezel references only, not part of the app itself

## Not covered yet (flag before build)
Sign-up/registration form, document upload UI, push notifications, in-app payments/Stripe Connect–style flows, dispute resolution, NDIS plan-manager integration, accessibility audit (screen reader labels, dynamic type, contrast on the accent ramp for small text).
