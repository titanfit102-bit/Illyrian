# Security architecture
Canonical product/trust-boundary design remains [blueprint §3–6, §10–11](../../architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md). This file maps implementation boundaries; it does not create a parallel architecture.

| Boundary | Current DEMO | Real-app prerequisite |
|---|---|---|
| Device/account | Browser fixtures and mutable localStorage; no real credentials | Provider-backed sessions, revocation/recovery, secure OS credential storage; privileged MFA |
| Client/API | No API; role switches illustrate journeys | Server checks ownership, membership, blocks and suspension on every request/subscription; deny by default |
| Private messaging/media | Local text/images only | Membership checks, scoped media URLs, upload size/type limits, retention/delete and abuse reporting; choose encryption guarantees explicitly |
| Database | Independent local stores | Versioned relational schema, least-privilege access, transactions/idempotency, isolation tests, restore exercise |
| Marketplace | Fake catalog/orders/5% | Single canonical listing identity; seller isolation; licensed payment provider, verified webhook signatures/idempotency only after approval |
| Operations | Read-only PR jobs, protected Preview | Redacted audit/alerts, rate/abuse limits, restore/incident/rollback and gradual measured scaling |

Do not store secrets/private production content in localStorage or this public repository. Escape for the output context, preserve UGC and stable domain codes. No provider, paid infrastructure or million-user capacity is approved by this design.
Use [ASVS 5.0.0](https://asvs.owasp.org/) for future web/API verification; [MASVS](https://mas.owasp.org/MASVS/) and [MASTG](https://mas.owasp.org/MASTG/) for native storage/auth/network/platform/privacy testing. Select applicable requirement IDs against the actual implementation before each real slice; no blanket compliance claim. GDPR obligations require target-market/data-lifecycle decisions and qualified review before real users.
