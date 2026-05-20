import { useState, useEffect, useCallback } from 'react';
import { BarChart3, FileText, TrendingUp, Download, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useRights } from '../contexts/UserRightsContext';
import { getProductListReport, getTopSellingReport } from '../services/reportService';
import toast from 'react-hot-toast';

// ─── CSV export helper ──────────────────────────────────────────────────────
function exportToCsv(filename, rows, columns) {
  const header = columns.map((c) => c.label).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const val = row[c.key] ?? '';
          // Wrap in quotes if value contains a comma, quote, or newline
          const str = String(val);
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Sortable column hook ───────────────────────────────────────────────────
function useSortedData(data) {
  const [sortKey, setSortKey] = useState('prodcode');
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...(data || [])].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-40" />;
    return sortDir === 'asc'
      ? <ArrowUp className="h-3.5 w-3.5 ml-1 text-primary-600" />
      : <ArrowDown className="h-3.5 w-3.5 ml-1 text-primary-600" />;
  };

  return { sorted, sortKey, sortDir, toggleSort, SortIcon };
}

// ─── REP_001 — Product List with Current Price ──────────────────────────────
function ProductReportSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { sorted, toggleSort, SortIcon } = useSortedData(products);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProductListReport();
      setProducts(data || []);
    } catch (err) {
      console.error('REP_001 load error:', err);
      toast.error(err.message || 'Failed to load product report.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReport(); }, [loadReport]);

  const filtered = sorted.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.prodcode || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.unit || '').toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error('No data to export.');
      return;
    }
    exportToCsv('product_list_report.csv', filtered, [
      { key: 'prodcode',    label: 'Product Code' },
      { key: 'description', label: 'Description' },
      { key: 'unit',        label: 'Unit' },
      { key: 'unitprice',   label: 'Unit Price' },
      { key: 'effdate',     label: 'Effective Date' },
    ]);
    toast.success(`Exported ${filtered.length} row${filtered.length !== 1 ? 's' : ''}.`);
  };

  const ThBtn = ({ col, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
      onClick={() => toggleSort(col)}
    >
      <span className="inline-flex items-center">
        {children}
        <SortIcon col={col} />
      </span>
    </th>
  );

  return (
    <section id="rep001" className="mb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">REP_001 — Product List with Current Price</h2>
            <p className="text-sm text-gray-500">{products.length} active product{products.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadReport}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleExport}
            disabled={loading || filtered.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code, description, or unit..."
          className="input-field max-w-md"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">
              {search ? 'No products match your search.' : 'No products found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <ThBtn col="prodcode">Code</ThBtn>
                  <ThBtn col="description">Description</ThBtn>
                  <ThBtn col="unit">Unit</ThBtn>
                  <ThBtn col="unitprice">Unit Price</ThBtn>
                  <ThBtn col="effdate">Effective Date</ThBtn>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((p) => (
                  <tr key={p.prodcode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">
                      {p.prodcode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{p.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {p.unitprice != null
                        ? `₱${Number(p.unitprice).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {p.effdate || <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── REP_002 — Top Selling Products ─────────────────────────────────────────
function TopSellingSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTopSellingReport(10);
      setProducts(data || []);
    } catch (err) {
      console.error('REP_002 load error:', err);
      toast.error(err.message || 'Failed to load top selling report.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReport(); }, [loadReport]);

  // Compute max quantity for the bar chart scale
  const maxQty = products.length > 0 ? Math.max(...products.map((p) => Number(p.totalqty))) : 1;

  return (
    <section id="rep002">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">REP_002 — Top Selling Products</h2>
            <p className="text-sm text-gray-500">Ranked by total quantity sold</p>
          </div>
        </div>
        <button
          onClick={loadReport}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <TrendingUp className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">No sales data found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    Rank
                  </th>
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
                    Total Qty Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Bar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((p, idx) => {
                  const barWidth = Math.round((Number(p.totalqty) / maxQty) * 100);
                  return (
                    <tr key={p.prodcode} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-bold text-gray-500">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">
                        {p.prodcode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.unit}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {Number(p.totalqty).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                          <div
                            className="h-4 rounded-full bg-primary-500 transition-all"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ReportsPage ─────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const { hasRight, loading: rightsLoading } = useRights();

  const canRep001 = hasRight('REP_001');
  const canRep002 = hasRight('REP_002');

  if (rightsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  // If user has no report rights at all, redirect them away
  if (!canRep001 && !canRep002) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-gray-500" />
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      </div>

      {canRep001 && <ProductReportSection />}
      {canRep002 && <TopSellingSection />}
    </div>
  );
}
