# Test Plan

## Unit Tests
- Placement validator:
  - before/between/after placement correctness
  - equal exact date accepted
  - equal year accepted in year mode
- Recognition normalization:
  - case-insensitive
  - punctuation-insensitive
  - alias matching
- Token accounting:
  - skip consumes 1
  - challenge consumes 1
  - buy consumes 3
  - cap at 5

## Integration Tests
- Room lifecycle:
  - create -> join -> start
- Turn lifecycle:
  - deal -> place -> challenge -> reveal -> next turn
- Challenge collision:
  - duplicate claimed position rejected
- Authorization:
  - non-member cannot read private deck/cards

## End-To-End
- Shared-screen 4-player match completion.
- Disconnect/reconnect with snapshot sync.
- Host disconnect triggers migration.
- Late challenge blocked after reveal lock.

## Acceptance Criteria Mapping
- Authoritative outcomes protected: unit+integration+e2e.
- Ruleset parity with spec: unit+integration.
- Private media access control: integration security suite.
- Complete multiplayer game finish: e2e happy path.

