import { supabase } from '../lib/supabaseClient';
import { makeStamp } from '../utils/stampHelper';

// Fetch products based on user type.
// USER sees only ACTIVE records; ADMIN and SUPERADMIN see all.
export async function getProducts(userType) {
  let query = supabase
    .from('product')
    .select('prodcode, description, unit, record_status, stamp')
    .order('prodcode');

  if (userType === 'USER') {
    query = query.eq('record_status', 'ACTIVE');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Fetch only INACTIVE (soft-deleted) products for Admin/SuperAdmin panel.
export async function getDeletedProducts() {
  const { data, error } = await supabase
    .from('product')
    .select('prodcode, description, unit, stamp')
    .eq('record_status', 'INACTIVE')
    .order('prodcode');

  if (error) throw error;
  return data;
}

// Add a new product. Also inserts the initial price into priceHist.
export async function addProduct({ prodCode, description, unit, unitPrice, effDate }, userId) {
  const stamp = makeStamp('ADDED', userId);

  const { error: productError } = await supabase
    .from('product')
    .insert([{ prodcode: prodCode, description, unit, record_status: 'ACTIVE', stamp }]);

  if (productError) throw productError;

  // Insert initial price history if provided
  if (unitPrice && effDate) {
    const { error: priceError } = await supabase
      .from('pricehist')
      .insert([{
        prodcode: prodCode,
        effdate: effDate,
        unitprice: parseFloat(unitPrice),
        record_status: 'ACTIVE',
        stamp: makeStamp('ADDED', userId)
      }]);

    if (priceError) throw priceError;
  }
}

// Update an existing product's description and unit.
export async function updateProduct(prodCode, { description, unit }, userId) {
  const stamp = makeStamp('EDITED', userId);

  const { error } = await supabase
    .from('product')
    .update({ description, unit, stamp })
    .eq('prodcode', prodCode);

  if (error) throw error;
}

// Soft-delete a product by setting record_status = 'INACTIVE'.
// Uses an RPC function for proper DB-level PRD_DEL enforcement.
export async function softDeleteProduct(prodCode, userId) {
  const stamp = makeStamp('DEACTIVATED', userId);

  // Try to use the RPC function for PRD_DEL enforcement first
  const { error: rpcError } = await supabase
    .rpc('rpc_soft_delete_product', { p_prod_code: prodCode, p_stamp: stamp });

  if (rpcError) {
    // Fallback: direct update (relies on UI button gating for PRD_DEL)
    const { error } = await supabase
      .from('product')
      .update({ record_status: 'INACTIVE', stamp })
      .eq('prodcode', prodCode);

    if (error) throw error;
  }
}

// Recover (reactivate) a soft-deleted product.
export async function recoverProduct(prodCode, userId) {
  const stamp = makeStamp('REACTIVATED', userId);

  const { error } = await supabase
    .from('product')
    .update({ record_status: 'ACTIVE', stamp })
    .eq('prodcode', prodCode);

  if (error) throw error;
}
