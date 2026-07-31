# Netlify Release Guide

This is the single source of truth for production-release capacity for every site in Shayne's Personal Netlify team. The allowance is **team-wide**, not per repository or site. A successful production deploy costs 15 credits; Deploy Previews and branch deploys do not consume production-deploy credits.

## Sites and production branches

| Repository | Netlify site | Production branch |
| --- | --- | --- |
| `SMcGregor199/business_card` | `shayne-business-card` | `main` |
| `SMcGregor199/malcolmipsum` | `malcolm-x-ipsum` | `main` |
| `SMcGregor199/EllisonOS-BE` | `ellison-ai-be` | `main` |
| `SMcGregor199/EllisonOS-FE` | `theellisonaiproject-fe` | `main` |
| `SMcGregor199/notion2github-BE` | `shaynemcgregordev-be` | `main` |
| `SMcGregor199/notion2github-FE` | `thunderous-crepe-b85eb1` (`shaynemcgregor.dev`) | `main` |

`xml-feed-gen` is not a Netlify site. `career-inventory` is not Netlify-hosted, but its resume publisher opens release PRs against this frontend repository and therefore follows this guide.

The July 27, 2026 Netlify team audit found all six active sites above; each exposes a `main--…netlify.app` branch URL. Confirm in each site's **Build & deploy > Continuous deployment** settings that `main` remains its production branch. Add any future Personal-team site to the table before it can be released.

## Shared production-deploy budget

The current billing-cycle allowance is **20 more production deploys**. Future billing cycles allow **30 production deploys per month** (up to 450 credits). The release owner must check Netlify **Usage & billing** weekly and immediately before every release batch; that live usage is authoritative.

Do not infer an account-wide remaining balance from this file. The table records only releases made under this policy. At the shared cap, freeze every production merge for every team site until the Netlify billing cycle resets.

| Billing cycle | Allowance | Releases recorded under this policy | Remaining | Last checked | Owner / notes |
| --- | ---: | ---: | ---: | --- | --- |
| Jul 21–Aug 20, 2026 | 20 | 7 | 13 | 2026-07-30 | 322 credits available after frontend PR #14 production deploy; seven successful production deploys recorded. |
| Future monthly cycle | 30 | 0 | 30 | Reset only after the Netlify billing reset | Start a new row for each billing cycle. |

### Production release log

Add exactly one row after each successful production deployment. A release batch may contain more than one repository; record one row for each site deployment, because each successful production deploy consumes one shared slot.

| Date (UTC) | Repository / site | PR | Netlify production deploy | Cycle count after deploy | Verified by |
| --- | --- | --- | --- | ---: | --- |
| 2026-07-27 | `notion2github-BE` / `shaynemcgregordev-be` | #8 | Ready (`6a67962e50d9a5000843fe33`) | 1 | Shayne |
| 2026-07-27 | `notion2github-FE` / `thunderous-crepe-b85eb1` | #7 | Ready (`6a6796851773ac000854ef46`) | 2 | Shayne |
| 2026-07-27 | `notion2github-FE` / `thunderous-crepe-b85eb1` | #9 | Ready (`6a67bb0fcc7a5f0008ee20c9`) | 3 | Shayne |
| 2026-07-29 | `notion2github-BE` / `shaynemcgregordev-be` | #9 | Ready (`6a6a28848bf0b300087750f6`) | 4 | Shayne |
| 2026-07-30 | `notion2github-BE` / `shaynemcgregordev-be` | #10 | Ready (`6a6bdcd394d4050008e4a9e5`) | 5 | Shayne |
| 2026-07-30 | `notion2github-FE` / `thunderous-crepe-b85eb1` | #12 | Ready (`6a6bdcde338ee60008427fcb`) | 6 | Shayne |
| 2026-07-30 | `notion2github-FE` / `thunderous-crepe-b85eb1` | #14 | Ready (`6a6be4c19dbf260008b9d1f1`) | 7 | Shayne |

## Required release workflow

1. Protect `main` in every repository in the site inventory: require a pull request before merging, require the `Netlify Deploy Preview` check when GitHub exposes it, and block direct pushes (including force pushes and branch deletion). Do not grant bypasses for ordinary releases.
2. Work on a feature branch and open a PR. Browser-visible changes must be reviewed on its Netlify Deploy Preview. Preview and branch deploys are free of production-deploy credit usage.
3. Batch approved PRs deliberately. Before merging, check the live team usage, reserve one shared slot per production deployment in the batch, and confirm the counter will remain at or below the applicable cap.
4. Merge only the planned release-batch PRs into `main`. There is no urgent-release exception: changes wait for the next planned batch.
5. Confirm the production deploy succeeded, then add one row to the release log and update the current-cycle count and remaining allowance. If the deploy did not succeed, record the failure in the PR and do not consume a counter slot.

## Non-deployment commits

Use `[skip netlify]` only for exceptional commits that are intentionally non-deploying, such as a counter-only update after a production release. Do not use it to bypass preview review, the shared cap, or the planned-batch rule. Confirm in Netlify that the commit was skipped before treating it as credit-free.

The resume publishing automation follows this rule by opening a frontend release PR instead of pushing to `main`; include it in a normal release batch and review its Deploy Preview before merging.
