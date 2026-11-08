# Contributing to WISE

Thank you for helping improve WISE. Contributions should prioritize user safety, privacy, accessibility, and clear documentation.

## Before you start

1. Search the existing issues and pull requests.
2. Open an issue before a large behavioral or architectural change.
3. Do not include real phone numbers, device addresses, credentials, or other personal data in code, screenshots, tests, or logs.

## Development workflow

1. Fork the repository and create a focused branch.
2. Serve the repository with a local static server.
3. Make the smallest coherent change that solves the issue.
4. Run `npm test`.
5. Test keyboard navigation and the narrow mobile layout when changing the UI.
6. Open a pull request explaining the problem, solution, testing, and any safety implications.

## Pull-request expectations

- Keep unrelated changes out of the pull request.
- Add or update tests for behavior changes.
- Document user-visible changes.
- Never claim that a request reached a device when the browser cannot verify the device response.
- Do not weaken local-network URL restrictions without a documented threat-model review.

All contributions are submitted under the repository's MIT License.
