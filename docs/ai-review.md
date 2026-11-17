# Instructions for AI-assisted changes

These are review instructions, not an executable agent or custom skill. No model API key is needed.

1. Read the README, strategy, relevant page object, scenario and existing findings.
2. State the behaviour to verify and the source of the expected result. Mark assumptions explicitly.
3. Inspect the current UI before changing selectors. Prefer user-facing roles or the existing `data-test` contract.
4. Keep the test independent. Do not add shared mutable state, fixed sleeps or forced interactions to hide a failure.
5. Run `npm run typecheck`, `npm run format:check` and affected scenarios. Inspect failure evidence before editing.
6. Distinguish product defects, environment blockers and test bugs. Never change expected behaviour simply to get a pass.
7. Record what was run, the result and remaining uncertainty. Only describe candidate review after it actually happens.
8. Review changes with the candidate before publishing. Do not submit the hiring assignment on the candidate's behalf without explicit instruction.

Useful prompt: "Review this test for independent setup, meaningful assertions, selector stability and unsupported requirements. Explain each proposed change and demonstrate the result with a real test run."
