import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { softDeleteProduct } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function SoftDeleteDialog({ product, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await softDeleteProduct(product.prodcode, currentUser.userId);
      toast.success(`"${product.description}" has been deactivated.`);
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to deactivate product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Deactivate Product</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600">
            Are you sure you want to deactivate{' '}
            <span className="font-semibold text-gray-900">
              {product.description}
            </span>{' '}
            ({product.prodcode})?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            The product will be hidden from regular users. It can be recovered from the Deleted Items panel.
          </p>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 btn-danger"
          >
            {loading ? 'Deactivating...' : 'Deactivate'}
          </button>
        </div>
      </div>
    </div>
  );
}
