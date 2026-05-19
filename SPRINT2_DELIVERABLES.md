# Sprint 2 Deliverables

## M5 — QA / Documentation Specialist

Sprint 2 focuses on product CRUD, rights enforcement, soft-delete visibility, recovery, API bypass verification, and stamp visibility testing.

---

# PR-01 — test/sprint2-rights-matrix

## Objective

Verify that each user type has the correct access rights based on the Sprint 2 rights matrix.

## Rights Tested

| Right ID | Description |
|---|---|
| PRD_ADD | Product Add |
| PRD_EDIT | Product Edit |
| PRD_DEL | Product Delete / Soft Delete |
| REP_001 | Product Report Listing |
| REP_002 | Product Top Selling Report |
| ADM_USER | Admin User Management |

---

## 18-Case Rights Test Matrix

| Test ID | User Type | Right ID | Expected Result | Actual Result | Status | Remarks |
|---|---|---|---|---|---|---|
| RM-001 | USER | PRD_ADD | Allowed |  | ⬜ |  |
| RM-002 | USER | PRD_EDIT | Allowed |  | ⬜ |  |
| RM-003 | USER | PRD_DEL | Not Allowed |  | ⬜ |  |
| RM-004 | USER | REP_001 | Allowed |  | ⬜ |  |
| RM-005 | USER | REP_002 | Not Allowed |  | ⬜ |  |
| RM-006 | USER | ADM_USER | Not Allowed |  | ⬜ |  |
| RM-007 | ADMIN | PRD_ADD | Allowed |  | ⬜ |  |
| RM-008 | ADMIN | PRD_EDIT | Allowed |  | ⬜ |  |
| RM-009 | ADMIN | PRD_DEL | Not Allowed |  | ⬜ |  |
| RM-010 | ADMIN | REP_001 | Allowed |  | ⬜ |  |
| RM-011 | ADMIN | REP_002 | Not Allowed |  | ⬜ |  |
| RM-012 | ADMIN | ADM_USER | Not Allowed |  | ⬜ |  |
| RM-013 | SUPERADMIN | PRD_ADD | Allowed |  | ⬜ |  |
| RM-014 | SUPERADMIN | PRD_EDIT | Allowed |  | ⬜ |  |
| RM-015 | SUPERADMIN | PRD_DEL | Allowed |  | ⬜ |  |
| RM-016 | SUPERADMIN | REP_001 | Allowed |  | ⬜ |  |
| RM-017 | SUPERADMIN | REP_002 | Allowed |  | ⬜ |  |
| RM-018 | SUPERADMIN | ADM_USER | Allowed |  | ⬜ |  |

---

# PR-02 — test/sprint2-softdelete-visibility

## Objective

Verify that soft-delete, recovery, API bypass protection, and stamp visibility behave correctly.

## Soft Delete and Visibility Test Cases

| Test ID | Scenario | Steps | Expected Result | Actual Result | Status | Remarks |
|---|---|---|---|---|---|---|
| SD-001 | SUPERADMIN soft-deletes a product | Login as SUPERADMIN → Select product → Click Delete/Soft Delete | Product record_status becomes INACTIVE |  | ⬜ |  |
| SD-002 | USER cannot see INACTIVE product | Login as USER → Open Products page | Soft-deleted product should not appear |  | ⬜ |  |
| SD-003 | ADMIN can see INACTIVE product in Deleted Items | Login as ADMIN → Open Deleted Items page | INACTIVE product should appear |  | ⬜ |  |
| SD-004 | ADMIN recovers product | Login as ADMIN → Click Recover | Product becomes ACTIVE again |  | ⬜ |  |
| SD-005 | USER can see recovered product | Login as USER → Open Products page | Recovered product should appear again |  | ⬜ |  |
| SD-006 | Direct API bypass test | USER attempts to access products without ACTIVE filter | RLS should still block INACTIVE rows |  | ⬜ |  |
| SD-007 | USER stamp visibility | Login as USER → Open Products page | Stamp column should be hidden |  | ⬜ |  |
| SD-008 | ADMIN stamp visibility | Login as ADMIN → Open Products page | Stamp column should be visible |  | ⬜ |  |

---

# PR-03 — docs/sprint2-log

## Sprint 2 QA Log

| Date | Task Done | Result | Notes |
|---|---|---|---|
|  | Created Sprint 2 rights matrix | Pending testing |  |
|  | Created soft-delete visibility test cases | Pending testing |  |
|  | Prepared Sprint 2 QA documentation | Pending review |  |

---

## Bugs Found

| Bug ID | Description | Severity | Status | Remarks |
|---|---|---|---|---|
| None | No bugs reported yet | - | - | - |

---

## Blockers

| Blocker | Description | Status |
|---|---|---|
| Pending live testing | Some tests require the live app or completed Sprint 2 features | Open |

---

## Next Steps

- Run rights matrix tests using USER, ADMIN, and SUPERADMIN accounts.
- Verify product soft-delete behavior.
- Verify recovery behavior.
- Confirm RLS protection against direct API bypass.
- Confirm stamp column visibility based on user type.
- Update Actual Result and Status columns after testing.