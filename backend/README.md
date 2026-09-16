# Secure API foundation

The browser must never initialise Firebase or receive database write capability. Public reads and all editorial writes pass through this API.

## Security contract

- Firestore denies all client access. Firebase Admin bypasses rules and must run under a dedicated least-privilege service account.
- Editorial writes require a verified, revocation-checked Firebase ID token and the custom role claim `editor` or `admin`.
- Published records live in `publishedPredictions`; drafts live in `predictionDrafts`.
- There is no mutation or deletion route for a published record.
- Every creation writes an `auditEvents` record in the same transaction.
- Production fails to start without an explicit CORS origin allowlist.
- Request size and rates are bounded; security headers are enabled.

## Next backend increment

Add a separate correction endpoint that links a new signed correction record to an immutable prediction, then add an audited approval workflow so an editor cannot approve their own publication.

## Deploy to Cloud Run (staging)

Image: `backend/Dockerfile` (build context = repo root). CI: `.github/workflows/deploy-api.yml` — tests first, then builds, deploys, and health-checks automatically on every push to `main` that touches the backend.

### One-time GCP setup (owner, ~15 min in console or gcloud)

1. **Billing**: the Firebase project must be on the Blaze (pay-as-you-go) plan. Cloud Run bills against it; at MVP traffic the always-free tier (2M requests/mo, 360k GB-s) covers everything — expect **$0/month**.
2. **Firestore region**: create the Firestore database in an explicit region (e.g. `europe-west1`) and record it in `docs/adr/ADR-001-architecture.md`.
3. **Service account**: create `zeepredict-api-staging` with the single role `roles/datastore.user` (Firestore read/write). ID-token verification is done locally by the Admin SDK against Google's public certs — no extra IAM role needed. This is the whole point of the server-only design: one least-privilege identity, nothing else.
4. **Workload Identity Federation** (no service-account keys in GitHub): create a WIF pool + provider for GitHub (`attribute.repository=martinzico35-afk/myworkspace`), bind it to the service account. Copy the provider resource name.
5. **Secret**: `printf '<staging-origin-urls>' | gcloud secrets create zeepredict-allowed-origins --data-file=-` and grant the service account `roles/secretmanager.secretAccessor` on it.
6. **Repo secrets** (Settings → Secrets → Actions):
   - `GCP_PROJECT_ID` — the Firebase/GCP project id
   - `GCP_SERVICE_ACCOUNT` — `zeepredict-api-staging@<project>.iam.gserviceaccount.com`
   - `GCP_WORKLOAD_IDENTITY_PROVIDER` — the WIF provider resource name from step 4
   - Create a `staging` GitHub environment (Settings → Environments) so deploys are environment-gated.

### Post-deploy verification

- `GET <service-url>/health` → `{"status":"ok"}`
- `POST <service-url>/api/v1/admin/predictions` without a token → `401`
- Request from a non-allowlisted origin → `403`
- Firestore console shows `publishedPredictions` only after an authenticated editor write; client SDK reads remain `PERMISSION_DENIED`.
