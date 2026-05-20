import { supabase } from '../lib/supabaseClient';

// REP_001: Product listing with current price.
// Queries the current_product_price view (defined in 03_triggers_and_functions.sql).
// Returns only ACTIVE products with their most recent active price entry.
export async function getProductListReport() {
  const { data, error } = await supabase
    .from('current_product_price')
    .select('prodcode, description, unit, unitprice, effdate')
    .eq('record_status', 'ACTIVE')
    .order('prodcode');

  if (error) throw error;
  return data;
}

// REP_002: Top-selling products by total quantity sold.
// Queries the top_selling_products view (defined in 07_sprint3_additions.sql).
// Returns products ranked by SUM(salesdetail.quantity) DESC, limited to top 10.
export async function getTopSellingReport(limit = 10) {
  const { data, error } = await supabase
    .from('top_selling_products')
    .select('prodcode, description, unit, totalqty')
    .limit(limit);

  if (error) throw error;
  return data;
}
