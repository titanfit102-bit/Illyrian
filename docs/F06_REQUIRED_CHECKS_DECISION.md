# ILLYRIAN F06 — Proposed Integration Branch Protection (approval required)

> **Active owner decision — 26 October 2026:** administrative F06 enforcement is deferred to the real APK phase; it is not required for development of the owner's DEMO. CI remains active and no merge is authorized. The proposal and preflight below are historical/design references, not a current instruction to activate rules. Revisit only after explicit phase/settings authorization. [Permanent policy](../AGENTS.md#demo-vs-apk--permanent-owner-policy).


> 2026-10-24. **PROPOSAL ONLY, NOT APPLIED**. Applies ONLY to `titanfit102-bit/Illyrian`, target branch `demo/v1.7-illyrian-shop`. Explicit owner authorization is required before changing GitHub branch protection or rulesets. No merges or Production actions authorized by this document.

## LIVE F06 preflight — 2026-10-25 [READ-ONLY / APPROVAL REQUIRED]

- **Exact current feature branch HEAD:** `8a345a7d4b9f44d434ea4c4114c3e8c009257ad5` (documentation-only), [PR Actions #40192722927](https://github.com/titanfit102-bit/Illyrian/actions/runs/40192722927) **221/221 Chromium PASS + 16/16 Linux WebKit PASS**, both job logs checked. Latest source/test commit `11bdf46b7e9736475a1081444b1a7bcaccad8aac` passed the same **221 + 16** in [Actions #40188067150](https://github.com/titanfit102-bit/Illyrian/actions/runs/40188067150). Neither run is a real phone or screenreader certification.
- **Draft PR #1** remains **open / Draft / unmerged** from `feat/i18n-shop-feedback-20261022` into **exactly** `demo/v1.7-illyrian-shop`. The integration branch remains at `015ce439e7c6d736149c6c300391586517664f62` with `protected:false`; repository rulesets query returns **[]**. Passing checks therefore **DO NOT block an unauthorized merge automatically**.
- The current `.github/workflows/illyrian-v17-browser-qa.yml` generates successful PR-context job names **`browser-smoke-pull_request`** and **`webkit-smoke-pull_request`**. Its feature-branch `push` duplicate trigger was removed; `push` only targets the integration branch, and the `pull_request` event is deliberately **not path-filtered**. Do **not** require a nonexistent feature-push check, the skipped WebKit push variant, or a Vercel comments check.
- **Unapproved administrative decision:** owner must explicitly authorize the targeted integration-only required-check rule and choose whether to demand strict up-to-date branches. Never mutate `main`, Production, global organization rules, SSO, aliases or paid services to enforce this draft rule.
- **Approval-independent HOLD:** even successful enforcement must not trigger a merge. Physical Android Chrome/iPhone Safari M01–M18, real TalkBack/VoiceOver and owner release sign-off are still **NOT TESTED**.
- **Scope:** no branch protection, rulesets, PR merge, or secrets/Production settings changed by this read-only preflight.

## Historical verification — 2026-10-24 (preserved for context)

- [Draft PR #1](https://github.com/titanfit102-bit/Illyrian/pull/1): source `feat/i18n-shop-feedback-20261022`, target `demo/v1.7-illyrian-shop`; unmerged.
- Integration branch GitHub branch-list API: `protected:false`. Repository rulesets API returned an empty list at the audited checkpoint; refresh both before making changes.
- At exact source/test SHA [`5a066164dbe794effea3b17eb241a70046d3949a`](https://github.com/titanfit102-bit/Illyrian/commit/5a066164dbe794effea3b17eb241a70046d3949a), [Actions #40099906942](https://github.com/titanfit102-bit/Illyrian/actions/runs/40099906942) shows these **successful PR checks from GitHub Actions**: `browser-smoke-pull_request` (190/190 Chromium) and `webkit-smoke-pull_request` (12/12 bounded WebKit). The separate push check `browser-smoke-push` also passed but must **not** be chosen as the PR merge gate.
- The WebKit job's skipped push-side check has a distinct label, while the successful PR job is `webkit-smoke-pull_request`; do not select skipped or generic labels as required checks.
- Both PR checks are triggered by the `pull_request` event targeting this integration branch **without path filters**, and use read-only checkout credentials. Chromium runs full tests; WebKit currently covers only a limited keyboard focus subset. This is not device or screenreader coverage.

## Recommended targeted rule — ONLY after explicit approval
1. In GitHub repository Settings → Branches (or Rules → Rulesets), match **exactly** `demo/v1.7-illyrian-shop` — do not apply the rule to `main`, all branches, tags or Production.
2. Require a Pull Request before merging; do not set mandatory external reviewer approvals in a single-maintainer repository without ensuring eligible reviewers exist (avoid deadlock). Require resolved conversations if practical.
3. Require status checks from the **GitHub Actions** app: `browser-smoke-pull_request` and `webkit-smoke-pull_request`. Do **not** require `browser-smoke-push`, the skipped WebKit push label or `Vercel Preview Comments`. Verify exact names in the live PR checks immediately before setup.
4. Initially choose whether to require the head branch to be up-to-date with integration. **Strict** protects against base-branch drift but can demand an authorized update/rebase; **loose** avoids needless reruns but increases integration conflict risk. Document the owner's choice. Do not silently rebase, merge or force-push.
5. Disable force pushes and branch deletion. Consider bypass permissions carefully; do not lock every write path until the maintainer workflow is validated. Leave secrets, global SSO, GitHub org rules and Production unchanged.
6. Keep PR #1 **Draft**, do **not merge** when checks turn green; actual phone, TalkBack/VoiceOver, manual QA and owner release sign-off remain independent HOLD gates.

## Verification after owner-approved implementation
- Re-read branch protection/rulesets: match exact integration branch and `protected:true`, with both required PR check names and expected GitHub Actions source.
- On a newly updated Draft PR, verify `browser-smoke-pull_request` **and** `webkit-smoke-pull_request` are present and successful for the correct HEAD/test merge; other check names must not accidentally satisfy these requirements.
- Confirm a missing/failing required check blocks merge, without actually merging PR #1 or modifying Production. If testing rejection would require an unsafe branch mutation, rely on rule API and GitHub UI evidence instead.
- Confirm `main`, integration SHA, Vercel Production deployment and policy scope remain unchanged during setup.
- If checks become permanently pending, undo only the new rule/configuration with the owner's authorization; preserve evidence and do not bypass the gate using a merge.

## Cost and scope guard
- **Updated 2026-10-25:** feature-branch Chromium runs are now triggered by PR only; the redundant feature-push event was removed and verified. Integration push retains its own scoped Chromium run. The WebKit engine probe runs on PR after Chromium success. **Never add PR path filters** that can leave required checks pending.
- Required automated checks complement but **do not substitute for** physical Android/iPhone QA, real VoiceOver/TalkBack, privacy/security audit, and explicit owner sign-off.

## Evidence
- Browser workflow: `.github/workflows/illyrian-v17-browser-qa.yml`.
- WebKit focus subset: `playwright.webkit.config.cjs`.
- CI naming policy regression: `qa/illyrian-v17.spec.cjs`.
- Acceptance checklist: `docs/DEMO_V1_7_DEVICE_QA_ACCEPTANCE.md`.
- GitHub docs: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches and https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks.
