import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import apiClient from '@/lib/axios';
import { ROUTE } from '@/routes/router';
import useErrorHandler from '@/hooks/useErrorHandler';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getErrorMessage } from '@/utils/helper';

export default function LoginPage() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    try {
      const googleIdToken = credentialResponse.credential;
      if (!googleIdToken) throw new Error("Google login failed: No credential received.");

      const response = await apiClient.post('/admin/auth/google', {
        googleToken: googleIdToken,
      });

      if (response.data.success) {
        login();
        navigate(ROUTE.DASHBOARD, { replace: true });
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (error) {
      handleError(getErrorMessage(error), 'Login failed. Please check if you are an authorized admin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setIsLoading(false);
    handleError(new Error("Google login process was cancelled or failed."));
  };

  return (
    <div className="h-screen container mx-auto flex flex-col md:flex-row bg-background text-foreground">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-4 text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Sign in with your authorized Google account to access the dashboard.
            </p>

            <div className="mt-4 w-full flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme={theme === "dark" ? "outline" : "filled_black"}
                    shape="pill"
                    useOneTap={false}
                  />
                </div>
              )}
            </div>

            <p className="text-left text-xs text-muted-foreground">
              Access is restricted to authorized personnel only.
            </p>
          </div>
        </div>
      </section>

      <section className="hidden md:block flex-1 relative p-4">
        <div
          className="absolute inset-4 rounded-3xl bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80')` }}
        ></div>
      </section>
    </div>
  );
};