import { useParams, useNavigate } from 'react-router-dom';
import { useTelecallerDetails } from '@/hooks/useApi';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import useErrorHandler from '@/hooks/useErrorHandler';
import { TelecallerDetailsSkeleton } from '@/components/skeletons/TelecallerDetailsSkeleton';
import { TelecallerInfoCard } from '@/components/telecallers/TelecallerInfoCard';
import { TelecallerActionsCard } from '@/components/telecallers/TelecallerActionsCard';
import { TelecallerComplaintsCard } from '@/components/telecallers/TelecallerComplaintsCard';
import { TelecallerUserManagementCard } from '@/components/telecallers/TelecallerUserManagementCard';

export default function TelecallerDetails() {
  const { id: telecallerId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { data: telecaller, isLoading, error } = useTelecallerDetails(telecallerId);

  if (error) {
    handleError(error, "Could not load telecaller information.");
  };

  if (isLoading) {
    return <TelecallerDetailsSkeleton />;
  }

  if (!telecaller) {
    return (
      <div className="text-center h-full flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold">Telecaller Not Found</h2>
        <p className="text-muted-foreground">The requested telecaller does not exist.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const isApproved = telecaller.telecallerProfile.approvalStatus === 'APPROVED';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Telecaller Details</h1>
          <p className="text-muted-foreground">
            {isApproved
              ? 'Manage telecaller account and review complaints.'
              : 'Review the application details below and take action.'
            }
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TelecallerInfoCard telecaller={telecaller} />
        </div>
        <div className="xl:col-span-1">
          <TelecallerActionsCard telecaller={telecaller} />
        </div>
      </div>

      {isApproved && (
        <TelecallerComplaintsCard
          complaints={telecaller.complaints}
          totalComplaints={telecaller.totalComplaints}
        />
      )}

      {isApproved && (
        <TelecallerUserManagementCard telecaller={telecaller} />
      )}
    </div>
  );
};