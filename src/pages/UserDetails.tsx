import { useParams, useNavigate } from 'react-router-dom';
import { useUserDetails } from '@/hooks/useApi';
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import useErrorHandler from '@/hooks/useErrorHandler';
import { UserDetailsSkeleton } from '@/components/skeletons/UserDetailsSkeleton';
import { UserInfoCard } from '@/components/users/UserInfoCard';
import { UserComplaintsCard } from '@/components/users/UserComplaintsCard';
import { UserManagementCard } from '@/components/users/UserManagementCard';

export default function UserDetails() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { data: user, isLoading, error } = useUserDetails(userId);

  if (error) {
    handleError(error, "Could not load user information.");
  };

  const getIncompletedFields = () => {
    if (!user) return [];

    const missingFields: string[] = [];

    if (!user.name) missingFields.push('Name');
    if (!user.gender) missingFields.push('Gender');
    if (!user.dob) missingFields.push('Date of Birth');

    return missingFields;
  };

  const incompletedFields = user ? getIncompletedFields() : [];
  const isProfileIncomplete = incompletedFields.length > 0;

  if (isLoading) {
    return <UserDetailsSkeleton />;
  };

  if (!user) {
    return (
      <div className="text-center h-full flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold">User Not Found</h2>
        <p className="text-muted-foreground">The requested user does not exist.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground">
            View user information, manage account access, and review complaints.
          </p>
        </div>
      </div>

      {isProfileIncomplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-amber-950/20 dark:border-amber-800/30">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-100 mb-1">
                Profile Setup Incomplete
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                This user has not completed their profile. Missing information: {' '}
                <span className="font-medium">
                  {incompletedFields.join(', ')}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <UserInfoCard
        user={user}
      />
      <UserManagementCard
        user={user}
      />
      <UserComplaintsCard
        complaints={user.complaints}
        totalComplaints={user.totalComplaints}
      />
    </div>
  );
};