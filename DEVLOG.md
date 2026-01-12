# Development Log

## 20 Dec 2025: API & Authorization Issues

### API Chain of Errors

- **404 (Not Found):** Initially called a non-existent endpoint. Fixed by auditing SDK documentation and ensuring request path matched V2 API specifications.  
- **401 (Unauthorized):** Received HTML pages instead of JSON when calling endpoint. Updated code by adding conditions to stop JSON from crashing. Error 429 unmasked as real error.
- **429 (Too Many Requests):** BALLDONTLIE API Free Tier subscription allowed for 5 requests per minute. Next.js was making multiple requests per call, essentially using up request limit. Implemented mock data as fallback for failed call.

#### Debugging Milestone: Unmasking the 429

- **Symptom:** `Unexpected token '<', "<!doctype "... is not valid JSON`
- **Discovery:** App was trying to parse HTML error page ("Too Many Requests" message) as JSON.
- **Diagnostic Strategy:** Implemented condition into code where HTML error page is displayed before body is parsed. Unmasked 429 Rate Limit, which confirmed 401 was resolved and API key was functional.

## 21 Dec 2025: Version Control & Cleanup

- **Conflict:** Checked "Add a README" and "Add a .gitignore" when first created repository on GitHub. Push command was rejected since Git has initial commit that doesn't exist of project PC.
- **Strategy:**

    1. Used `git pull origin main --allow-unrelated-histories` to bridge local repo with initial repo on GitHub

    2. Ran `git checkout --ours .gitignore` and `git checkout --ours README.md`, so that Git keeps developer version of files.
        - Using `git add .gitignore README.md` resolved issue finally.

## 23 Dec 2025: 429 Unmasked, Again

### Another Breakthrough

While previous logs identified the 429 (Too Many Requests) as the primary bottleneck, further investigation revealed that the rate-limiting was a symptom of a deeper environment variable issue.

### Anonymous Limit Case

- **Loop:** Noticed that even when making a single manual request, a 429 or 401 would still trigger.
- **Server-Side Diagnostics:** Added `console.log` checks to the server-side fetch logic. Discovered that `process.env.BALLDONTLIE_API_KEY` was returning `undefined`.
- **Logic Chain:** Because the key was missing, requests were unauthorized. Hence, BALLDONTLIE lowered the rate limit significantly from the Free Tier, explaining why 429 error triggered so aggressively.

### Resolution & Cache Invalidation

1. **Environment Correction:** Key was initially stored in `env.local` file, which Next.js was not registering in server process. Created standard `.env` file to store the key, where it was successfully registered ("Key Exists")
2. **Hard Reset:** Deleted `.next` directory to clear sever-side data cache. Next.js had saved and displayed previous 429 error page without actually re-attempting API call.
3. **Outcome:** Authorization was successful (Status 200). App can now fetch real NBA season data without anonymous 429 error appearing.

## 27 Dec 2025: Repository Refactoring & Matchboard Architecture

- **Git Maintenance:** Optimized commit history and finalized `.gitignore` configurations to align with production-ready standards.
- **Data Strategy:** Designed `mockGames` system to serve as a fail-safe, ensuring UI stability during API rate-limiting or outages.
- **Time Fix:** Implemented `timeZone: 'UTC'` logic within `toLocaleTimeString` method to resolve 5-hour time shift in game schedules.

## 30 Dec 2025: Live Dashboard & Layout Restructuring

### Live Data Pivot

- **SDK Integration:** Successfully transitioned from mock-only displays to live API fetching using getGames().
- **Historical Data Handling:** Identified that unfiltered API calls default to 1946 data. Resolved by passing specific date objects { dates: ["2025-12-30"] } to the SDK to target more recent gameday.

### UI & Architecture

**Semantic Refactor:** Replaced generic div containers with `<header>` and `<section>` tags to improve code readability and accessibility.
**Information Hierarchy:** Moved the Matchboard to the top of the page to prioritize real-time scores.

## 31 Dec 2025: Polymorphic Data Normalization

### Technical Challenge

- Discovered a critical crash-point when transitioning from `getGames()` (List) to `getGame()` (Single Object).
  - Matchboard is designed for array iteration (`.map`) and was incompatible with single-object response from the SDK's specific game endpoint.

### Solution: The Normalization Pattern

- **Architecture:** Implemented a ternary check using `Array.isArray()` and  `gameResponse.data` to force consistent data shape.
- **Type Safety:** Utilized TypeScript casting to ensure the normalized array adhered to the Game[] interface, preventing "Property undefined" errors in the render cycle.
- **UX Polish:** Refined JSX syntax for conditional string interpolation in game-clock displays, ensuring "Final" statuses don't redundantly display.

## 3 Jan 2026: UX Contextualization & Logic Resilience

### Feature: Context-Aware UI Logic

- Implemented conditional rendering to optimize information hierarchy of Matchboard
  - Reduced cognitive load by filtering out non-contextual data points.

### Architectural Win

- Refined Matchboard footer using Ternary Operator to handle state switch between "Tip-off Time" and "Final Score" displays, improving code readability.

## 6 Jan 2026: Architectural Refactor & State-Driven Filtering

- **Architecture:** Transitioned from a pure Server Component to a Hybrid Model.
  - Created a `dashboard.tsx` Client Component to handle user interactions while keeping `page.tsx` as the data-fetching layer.
- **State Management:** Implemented `useState` to manage `searchQuery` and `selectedDate`.
  - Allows for real-time UI updates without additional server round-trips.
- **"Date-Shift" Resolution:** Debugged a timezone offset issue where games appeared a day behind
  - Resolved by appending `T00:00:00` to date strings, forcing the browser to interpret dates in the user's local timezone
- **Advanced Filtering:** Engineered a multi-clause `.filter()` logic that aggregates search input and date selection to narrow down game results dynamically.

## 8 Jan 2026: Hybrid UI Selection & Data Standardization

- **Incremental Static Regeneration (ISR):** Integrated `export const revalidate = 60;` to ensure the dashboard stays current without requiring manual redeploys
  - Allows server to fetch fresh NBA scores in the background every minute, providing a "live" feel while maintaining the speed of a static site.
- **Hybrid Date Selection:** Applied dynamic `<select>` menu paired with a conditional `input[type="date"]`.
  - Allows for a clean UI that defaults to common relative dates (Today/Yesterday/Tomorrow) while supporting deep-calendar queries.
- **String Mismatch in Filtering:** Identified a bug where the HTML5 Date Input string (YYYY-MM-DD) failed to match the API's ISO-8601 string despite identical date values.
  - **Solution: Standardization Layer:** Implemented `.slice(0, 10)` normalization step within the `.filter()` method
    - Ensures that the state and API data are compared as standardized 10-character strings, regardless of trailing UTC timestamps.

## 9 Jan 2026: Time-Zone Synchronization & Dynamic Fetching Architecture

- **Date Drift Resolution:** Verified and anchored the `getRelativeDate` utility to `America/New_York` using `toLocaleDateString`.
- **Logic Verification:** Confirmed via server logs that the `T00:00:00` ISO-string formatting correctly synchronizes the application state with the NBA league calendar, eliminating UTC-rollover mismatch.
- **Server Action Implementation:** Created a `getGamesByDate` server-side action to bridge the gap between Client Component and API
  - Enables secure, on-demand data fetching for any date in the archives without exposing API keys.
- **State Merging Pattern:** Implemented "Master List" logic using Spread Operator (`...`) to combine initial server-side data with dynamic client-side fetches, ensuring a seamless user experience when navigating the calendar.

## 12 Jan 2026: State Optimization & Hook Stabilization

### Issue: Duplicate Keys & Memory Leaks

- **Symptom:** React warnings regarding duplicate keys in the Matchboard when navigating between specific dates.
- **Cause:** Overlapping data between `initialGames` (SSR) and `extraGames` (Client) caused ID collisions.
- **Solution:** Declarative De-duplication: Refactored the state merging logic from an imperative `.forEach` push to a declarative `Map` constructor.
  - *Insight:* Using `new Map().values()` is significantly more performant than `.find()` or `.filter()` for large datasets as it leverages hash-map lookups.

### Issue: React Hook Dependency Mismatch

- **Symptom:** Console error: "The final argument passed to useEffect changed size between renders."
- **Discovery:** Changing the dependency array from `[selectedDate, initialGames]` to `[selectedDate]` mid-session violated the Rule of Hooks regarding constant array size.
- **Resolution:** Standardized the effect trigger to watch `selectedDate` exclusively and performed a hard reset to clear the hook's memory buffer.