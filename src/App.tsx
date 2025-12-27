import { useEffect } from "react";
import ScrollToTop from "./components/ui/scrollToTop";
import { Toaster } from "./components/ui/sonner";
import AppRoutes from "./routes/AppRouter";
import { connectSocket, disconnectSocket } from "./lib/socket";
import { useAuth } from "./context/AuthContext";
import { useTheme } from '@/hooks/useTheme';

function App() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => disconnectSocket();
  }, [isAuthenticated]);

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <Toaster position="bottom-center" richColors={true} closeButton={true} theme={theme} />
    </>
  )
};

export default App;