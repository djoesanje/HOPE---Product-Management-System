import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const withTimeout = (promise, ms = 5000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Auth request timed out')), ms)
      )
    ]);
  };

  useEffect(() => {
    let cancelled = false;

    withTimeout(supabase.auth.getSession())
      .then(({ data: { session } }) => {
        if (cancelled) return;

        setSession(session);
        if (session) {
          checkUserStatus(session);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        if (cancelled) return;

        console.error('Auth initialization failed:', error);
        setSession(null);
        setCurrentUser(null);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (event === 'SIGNED_IN' && session) {
        await checkUserStatus(session);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const checkUserStatus = async (session) => {
    try {
      const { data: userRow, error: userError } = await withTimeout(
        supabase
          .from('user')
          .select('userid, username, lastname, firstname, user_type, record_status')
          .eq('userid', session.user.id)
          .maybeSingle()
      );

      if (userError) {
        console.error('Error fetching user:', userError);
        setCurrentUser(null);
        setError('Failed to load user data. Please contact an administrator.');
        setLoading(false);
        supabase.auth.signOut().catch(console.error);
        return;
      }

      if (!userRow) {
        setCurrentUser(null);
        setError('Your account has been created, but your app profile is not ready yet. Please wait for administrator activation.');
        toast.error('Your account needs administrator activation before you can continue.');
        setLoading(false);
        supabase.auth.signOut().catch(console.error);
        return;
      }

      if (userRow.record_status !== 'ACTIVE') {
        setCurrentUser(null);
        setError('Your account is pending activation by an administrator. Please wait until your account is activated.');
        toast.error('Your account needs administrator activation before you can continue.');
        setLoading(false);
        supabase.auth.signOut().catch(console.error);
        return;
      }

      setCurrentUser({
        ...session.user,
        userId: userRow.userid,
        username: userRow.username,
        lastName: userRow.lastname,
        firstName: userRow.firstname,
        user_type: userRow.user_type,
        record_status: userRow.record_status
      });
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error in checkUserStatus:', err);
      setCurrentUser(null);
      setError('An error occurred while checking your account status.');
      setLoading(false);
      supabase.auth.signOut().catch(console.error);
    }
  };

  const signUp = async (email, password, metadata) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      
      toast.success('Registration successful! Please check your email to confirm your account.');
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setCurrentUser(null);
      setError(null);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    currentUser,
    session,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
