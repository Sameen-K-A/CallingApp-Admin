import { Loader2, XCircle, IndianRupee, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRejectWithdrawal } from '@/hooks/useApi';
import useErrorHandler from '@/hooks/useErrorHandler';
import type { ITransactionDetails } from '@/types/general';

interface RejectWithdrawalDialogProps {
  transaction: ITransactionDetails | null;
  open: boolean;
  onClose: () => void;
}

export const RejectWithdrawalDialog = ({ transaction, open, onClose }: RejectWithdrawalDialogProps) => {
  const { handleError } = useErrorHandler();
  const rejectWithdrawal = useRejectWithdrawal();

  const handleReject = async () => {
    if (!transaction) return;

    try {
      await rejectWithdrawal.mutateAsync(transaction._id);
      toast.success('Withdrawal request rejected');
      onClose();
    } catch (error) {
      handleError(error, 'Failed to reject withdrawal');
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">

        <div className="bg-muted/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Reject Withdrawal</h2>
              <p className="text-sm text-muted-foreground">Decline this request</p>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mt-4">
            <IndianRupee className="h-6 w-6" />
            <span className="text-4xl font-bold tracking-tight">
              {transaction.amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Telecaller</span>
              <span className="font-medium">{transaction.user.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{transaction.user.phone}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Coins Requested</span>
              <span className="font-medium">{transaction.coins?.toLocaleString() || 0}</span>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 p-4">
            <div className="flex gap-3">
              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/50 h-fit">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  No coins will be deducted
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  The telecaller's wallet balance will remain unchanged. They can submit a new
                  withdrawal request later.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted/50 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={rejectWithdrawal.isPending}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={rejectWithdrawal.isPending}
            className="flex-1 h-11"
          >
            {rejectWithdrawal.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Reject Withdrawal
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};