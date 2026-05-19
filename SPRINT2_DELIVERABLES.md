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

Verify that product soft-delete, deleted item visibility, recovery, API bypass protection, and stamp column visibility work correctly based on user type.

---

## Soft Delete and Visibility Test Cases

| Test ID | Feature | User Type | Test Scenario | Steps | Expected Result | Actual Result | Status | Remarks |
|---|---|---|---|---|---|---|---|---|
| SD-001 | Soft Delete | SUPERADMIN | Soft-delete an active product | Login as SUPERADMIN → Go to Products page → Select active product → Click Delete/Soft Delete → Confirm action | Product record_status should become INACTIVE | Pending | ⬜ | Requires SUPERADMIN account |
| SD-002 | Soft Delete Restriction | USER | USER attempts to soft-delete a product | Login as USER → Go to Products page → Check delete button/action | Delete button should not be visible or delete action should be blocked | Pending | ⬜ | USER should not have PRD_DEL |
| SD-003 | Soft Delete Restriction | ADMIN | ADMIN attempts to soft-delete a product | Login as ADMIN → Go to Products page → Check delete button/action | Delete button should not be visible or delete action should be blocked | Pending | ⬜ | ADMIN should not have PRD_DEL |
| SD-004 | USER Visibility | USER | USER checks product list after soft-delete | Login as USER → Open Products page | INACTIVE product should not appear in the product list | Pending | ⬜ | Verifies ACTIVE-only visibility |
| SD-005 | Deleted Items Visibility | ADMIN | ADMIN views deleted items | Login as ADMIN → Open Deleted Items page | INACTIVE product should appear in Deleted Items | Pending | ⬜ | ADMIN can view deleted records |
| SD-006 | Deleted Items Visibility | SUPERADMIN | SUPERADMIN views deleted items | Login as SUPERADMIN → Open Deleted Items page | INACTIVE product should appear in Deleted Items | Pending | ⬜ | SUPERADMIN can view deleted records |
| SD-007 | Recovery | ADMIN | ADMIN recovers a soft-deleted product | Login as ADMIN → Open Deleted Items page → Click Recover | Product record_status should become ACTIVE again | Pending | ⬜ | Recovered product should return to normal product list |
| SD-008 | Recovery Verification | USER | USER checks recovered product | Login as USER → Open Products page | Recovered product should appear again in product list | Pending | ⬜ | Confirms successful recovery |
| SD-009 | API Bypass Protection | USER | USER attempts to access inactive products without UI filter | Attempt direct product query without ACTIVE filter | RLS should still block INACTIVE rows from USER | Pending | ⬜ | Verifies database-level protection |
| SD-010 | Stamp Visibility | USER | USER checks product table columns | Login as USER → Open Products page | Stamp column should be hidden | Pending | ⬜ | USER should not see stamp |
| SD-011 | Stamp Visibility | ADMIN | ADMIN checks product table columns | Login as ADMIN → Open Products page | Stamp column should be visible | Pending | ⬜ | ADMIN should see stamp |
| SD-012 | Stamp Visibility | SUPERADMIN | SUPERADMIN checks product table columns | Login as SUPERADMIN → Open Products page | Stamp column should be visible | Pending | ⬜ | SUPERADMIN should see stamp |

---

## PR-02 QA Summary

| Item | Result |
|---|---|
| Soft-delete test cases prepared | Pending execution |
| Recovery test cases prepared | Pending execution |
| API bypass test case prepared | Pending execution |
| Stamp visibility test cases prepared | Pending execution |
| Final status | Pending live/system testing |

---

## Notes

- These test cases are prepared based on Sprint 2 requirements.
- Actual Result and Status columns will be updated after testing the completed Sprint 2 features.
- Some tests require valid USER, ADMIN, and SUPERADMIN accounts.

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