-- =====================================================
-- Sprint 3 DB Additions
-- Reports views and Admin Module RLS with SUPERADMIN guard.
-- Run this script in Supabase SQL Editor (Sprint 3).
-- Safe to re-run: DROP IF EXISTS before all CREATE statements.
-- =====================================================


-- -------------------------------------------------------
-- REP_001: current_product_price view
-- Returns each product's most recent ACTIVE price entry.
-- Originally defined in 03_triggers_and_functions.sql.
-- Recreated here so this script is self-contained and safe
-- to run even if 03 was not fully applied.
-- -------------------------------------------------------
CREATE OR REPLACE VIEW current_product_price AS
SELECT DISTINCT ON (p.prodcode)
  p.prodcode,
  p.description,
  p.unit,
  ph.unitprice,
  ph.effdate,
  p.record_status,
  p.stamp
FROM product p
LEFT JOIN pricehist ph ON p.prodcode = ph.prodcode
WHERE ph.record_status = 'ACTIVE'
ORDER BY p.prodcode, ph.effdate DESC;

GRANT SELECT ON current_product_price TO authenticated;


-- -------------------------------------------------------
-- REP_002: top_selling_products view
-- JOINs salesdetail with product, aggregates total quantity
-- sold per product, orders by totalqty DESC.
-- Used by ReportsPage.jsx for the Top Selling report.
-- -------------------------------------------------------
DROP VIEW IF EXISTS top_selling_products;

CREATE VIEW top_selling_products AS
SELECT
  sd.prodcode,
  p.description,
  p.unit,
  SUM(sd.quantity) AS totalqty
FROM salesdetail sd
JOIN product p ON sd.prodcode = p.prodcode
GROUP BY sd.prodcode, p.description, p.unit
ORDER BY totalqty DESC;

-- Grant SELECT to authenticated users.
-- REP_002 right is gated at the application layer (hasRight('REP_002')).
GRANT SELECT ON top_selling_products TO authenticated;


-- -------------------------------------------------------
-- Admin Module RLS — user table
-- Replace the existing user_update_for_admin policy with
-- admin_cannot_touch_superadmin: ADMIN can update user rows
-- only WHERE the target row's user_type is not 'SUPERADMIN'.
-- SUPERADMIN can update any user row.
--
-- USING clause checks the existing row (before update) —
-- this is the correct place to block SUPERADMIN rows from
-- being targeted, regardless of what columns are being changed.
-- -------------------------------------------------------
DROP POLICY IF EXISTS user_update_for_admin        ON "user";
DROP POLICY IF EXISTS admin_cannot_touch_superadmin ON "user";

CREATE POLICY admin_cannot_touch_superadmin ON "user"
  FOR UPDATE TO authenticated
  USING (
    public.is_admin_user(auth.uid()::text)
    AND (
      user_type != 'SUPERADMIN'
      OR public.is_superadmin_user(auth.uid()::text)
    )
  )
  WITH CHECK (
    public.is_admin_user(auth.uid()::text)
  );


-- -------------------------------------------------------
-- Admin Module RLS — UserModule_Rights table
-- Replace the existing usermodule_rights_update_for_admin
-- policy with protect_superadmin_rights: ADMIN cannot UPDATE
-- rights rows that belong to a SUPERADMIN user.
-- SUPERADMIN can update any rights row.
-- -------------------------------------------------------
DROP POLICY IF EXISTS usermodule_rights_update_for_admin ON UserModule_Rights;
DROP POLICY IF EXISTS protect_superadmin_rights          ON UserModule_Rights;

CREATE POLICY protect_superadmin_rights ON UserModule_Rights
  FOR UPDATE TO authenticated
  USING (
    public.is_admin_user(auth.uid()::text)
    AND (
      NOT EXISTS (
        SELECT 1 FROM "user"
        WHERE userid = UserModule_Rights.userid
          AND user_type = 'SUPERADMIN'
      )
      OR public.is_superadmin_user(auth.uid()::text)
    )
  );


-- -------------------------------------------------------
-- Final RLS audit note (for Sprint 3 sign-off)
-- -------------------------------------------------------
-- Confirm zero DELETE statements in any function, trigger,
-- or migration by running:
--   SELECT routine_name, routine_definition
--   FROM information_schema.routines
--   WHERE routine_definition ILIKE '%DELETE%'
--     AND routine_schema = 'public';
-- Expected: rpc_soft_delete_product appears (it uses UPDATE,
-- not DELETE) — no other routines should contain DELETE.
