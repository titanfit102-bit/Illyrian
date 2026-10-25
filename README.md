# ILLYRIAN

**Social, community and marketplace platform.** Current repository work is the **v1.7 static browser DEMO**, not a released Android/iOS app, live backend or real payment platform. It uses fictional content and browser `localStorage`.

## Start here — canonical documents

| Purpose | Existing source |
| --- | --- |
| Live checkpoint, authorization and open blockers | [CURRENT_STATE.md](CURRENT_STATE.md) |
| Full handoff, decisions and exact next steps | [MASTER_HANDOFF.md](MASTER_HANDOFF.md) |
| Current DEMO features, Shop and roadmap | [DEMO v1.7 roadmap](demo/ILLYRIAN_v1.7_SHOP_AND_ROADMAP.md) |
| Future real app: product, domain/API design, threat and performance gates | [Product architecture blueprint](architecture/ILLYRIAN_PRODUCT_V1_BLUEPRINT.md) |
| Internationalization architecture | [ILLyRIAN i18n](architecture/ILLYRIAN_I18N.md) |
| Source for v1.7 DEMO | [DEMO HTML](demo/ILLYRIAN_DEMO_v1.7.html) |
| Browser QA | [GitHub Actions](.github/workflows/illyrian-v17-browser-qa.yml) and [Playwright configuration](playwright.config.cjs) |
| Manual mobile/accessibility release gate | [M01–M18 acceptance](docs/DEMO_V1_7_DEVICE_QA_ACCEPTANCE.md) and [test worksheet](docs/DEMO_V1_7_PHYSICAL_QA_SESSION.md) |
| Pending integration required checks | [F06 proposal — owner approval needed](docs/F06_REQUIRED_CHECKS_DECISION.md) |
| Agent development constraints | [AGENTS.md](AGENTS.md) |

## Current delivery boundary

Work on `feat/i18n-shop-feedback-20261022` through [Draft PR #1](https://github.com/titanfit102-bit/Illyrian/pull/1) into `demo/v1.7-illyrian-shop`. Verify LIVE GitHub HEAD and the current checkpoint before changing anything. The documented foundation for the real APK/AAB is **planning only** until separately authorized, implemented and tested.

**No automatic merge or release.** Physical Android/iPhone testing, actual TalkBack/VoiceOver, F06 branch-rule enforcement and owner sign-off remain necessary. Do not place passwords, tokens or private personal information in this public repository.
