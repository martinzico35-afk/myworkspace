# ADR-001: Server-only Firestore backend for Phase 1–2, with a PostgreSQL revisit gate

- **Status:** Accepted — engine decision (Firestore Phase 1–2) + hosting decision (staging: Cloud Run; production deferred to Phase 2 gate)
- **Date:** 2026-09-16
- **Deciders:** Contracted CTO, repo owner
- **Supersedes:** Nothing (first ADR). Related: CTO audit §9 (target architecture), PR #2 (implemented backend)

---

## Context

The CTO audit (§9) recommended managed **PostgreSQL** as the source of truth. Separately, the reviewed patch in PR #2 shipped a **server-only Cloud Firestore backend** (Firebase Admin SDK, deny-by-default client rules, transactional writes, audit events, tests).

Both are now in tension. The backend exists, is tested, and matches the audit's *security* architecture (server-side privilege separation, no client database access). What it does not match is the audit's *database engine* preference.

Key facts for the decision:

1. **Phase 1–2 data volumes are tiny.** A few hundred fixtures/day, a handful of predictions/day, one audit event per write. Firestore handles this trivially; PostgreSQL's advantages (joins, analytics SQL, relational integrity) are not yet load-bearing.
2. **The patch's backend is already built and green (14/14 tests).** Rebuilding on Postgres now burns the 48-hour-plus window to re-solve solved problems (auth, immutability, audit) on new infrastructure.
3. **Firestore has real constraints**: no multi-document transactions across collections at scale-cost sanity, weaker ad-hoc analytics, query model pushes complexity into code, data residency must be explicitly pinned (NDP Act consideration).
4. **The prediction ledger will need analytical queries** (§7 metrics: calibration by band, yield by league/market/odds band, drawdown). These are painful in Firestore and natural in SQL.
5. **Firestore locks us into GCP/Firebase** for the data plane; Postgres is portable across clouds.

## Decision

**Adopt the PR #2 Firestore backend as the Phase 1–2 source of truth. Do not rebuild on PostgreSQL now.** Stand up a mandatory revisit gate at the Phase 2 exit (audit §12: "≥30 days of immutable, automatically settled predictions").

### Explicit revisit triggers (any one forces the ADR to be re-opened)

- Analytics queries for the public ledger require >2 Firestore round-trips per request (N+1 pain), or
- Prediction volume exceeds ~10k settled records, or
- Model development needs feature snapshots joined across entities (Fixture × Odds × Form), or
- Cost per write/read exceeds the managed-Postgres equivalent at our volume by >2×, or
- A data-residency requirement from NDPC counsel that Firestore's pinned region cannot satisfy.

### Non-negotiables carried over from the audit (independent of engine)

- Client rules remain `allow read, write: if false` — verified by `test/static-safety.test.js`.
- Writes are transactional create + `auditEvents`; no update/delete endpoints.
- Secrets and provider keys live server-side only (`.env.example` contract).
- Backups/export job scheduled before Phase 2 launch (Firestore managed export to GCS, weekly).

## Alternatives considered

| Alternative | Verdict |
|---|---|
| Rebuild now on managed PostgreSQL (Neon/Cloud SQL) | Rejected for Phase 1: throws away tested, merge-ready backend; solves no current problem. Revisit at Phase 2 gate. |
| Dual-write Firestore → Postgres from day one | Rejected: doubles every write path, doubles failure modes, for analytics we do not yet serve. |
| Keep Firestore permanently | Not decided. The revisit gate exists precisely because this may be wrong at scale. |

## Consequences

**Positive:** PR #2 merges as-is; Phase 1 work (provider PoC, ingestion, editorial flow) starts immediately on a working API; containment stays test-locked.

**Negative/accepted:** analytics for the public ledger will be awkward for ~45–90 days; migration cost at the Phase 2 gate is real (est. 3–5 engineer-days with the repository pattern the backend already uses); GCP lock-in for the data plane.

## Hosting decision (added 2026-09-16, CTO review)

**Staging: Cloud Run, final.** The backend is a host-agnostic Express container; Cloud Run is chosen for staging because it is zero-setup, scales to zero (~$0 at MVP traffic), and inherits GCP service-account auth (no API keys, no secrets files). **Production host is deferred to the Phase 2 gate** and will be decided with measured traffic/cost data — Cloud Run vs the owner's existing Coolify VPS (sunk cost, single-platform ops, Doppler secrets). The Express container and Firestore coupling are identical either way; only deploy wiring changes.

## Compliance note

Firestore database region must be pinned explicitly (e.g., `europe-west1` or per counsel) at project setup and recorded here; NDPC counsel review remains a Phase 1 workstream regardless of engine.
