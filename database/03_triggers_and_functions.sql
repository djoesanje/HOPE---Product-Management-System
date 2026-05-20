-- =====================================================
-- Triggers and Functions
-- Run this script third in Supabase SQL Editor
-- =====================================================

-- Auto-provisioning trigger for new users
CREATE OR REPLACE FUNCTION provision_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_username TEXT;
BEGIN
  -- Use Google display name or fall back to email prefix
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  -- Only provision if not already in the user table
  IF NOT EXISTS (SELECT 1 FROM public.user WHERE userId = NEW.id::text) THEN
    INSERT INTO public.user (userId, username, lastName, firstName, user_type, record_status, stamp)
    VALUES (
      NEW.id::text,
      v_username,
      COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
      COALESCE(NEW.raw_user_meta_data->>'firstName', v_username),
      'USER',
      'INACTIVE',
      'REGISTERED ' || NEW.id::text || ' ' || NOW()::text
    );

    -- Default module access
    INSERT INTO user_module (userid, Module_ID, rights_value, record_status, stamp) VALUES
      (NEW.id::text, 'Prod_Mod', 1, 'ACTIVE', 'AUTO'),
      (NEW.id::text, 'Report_Mod', 1, 'ACTIVE', 'AUTO'),
      (NEW.id::text, 'Adm_Mod', 0, 'ACTIVE', 'AUTO');

    -- Default rights
    INSERT INTO UserModule_Rights (userid, Right_ID, Right_value, Record_status, Stamp) VALUES
      (NEW.id::text, 'PRD_ADD', 1, 'ACTIVE', 'AUTO'),
      (NEW.id::text, 'PRD_EDIT', 1, 'ACTIVE', 'AUTO'),
      (NEW.id::text, 'PRD_DEL', 0, 'ACTIVE', 'AUTO'),
      (NEW.id::text, 'REP_001', 1, 'ACTIVE', 'AUTO'),
      (NEW.id::text, 'REP_002', 0, 'ACTIVE', 'AUTO'),
      (NEW.id::text, 'ADM_USER', 0, 'ACTIVE', 'AUTO');
  END IF;

  RETURN NEW;
END; $$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION provision_new_user();

-- View for current product prices
CREATE OR REPLACE VIEW current_product_price AS
SELECT DISTINCT ON (p.prodCode)
  p.prodCode,
  p.description,
  p.unit,
  ph.unitPrice,
  ph.effDate,
  p.record_status,
  p.stamp
FROM product p
LEFT JOIN priceHist ph ON p.prodCode = ph.prodCode
WHERE ph.record_status = 'ACTIVE'
ORDER BY p.prodCode, ph.effDate DESC;
