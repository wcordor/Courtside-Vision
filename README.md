# 🏀 Courtside Vision

## What is it?

Courtside Vision is an NBA analytics dashboard designed to help users compare team match-ups and player performance using the BALLDONTLIE API. It leverages TypeScript for robust data handling and features a custom fallback system to ensure a seamless user experience even when hitting external API rate limits.

## Tech Stack

- Next.js
- TypeScript
- Tailwind
- @balldontlie/sdk

## Status: Work in Progress

- [x] Initial Project Setup & Next.js Boilerplate
- [x] API AUthentication & SDK Integration
- [x] Data Resilience Layer
- [ ] Live Matchup Dashboard (In Progress)
- [ ] Mead-to-Head Player Comparison Tool
- [ ] Responsive UI Polish with Tailwind CSS

## Hybrid Data Resilience

To ensure the application remains functional despite the 5 req/min API limit, I implemented a Conditional Fetching Strategy. The app attempts to authenticate via environment variables; if it detects a failure (401 or 429), it seamlessly transitions to a local JSON dataset. This prevents the UI from crashing and allows for uninterrupted development and demonstration.
