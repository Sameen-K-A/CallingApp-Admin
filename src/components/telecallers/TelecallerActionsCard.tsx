import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApproveTelecaller, useRejectTelecaller } from '@/hooks/useApi';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Clock, Shield, UserCheck, UserX, AlertCircle } from 'lucide-react';
import type { ITelecaller } from '@/types/general';
import useErrorHandler from '@/hooks/useErrorHandler';

interface TelecallerActionsCardProps {
  telecaller: ITelecaller;
};

export function TelecallerActionsCard({ telecaller }: TelecallerActionsCardProps) {
  const { handleError } = useErrorHandler();
  const [rejectionReason, setRejectionReason] = useState("");
  const status = telecaller.telecallerProfile.approvalStatus;

  const approveMutation = useApproveTelecaller();
  const rejectMutation = useRejectTelecaller();
  const isActionLoading = approveMutation.isPending || rejectMutation.isPending;

  const handleApprove = async () => {
    try {
      const data = await approveMutation.mutateAsync(telecaller._id);
      if (data.success) {
        toast.success("Telecaller approved successfully!");
      }
    } catch (error) {
      handleError(error, "Failed to approve telecaller.");
    }
  };

  const handleRejectConfirm = async () => {
    if (rejectionReason.trim().length < 10) {
      toast.error("Rejection reason must be at least 10 characters long.");
      return;
    };

    try {
      const data = await rejectMutation.mutateAsync({ telecallerId: telecaller._id, reason: rejectionReason, });
      if (data.success) {
        toast.warning("Telecaller has been rejected.");
      }
    } catch (error) {
      handleError(error, "Failed to reject telecaller.");
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: <CheckCircle className="h-10 w-10" />,
          title: 'Application Approved',
          description: 'This telecaller is active and can receive calls on the platform.',
          bgColor: 'bg-green-50 dark:bg-green-950/20',
          borderColor: 'border-green-200 dark:border-green-800/30',
          textColor: 'text-green-600 dark:text-green-400',
          iconBg: 'bg-green-100 dark:bg-green-900/30'
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="h-10 w-10" />,
          title: 'Application Rejected',
          description: 'This application did not meet the requirements and has been declined.',
          bgColor: 'bg-red-50 dark:bg-red-950/20',
          borderColor: 'border-red-200 dark:border-red-800/30',
          textColor: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-100 dark:bg-red-900/30'
        };
      default: // PENDING
        return {
          icon: <Clock className="h-10 w-10" />,
          title: 'Pending Review',
          description: 'This application is awaiting admin review and approval.',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800/30',
          textColor: 'text-yellow-600 dark:text-yellow-400',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/30'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const renderContent = () => {
    if (status === 'PENDING') {
      return (
        <div className="flex flex-col gap-4">
          {/* Status Display */}
          <div className={`rounded-lg p-4 border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${statusConfig.iconBg} ${statusConfig.textColor} shrink-0`}>
                {statusConfig.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground mb-1">{statusConfig.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {statusConfig.description}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm text-foreground">Admin Decision</h4>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 border border-border">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Review the telecaller's profile carefully before making a decision. This action will affect their platform access.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserCheck className="mr-2 h-4 w-4" />
                    )}
                    Approve Application
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Approve this Telecaller?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will grant <span className="font-medium">{telecaller.name || 'this telecaller'}</span> access to receive calls on the platform.
                      <p className="mt-2">This action cannot be reversed later.</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className='bg-green-600 hover:bg-green-700'
                      onClick={handleApprove}
                    >
                      Confirm Approval
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog onOpenChange={() => setRejectionReason("")}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={isActionLoading}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Reject Application
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Reject this Application?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Please provide a clear reason for rejecting <span className="font-medium">{telecaller.name || 'this telecaller'}</span>'s application. This will be recorded and may be shared with the applicant.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Rejection Reason <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="e.g., Profile photo not clear, about section incomplete, insufficient experience..."
                      value={rejectionReason}
                      className='resize-none h-28 border-border'
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 10 characters ({rejectionReason.length}/10)
                    </p>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={handleRejectConfirm}
                      disabled={rejectionReason.trim().length < 10}
                    >
                      Confirm Rejection
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      );
    }

    // For APPROVED or REJECTED status
    return (
      <div className="flex flex-col justify-center h-full">
        <div className={`rounded-lg p-6 border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${statusConfig.iconBg} ${statusConfig.textColor}`}>
              {statusConfig.icon}
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground mb-2">{statusConfig.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {statusConfig.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className='flex flex-col'>
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
          <Shield className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg">Application Review</CardTitle>
          <p className="text-sm text-muted-foreground">Review and take action on this application</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
}