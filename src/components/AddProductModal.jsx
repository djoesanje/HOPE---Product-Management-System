import { useState } from 'react';
import { X } from 'lucide-react';
import { addProduct } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AddProductModal({ onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    prodCode: '',
    description: '',
    unit: '',
    unitPrice: '',
    effDate: new Date().toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.prodCode.trim()) errs.prodCode = 'Product code is required.';
    if (form.prodCode.trim().length > 6) errs.prodCode = 'Product code must be 6 characters or fewer.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.unit.trim()) errs.unit = 'Unit is required.';
    if (form.unitPrice && isNaN(parseFloat(form.unitPrice))) errs.unitPrice = 'Price must be a number.';
    if (form.unitPrice && parseFloat(form.unitPrice) <= 0) errs.unitPrice = 'Price must be greater than 0.';
    if (form.unitPrice && !form.effDate) errs.effDate = 'Effective date is required when price is provided.';
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
      await addProduct(
        {
          prodCode: form.prodCode.trim().toUpperCase(),
          description: form.description.trim(),
          unit: form.unit.trim(),
          unitPrice: form.unitPrice || null,
          effDate: form.unitPrice ? form.effDate : null,
        },
        currentUser.userId
      );
      toast.success('Product added successfully.');
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Product</h2>
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
              Product Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="prodCode"
              value={form.prodCode}
              onChange={handleChange}
              maxLength={6}
              className="input-field"
              placeholder="e.g. AB0001"
              disabled={loading}
            />
            {errors.prodCode && <p className="mt-1 text-xs text-red-600">{errors.prodCode}</p>}
          </div>

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
              placeholder="e.g. Keyboard, Mechanical RGB"
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

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500 mb-3">Initial Price (optional)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={form.unitPrice}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.unitPrice && <p className="mt-1 text-xs text-red-600">{errors.unitPrice}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Date
                </label>
                <input
                  type="date"
                  name="effDate"
                  value={form.effDate}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                />
                {errors.effDate && <p className="mt-1 text-xs text-red-600">{errors.effDate}</p>}
              </div>
            </div>
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
              {loading ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
