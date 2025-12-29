import { useState } from 'react';
import { Loader2, CheckCircle, IndianRupee, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompleteWithdrawal } from '@/hooks/useApi';
import useErrorHandler from '@/hooks/useErrorHandler';
import type { ITransactionDetails } from '@/types/general';

interface CompleteWithdrawalDialogProps {
  transaction: ITransactionDetails | null;
  open: boolean;
  onClose: () => void;
}

export const CompleteWithdrawalDialog = ({ transaction, open, onClose }: CompleteWithdrawalDialogProps) => {
  const { handleError } = useErrorHandler();
  const completeWithdrawal = useCompleteWithdrawal();
  const [transferReference, setTransferReference] = useState('');

  const handleClose = () => {
    setTransferReference('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!transaction) return;

    if (!transferReference.trim()) {
      toast.error('Please enter the transfer reference');
      return;
    }

    if (transferReference.trim().length < 5) {
      toast.error('Transfer reference must be at least 5 characters');
      return;
    }

    try {
      await completeWithdrawal.mutateAsync({
        transactionId: transaction._id,
        payload: { transferReference: transferReference.trim() },
      });
      toast.success('Withdrawal completed successfully');
      handleClose();
    } catch (error) {
      handleError(error, 'Failed to complete withdrawal');
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">

        <div className="bg-muted/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-muted-foreground/20 backdrop-blur-sm rounded-xl">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Complete Withdrawal</h2>
              <p className="text-sm text-muted-foreground">Confirm the bank transfer</p>
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
          <div className="space-y-2">
            <Label htmlFor="transferReference" className="text-sm font-medium">
              Transfer Reference <span className="text-destructive">*</span>
            </Label>
            <Input
              id="transferReference"
              placeholder="Enter UPI ID / UTR / Reference Number"
              value={transferReference}
              onChange={(e) => setTransferReference(e.target.value)}
              disabled={completeWithdrawal.isPending}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Enter the transaction reference from your payment app (Google Pay, PhonePe, Bank, etc.)
            </p>
          </div>

          {/* Warning */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 p-4">
            <div className="flex gap-3">
              <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/50 h-fit">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  This action cannot be undone
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Completing this withdrawal will permanently deduct{' '}
                  <strong>{transaction.coins?.toLocaleString() || 0} coins</strong> from the
                  telecaller's wallet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/50 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={completeWithdrawal.isPending}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={completeWithdrawal.isPending || !transferReference.trim()}
            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700"
          >
            {completeWithdrawal.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Withdrawal
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};