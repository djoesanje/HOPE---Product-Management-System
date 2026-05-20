-- =====================================================
-- Sprint 2 RLS Additions
-- Provides DB-level enforcement of PRD_DEL right for
-- soft deletes, and a review of existing product policies.
-- Run this script in Supabase SQL Editor (Sprint 2).
--
-- NOTE on casing: PostgreSQL folds unquoted identifiers
-- to lowercase. Tables created without double-quotes
-- (e.g. UserModule_Rights, priceHist) are stored as
-- usermodule_rights and pricehist respectively.
-- All references below use unquoted names to match.
-- =====================================================

-- Helper: check if calling user has a specific right
CREATE OR REPLACE FUNCTION public.user_has_right(p_right_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM UserModule_Rights
    WHERE userid = auth.uid()::text
      AND Right_ID = p_right_id
      AND Right_value = 1
      AND Record_status = 'ACTIVE'
  );
$$;

-- RPC function: soft-delete a product.
-- Only succeeds if the calling user has PRD_DEL = 1.
-- This enforces PRD_DEL at the database level, since
-- RLS UPDATE policies cannot distinguish which column is changing.
CREATE OR REPLACE FUNCTION public.rpc_soft_delete_product(
  p_prod_code TEXT,
  p_stamp     TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check PRD_DEL right
  IF NOT public.user_has_right('PRD_DEL') THEN
    RAISE EXCEPTION 'Access denied: PRD_DEL right required to deactivate products.';
  END IF;

  UPDATE product
  SET record_status = 'INACTIVE',
      stamp = p_stamp
  WHERE prodCode = p_prod_code
    AND record_status = 'ACTIVE';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found or already inactive: %', p_prod_code;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.rpc_soft_delete_product(TEXT, TEXT) TO authenticated;

-- -------------------------------------------------------
-- Refresh product UPDATE policy to ensure PRD_EDIT gate.
-- Drop-and-recreate is safe (idempotent).
-- -------------------------------------------------------

DROP POLICY IF EXISTS product_update_with_right ON product;

CREATE POLICY product_update_with_right ON product
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM UserModule_Rights
      WHERE userid = auth.uid()::text
        AND Right_ID = 'PRD_EDIT'
        AND Right_value = 1
        AND Record_status = 'ACTIVE'
    )
  );

-- -------------------------------------------------------
-- Refresh priceHist INSERT / UPDATE policies.
-- Table is stored as 'pricehist' (PostgreSQL lowercases it).
-- -------------------------------------------------------

DROP POLICY IF EXISTS pricehist_insert_with_right ON priceHist;
DROP POLICY IF EXISTS pricehist_update_with_right ON priceHist;

CREATE POLICY pricehist_insert_with_right ON priceHist
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM UserModule_Rights
      WHERE userid = auth.uid()::text
        AND Right_ID = 'PRD_ADD'
        AND Right_value = 1
        AND Record_status = 'ACTIVE'
    )
  );

CREATE POLICY pricehist_update_with_right ON priceHist
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM UserModule_Rights
      WHERE userid = auth.uid()::text
        AND Right_ID = 'PRD_EDIT'
        AND Right_value = 1
        AND Record_status = 'ACTIVE'
    )
  );

-- Note: No DELETE policies on product or priceHist —
-- soft deletes only via UPDATE / rpc_soft_delete_product.
