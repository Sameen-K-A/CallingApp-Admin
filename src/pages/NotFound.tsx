import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MdSpaceDashboard } from 'react-icons/md';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-[150px] font-extrabold leading-none text-muted-foreground/50">
            404
          </h1>
          <h2 className="text-3xl font-bold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <MdSpaceDashboard className="h-5 w-5" />
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;