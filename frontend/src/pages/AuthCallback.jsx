import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuthStatus } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      setLoading(true);
      setErrorMsg("");
      const token = searchParams.get('token');
      const success = searchParams.get('success');
      const error = searchParams.get('error');

      if (error) {
        setErrorMsg('OAuth error: ' + error);
        setLoading(false);
        return;
      }

      if (success === 'true' && token) {
        try {
          localStorage.setItem('accessToken', token);
          await checkAuthStatus();
          navigate('/dashboard');
        } catch (err) {
          setErrorMsg('Failed to authenticate. Please try again.');
        }
      } else {
        setErrorMsg('Authentication failed. Please try again.');
      }
      setLoading(false);
    };
    handleCallback();
  }, [searchParams, navigate, checkAuthStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {loading && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Completing authentication...</p>
          </>
        )}
        {errorMsg && (
          <>
            <div className="text-red-500 mb-2">{errorMsg}</div>
            <button
              className="px-4 py-2 bg-primary text-white rounded"
              onClick={() => navigate('/signin')}
            >
              Go to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
 
