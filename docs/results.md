# Execution results - 17 November 2026

## Verified completed runs

| Check                         | Observed result                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| Chromium regression           | 36 passed, 0 failed, 0 skipped in the first completed run (started 16:19 UTC; approximately 4.5 minutes) |
| Accessibility subset          | Five axe scans and two keyboard checks passed, included in the 36 above                                  |
| Exploratory Chromium          | 8 passed, 6 failed, 0 skipped (started 16:23 UTC; approximately 1.9 minutes)                             |
| Firefox core                  | All 12 attempts blocked at browser launch with `spawn UNKNOWN`; no app behaviour verified                |
| WebKit                        | One preflight blocked by missing Windows libraries; remaining core cases not attempted                   |
| Clean dependency installation | `npm ci` completed successfully                                                                          |
| TypeScript                    | `npm run typecheck` passed                                                                               |
| Formatting                    | `npm run format:check` passed before the final documentation additions                                   |
| GitHub Actions                | Prepared, not yet executed                                                                               |

Environment: Windows x64 (10.0.26200), Node 26.13.0, npm 11.20.0, Playwright 1.65.1, axe Playwright 4.14.0, TypeScript 7.0.2. The CI workflow selects Node 24 on Ubuntu; that environment has not yet been verified.

## Report integrity and remaining verification

A second verification run was started after formatting and strengthening the empty-order assertion. Tool access was interrupted by a usage-limit approval-review failure, and completion of that run could not subsequently be confirmed. A concurrent `--list` discovery command overwrote the default JSON report with a discovery-only result (60 skipped). That JSON must not be presented as an executed test result or as evidence for the 36 passes above. The completed first-run counts were observed in the terminal output.

Before submission, execute a fresh final run and retain its reports without running `--list` against the same report destination. Verify the final documentation formatting too. The exploratory report currently describes the earlier completed run; rerun the strengthened empty-order test before claiming it was verified in its final form.

## What the findings mean

The six exploratory failures comprise three whitespace-only customer-field cases, empty-order completion and two special-persona sorting cases. The eight passes include observation-only tests: they mean evidence was collected, not that questionable input is acceptable. See [findings](findings.md) for reproduction steps and requirement questions.

Name sorting could not be reproduced as faulty for `standard_user` in the completed Chromium run. It failed for `problem_user` and `error_user`. Cross-browser compatibility remains unverified because of local launch blockers. Automated accessibility passes do not establish full WCAG compliance.

The project is suitable for review and repository creation, but final report regeneration, successful CI execution and the candidate walkthrough remain pre-submission tasks. Nothing has been submitted to the hiring team.
