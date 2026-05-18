import { supabase } from '../lib/supabaseClient';
import { makeStamp } from '../utils/stampHelper';

// Fetch all ACTIVE price history entries for a product, most recent first.
export async function getPriceHistory(prodCode) {
  const { data, error } = await supabase
    .from('pricehist')
    .select('effdate, prodcode, unitprice, record_status, stamp')
    .eq('prodcode', prodCode)
    .eq('record_status', 'ACTIVE')
    .order('effdate', { ascending: false });

  if (error) throw error;
  return data;
}

// Add a new price history entry.
export async function addPriceEntry(prodCode, effDate, unitPrice, userId) {
  const stamp = makeStamp('ADDED', userId);

  const { error } = await supabase
    .from('pricehist')
    .insert([{
      prodcode: prodCode,
      effdate: effDate,
      unitprice: parseFloat(unitPrice),
      record_status: 'ACTIVE',
      stamp
    }]);

  if (error) throw error;
}

// Get the current (most recent) price for a product.
export async function getCurrentPrice(prodCode) {
  const { data, error } = await supabase
    .from('pricehist')
    .select('unitprice, effdate')
    .eq('prodcode', prodCode)
    .eq('record_status', 'ACTIVE')
    .order('effdate', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
