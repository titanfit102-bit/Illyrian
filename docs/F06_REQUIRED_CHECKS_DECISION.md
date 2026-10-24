# ILLYRIAN F06 — Proposed Integration Branch Protection (approval required)

> 2026-10-24. **PROPOSAL ONLY, NOT APPLIED**. Applies ONLY to `titanfit102-bit/Illyrian`, target branch `demo/v1.7-illyrian-shop`. Explicit owner authorization is required before changing GitHub branch protection or rulesets. No merges or Production actions authorized by this document.

## Verified current facts
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
- Current workflow runs Chromium on source feature push **and** PR, adding duplicate CI minutes; the WebKit engine probe runs only on PR and only after Chromium succeeds. Consider reducing redundant feature-branch push runs in a later, separately verified CI optimization; **never add a PR path filter** that can skip required checks.
- Required automated checks complement but **do not substitute for** physical Android/iPhone QA, real VoiceOver/TalkBack, privacy/security audit, and explicit owner sign-off.

## Evidence
- Browser workflow: `.github/workflows/illyrian-v17-browser-qa.yml`.
- WebKit focus subset: `playwright.webkit.config.cjs`.
- CI naming policy regression: `qa/illyrian-v17.spec.cjs`.
- Acceptance checklist: `docs/DEMO_V1_7_DEVICE_QA_ACCEPTANCE.md`.
- GitHub docs: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches and https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks.
