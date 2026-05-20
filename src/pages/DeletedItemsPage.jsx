import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, RefreshCw, Archive } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDeletedProducts, recoverProduct } from '../services/productService';
import toast from 'react-hot-toast';

export default function DeletedItemsPage() {
  const { currentUser } = useAuth();

  // Block USER accounts at the page level (route guard also handles this)
  if (!['ADMIN', 'SUPERADMIN'].includes(currentUser?.user_type)) {
    return <Navigate to="/products" replace />;
  }

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recoveringCode, setRecoveringCode] = useState(null);
  const [search, setSearch] = useState('');

  const loadDeletedProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDeletedProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Deleted products load error:', err);
      toast.error(err.message || 'Failed to load deleted products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeletedProducts();
  }, [loadDeletedProducts]);

  const handleRecover = async (product) => {
    setRecoveringCode(product.prodcode);
    try {
      await recoverProduct(product.prodcode, currentUser.userId);
      toast.success(`"${product.description}" has been reactivated.`);
      await loadDeletedProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to recover product.');
    } finally {
      setRecoveringCode(null);
    }
  };

  // Supabase returns column names in lowercase (prodcode, not prodCode)
  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.prodcode || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="h-6 w-6 text-gray-500" />
            <h1 className="text-2xl font-bold text-gray-900">Deleted Items</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} deactivated product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={loadDeletedProducts}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors self-start"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        These products are deactivated (soft-deleted) and hidden from regular users.
        Use <strong>Recover</strong> to restore a product to active status.
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or description..."
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
            <Archive className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">No deleted products found.</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stamp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.prodcode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">
                      {product.prodcode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.unit}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono max-w-xs truncate">
                      {product.stamp || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRecover(product)}
                        disabled={recoveringCode === product.prodcode}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Recover product"
                      >
                        <RotateCcw className="h-3 w-3" />
                        {recoveringCode === product.prodcode ? 'Recovering...' : 'Recover'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
