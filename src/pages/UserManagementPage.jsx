import { useState, useEffect, useCallback } from 'react';
import { Users, RefreshCw, ShieldAlert } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRights } from '../contexts/UserRightsContext';
import { getUsers, toggleUserStatus } from '../services/userService';
import toast from 'react-hot-toast';

// Badge colours per user_type
const USER_TYPE_CLASSES = {
  SUPERADMIN: 'bg-purple-100 text-purple-800',
  ADMIN:      'bg-blue-100   text-blue-800',
  USER:       'bg-gray-100   text-gray-700',
};

// Badge colours per record_status
const STATUS_CLASSES = {
  ACTIVE:   'bg-green-100 text-green-800',
  INACTIVE: 'bg-red-100   text-red-800',
};

const SUPERADMIN_TOOLTIP = 'SUPERADMIN accounts cannot be modified';

export default function UserManagementPage() {
  const { currentUser } = useAuth();
  const { hasRight, loading: rightsLoading } = useRights();

  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [search, setSearch]         = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('User management load error:', err);
      toast.error(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // Block access if ADM_USER right is not granted
  if (!rightsLoading && !hasRight('ADM_USER')) {
    return <Navigate to="/products" replace />;
  }

  const handleToggle = async (user, newStatus) => {
    setTogglingId(user.userid);
    try {
      await toggleUserStatus(user.userid, newStatus, currentUser.userId);
      const label = newStatus === 'ACTIVE' ? 'activated' : 'deactivated';
      toast.success(`"${user.username}" has been ${label}.`);
      await loadUsers();
    } catch (err) {
      toast.error(err.message || `Failed to update user status.`);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.username   || '').toLowerCase().includes(q) ||
      (u.firstname  || '').toLowerCase().includes(q) ||
      (u.lastname   || '').toLowerCase().includes(q) ||
      (u.user_type  || '').toLowerCase().includes(q) ||
      (u.record_status || '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-gray-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500">
              {users.length} registered user{users.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={loadUsers}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors self-start"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* SUPERADMIN guard notice */}
      <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-2 text-sm text-purple-800">
        <ShieldAlert className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>
          SUPERADMIN accounts are displayed but <strong>cannot be modified</strong> by any user.
          All action buttons on SUPERADMIN rows are disabled.
        </span>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username, name, type, or status..."
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
            <Users className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">
              {search ? 'No users match your search.' : 'No users found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((user) => {
                  const isSuperAdmin  = user.user_type === 'SUPERADMIN';
                  const isProcessing  = togglingId === user.userid;
                  const isActive      = user.record_status === 'ACTIVE';

                  return (
                    <tr
                      key={user.userid}
                      className={`hover:bg-gray-50 ${isSuperAdmin ? 'bg-purple-50/30' : ''}`}
                    >
                      {/* Username */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {isSuperAdmin && (
                            <ShieldAlert className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
                          )}
                          {user.username}
                        </div>
                      </td>

                      {/* Full name */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {[user.firstname, user.lastname].filter(Boolean).join(' ') || '—'}
                      </td>

                      {/* User ID (truncated) */}
                      <td className="px-6 py-4 text-xs font-mono text-gray-400 max-w-[8rem] truncate">
                        {user.userid}
                      </td>

                      {/* User type badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${USER_TYPE_CLASSES[user.user_type] || 'bg-gray-100 text-gray-700'}`}>
                          {user.user_type}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_CLASSES[user.record_status] || 'bg-gray-100 text-gray-700'}`}>
                          {user.record_status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* Activate button — shown when INACTIVE */}
                          <button
                            onClick={() => handleToggle(user, 'ACTIVE')}
                            disabled={isSuperAdmin || isProcessing || isActive}
                            title={isSuperAdmin ? SUPERADMIN_TOOLTIP : 'Activate this user'}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? 'Saving…' : 'Activate'}
                          </button>

                          {/* Deactivate button — shown when ACTIVE */}
                          <button
                            onClick={() => handleToggle(user, 'INACTIVE')}
                            disabled={isSuperAdmin || isProcessing || !isActive}
                            title={isSuperAdmin ? SUPERADMIN_TOOLTIP : 'Deactivate this user'}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? 'Saving…' : 'Deactivate'}
                          </button>
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
    </div>
  );
}
