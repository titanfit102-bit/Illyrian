# Security verification matrix
| Control | Executable evidence / next proof | Scope |
|---|---|---|
| Known secret formats / suspicious assignments | `python3 scripts/security/check.py`; `--self-test` rejects synthetic fixtures without printing values | Current tracked tree only; no full historical/high-entropy scan |
| Bounded static analysis | Same checker rejects eval/Function/document.write in first-party JS/HTML; `node scripts/security/syntax.cjs` parses JS | Not comprehensive SAST or XSS proof; review innerHTML/data flows |
| Dependency advisories | `npm ci --prefix security --ignore-scripts`; `npm audit --prefix security --audit-level=high` | Registry availability required; unknown/network failure is not PASS; review moderate findings too |
| Served vendor integrity | SHA manifest + byte equality to locked npm i18next distribution | Update version, lock, hash and vendor together after review |
| UGC/escaping/storage/privacy fixtures | Existing `qa/illyrian-v17-i18n.spec.cjs`, flows/lab/focus suites; existing browser QA workflow | DEMO only; existing A1 regression coverage reused |
| Real auth/API/DB/messages/payments | NOT APPLICABLE to current DEMO; UNKNOWN for real release until negative multi-user tests exist | ASVS authentication/access control/session/encoding/API requirements |
| Native app | NOT APPLICABLE: no native package | MASVS storage/auth/network/platform/privacy; MASTG device tests before native release |
| Restore/abuse/scale | UNKNOWN for real product | Restore drill, bot/rate-limit tests, redacted alerts and measured staged load |

Low-risk copy/CSS: baseline CI plus affected UI checks. UGC/persistence/media/permissions/dependencies/workflows: targeted negative tests plus affected browser suite and threat/register review. Real auth/payments/migrations: deeper isolation/concurrency/security review. Never repeat a full manual audit for cosmetic changes or treat fixture tests as backend authorization.
