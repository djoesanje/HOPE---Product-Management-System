# Sprint 3 Final E2E Test Report

## M5 — QA / Documentation Specialist

## Objective

Verify the final production version of the Hope Product Management System through end-to-end testing. This report covers user access, rights enforcement, SUPERADMIN protection, Google OAuth production testing, and major system features.

---

## Test Environment

| Item | Details |
|---|---|
| App Environment | Production / Live App |
| Browser Used | Chrome / Edge |
| Tester | Robin |
| Test Date |  |
| Live URL |  |

---

## Test Accounts

| User Type | Account Used | Purpose |
|---|---|---|
| USER |  | Regular user testing |
| ADMIN |  | Admin-level testing |
| SUPERADMIN |  | Full access and protection testing |

---

# E2E Test Cases

| Test ID | User Type | Feature | Test Scenario | Expected Result | Actual Result | Status | Remarks |
|---|---|---|---|---|---|---|---|
| E2E-001 | USER | Login | Login using valid USER account | USER should login successfully | Pending | ⬜ |  |
| E2E-002 | ADMIN | Login | Login using valid ADMIN account | ADMIN should login successfully | Pending | ⬜ |  |
| E2E-003 | SUPERADMIN | Login | Login using valid SUPERADMIN account | SUPERADMIN should login successfully | Pending | ⬜ |  |
| E2E-004 | USER | Products | USER views product list | USER should only see allowed product records | Pending | ⬜ |  |
| E2E-005 | ADMIN | Products | ADMIN views product list | ADMIN should see admin-accessible product records | Pending | ⬜ |  |
| E2E-006 | SUPERADMIN | Products | SUPERADMIN views product list | SUPERADMIN should see all allowed product records | Pending | ⬜ |  |
| E2E-007 | USER | Rights | USER attempts restricted actions | Restricted buttons/pages should be hidden or blocked | Pending | ⬜ |  |
| E2E-008 | ADMIN | Rights | ADMIN attempts admin-level actions | ADMIN should access only allowed features | Pending | ⬜ |  |
| E2E-009 | SUPERADMIN | Rights | SUPERADMIN accesses full features | SUPERADMIN should access all allowed features | Pending | ⬜ |  |
| E2E-010 | ADMIN | SUPERADMIN Protection | ADMIN attempts to modify SUPERADMIN account | System should block the action in UI and database level | Pending | ⬜ |  |
| E2E-011 | SUPERADMIN | Admin Module | SUPERADMIN checks user management | User management should load correctly | Pending | ⬜ |  |
| E2E-012 | USER | Reports | USER checks reports access | USER should only see allowed report links | Pending | ⬜ |  |
| E2E-013 | ADMIN | Reports | ADMIN checks reports access | ADMIN should only see allowed report links | Pending | ⬜ |  |
| E2E-014 | SUPERADMIN | Reports | SUPERADMIN checks reports access | SUPERADMIN should see allowed report links | Pending | ⬜ |  |
| E2E-015 | New User | Google OAuth | Login/register using Google OAuth in production | Google OAuth should complete successfully | Pending | ⬜ |  |

---

# SUPERADMIN Protection Test

| Test ID | Tester Role | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| SA-001 | ADMIN | Try to deactivate SUPERADMIN | Action should be blocked | Pending | ⬜ |
| SA-002 | ADMIN | Try to edit SUPERADMIN rights | Action should be blocked | Pending | ⬜ |
| SA-003 | SUPERADMIN | View own account row | SUPERADMIN row should be protected from modification | Pending | ⬜ |

---

# Google OAuth Production Test

| Test ID | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| OAuth-001 | Click Google sign-in on live app | Redirects to Google login | Pending | ⬜ |
| OAuth-002 | Complete Google authentication | Redirects back to app successfully | Pending | ⬜ |
| OAuth-003 | New Google user account created | User is created with correct default status/rights | Pending | ⬜ |

---

# Bugs Found

| Bug ID | Description | Severity | Status | Remarks |
|---|---|---|---|---|
| None | No bugs reported yet | - | - | Testing pending |

---

# Final QA Summary

Final E2E testing is prepared for Sprint 3. Actual results will be updated after testing the live production app with USER, ADMIN, and SUPERADMIN accounts.