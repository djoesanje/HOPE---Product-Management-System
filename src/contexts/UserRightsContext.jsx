import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const UserRightsContext = createContext({});

export const useRights = () => {
  const context = useContext(UserRightsContext);
  if (!context) {
    throw new Error('useRights must be used within UserRightsProvider');
  }
  return context;
};

export function UserRightsProvider({ children }) {
  const { currentUser } = useAuth();
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.userId) {
      loadUserRights();
    } else {
      setRights({});
      setLoading(false);
    }
  }, [currentUser]);

  const loadUserRights = async () => {
    try {
      const { data, error } = await supabase
        .from('usermodule_rights')
        .select('right_id, right_value')
        .eq('userid', currentUser.userId)
        .eq('record_status', 'ACTIVE');

      if (error) throw error;

      const rightsMap = {};
      data.forEach(row => {
        rightsMap[row.right_id] = row.right_value;
      });

      setRights(rightsMap);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user rights:', error);
      setRights({});
      setLoading(false);
    }
  };

  const hasRight = (rightId) => {
    return rights[rightId] === 1;
  };

  const value = {
    rights,
    loading,
    hasRight
  };

  return (
    <UserRightsContext.Provider value={value}>
      {children}
    </UserRightsContext.Provider>
  );
}
