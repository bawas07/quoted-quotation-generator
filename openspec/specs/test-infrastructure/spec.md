# Test Infrastructure

## Purpose

Configure Vitest with jsdom environment and establish test coverage for the localStorage utility layer.

## Requirements

### Requirement: Vitest configured with jsdom
`vitest.config.ts` MUST configure jsdom environment. `package.json` SHALL include `"test": "vitest run"` and `"test:watch": "vitest"` scripts.

#### Scenario: Tests executable
- **WHEN** `npm test` runs
- **THEN** vitest discovers and executes test files

### Requirement: localStorage utility tested
Tests MUST cover `get` (happy path, missing key, corrupt JSON), `set` (round-trip, overwrite), `remove`, prefix behavior, `clearAll`, and `checkAvailable`.

#### Scenario: All tests pass
- **WHEN** `npm test` runs
- **THEN** all localStorage tests pass with zero failures
