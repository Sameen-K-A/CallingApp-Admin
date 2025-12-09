import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, UserX, UserCheck, AlertTriangle, Settings, Users } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import useErrorHandler from "@/hooks/useErrorHandler";
import type { IReport, IReportDetails } from "@/types/general";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface AdminActionsCardProps {
  report: IReportDetails;
  onReportUpdate: (updatedFields: { status: string, adminNotes?: string, resolvedAt?: string }) => void;
  onUserStatusUpdate: (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED') => void;
}

export const AdminActionsCard = ({ report, onReportUpdate, onUserStatusUpdate }: AdminActionsCardProps) => {
  const { handleError } = useErrorHandler();
  const [selectedStatus, setSelectedStatus] = useState<IReport["status"]>(report.status);
  const [adminNotes, setAdminNotes] = useState(report.adminNotes || '');
  const [isUpdatingReport, setIsUpdatingReport] = useState(false);
  const [isBlockingUser, setIsBlockingUser] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);

  // Handle status change with proper typing
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as IReport["status"]);
  };

  // Handle report status update
  const handleUpdateReportStatus = async () => {
    if (selectedStatus === report.status && adminNotes === (report.adminNotes || '')) {
      toast.info('No changes to update.');
      return;
    }

    setIsUpdatingReport(true);
    try {
      const { data } = await apiClient.patch(`/admin/reports/${report._id}/status`, {
        status: selectedStatus,
        adminNotes: adminNotes.trim() || undefined
      });

      if (data.success) {
        onReportUpdate(data.data);
        toast.success('Report status updated successfully!');
        setShowStatusConfirm(false);
      }
    } catch (error) {
      handleError(error, 'Failed to update report status.');
    } finally {
      setIsUpdatingReport(false);
    }
  };

  // Handle user block/unblock
  const handleUserAction = async (action: 'block' | 'unblock') => {
    setIsBlockingUser(true);
    try {
      const { data } = await apiClient.post(`/admin/users/${report.reportedAgainst._id}/${action}`);

      if (data.success) {
        const newStatus = action === 'block' ? 'SUSPENDED' : 'ACTIVE';
        onUserStatusUpdate(report.reportedAgainst._id, newStatus);
        toast.success(data.message);
        setShowBlockConfirm(false);
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      handleError(error, `Failed to ${action} user.`);
    } finally {
      setIsBlockingUser(false);
    }
  };

  const canUpdateStatus = selectedStatus !== report.status || adminNotes !== (report.adminNotes || '');
  const isReportResolved = report.status === 'RESOLVED' || report.status === 'DISMISSED';
  const isUserActive = report.reportedAgainst.accountStatus === 'ACTIVE';

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">Admin Actions</CardTitle>
            <p className="text-sm text-muted-foreground">Update report status and manage users</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {/* Report Status Update Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm text-foreground">Update Report Status</h4>
            </div>

            <div className="space-y-3 pl-1.5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger className="border-border w-xs">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="DISMISSED">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                <Textarea
                  placeholder="Add notes about your decision or findings..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  className="resize-none border-border"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {adminNotes.length}/2000 characters
                </div>
              </div>

              <Button
                onClick={() => setShowStatusConfirm(true)}
                disabled={!canUpdateStatus || isUpdatingReport}
                className="w-full md:w-auto"
              >
                {isUpdatingReport ? 'Updating...' : 'Update Report Status'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* User Management Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm text-foreground">User Management</h4>
            </div>

            <div className="space-y-3 pl-1.5">
              {/* User Action Card */}
              <div className="bg-muted/40 rounded-lg p-3.5 border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-medium text-sm text-foreground">{report.reportedAgainst.name}</h5>
                    <p className="text-xs text-muted-foreground">
                      Currently: <span className={`font-medium capitalize text-foreground ${report.reportedAgainst.accountStatus === "ACTIVE" ? "text-green-500" : "text-red-500"}`}>
                        {report.reportedAgainst.accountStatus.toLowerCase()}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isUserActive ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowBlockConfirm(true)}
                        disabled={isBlockingUser}
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        {isBlockingUser ? 'Blocking...' : 'Block User'}
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => setShowBlockConfirm(true)}
                        disabled={isBlockingUser}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        {isBlockingUser ? 'Unblocking...' : 'Unblock User'}
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  {isUserActive
                    ? 'Blocking will suspend this user\'s account and prevent them from using the platform.'
                    : 'Unblocking will restore this user\'s account access.'
                  }
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 dark:bg-amber-950/20 dark:border-amber-800/30">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-medium text-sm mb-1.5 text-amber-900 dark:text-amber-100">Important</h5>
                    <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                      User blocking actions are immediate and will affect the user's ability to access the platform.
                      Make sure to document your decision in the admin notes above before taking action.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Information */}
          {isReportResolved && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3.5 dark:bg-green-950/20 dark:border-green-800/30">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-sm text-green-900 dark:text-green-100">Report Resolved</span>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                This report has been marked as {report.status.toLowerCase()}.
                You can still update the status or take user actions if needed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update Confirmation Dialog */}
      <AlertDialog open={showStatusConfirm} onOpenChange={setShowStatusConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status from <span className="font-medium">{report.status}</span> to <span className="font-medium">{selectedStatus}</span>?

              {(selectedStatus === 'RESOLVED' || selectedStatus === 'DISMISSED') && (
                <p className="mt-2">This will mark the report as handled.</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateReportStatus}>
              Confirm Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Action Confirmation Dialog */}
      <AlertDialog open={showBlockConfirm} onOpenChange={setShowBlockConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isUserActive ? 'Confirm Block User' : 'Confirm Unblock User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isUserActive ? (
                <>
                  Are you sure you want to block <span className="font-medium">{report.reportedAgainst.name}</span>?
                  <p className="mt-2">This will prevent the user from accessing the platform.</p>
                </>
              ) : (
                <>
                  Are you sure you want to unblock <span className="font-medium">{report.reportedAgainst.name}</span>?
                  <p className="mt-2">This will restore the user's access to the platform.</p>
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
              {isUserActive ? 'Block User' : 'Unblock User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};