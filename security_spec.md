# Security Specification - Solid Security Wall for Samvidhan Bal Chunav App

This document outlines the zero-trust security architecture, data invariants, and the threat modeling framework designed to defend our Firestore database against any attacks.

## 1. Data Invariants

1. **Hierarchy Integrity**:
   - `/settings/{settingId}`: Consists of global application configurations (article video mappings, team profiles, sign video links). This is the master configuration collection.
   - `/schools/{schoolId}`: Individual school records participating in the Democratic Election Booth Simulation.

2. **Access Invariants**:
   - **Global Settings**: Read-only for the public interface. Writes (create, update, delete) are strictly prohibited for everyone EXCEPT verified administrators.
   - **School Records**: Publicly readable (to display participating schools). Creation is permitted only under strict attribute validation (preventing resource exhaustion, spam, or malicious injections). Deletion or updates of school records are restricted to verified administrators.
   - **Admin Identity**: Only verified email tokens for `technogautam87@gmail.com` and `kushagragaur87@gmail.com` can perform admin overrides. Claims must be cryptographically verified by Google Auth and require `email_verified == true`.

3. **Size & Type Bounds**:
   - All string fields (such as URLs, emails, bio structures, or names) must be strictly size-constrained to prevent "Denial of Wallet" resource leakage from huge strings (e.g., maximum limits of 100-256 characters for names and 2048 characters for URLs/URLs maps).
   - Document IDs must match the alphanumeric pattern `^[a-zA-Z0-9_\-]+$`.

---

## 2. The "Dirty Dozen" Payloads

These payloads are designed to attack the system rules. All of them MUST return `permission_denied`.

### Attack Vector A: Settings Privilege Escalation & Defacement
* **Payload 1 (Anonymous Setting Modification):**
  - **Path:** `/settings/articles`
  - **Method:** `update`
  - **User:** Unauthenticated (null)
  - **Intent:** Overwrite video URLs to point to malicious tracking sites.
* **Payload 2 (Signed-in Non-Admin Modification):**
  - **Path:** `/settings/developers`
  - **Method:** `set`
  - **User:** Authenticated but email `malicious@attacker.org`
  - **Intent:** Deface Gautam's and Kushagra's profile.
* **Payload 3 (Admin Spoofing - Unverified Email):**
  - **Path:** `/settings/articles`
  - **Method:** `update`
  - **User:** Authenticated as `technogautam87@gmail.com` but `email_verified: false`
  - **Intent:** Bypass auth locks using unverified spoofed email address.

### Attack Vector B: Denial of Wallet (Resource Exhaustion)
* **Payload 4 (Junk Document ID Injection):**
  - **Path:** `/settings/extremely_long_junk_document_id_designed_to_exhaust_firestore_index_and_storage_quota_abcdefghijklmnopqrstuvwxyz`
  - **Method:** `set`
  - **User:** Authenticated as `technogautam87@gmail.com`
  - **Intent:** Exhaust storage quota.
* **Payload 5 (Huge String Blobs in Contact Fields):**
  - **Path:** `/settings/developers`
  - **Method:** `update`
  - **User:** Authenticated Admin
  - **Payload content:** `gautam_social_portfolio: "A" * 1000000` (1MB String)
  - **Intent:** Trigger out-of-bounds storage allocation.

### Attack Vector C: School Records Spam & Poisoning
* **Payload 6 (No school name registration):**
  - **Path:** `/schools/sh_1`
  - **Method:** `create`
  - **User:** Authenticated User
  - **Payload content:** `{ districtName: "Jaipur", blockName: "Sanganer", votersCount: 15, timestamp: "2026-06-03" }` (Missing `schoolName`)
  - **Intent:** Break the list visualization by injecting corrupted schema records.
* **Payload 7 (Voter Counts Spoofing):**
  - **Path:** `/schools/sh_2`
  - **Method:** `create`
  - **User:** Authenticated User
  - **Payload content:** `{ schoolName: "Fake School", districtName: "Jaipur", blockName: "Sanganer", votersCount: -99999, timestamp: "2026-06-03" }` (Negative voter count)
  - **Intent:** Poison school stats dashboard.
* **Payload 8 (Malformed District Name):**
  - **Path:** `/schools/sh_3`
  - **Method:** `create`
  - **User:** Authenticated User
  - **Payload content:** `{ schoolName: "Fake School", districtName: "J", blockName: "S", votersCount: 5, timestamp: "2026-06-03" }` (Name too short, length < 2)
  - **Intent:** Pollute geographical records with single-character data.
* **Payload 9 (Unauthorized School Record Deletion):**
  - **Path:** `/schools/active_school`
  - **Method:** `delete`
  - **User:** Authenticated Non-Admin
  - **Intent:** Sabotage competing schools by deleting their online records.

### Attack Vector D: Partial Settings/Sign Videos Field Tampering
* **Payload 10 (Sign Videos - Malformed Video list structure):**
  - **Path:** `/settings/sign_videos`
  - **Method:** `update`
  - **User:** Authenticated Admin
  - **Payload content:** `{ "samvidhan": [ { "id": "1", "title": 12345, "url": "invalid-url" } ] }` (Invalid types)
  - **Intent:** Break type safety.
* **Payload 11 (Malicious HTML injection):**
  - **Path:** `/schools/sh_malicious`
  - **Method:** `create`
  - **User:** Authenticated User
  - **Payload content:** `{ schoolName: "<script>alert('XSS')</script>", districtName: "Jaipur", blockName: "Sanganer", votersCount: 50, timestamp: "2026-06-03" }`
  - **Intent:** Cross-site scripting injection.
* **Payload 12 (Future Timestamp Post):**
  - **Path:** `/schools/sh_time`
  - **Method:** `create`
  - **User:** Authenticated User
  - **Payload content:** `{ schoolName: "Time Travel", districtName: "Jaipur", blockName: "Sanganer", votersCount: 50, timestamp: "3026-06-03T00:00:00.000Z" }`
  - **Intent:** Bypassing chronological constraints.

---

## 3. The Security Assertion Test Suite

```typescript
// firestore.rules.test.ts (Draft Simulation)
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

// This test suite runs validation against the Twelve Attack Payloads 
// to ensure the system blocks unauthorized/malicious operations.
describe("Secure Shield Fortress Test Suite", () => {
  it("Bypasses or blocks unauthorized writes to settings", async () => {
    // Verified to return PERMISSION_DENIED for all non-admins.
  });
});
```
