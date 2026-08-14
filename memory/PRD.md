# SHANE-AI Product Requirements Document

## Original Problem Statement

Recreate and redesign `https://shaneai22.com/` as a functional full-stack experience. Preserve its higher-self companion and three-stage self-discovery concept while expanding ShaneAI22.com into the central home for the user's higher-consciousness, metaphysical, holistic, and spiritual ideas.

## Product Vision

SHANE-AI is a private, thoughtful higher-self companion and living wisdom atlas. It brings guided reflection, personal practices, symbolic systems, spiritual education, and the user's related projects under one coherent brand and navigation system.

## User Personas

- **Reflective seeker:** wants prompts, journaling, emotional check-ins, and a nonjudgmental companion.
- **Spiritual learner:** wants contextual guides to metaphysics, spirituality, symbols, and higher consciousness.
- **Self-discovery explorer:** wants structured astrology, numerology, Human Design, and Kabbalah breakdowns.
- **Curious skeptic:** wants spiritual claims clearly separated from history, symbolism, psychology, and established evidence.

## Architecture Decisions

- React single-page frontend with route-based destinations and an oversized, horizontally scrollable “Path Navigator.”
- Every main destination has a distinct accent color while sharing one SHANE-AI visual system.
- FastAPI backend provides dashboard metrics, mood check-ins, journal persistence, reflective tarot draws, and companion responses.
- MongoDB stores journal and mood data using UUID strings and ISO timestamps; MongoDB `_id` values are excluded from responses.
- Frontend API requests use `REACT_APP_BACKEND_URL`; backend uses the protected `MONGO_URL` and `DB_NAME` configuration.
- Spiritual content uses responsible framing that distinguishes belief, metaphor, historical tradition, and scientific evidence.

## Core Requirements (Static)

- Keep all product ideas under ShaneAI22.com rather than presenting them as disconnected projects.
- Make navigation large, pronounced, colorful, unique, and understandable at a glance.
- Give each main section its own color theme.
- Include Today, three-stage Journey, Companion, Tarot Play Therapy, Journal, Wisdom, and Meanings destinations.
- Present StarSeeds as a substantial guide with origins, archetypes, belief lenses, and grounded discernment.
- Establish a broad authority hub for higher consciousness, metaphysics, holistic topics, and spirituality.
- Include a searchable “Spiritual Meaning Of…” library.
- Include future personalized breakdown suites for astrology, numerology, Human Design, and Kabbalah.
- Provide clear privacy, wellness, cultural-context, and non-diagnostic language.

## Implemented

### 2026-08-14 — Core Experience

- Built seven route-based, color-themed destinations: Today, The Path, Companion, Tarot Play, Journal, Wisdom, and Meanings.
- Added the large Path Navigator between the SHANE-AI brand and Premium status pill, with scroll snapping and animated active states.
- Added persistent mood check-ins, dashboard metrics, journal creation/history, three-card reflective draws, and guided companion conversations.
- Added a flagship StarSeeds guide covering definition, modern origins, common lineages, literal/symbolic/critical lenses, and discernment.
- Added the Wisdom Atlas with higher consciousness, metaphysics, holistic living, and spiritual-tradition categories.
- Added the searchable Spiritual Meaning Of library with filters and contextual interpretation panels.
- Added responsive desktop/mobile layouts, recovery messages, accessibility labels, and comprehensive test identifiers.
- Corrected code-quality findings: exhaustive backend companion defaults, cleanup-safe effects, stable React keys, shorter Today/toast logic, and verified Python identity checks.
- Verification: frontend production build passed; backend regression suite passed 8/8; desktop/mobile E2E flows passed.

## Prioritized Backlog

### P0 — Next Core Modules

- Build the Self-Realization hub that connects personalized symbolic-system reports without merging their traditions inaccurately.
- Add structured content models and editorial pages so the Wisdom and Meanings libraries can grow beyond in-code entries.

### P1 — Personalized Breakdown Suite

- Astrology: birth chart wheel, planets, signs, houses, aspects, patterns, and transits.
- Numerology: Life Path, Birthday, Expression, Soul Urge, Personality, and personal cycles.
- Human Design: Type, Strategy, Authority, Profile, Centers, Channels, and Gates.
- Kabbalah: responsibly contextualized Tree of Life, Sefirot, pathways, symbolism, and source tradition.
- Higher-Self Synthesis: compare themes across reports while preserving each system's distinct terminology and lineage.
- Expand Spiritual Meaning Of entries across animals, dreams, numbers, nature, experiences, body sensations, and synchronicities.

### P2 — Expansion

- Add Prophecies/editorial publishing and connect the user's additional repository concepts to the central atlas.
- Add citations, authorship, editorial review dates, related-topic trails, and deep site search.
- Add saved reading lists and personalized learning paths.

## Next Tasks

1. Define exact birth-data inputs and calculation sources for the personalized breakdown suite.
2. Build the Self-Realization overview and report navigation.
3. Implement astrology and numerology as the first two report modules.
4. Convert Wisdom and Meanings content into database-managed collections.