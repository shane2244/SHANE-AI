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

### 2026-08-14 — Membership, Intelligence, and Knowledge Expansion

- Added the original `/app/discovery`, `/app/sacral`, `/app/traditions`, `/app/meanings`, and `/app/connections` route structure under the redesigned shell.
- Added five-system Discovery previews for astrology, numerology, Human Design, Chinese astrology, and Kabbalah; first half is visible before the paywall.
- Added Stripe test membership at $22 monthly or $220 yearly with authenticated checkout, transaction tracking, status polling, and server-side premium access.
- Added Emergent-managed Google session exchange, secure cookies, free/premium member states, private messages, booking requests, and group-event access.
- Added Claude Sonnet 4.6 streaming companion responses with consent-based memory, review, and forget controls.
- Expanded Sacral into Kundalini, historical Tantra versus neo-Tantra, sacred sexuality, breathwork, yoga, Akashic symbolism, consent, and safety content.
- Added a source-linked Traditions Atlas with five editorial groups and progressive depth for newcomers versus experienced seekers.
- Adopted the supplied SHANE-AI logo, removed Pittsburgh references, darkened all surfaces, and remapped accents to neon turquoise, orange, blue, yellow, purple, green, and dark cherry red.
- Tightened credentialed CORS to explicit preview, production, and custom domains; environment files are excluded from source control.
- Verification: 21/21 backend tests passed; Claude streaming, Stripe checkout, premium access, all routes, and mobile overflow checks passed.

### 2026-08-14 — Authority, Growth, and Intuitive Arts

- Added a searchable central Atlas spanning higher consciousness, metaphysics, holistic living, spiritual traditions, esoteric systems, symbols, and intuition/channeling.
- Added a plainspoken newcomer compass that routes people by their immediate need rather than spiritual vocabulary.
- Added The Signal consented email list, worldwide SEO metadata, Open Graph, JSON-LD, accessible skip navigation, and privacy-safe pageview analytics with session recording disabled.
- Added public Methods & Accuracy documentation that labels live, preview, held-back, and interpretive engines instead of manufacturing precision.
- Added an extensive Intuition & Channeling Atlas with ten abilities, four explanatory lenses, and sourced profiles of Lee Carroll/Kryon, Esther Hicks/Abraham, Darryl Anka/Bashar, and Edgar Cayce.
- Added a channeling discernment code covering consent, fear/urgency, high-stakes decisions, prediction tracking, daily functioning, and appropriate support.
- Completed competitive benchmarking across Nementum, Cosmic Oceans, myBodyGraph, Gaia, CaleaDream, Insight Timer, Mindvalley, Co-Star, CHANI, The Pattern, Sanctuary, and leading AI companions.
- Identified SHANE-AI’s moat as a living personal spirituality operating system: sourced knowledge + consented evolving AI + connected systems + real-world integration.
- Verification expanded to 30/30 backend tests and responsive UI checks; strict CORS passes at app level. Public preview OPTIONS remains controlled by upstream ingress and requires platform support.

## Prioritized Backlog

### P0 — Next Core Modules

- Add structured content models and editorial pages so the Wisdom and Meanings libraries can grow beyond in-code entries.
- Connect a verified Human Design calculation engine and complete Kabbalah personalization without inventing results.
- Complete direct Google Calendar synchronization after owner credentials are provided.
- Build the Integration Loop: convert any insight into one real-world experiment, then learn from the 24-hour and seven-day outcome.
- Add a personal Meaning Graph linking symbols, dreams, readings, memories, and life events with user-controlled provenance.

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