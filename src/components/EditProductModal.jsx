import { useState } from 'react';
import { X } from 'lucide-react';
import { updateProduct } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function EditProductModal({ product, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  // Supabase returns column names in lowercase (prodcode, not prodCode)
  const [form, setForm] = useState({
    description: product.description || '',
    unit: product.unit || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.unit.trim()) errs.unit = 'Unit is required.';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      // product.prodcode is lowercase because PostgreSQL folds unquoted identifiers
      await updateProduct(
        product.prodcode,
        { description: form.description.trim(), unit: form.unit.trim() },
        currentUser.userId
      );
      toast.success('Product updated successfully.');
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Product</h2>
            <p className="text-sm text-gray-500 mt-1">{product.prodcode}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={35}
              className="input-field"
              disabled={loading}
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              maxLength={4}
              className="input-field"
              placeholder="pc / unit"
              disabled={loading}
            />
            {errors.unit && <p className="mt-1 text-xs text-red-600">{errors.unit}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
