import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasOAuthParams =
      window.location.search.includes('code=') ||
      window.location.hash.includes('access_token=') ||
      window.location.hash.includes('refresh_token=');

    if (!hasOAuthParams) {
      navigate('/products', { replace: true });
      return;
    }

    let cancelled = false;

    const withTimeout = (promise, ms = 5000) => {
      return Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth callback timed out')), ms)
        )
      ]);
    };

    const handleCallback = async () => {
      try {
        const {
          data: { session },
          error: sessionError
        } = await withTimeout(supabase.auth.getSession());

        if (cancelled) return;

        if (sessionError) {
          console.error('OAuth callback session failed:', sessionError);
          navigate('/login?error=callback_error', { replace: true });
          return;
        }

        if (!session) {
          navigate('/login', { replace: true });
          return;
        }

        const { data: userRow, error: userError } = await withTimeout(
          supabase
            .from('user')
            .select('record_status')
            .eq('userid', session.user.id)
            .maybeSingle()
        );

        if (cancelled) return;

        if (userError) {
          console.error('OAuth callback user lookup failed:', userError);
          await supabase.auth.signOut();
          navigate('/login?error=profile_error', { replace: true });
          return;
        }

        if (!userRow) {
          await supabase.auth.signOut();
          navigate('/login?error=profile_missing', { replace: true });
          return;
        }

        if (userRow.record_status === 'ACTIVE') {
          navigate('/products', { replace: true });
        } else {
          await supabase.auth.signOut();
          navigate('/login?error=not_activated', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback failed:', error);
        navigate('/login?error=callback_error', { replace: true });
      }
    };

    handleCallback();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}