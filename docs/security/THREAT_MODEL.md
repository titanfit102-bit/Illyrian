# Threat model — current DEMO and future boundaries
Assets: repository/CI integrity, drafts/local state, future identities/private messages/location/media, seller inventory and payments. Attackers: malicious content author, abusive account/bot, compromised dependency or contributor, stolen device/session, privileged insider.

| Scenario / boundary | Defense and present evidence | Residual risk |
|---|---|---|
| UGC → DOM/translation | Escaping, UGC exclusions, existing browser injection/locale regressions | Not every HTML sink audited; bounded static patterns are not taint analysis |
| Persisted data → runtime | Current A1 recovery/rollback and stale-write regression tests | Local data mutable; no atomic concurrency or device recovery |
| Contributor/dependency → CI/client | Read-only checkout, pinned security action SHAs, locked inventory/vendor parity, secret-pattern scan | Current-tree patterns miss unknown secret formats/history; human review still needed |
| Identity → private object/API | No real API/auth: NOT APPLICABLE to local DEMO | Release blocked for real users until IDOR/BOLA, session, block and membership tests pass |
| Bot → social/marketplace | Fictional offline flows only | Real rollout needs quotas/rate limits, spam/fraud response and moderation operators |
| Operator → private data/payment | No real processing | Scoped admin, immutable server audit, signed webhooks, incident/restore evidence required |

Revisit only when trust boundaries/data classes/integrations change. Public register contains impact/status, not sensitive exploit details. Private disclosure route remains UNKNOWN; establish it before collecting sensitive reports. No production probing is authorized.
