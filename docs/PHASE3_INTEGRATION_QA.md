# ILLYRIAN — Phase 3 social/location integration QA

25 October 2026 · Feature branch `feat/i18n-shop-feedback-20261022` · Draft PR #1 · **DEMO, not native/backend release**.

## Discovery and scope

Base HEAD `d32a7c57692b5a2f20b2faa0b4c02ec39c373e9f`, all three Actions checks successful. The existing roadmap already records Phase 3 IN9-02/03/04/05/07 and IL-029: two manual cities, expiring interests, first-attendee guidance, repeat draft and collaborative activities. They were reused. No separately documented checkpoint named **3.2** was found in the tracked source/docs at that HEAD; this report does not retrospectively declare it complete. Phase 7/8 and M0–M5 remain unchanged.

Source/test SHA **a9a380cfa570a2a07c3c7b0ae814817e630e8e99**, tree `e5cca560fa16515923bc8916a537db4421940790`, byte-identical to the locally tested tree. No CSS/logo/icon/domain/storage-key rewrite, merge, main/integration/Production, paid service, backend or native build. Publication was verified by per-file blob and complete-tree identity checks, with expected-HEAD update.

## Commit evidence

| Commit | Change / evidence |
|---|---|
| `27da8420cb8570e1a1a36daf0aac407b930ffd3f` | Initial integration/time/storage/contracts; [CI 40233493686](https://github.com/titanfit102-bit/Illyrian/actions/runs/40233493686), 257 Chromium +16 WebKit PASS; initial 17-asset Preview parity |
| `d45fea19c4793d8ee174d1f0139c34b357075a11` | Preserve existing membership activity/notification log in the same write/rollback; [CI 40234008884](https://github.com/titanfit102-bit/Illyrian/actions/runs/40234008884), 257 Chromium +16 WebKit PASS |
| `a9a380cfa570a2a07c3c7b0ae814817e630e8e99` | Final community UI-copy correction; latest source evidence below; earlier candidates do not substitute for its final verification |

## Results and boundaries

| Area | Status | Implemented / verified scope |
|---|---|---|
| Communities integration | VERIFIED / DEMO | Community discussions reuse the same core post/comment IDs, Feed/Profile rendering, composer, hide/report actions and storage. Search filters existing community posts; navigation, membership and disclaimer copy use direct semantic sq/en/it keys after visual review; no separate Forum, discussion database or duplicate write. |
| Education | VERIFIED / DEMO | `c4` School & University / Shkolla & Universiteti / Scuola e Università within Communities, with pupil/student/alumni context; titles/descriptions/search in sq/en/it. No real schools, minor directory or personal records. Existing Alumni opt-in/search route retained; real age/contact/consent policy is BACKEND/OPEN. |
| Stories/Reels/Messages | VERIFIED scoped / DEMO | Existing viewer/focus/touch, draft/quota/Retry, like/save/share and navigation regressions are reused in the full browser suite; no real media pipeline, conversation server or cross-device delivery. |
| Social → activity | VERIFIED / DEMO | Community opens existing Plans draft; date/place/capacity require confirmation, no auto-publish/invite. Optional `communityId` references canonical local Plans records and reopens the same object. Old Events/Plans and stores are not merged. |
| Membership / comments | VERIFIED, bounded | Refused core writes do not claim membership or a posted comment; in-memory rollback, text retained, single retry/reload. Membership and its existing activity/notification log are persisted together with rollback; Retry records one log entry. Stale comment typing/sending cannot erase another tab's confirmed membership in the tested sequence. Other legacy writers and simultaneous races remain OPEN. |
| Composer context | VERIFIED | Closing a community composer and opening the normal Feed composer clears the destination context; a Feed post cannot silently inherit the previous community. Existing draft content is retained. |
| Manual city / GPS | VERIFIED / DEMO | Manual Feed city survives reload; failed save restores the previous city. GPS denied/absent/revoked-availability simulation leaves Feed/Shop/Inbox/Connections usable and makes zero geolocation calls. The whole DEMO still requests no GPS. Real native permission prompt/revocation and Nearby geocoding are OPEN/BACKEND, not implemented. |
| Timezones | VERIFIED, bounded cities | Shared `ILLYRIAN_ACTIVITY_TIME_v1.7.js` resolves local event date/time in its city IANA zone, independent of viewer. Plans and Connections use the same instant for closed/upcoming. DST gap/duplicate and invalid calendar times are rejected; midnight/leap examples checked. Supported DEMO cities only; no global timezone/service certification. |
| Interests / repeat | VERIFIED / DEMO | Exact expiry and invalid expiry never expose a matched-plan draft. Repeat creates a fresh blank-date/place/default-capacity draft without changing old attendees or storage before publish; no recurring scheduler or notifications. |
| Backend contracts | BACKEND / design | Existing blueprint §13 extends users, scoped roles, Communities/content, activity/participation/invitation/interest, notification outbox, ID mapping, API errors/idempotency, object authorization, optional location and DST/recurrence contracts. No running API/DB or destructive migration. |
| Global acceptance | OPEN | Full app-wide i18n/UGC/a11y, real Android/iPhone M01–M18, TalkBack/VoiceOver, virtual keyboard, performance baselines, P1-A11Y-01, F06 enforcement and owner sign-off. Phase 1 remains PARTIAL / RELEASE HOLD. |

## Compatibility and safety

Existing keys and IDs remain unchanged. Additive optional post/Plan `communityId` and new Plan `timeZone` do not migrate old records. Legacy city-based zone inference occurs on read, without raw-storage rewrite; unknown/invalid wall times are non-actionable. Supported mappings: Albanian cities → Europe/Tirane; Prishtinë → Europe/Belgrade (IANA identifier); Milano/Romë → Europe/Rome; Berlin → Europe/Berlin. No personal coordinates or movement history are collected or published. Manual city filters remain separately scoped rather than silently synchronized.

Community-created content uses existing escaping and UGC boundaries; `<script>`-like text and `Mbyll` remain literal through language changes. No server authorization is implied by local membership checks. Client-only moderation/reporting, messages, participation, host counters and notifications remain simulations. No real pupils/users are enrolled.

## Test evidence

- Added **22 Playwright regressions** in the existing `qa/illyrian-v17-i18n.spec.cjs`, discovered by unchanged CI config. Local integration **22/22 PASS (1.3 min)**, followed by **3/3 expanded sq/en/it community-copy tests PASS** on the final copy correction. Initial red run: 13 failed /1 GPS baseline passed; additional bridge, composer-context, translated-search, stale-comment, activity-log preservation, visible community UI-copy and exact/invalid-interest tests failed before their respective fixes. No existing tests were removed/skipped.
- Environment setup failures (missing pinned browser; full Chromium singleton socket restriction) were separated from product failures; pinned Chromium 1193 headless shell ran the final tests. An initial test referenced private lexical `state`; corrected to UI/raw-storage assertions before using red results as evidence.
- Additional local Playwright probe: 320×568, 844×390, 1280×800, Light/Dark, reduced-motion enabled; **6/6 PASS** for community modal Tab/Shift+Tab containment, Escape/inert restoration and long-content/document horizontal overflow. Browser evidence only, no screenreader/hardware claim.
- Catalogs **622 keys per sq/en/it, 15 namespaces**; key sets and root/demo byte mirrors PASS. Bounded detector self-test 7 unsafe fixtures rejected; tracked-tree scan 83 files/zero pattern findings, JS syntax and audited vendor parity PASS. Remote security log inspected: npm audit **0 vulnerabilities** at execution. Global SAST/history scanning remains unimplemented.
- Full remote QA: **257/257 Chromium + 16/16 Linux WebKit PASS**; both job logs inspected (121294173033 / 121295744955), exact source SHA. [Browser Actions](https://github.com/titanfit102-bit/Illyrian/actions/runs/40234873355); [security Actions](https://github.com/titanfit102-bit/Illyrian/actions/runs/40234873350) PASS, job 121294172984 log inspected.

## Preview, visual identity and performance

Immutable [Preview](https://illyrian-demo-hwa3rchfw-un24.vercel.app/), `dpl_12TbBhUTKxeWYY6EWUKNPb3R2fM1`, exact a9a380cfa570a2a07c3c7b0ae814817e630e8e99, `READY`, target null, project `illyrian-demo`, team `un24`. Authorized protected root HTTP **200**, complete same-source HTML prefix plus 163 feedback characters; **17/17 referenced CSS/JS/vendor/catalog assets HTTP 200 and source parity** at initial implementation `27da842`; 14 of these assets remain byte-unchanged at this final source. The 3 updated locale catalogs and final-source root were re-fetched: catalogs identical, root exactly matching as prefix. Includes the newly shared time helper. No global SSO/Production or anonymous-access guarantee. Physical QA must use this candidate's URL/deployment/source together, not the older Phase 1 URL.

No redesign or new animations. All 9 embedded image/brand data URIs are byte-identical to the base source. Visual review at 320×568 Light and 1280×800 Dark found mixed old community UI copy; the final correction and 3 expanded locale regressions resolve the sampled navigation/membership/disclaimer labels. Fonts/emoji on real hardware remain part of physical QA.

Performance is **INFO / OPEN**, not an approved device budget: paired same-browser Chromium 1193, 390×844, two localhost origins, 10 loads per source with alternating order, base `d32a7c5` vs final source. Medians **227.25 → 241.00 ms** (~6% higher in this noisy small sample); no speedup or performance-acceptance claim. Raw Navigation Timing ms, rounded: baseline `[380.8,232.3,219.8,203.7,195.4,284.9,213.3,295.3,533.9,222.2]`; final `[280.8,192.8,366.4,197.0,189.7,176.2,254.7,401.5,460.8,227.3]`. Earlier separate six-load runs varied considerably, motivating this paired comparison rather than attributing the difference to a specific change. Selected changed served runtime/catalog payload **803,001 → 816,997 bytes (+13,996)**. New resolver has bounded 128-entry cache and no dependency/network service. Real startup/memory/battery/media/network/assistive-tech budgets remain NOT TESTED.


## Exact next step

Keep the verified source candidate, complete actual Android/iPhone M01–M18 and targeted global UI/UGC/a11y inventory. Verify the new community loops and timezone handling on hardware, including empty/error/long-content states and optional-location behavior. Record failures before further minimal patches. P1-A11Y-01 needs the bounded visual decision; F06 needs separate administrative approval. Backend/native/recurrence/invitation delivery remain future contracts, not work authorized for automatic provisioning. No release/merge from these PASS results.
