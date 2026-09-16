# Provider Scoring Matrix — Sports Data Provider Proof of Concept

**Date:** 2026-09-16 · **Decision owner:** CTO · **Budget posture:** pre-revenue MVP
**Method:** score 1–5 against the audit's §9 PoC checklist. Publicly documented facts as of Sep 2026 are footnoted; every cell marked **V** must be verified hands-on during the two-week PoC before any annual contract.

## Candidates

| | **Sportmonks** (primary candidate) | **API-Football** (breadth/verification candidate) | **Sportradar** (enterprise, deferred) |
|---|---|---|---|
| NPFL fixture depth | **V** — 2,300+ leagues listed, African lower-tier quality varies [1] | **4** — NPFL explicitly on published coverage list [4] | **V** — 650+ soccer comps, depth per comp unverified [2] |
| CAF competitions | **V** | **V** — listed for African confederation comps [4] | **4** — official confederation partnerships [2] |
| Historical seasons | **3** — 3 seasons base; older is paid add-on via sales [1] | **3** — varies by plan/competition [4] | **5** — deep official archives [2] |
| Time-zone consistency | **V** — must test kickoff UTC handling for African venues | **V** | **4** — contractually guaranteed [2] |
| Postponement/correction speed | **V** | **V** | **5** — real-time official feeds [2] |
| Prematch odds coverage & display rights | **4** — strong odds product; Premium Odds add-on (~€129/mo) for bookmaker depth [1][3] | **3** — odds on paid tiers, bookmaker depth narrower [4] | **5** — industry standard, 150+ bookmakers [2] |
| Settlement latency | **V** | **V** | **4** — push feeds [2] |
| Rate limits / webhooks | **4** — ~3,000 req/hr per entity; webhooks on higher tiers [1] | **3** — 10 req/min free, higher on paid [4] | **5** — enterprise SLAs [2] |
| Commercial rights (predictions, derived data, archives, affiliate use) | **V** — must confirm derived-data + display rights in writing | **V** — same | **5** — B2B licensing designed for this; explicitly not for direct client calls [2] |
| Support SLA | **3** — email/chat; dedicated at enterprise [1] | **3** | **5** — named account team [2] |
| Cost reality for MVP | **3** — entry €29/mo (5 leagues) but realistic config (leagues + odds + history) runs €150–600+/mo once add-ons stack [1][3] | **5** — free 100 req/day; paid from ~$19/mo [4] | **1** — no public pricing; typical entry $5k–10k+/mo, weeks-to-months onboarding, annual commitment [2][3] |
| Time to first API call | **5** — self-serve | **5** — self-serve | **1** — sales cycle [3] |

## Scoring summary

| Candidate | Weighted fit for Phase 1 PoC |
|---|---|
| Sportmonks | **Primary** — best odds product at startup-friendly entry, provided NPFL depth verifies |
| API-Football | **Secondary** — cheap, self-serve, *publicly lists NPFL*; ideal to cross-verify African fixture data and to keep as redundancy |
| Sportradar | **Deferred to Phase 4–5** — the audit's rights/SLA gold standard, but enterprise economics are irrational pre-revenue. Re-open when paid products or media partnerships justify it |

## PoC plan (two weeks, days 3–14 of the 48h plan's Phase 1)

1. **Week 1 — Coverage verification (both Sportmonks + API-Football, cheapest tiers):**
   - Pull 30 days of NPFL + CAF Champions League fixtures; diff against official NPFL/CAF published schedules.
   - Measure: fixture completeness %, kickoff time-zone correctness, postponement propagation delay.
   - Pull prematch odds for 50 European + 20 African fixtures; verify decimal format, margin sanity, and timestamp freshness.
2. **Week 2 — Pipeline rehearsal (Sportmonks primary):**
   - Wire the audit §7 record fields (fixture_id, kickoff_at_utc, odds_snapshot, captured_at) through the PR #2 backend `create` flow into `predictionDrafts`.
   - Measure: end-to-end latency from provider webhook/poll → stored record; settlement latency on 10 finished fixtures.
   - Get **written confirmation** of derived-data/prediction/archive/affiliate rights from both providers (email suffices at this stage).
3. **Exit criteria (from audit §9):** >99.5% fixture/result correctness after reconciliation; settlement <10 min after provider finality; rights confirmed in writing; total PoC cost < €500. Fail any → re-open provider selection with the matrix evidence.

## Sources (public, Sep 2026 — secondary sources, verify in PoC)

- [1] thestatsapi.com/blog/sportmonks-alternative (2026-04) — Sportmonks plan/add-on structure, rate limits
- [2] developer.sportradar.com — B2B positioning, coverage matrix, client-call warning; thestatsapi.com/blog/best-football-api (2026-02) — 650+ comps, official partnerships
- [3] sharpapi.io/compare/sportradar-alternative (2025-12) — enterprise pricing posture; SportsAPIPro review (2026-03)
- [4] api-football.com/coverage (updated 2026-04) — NPFL explicitly listed
