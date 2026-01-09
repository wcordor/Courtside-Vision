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
  - *Completed: Built a context-aware filtering engine that standardizes disparate date formats (ISO-8601 vs. HTML5) into unified queryable state.*
- [ ] **On-Demand Data Retrieval:** Implementing Server Actions to fetch historical data dynamically as users navigate the calendar.
- [ ] **Matchup Trend & Comparison Engine:** Comprehensive analysis tool that aggregates rolling 5-game performance metrics and head-to-head opponent stats. This engine utilizes multiple asynchronous data streams to provide a "Matchup Strength" indicator.
- [ ] **Mobile-First Design:** Fully responsive UI refactor using Tailwind CSS.

## Hybrid Data Resilience

To ensure the application remains functional despite the 5 req/min API limit, I implemented a Conditional Fetching Strategy. The app attempts to authenticate via environment variables; if it detects a failure (401 or 429), it seamlessly transitions to a local JSON dataset. This prevents the UI from crashing and allows for uninterrupted development and demonstration.

- **Data Integrity:** Implemented UTC-aware time formatting to ensure game schedules remain accurate across various client locales.
- **UI Hierarchy:** Re-aligned the dashboard according to original blueprint, moving live match-ups to the top and utilizing semantic HTML for improved structure.

### Technical Challenges

**Date Normalization Bridge:** One of the primary challenges was reconciling the data formats between the BALLDONTLIE API and the HTML5 browser environment. The API returns full ISO-8601 timestamps, while the native browser calendar returns a simplified `YYYY-MM-DD` string. To bridge this gap, I architected a normalization layer within the client-side filter that slices incoming API data to match the 10-character ISO standard, ensuring 100% filter accuracy regardless of the user's local timezone or the API's time precision.

**Performance & Scalability (ISR):** To ensure the dashboard remains highly performant while serving live sports data, I integrated Incremental Static Regeneration (ISR). By setting a 60-second revalidation window, the application serves optimized static pages to users while background-fetching fresh scores, effectively balancing data real-time accuracy with server efficiency.
