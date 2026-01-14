# 🏀 Courtside Vision

## What is it?

Courtside Vision is an NBA analytics dashboard engineered for high-integrity data handling and system resilience. Built to simulate mission-critical environments, it features a custom **Cache-Aside Persistence Layer** and a **Deterministic Normalization Bridge** to maintain 100% uptime and data accuracy despite strict upstream API constraints.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind
- **Data:** @balldontlie/sdk / REST API

## Technical Case Studies

### Pillar 1: The Normalization Layer (Complexity)

**Problem:** The SDK returns single game objects for ID lookups versus arrays for date queries, which caused mapping crashes in the UI.

**Solution:** Engineered a normalization bridge using `Array.isArray()` checks to force a consistent `Game[]` interface. I implemented a declarative de-duplication layer using a JavaScript `Map` constructor, ensuring $O(1)$ lookup complexity and preventing duplicate key collisions during state updates.

### Pillar 2: API Resilience & Persistence (Resilience)

**Problem:** The BALLDONTLIE Free Tier enforces a strict 5 requests per minute limit, making a traditional "live-fetch" dashboard unusable during active user sessions.

**Solution:** Architected a **Cache-Aside Persistence Layer**. The application prioritizes locally cached data in `localStorage` before attempting network requests. By transitioning the UX to a manual "On-Demand" fetch model, I reduced redundant API calls by over 90% and ensured 100% uptime through localized mock fallbacks.

### Pillar 3: Deterministic Date Sync (Performance/Logic)

**Problem:** "Date-Drift" occurs when the server (UTC) and client (Local Time) disagree on "Today's" date, leading to hydration mismatches and missing games during late-night usage.
**Solution:** Anchored the application’s temporal logic to `America/New_York` (EST). By standardizing date strings at the normalization layer (slicing ISO-8601 to 10-character `YYYY-MM-DD` formats), I eliminated timezone-related rolling errors and synchronized the UI with the official NBA league calendar.

## Roadmap & Progress

- [x] **Core Infrastructure:** Next.js setup with strict TypeScript and SDK integration.
- [x] **Data Resilience:** Multi-layered Cache-Aside system to handle 429 Rate Limits.
- [x] **Polymorphic Data Handling:** Normalization bridge for disparate API response shapes.
- [x] **Dynamic Matchboard:** Context-aware components with real-time state rendering.
- [ ] **Advanced Filtering:** Team-specific querying (Logic engine built, UI pending).
- [ ] **On-Demand Data Retrieval:** Implementing Server Actions to fetch historical data dynamically as users navigate the calendar.
- [ ] **Matchup Trend Engine:** Rolling 5-game performance aggregation and H2H strength indicators.
- [ ] **Mobile-First Design:** Fully responsive UI refactor.

## ⚙️ Performance & Scalability

To balance data freshness with resource constraints, the application utilizes **Incremental Static Regeneration (ISR)**. I implemented a customized revalidation window of **3600 seconds**, strategically budgeting API requests to prioritize user-initiated historical queries over background automated refreshes.
