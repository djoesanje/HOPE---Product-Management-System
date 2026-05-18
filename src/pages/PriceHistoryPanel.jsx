import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { getPriceHistory, addPriceEntry } from '../services/priceHistService';
import { useAuth } from '../contexts/AuthContext';
import { useRights } from '../contexts/UserRightsContext';
import toast from 'react-hot-toast';

export default function PriceHistoryPanel({ prodCode }) {
  const { currentUser } = useAuth();
  const { hasRight } = useRights();
  const [expanded, setExpanded] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({
    effDate: new Date().toISOString().slice(0, 10),
    unitPrice: '',
  });
  const [addError, setAddError] = useState('');

  const canEditPrice = hasRight('PRD_EDIT');

  useEffect(() => {
    if (expanded) {
      loadHistory();
    }
  }, [expanded]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getPriceHistory(prodCode);
      setPriceHistory(data || []);
    } catch (err) {
      toast.error('Failed to load price history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleToggle = () => {
    setExpanded(!expanded);
    if (!expanded) setShowAddForm(false);
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newEntry.effDate) {
      setAddError('Effective date is required.');
      return;
    }
    if (!newEntry.unitPrice || isNaN(parseFloat(newEntry.unitPrice)) || parseFloat(newEntry.unitPrice) <= 0) {
      setAddError('Unit price must be a positive number.');
      return;
    }

    setAddLoading(true);
    try {
      await addPriceEntry(prodCode, newEntry.effDate, newEntry.unitPrice, currentUser.userId);
      toast.success('Price entry added.');
      setNewEntry({ effDate: new Date().toISOString().slice(0, 10), unitPrice: '' });
      setShowAddForm(false);
      await loadHistory();
    } catch (err) {
      toast.error(err.message || 'Failed to add price entry.');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        Price History
      </button>

      {expanded && (
        <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
          {loadingHistory ? (
            <div className="p-3 text-center text-xs text-gray-500">Loading...</div>
          ) : priceHistory.length === 0 ? (
            <div className="p-3 text-center text-xs text-gray-500">No price history found.</div>
          ) : (
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Effective Date</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Supabase returns column names lowercase: effdate, unitprice, prodcode */}
                {priceHistory.map((entry) => (
                  <tr key={`${entry.effdate}-${entry.prodcode}`} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-700">{entry.effdate}</td>
                    <td className="px-3 py-2 text-right text-gray-700">
                      ₱{parseFloat(entry.unitprice).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {canEditPrice && (
            <div className="border-t border-gray-200">
              {!showAddForm ? (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Add Price Entry
                </button>
              ) : (
                <form onSubmit={handleAddEntry} className="p-3 space-y-2">
                  {addError && <p className="text-xs text-red-600">{addError}</p>}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Effective Date
                      </label>
                      <input
                        type="date"
                        value={newEntry.effDate}
                        onChange={(e) => setNewEntry({ ...newEntry, effDate: e.target.value })}
                        className="input-field text-xs"
                        disabled={addLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        value={newEntry.unitPrice}
                        onChange={(e) => setNewEntry({ ...newEntry, unitPrice: e.target.value })}
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        className="input-field text-xs"
                        disabled={addLoading}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setAddError(''); }}
                      disabled={addLoading}
                      className="flex-1 px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addLoading}
                      className="flex-1 px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                    >
                      {addLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
