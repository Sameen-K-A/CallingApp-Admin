import { useAuth } from '@/context/AuthContext';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

const useErrorHandler = () => {
  const { logout } = useAuth();

  const handleError = (error: AxiosError | any, fallbackMessage: string = "Something went wrong. Please try again.") => {

    if (error.response?.status === 401) {
      toast.error("Your session has expired. Please log in again.");
      logout();
      return;
    };

    if (error.response?.status === 429) {
      toast.error("Too many requests. Please try again in a moment.");
      return;
    }

    const backendMessage = error.response?.data?.message || error.message;
    toast.error(backendMessage || fallbackMessage);
  };

  return { handleError };
};

export default useErrorHandler;