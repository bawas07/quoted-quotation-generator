# Local Storage Layer

## Purpose

Provide a typed, prefixed wrapper around the browser `localStorage` API to centralize persistence logic and prevent key collisions.

## Requirements

### Requirement: Typed get/set/remove methods provided
The `storage` utility MUST export `get<T>`, `set<T>`, and `remove` methods that transparently add `quotify_` prefix to all keys.

#### Scenario: Set and get round-trip
- **WHEN** `storage.set('test', { name: 'hello' })` then `storage.get('test')` is called
- **THEN** `{ name: 'hello' }` is returned
- **THEN** the raw localStorage key is `quotify_test`

#### Scenario: Get missing key returns null
- **WHEN** `storage.get('nonexistent')` is called
- **THEN** `null` is returned

#### Scenario: Remove deletes key
- **WHEN** `storage.set('temp', 42)` then `storage.remove('temp')`
- **THEN** `storage.get('temp')` returns `null`

### Requirement: Corrupt JSON handled gracefully
When `get()` encounters non-JSON content, it MUST return `null` and log a warning without throwing.

#### Scenario: Corrupt value
- **WHEN** localStorage has `quotify_bad` with value `not-json{{{`
- **THEN** `storage.get('bad')` returns `null`

### Requirement: clearAll method provided
The utility MUST export `clearAll()` that removes all `quotify_`-prefixed keys without touching others.

#### Scenario: Selective clear
- **WHEN** localStorage has keys `quotify_a`, `quotify_b`, and `other_data`
- **THEN** after `storage.clearAll()`, only `other_data` remains

### Requirement: checkAvailable method provided
The utility MUST export `checkAvailable()` returning `{ available, usedMB, remainingMB }`.

#### Scenario: Storage available
- **WHEN** `checkAvailable()` is called in a normal browser
- **THEN** `available` is `true`, `usedMB` >= 0, `remainingMB` is a number
