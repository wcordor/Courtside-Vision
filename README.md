# 🏀 Courtside Vision

## What is it?

Courtside Vision is an NBA analytics dashboard designed to help users compare team match-ups and player performance using the BALLDONTLIE API. It leverages TypeScript for robust data handling and features a custom fallback system to ensure a seamless user experience even when hitting external API rate limits.

## Tech Stack

- Next.js
- TypeScript
- Tailwind
- @balldontlie/sdk

## Roadmap & Progress

- [x] **Core Infrastructure:** Next.js setup with TypeScript and SDK integration.
- [x] **Data Resilience:** Hybrid Mock/Live data system to bypass 429 Rate Limits.
- [x] **Polymorphic Data Handling:** Engineered a normalization layer for Single (Object) vs. Multiple (Array) game responses.
- [x] **Dynamic Matchboard:** Engineered context-aware components that dynamically render scores, clocks, and statuses based on real-time game states.
- [ ] **Advanced Filtering:** Team-specific and date-range querying for the dashboard.
- [ ] **Matchup Trend & Comparison Engine:** Comprehensive analysis tool that aggregates rolling 5-game performance metrics and head-to-head opponent stats. This engine utilizes multiple asynchronous data streams to provide a "Matchup Strength" indicator.
- [ ] **Mobile-First Design:** Fully responsive UI refactor using Tailwind CSS.

## Hybrid Data Resilience

To ensure the application remains functional despite the 5 req/min API limit, I implemented a Conditional Fetching Strategy. The app attempts to authenticate via environment variables; if it detects a failure (401 or 429), it seamlessly transitions to a local JSON dataset. This prevents the UI from crashing and allows for uninterrupted development and demonstration.

- **Data Integrity:** Implemented UTC-aware time formatting to ensure game schedules remain accurate across various client locales.
- **UI Hierarchy:** Re-aligned the dashboard according to original blueprint, moving live match-ups to the top and utilizing semantic HTML for improved structure.
