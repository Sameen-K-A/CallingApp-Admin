import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, UserX, UserCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import useErrorHandler from "@/hooks/useErrorHandler";
import type { ITelecaller } from "@/types/general";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useUpdateTelecallerStatus } from "@/hooks/useApi";

interface TelecallerUserManagementCardProps {
  telecaller: ITelecaller;
};

export const TelecallerUserManagementCard = ({ telecaller }: TelecallerUserManagementCardProps) => {
  const { handleError } = useErrorHandler();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const updateStatus = useUpdateTelecallerStatus();
  const isActionLoading = updateStatus.isPending;

  const isUserActive = telecaller.accountStatus === 'ACTIVE';

  const handleUserAction = async (action: 'block' | 'unblock') => {
    try {
      const data = await updateStatus.mutateAsync({ telecallerId: telecaller._id, action });

      if (data.success) {
        toast.success(data.message);
        setShowConfirmDialog(false);
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      handleError(error, `Failed to ${action} telecaller.`);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">User Management</CardTitle>
            <p className="text-sm text-muted-foreground">Manage telecaller account access and permissions</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {/* Current Status Section */}
          <div className="bg-muted/40 rounded-lg p-3.5 border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h5 className="font-medium text-sm text-foreground">{telecaller.name || 'Telecaller'}</h5>
                <p className="text-xs text-muted-foreground">
                  Current Status: <span className="font-medium capitalize text-foreground">
                    {telecaller.accountStatus.toLowerCase()}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                {isUserActive ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isActionLoading}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    {isActionLoading ? 'Blocking...' : 'Block Telecaller'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isActionLoading}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {isActionLoading ? 'Unblocking...' : 'Unblock Telecaller'}
                  </Button>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              {isUserActive
                ? 'Blocking will suspend this telecaller\'s account and prevent them from receiving calls on the platform.'
                : 'Unblocking will restore this telecaller\'s account access and allow them to receive calls again.'
              }
            </p>
          </div>

          {/* Important Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 dark:bg-amber-950/20 dark:border-amber-800/30">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-medium text-sm mb-1.5 text-amber-900 dark:text-amber-100">Important Notice</h5>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  Account blocking actions are immediate and will affect the telecaller's ability to access the platform and receive calls.
                  Make sure you have reviewed all complaints before taking action.
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-sm text-foreground">Account Information</h4>
            <div className="grid gap-2.5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground">Phone Number</span>
                <span className="text-sm font-medium text-foreground">{telecaller.phone}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground">Wallet Balance</span>
                <span className="text-sm font-medium text-foreground font-mono">
                  {telecaller.walletBalance} coins
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground">Approval Status</span>
                <span className="text-sm font-medium text-green-600 capitalize">
                  {telecaller.telecallerProfile.approvalStatus.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isUserActive ? 'Confirm Block Telecaller' : 'Confirm Unblock Telecaller'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isUserActive ? (
                <>
                  Are you sure you want to block <span className="font-medium">{telecaller.name || 'this telecaller'}</span>?
                  <p className="mt-2">This will prevent them from receiving calls and accessing the platform.</p>
                </>
              ) : (
                <>
                  Are you sure you want to unblock <span className="font-medium">{telecaller.name || 'this telecaller'}</span>?
                  <p className="mt-2">This will restore their access to receive calls on the platform.</p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUserAction(isUserActive ? 'block' : 'unblock')}
              className={isUserActive ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {isUserActive ? 'Block Telecaller' : 'Unblock Telecaller'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};