# Execution results - 17 November 2026

## GitHub Actions verification

[Run 1](https://github.com/vinnz-lab/foundation-health-qa-assignment/actions/runs/44161598009) completed successfully against commit `fd32aa6d1a7e6fd6133ee7f81451b28982d87783` on Ubuntu with Node 24. The test step finished at 19:44 UTC.

| Check                         | Result                                                         |
| ----------------------------- | -------------------------------------------------------------- |
| Chromium                      | 36 passed                                                      |
| Firefox core                  | 12 passed                                                      |
| WebKit core                   | 12 passed                                                      |
| Total regression              | **60 passed in 35.1 seconds**, no failures or retries reported |
| Clean dependency installation | Passed                                                         |
| TypeScript                    | Passed                                                         |
| Formatting                    | Passed                                                         |
| Report upload                 | Passed                                                         |

The Chromium checks include five axe scans and two keyboard checks. The optional exploratory job was not selected in this push-triggered run; its skipped job status does not mean regression cases were skipped.

[Download the regression evidence](https://github.com/vinnz-lab/foundation-health-qa-assignment/actions/runs/44161598009/artifacts/14362839020): HTML, JSON and JUnit reports. Artifact retention ends 1 December 2026. The run logs also record the test outcomes. These results apply to the linked source commit; later documentation-only updates do not alter the tested code.

## Local execution history and limitations

The first completed Windows Chromium run at 16:19 UTC passed all 36 cases. The initial exploratory run at 16:23 UTC reported 8 passes and 6 failures. Firefox could not launch locally (`spawn UNKNOWN`), and a WebKit preflight found missing system libraries. Both browser engines subsequently passed their core cases on Ubuntu CI.

After reconnection, the exploratory rerun reported **6 passed and 8 failed**: the same six finding-related failures plus two navigation timeouts before the punctuation-postcode and markup-like-input investigations began. The strengthened empty-order assertion was verified: the application displayed order confirmation for an empty cart. The two navigation timeouts are not new data-validation defects.

The fresh local Chromium regression run finished with **34 passed and 2 failed** in 4.4 minutes; see the [local evidence summary](../evidence/test-results-summary.json). Page-load timeouts affected the checkout-error accessibility scan and keyboard-login case before their accessibility assertions ran. The page snapshots showed the login form while navigation awaited the load event. These two cases passed in CI; the precise local loading cause remains unconfirmed. Do not classify those timeouts as accessibility violations.

An earlier interrupted run produced an overwritten discovery-only report. It is not used as execution evidence. The successful CI run above is the reproducible verification reference.

## Interpretation and next steps

The six finding-related exploratory failures cover three whitespace-only customer fields, empty-order completion and sorting for two deliberately problematic demo personas. Passing observation tests means evidence was collected, not that questionable input is acceptable. See [findings](findings.md).

The suspected name-sorting fault for `standard_user` was not reproduced. All four sorting modes passed on all three CI engines. Automated accessibility passes do not establish full WCAG compliance, and WebKit is not real-device Safari certification.

Before submission, complete the [candidate walkthrough](walkthrough.md), review the findings and ensure the candidate can explain and modify the tests. Nothing has been submitted to the hiring team.
