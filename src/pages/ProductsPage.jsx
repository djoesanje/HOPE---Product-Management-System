import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRights } from '../contexts/UserRightsContext';
import { getProducts } from '../services/productService';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import SoftDeleteDialog from '../components/SoftDeleteDialog';
import PriceHistoryPanel from '../components/PriceHistoryPanel';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { currentUser } = useAuth();
  const { hasRight } = useRights();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // Stamp and action column visibility
  const showStamp = ['ADMIN', 'SUPERADMIN'].includes(currentUser?.user_type);
  const canAdd = hasRight('PRD_ADD');
  const canEdit = hasRight('PRD_EDIT');
  const canDelete = hasRight('PRD_DEL');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts(currentUser.user_type);
      setProducts(data || []);
    } catch (err) {
      console.error('Products load error:', err);
      toast.error(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.user_type]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Search filters against lowercase column names returned by Supabase
  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.prodcode || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.unit || '').toLowerCase().includes(q)
    );
  });

  const handleModalSuccess = () => {
    setShowAddModal(false);
    setEditProduct(null);
    setDeleteProduct(null);
    loadProducts();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          {canAdd && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code, description or unit..."
          className="input-field max-w-md"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-lg font-medium">No products found.</p>
            {search && (
              <p className="text-sm mt-1">Try clearing the search filter.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  {showStamp && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stamp
                    </th>
                  )}
                  {showStamp && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  )}
                  {(canEdit || canDelete) && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.prodcode}
                    className={`hover:bg-gray-50 ${
                      product.record_status === 'INACTIVE' ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm font-mono font-medium text-gray-900">
                          {product.prodcode}
                        </span>
                        <PriceHistoryPanel prodCode={product.prodcode} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.unit}
                    </td>
                    {showStamp && (
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono max-w-xs truncate">
                        {product.stamp || '—'}
                      </td>
                    )}
                    {showStamp && (
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.record_status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.record_status}
                        </span>
                      </td>
                    )}
                    {(canEdit || canDelete) && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <button
                              onClick={() => setEditProduct(product)}
                              className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                              title="Edit product"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                          {canDelete && product.record_status === 'ACTIVE' && (
                            <button
                              onClick={() => setDeleteProduct(product)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Deactivate product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={handleModalSuccess}
        />
      )}
      {deleteProduct && (
        <SoftDeleteDialog
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
