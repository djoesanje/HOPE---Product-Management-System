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
| RM-001 | USER | PRD_ADD | Allowed | Add Product button was visible and USER was able to add a product successfully | ✅ Pass | Working as expected |
| RM-002 | USER | PRD_EDIT | Allowed | Edit button was visible and USER was able to update product details successfully | ✅ Pass | Working as expected |
| RM-003 | USER | PRD_DEL | Not Allowed | Delete/Soft Delete button was hidden for USER | ✅ Pass | Correctly restricted |
| RM-004 | USER | REP_001 | Allowed | Product Report page was accessible for USER | ✅ Pass | Working as expected |
| RM-005 | USER | REP_002 | Not Allowed | USER was able to see/access Top Selling Reports | ❌ Fail | Expected REP_002 to be hidden or blocked for USER |
| RM-006 | USER | ADM_USER | Not Allowed | Admin/User Management page was not visible in the sidebar | ✅ Pass | Correctly restricted |

---

# PR-02 — test/sprint2-softdelete-visibility

## Objective

Verify that product soft-delete, deleted item visibility, recovery, API bypass protection, and stamp column visibility work correctly based on user type.

---

## Soft Delete and Visibility Test Cases

| Test ID | Feature | User Type | Test Scenario | Steps | Expected Result | Actual Result | Status | Remarks |
|---|---|---|---|---|---|---|---|---|
| SD-001 | Soft Delete | SUPERADMIN | Soft-delete an active product | Login as SUPERADMIN → Go to Products page → Select active product → Click Delete/Soft Delete → Confirm action | Product record_status should become INACTIVE | SUPERADMIN was able to soft-delete the product. The product disappeared from the active product list and became recoverable. | ✅ Pass | Working as expected |
| SD-002 | Soft Delete Restriction | USER | USER attempts to soft-delete a product | Login as USER → Go to Products page → Check delete button/action | Delete button should not be visible or delete action should be blocked | USER cannot see the Delete/Soft Delete button. Only SUPERADMIN can access the delete action. | ✅ Pass | Correctly restricted |
| SD-003 | Soft Delete Restriction | ADMIN | ADMIN attempts to soft-delete a product | Login as ADMIN → Go to Products page → Check delete button/action | Delete button should not be visible or delete action should be blocked | ADMIN cannot use the Delete/Soft Delete action. Only SUPERADMIN can access it. | ✅ Pass | Correctly restricted |
| SD-004 | USER Visibility | USER | USER checks product list after soft-delete | Login as USER → Open Products page | INACTIVE product should not appear in the product list | USER cannot see the soft-deleted product in the Products page. | ✅ Pass | ACTIVE-only visibility works |
| SD-005 | Deleted Items Visibility | ADMIN | ADMIN views deleted items | Login as ADMIN → Open Deleted Items page | INACTIVE product should appear in Deleted Items | ADMIN cannot see the soft-deleted product in Deleted Items. Only SUPERADMIN can see it. | ❌ Fail | Expected ADMIN to view deleted records, but only SUPERADMIN can access them |
| SD-006 | Deleted Items Visibility | SUPERADMIN | SUPERADMIN views deleted items | Login as SUPERADMIN → Open Deleted Items page | INACTIVE product should appear in Deleted Items | SUPERADMIN can see the soft-deleted product in Deleted Items. | ✅ Pass | Working as expected |
| SD-007 | Recovery | ADMIN | ADMIN recovers a soft-deleted product | Login as ADMIN → Open Deleted Items page → Click Recover | Product record_status should become ACTIVE again | ADMIN cannot recover the soft-deleted product. Only SUPERADMIN can recover it. | ❌ Fail | Expected ADMIN recovery, but system allows only SUPERADMIN |
| SD-008 | Recovery Verification | USER | USER checks recovered product | Login as USER → Open Products page | Recovered product should appear again in product list | After SUPERADMIN recovered the product, USER was able to see the product again in the Products page. | ✅ Pass | Recovery reflected correctly for USER |
| SD-009 | API Bypass Protection | USER | USER attempts to access inactive products without UI filter | Attempt direct product query without ACTIVE filter | RLS should still block INACTIVE rows from USER | Not tested because direct API/RLS verification needs DB/API access. | ⬜ Pending | Requires database/API access |
| SD-010 | Stamp Visibility | USER | USER checks product table columns | Login as USER → Open Products page | Stamp column should be hidden | USER can see the stamp column in the Products page. | ❌ Fail | Expected stamp column to be hidden for USER |
| SD-011 | Stamp Visibility | ADMIN | ADMIN checks product table columns | Login as ADMIN → Open Products page | Stamp column should be visible | ADMIN can see the stamp column in the Products page. | ✅ Pass | Working as expected |
| SD-012 | Stamp Visibility | SUPERADMIN | SUPERADMIN checks product table columns | Login as SUPERADMIN → Open Products page | Stamp column should be visible | SUPERADMIN can see the stamp column in the Products page. | ✅ Pass | Working as expected |

---

## PR-02 QA Summary

| Item | Result |
|---|---|
| Soft-delete test cases prepared | Completed |
| Recovery test cases prepared | Completed |
| API bypass test case prepared | Prepared, but pending DB/API access |
| Stamp visibility test cases prepared | Completed |
| Final status | Partially completed — live/system testing executed, with some failed cases documented |

## PR-02 Testing Notes

Soft-delete and visibility testing was executed using USER, ADMIN, and SUPERADMIN accounts. Most restrictions worked as expected, but some issues were found: ADMIN cannot view/recover deleted items even though expected, and USER can see the stamp column even though it should be hidden. API bypass testing remains pending because it requires direct DB/API access.

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
| May 20, 2026 | Prepared Sprint 2 rights matrix | Completed | Added 18-case rights test matrix for USER, ADMIN, and SUPERADMIN |
| May 20, 2026 | Prepared soft-delete visibility test cases | Completed | Added soft-delete, recovery, API bypass, and stamp visibility cases |
| May 20, 2026 | Reviewed Sprint 2 QA requirements | Completed | Based on Sprint 2 deliverables and M5 QA responsibilities |
| May 20, 2026 | Executed USER rights matrix testing | Partially completed | USER rights were tested; REP_002 issue was found |
| May 20, 2026 | Executed soft-delete and visibility testing | Completed | Tested using USER, ADMIN, and SUPERADMIN accounts |
| May 20, 2026 | API bypass testing | Pending | Requires direct DB/API or RLS verification access |

---

## Sprint 2 QA Summary

During Sprint 2, the QA / Documentation role focused on preparing and executing test documentation for rights enforcement, product soft-delete behavior, recovery behavior, API bypass protection, and stamp column visibility.

The rights matrix testing was started by verifying USER permissions. Soft-delete and visibility testing was executed using USER, ADMIN, and SUPERADMIN accounts. Several expected behaviors passed, but some issues were found and documented for review.

---

## Bugs Found

| Bug ID | Description | Severity | Status | Remarks |
|---|---|---|---|---|
| BUG-S2-001 | USER can access Top Selling Reports even though REP_002 is expected to be Not Allowed | Medium | Open | Expected REP_002 to be hidden or blocked for USER |
| BUG-S2-002 | ADMIN cannot view soft-deleted products in Deleted Items even though expected result says ADMIN should see them | Medium | Open | Only SUPERADMIN can view deleted items |
| BUG-S2-003 | ADMIN cannot recover soft-deleted products even though expected result says ADMIN should recover them | Medium | Open | Only SUPERADMIN can recover soft-deleted products |
| BUG-S2-004 | USER can see the stamp column even though it should be hidden | Medium | Open | Stamp column should only be visible to ADMIN and SUPERADMIN |

---

## Blockers

| Blocker | Description | Status |
|---|---|---|
| API bypass testing | Direct API/RLS verification requires DB/API access or guidance from the DB Engineer | Open |
| Remaining rights matrix testing | ADMIN and SUPERADMIN rights matrix rows still need to be fully verified if not yet tested | Open |

---

## Next Steps

- Complete remaining ADMIN and SUPERADMIN rights matrix testing.
- Confirm whether REP_002 should be visible to USER or not.
- Confirm whether Deleted Items and recovery should be ADMIN + SUPERADMIN or SUPERADMIN only.
- Verify API bypass protection with help from the DB Engineer.
- Confirm stamp column visibility requirement and fix if needed.
- Update Actual Result and Status columns after remaining tests are completed.