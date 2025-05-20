

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verify } from '../../src/services/authServices';

// Config for different server addresses
const config = {
  loginPath: '/login',
  dashboardPath: '/dashboard'
};

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    verify()
      .then(res => {
        if (res.valid) {
          setIsAuthenticated(true);
          
          // Handle login redirect case
          if (location.pathname === config.loginPath) {
            navigate(config.dashboardPath, { replace: true });
          }
        } else {
          // Redirect to login page without return URL
          window.location.href = 'http://localhost:5174/login';
        }
      })
      .catch(() => {
        // Redirect to login page without return URL on error
        window.location.href = 'http://localhost:5174/login';
      })
      .finally(() => setLoading(false));
  }, [navigate, location]);

  if (loading) return <div className="text-white">Checking auth...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default AuthWrapper;
