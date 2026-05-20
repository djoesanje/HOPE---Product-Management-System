import { supabase } from '../lib/supabaseClient';
import { makeStamp } from '../utils/stampHelper';

// Fetch all users for the Admin Module.
// RLS policy user_select_all_for_admin restricts this to ADMIN and SUPERADMIN callers.
export async function getUsers() {
  const { data, error } = await supabase
    .from('user')
    .select('userid, username, lastname, firstname, user_type, record_status')
    .order('username');

  if (error) throw error;
  return data;
}

// Activate or deactivate a user account.
// Passes a stamp for audit trail.
// Sprint 3 RLS policy (admin_cannot_touch_superadmin) blocks any attempt
// to update a row where the target user's user_type is 'SUPERADMIN'.
export async function toggleUserStatus(userId, newStatus, adminUserId) {
  const action = newStatus === 'ACTIVE' ? 'ACTIVATED' : 'DEACTIVATED';
  const stamp = makeStamp(action, adminUserId);

  const { error } = await supabase
    .from('user')
    .update({ record_status: newStatus, stamp })
    .eq('userid', userId);

  if (error) throw error;
}
