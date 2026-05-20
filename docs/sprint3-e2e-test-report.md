# Sprint 3 Final E2E Test Report

## M5 — QA / Documentation Specialist

## Objective

Verify the final production version of the Hope Product Management System through end-to-end testing. This report covers user access, rights enforcement, SUPERADMIN protection, Google OAuth production testing, and major system features.

---

## Test Environment

| Item | Details |
|---|---|
| App Environment | Production / Live App |
| Browser Used | Google Chrome |
| Tester | Rhoben Echaluse |
| Test Date | May 20, 2026 |
| Live URL | https://hope-product-management-system.vercel.app/login |

---

## Test Accounts

| User Type | Account Used | Purpose |
|---|---|---|
| USER | rhoben.echaluse@neu.edu.ph | Regular user testing |
| ADMIN | Not provided | Admin-level testing |
| SUPERADMIN | Superadmin@example.com | Full access and protection testing |

---

# E2E Test Cases

| Test ID | User Type | Feature | Test Scenario | Expected Result | Actual Result | Status | Remarks |
|---|---|---|---|---|---|---|---|
| E2E-001 | USER | Login | Login using valid USER account | USER should login successfully | USER logged in successfully | ✅ Pass | Working as expected |
| E2E-002 | ADMIN | Login | Login using valid ADMIN account | ADMIN should login successfully | Not tested because no ADMIN account was provided | ⬜ Pending | Requires ADMIN test account |
| E2E-003 | SUPERADMIN | Login | Login using valid SUPERADMIN account | SUPERADMIN should login successfully | SUPERADMIN logged in successfully | ✅ Pass | Working as expected |
| E2E-004 | USER | Products | USER views product list | USER should only see allowed product records | USER can see the products in the Products section | ✅ Pass | Product list is accessible |
| E2E-005 | ADMIN | Products | ADMIN views product list | ADMIN should see admin-accessible product records | Not tested because no ADMIN account was provided | ⬜ Pending | Requires ADMIN test account |
| E2E-006 | SUPERADMIN | Products | SUPERADMIN views product list | SUPERADMIN should see all allowed product records | SUPERADMIN can see the products in the Products section | ✅ Pass | Working as expected |
| E2E-007 | USER | Rights | USER attempts restricted actions | Restricted buttons/pages should be hidden or blocked | USER can access Products and Reports | ⚠️ Partial | Needs verification if all visible reports are allowed for USER |
| E2E-008 | ADMIN | Rights | ADMIN attempts admin-level actions | ADMIN should access only allowed features | Not tested because no ADMIN account was provided | ⬜ Pending | Requires ADMIN test account |
| E2E-009 | SUPERADMIN | Rights | SUPERADMIN accesses full features | SUPERADMIN should access all allowed features | SUPERADMIN can access Products, Reports, and Deleted Items | ✅ Pass | Working as expected |
| E2E-010 | ADMIN | SUPERADMIN Protection | ADMIN attempts to modify SUPERADMIN account | System should block the action in UI and database level | Not tested because no ADMIN account was provided | ⬜ Pending | Requires ADMIN test account |
| E2E-011 | SUPERADMIN | Admin Module | SUPERADMIN checks user management | User management should load correctly | Not tested / Admin Module was not accessible or not available during testing | ⬜ Pending | Needs confirmation if Admin Module is implemented |
| E2E-012 | USER | Reports | USER checks reports access | USER should only see allowed report links | USER can access Products and Reports | ⚠️ Partial | Needs confirmation if USER should access all visible reports |
| E2E-013 | ADMIN | Reports | ADMIN checks reports access | ADMIN should only see allowed report links | Not tested because no ADMIN account was provided | ⬜ Pending | Requires ADMIN test account |
| E2E-014 | SUPERADMIN | Reports | SUPERADMIN checks reports access | SUPERADMIN should see allowed report links | SUPERADMIN can access Products, Reports, and Deleted Items | ✅ Pass | Working as expected |
| E2E-015 | New User | Google OAuth | Login/register using Google OAuth in production | Google OAuth should complete successfully | Google sign-in button is available, but authentication returns an error after selecting an account | ❌ Fail | Google OAuth production redirect/configuration needs checking |

---

# SUPERADMIN Protection Test

| Test ID | Tester Role | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| SA-001 | ADMIN | Try to deactivate SUPERADMIN | Action should be blocked | Not tested because no ADMIN account was provided | ⬜ Pending |
| SA-002 | ADMIN | Try to edit SUPERADMIN rights | Action should be blocked | Not tested because no ADMIN account was provided | ⬜ Pending |
| SA-003 | SUPERADMIN | View own account row | SUPERADMIN row should be protected from modification | Not tested / User Management page was not accessible or not available during testing | ⬜ Pending |

---

# Google OAuth Production Test

| Test ID | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| OAuth-001 | Click Google sign-in on live app | Redirects to Google login | Google sign-in button is available and clickable | ✅ Pass |
| OAuth-002 | Complete Google authentication | Redirects back to app successfully | Google authentication returns an error after choosing an account | ❌ Fail |
| OAuth-003 | New Google user account created | User is created with correct default status/rights | Not completed because Google OAuth flow returned an error | ❌ Fail |

---

# Bugs Found

| Bug ID | Description | Severity | Status | Remarks |
|---|---|---|---|---|
| BUG-S3-001 | Google OAuth production login returns an error after selecting a Google account | High | Open | Check Supabase Auth settings, Google OAuth credentials, and production redirect URL |
| BUG-S3-002 | ADMIN account was not provided, so ADMIN-related E2E and SUPERADMIN protection tests could not be completed | Medium | Open | Requires valid ADMIN test account |
| BUG-S3-003 | Admin/User Management module was not accessible or not available during testing | Medium | Open | Needs confirmation if Admin Module is implemented and linked |

---

# Final QA Summary

Sprint 3 E2E testing was partially completed using the available USER and SUPERADMIN accounts. USER and SUPERADMIN login, product access, and visible navigation were tested successfully. However, ADMIN-related tests could not be completed because no ADMIN account was provided.

Google OAuth production testing failed after selecting a Google account, which indicates that the OAuth redirect or provider configuration may need review. Some Admin Module and SUPERADMIN protection tests also remain pending because User Management was not accessible or not available during testing.

Overall, the system is partially verified, with remaining issues documented for team review.