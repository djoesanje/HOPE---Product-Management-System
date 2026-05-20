-- =====================================================
-- Row Level Security (RLS) Policies
-- Run this script fourth in Supabase SQL Editor
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE Module ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module ENABLE ROW LEVEL SECURITY;
ALTER TABLE rights ENABLE ROW LEVEL SECURITY;
ALTER TABLE UserModule_Rights ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE priceHist ENABLE ROW LEVEL SECURITY;

-- USER table policies
CREATE POLICY user_select_own ON "user"
  FOR SELECT TO authenticated
  USING (userId = auth.uid()::text);

CREATE POLICY user_select_all_for_admin ON "user"
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user
      WHERE userId = auth.uid()::text
      AND user_type IN ('ADMIN', 'SUPERADMIN')
    )
  );

CREATE POLICY user_update_for_admin ON "user"
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user
      WHERE userId = auth.uid()::text
      AND user_type IN ('ADMIN', 'SUPERADMIN')
    )
  )
  WITH CHECK (
    -- ADMIN cannot modify SUPERADMIN accounts
    user_type != 'SUPERADMIN' OR
    EXISTS (
      SELECT 1 FROM public.user
      WHERE userId = auth.uid()::text
      AND user_type = 'SUPERADMIN'
    )
  );

-- Module table policies (read-only for all authenticated users)
CREATE POLICY module_select_all ON Module
  FOR SELECT TO authenticated
  USING (record_status = 'ACTIVE');

-- user_module policies
CREATE POLICY user_module_select_own ON user_module
  FOR SELECT TO authenticated
  USING (userid = auth.uid()::text);

CREATE POLICY user_module_select_all_for_admin ON user_module
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user
      WHERE userId = auth.uid()::text
      AND user_type IN ('ADMIN', 'SUPERADMIN')
    )
  );

-- rights table policies (read-only for all authenticated users)
CREATE POLICY rights_select_all ON rights
  FOR SELECT TO authenticated
  USING (record_status = 'ACTIVE');

-- UserModule_Rights policies
CREATE POLICY usermodule_rights_select_own ON UserModule_Rights
  FOR SELECT TO authenticated
  USING (userid = auth.uid()::text);

CREATE POLICY usermodule_rights_select_all_for_admin ON UserModule_Rights
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user
      WHERE userId = auth.uid()::text
      AND user_type IN ('ADMIN', 'SUPERADMIN')
    )
  );

CREATE POLICY usermodule_rights_update_for_admin ON UserModule_Rights
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user
      WHERE userId = auth.uid()::text
      AND user_type IN ('ADMIN', 'SUPERADMIN')
    )
  )
  WITH CHECK (
    -- ADMIN cannot modify SUPERADMIN rights
    NOT EXISTS (
      SELECT 1 FROM public.user
      WHERE userId = userid
      AND user_type = 'SUPERADMIN'
    ) OR
    EXISTS (
      SELECT 1 FROM public.user
      WHERE userId = auth.uid()::text
      AND user_type = 'SUPERADMIN'
    )
  );

-- PRODUCT table policies
CREATE POLICY product_select_active_for_user ON product
  FOR SELECT TO authenticated
  USING (
    record_status = 'ACTIVE' OR
    EXISTS (
      SELECT 1 FROM public.user
      WHERE userId = auth.uid()::text
      AND user_type IN ('ADMIN', 'SUPERADMIN')
    )
  );

CREATE POLICY product_insert_with_right ON product
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

-- Note: No DELETE policy - soft deletes only via UPDATE

-- PRICEHIST table policies
CREATE POLICY pricehist_select_active ON priceHist
  FOR SELECT TO authenticated
  USING (
    record_status = 'ACTIVE' OR
    EXISTS (
      SELECT 1 FROM public.user
      WHERE userId = auth.uid()::text
      AND user_type IN ('ADMIN', 'SUPERADMIN')
    )
  );

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
