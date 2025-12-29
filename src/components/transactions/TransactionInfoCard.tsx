import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { CreditCard, TrendingDown, TrendingUp, User, Wallet, CheckCircle, Clock, XCircle, AlertCircle, Building2, Ban, Copy, IndianRupee } from 'lucide-react';
import { CompleteWithdrawalDialog } from './CompleteWithdrawalDialog';
import { RejectWithdrawalDialog } from './RejectWithdrawalDialog';
import type { ITransactionDetails } from '@/types/general';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { FaCoins } from 'react-icons/fa';

interface TransactionInfoCardProps {
  transaction: ITransactionDetails;
}

export const TransactionInfoCard = ({ transaction }: TransactionInfoCardProps) => {
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const isWithdrawal = transaction.type === 'WITHDRAWAL';
  const isPending = transaction.status === 'PENDING';
  const showActions = isWithdrawal && isPending;

  const statusConfig = {
    SUCCESS: {
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-200 dark:border-emerald-800',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    },
    PENDING: {
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    },
    FAILED: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950/50',
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    },
    CANCELLED: {
      icon: Ban,
      color: 'text-gray-600',
      bg: 'bg-gray-50 dark:bg-gray-950/50',
      border: 'border-gray-200 dark:border-gray-800',
      badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
    },
    REJECTED: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950/50',
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    },
  };

  const status = statusConfig[transaction.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  return (
    <>
      <div className="space-y-6">
        {/* Hero Section - Transaction Summary */}
        <Card className="overflow-hidden p-0 gap-0 shadow-none">
          <div className={cn('p-6 md:p-8', isWithdrawal ? 'bg-linear-to-br from-orange-500 to-red-600' : 'bg-linear-to-br from-emerald-500 to-teal-600')}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left Side */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    {isWithdrawal ? (
                      <TrendingDown className="h-6 w-6 text-white" />
                    ) : (
                      <TrendingUp className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {isWithdrawal ? 'Withdrawal Request' : 'Wallet Recharge'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/60 text-xs font-mono">
                        #{transaction._id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(transaction._id, 'Transaction ID')}
                        className="text-white/60 hover:text-white transition-colors cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="h-8 w-8 text-white" />
                  <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                    {transaction.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                {transaction.coins && (
                  <div className="flex items-center gap-2 text-white">
                    <FaCoins className="h-4 w-4" />
                    <span className="text-sm">
                      {transaction.coins.toLocaleString()} coins credited
                    </span>
                  </div>
                )}
              </div>

              {/* Right Side - Status */}
              <div className="flex flex-col items-center md:items-end gap-4">
                <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium', 'bg-white/20 backdrop-blur-sm text-white')}>
                  <StatusIcon className="h-4 w-4" />
                  <span className="capitalize">{transaction.status.toLowerCase()}</span>
                </div>

                <div className="text-white text-sm text-center md:text-right">
                  <p>{format(new Date(transaction.createdAt), 'MMMM d, yyyy')}</p>
                  <p className="text-white/60">
                    {format(new Date(transaction.createdAt), 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar for Pending Withdrawal */}
          {showActions && (
            <div className="p-4 bg-muted/50 border-t flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 text-red-500 hover:text-red-500"
                onClick={() => setRejectDialogOpen(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Request
              </Button>
              <Button
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setCompleteDialogOpen(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Withdrawal
              </Button>
            </div>
          )}
        </Card>

        {/* Info Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Card */}
          <Card className='shadow-none gap-2 h-fit'>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    {isWithdrawal ? 'Telecaller Details' : 'User Details'}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Account information
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                label="Name"
                value={transaction.user.name}
              />
              <InfoRow
                label="Phone"
                value={transaction.user.phone}
                onCopy={() => copyToClipboard(transaction.user.phone, 'Phone number')}
              />
              <InfoRow
                label="User ID"
                value={transaction.user._id}
                mono
                onCopy={() => copyToClipboard(transaction.user._id, 'User ID')}
              />
              <Separator className='h-[0.5px]' />
              <div className="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    Wallet Balance
                  </span>
                </div>
                <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
                  {transaction.user.walletBalance.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details for Withdrawal */}
          {isWithdrawal && transaction.bankDetails && (
            <Card className='shadow-none h-fit'>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                    <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Bank Account</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Transfer destination
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  label="Account Holder"
                  value={transaction.bankDetails.accountHolderName}
                />
                <InfoRow
                  label="Account Number"
                  value={transaction.bankDetails.accountNumber}
                  mono
                  onCopy={() => copyToClipboard(transaction.bankDetails!.accountNumber, 'Account number')}
                />
                <InfoRow
                  label="IFSC Code"
                  value={transaction.bankDetails.ifscCode}
                  mono
                  onCopy={() => copyToClipboard(transaction.bankDetails!.ifscCode, 'IFSC code')}
                />

                {isPending && (
                  <>
                    <Separator />
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                      <div className="flex gap-2 items-center">
                        <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Transfer ₹{transaction.amount.toLocaleString('en-IN')} to this account and
                          complete the withdrawal with the transaction reference.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Gateway Details for Recharge */}
          {transaction.type === 'RECHARGE' &&
            (transaction.gatewayOrderId || transaction.gatewayPaymentId) && (
              <Card className='shadow-none h-fit gap-2'>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                      <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Payment Gateway</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Razorpay transaction details
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {transaction.gatewayOrderId && (
                    <InfoRow
                      label="Order ID"
                      value={transaction.gatewayOrderId}
                      mono
                      onCopy={() => copyToClipboard(transaction.gatewayOrderId!, 'Order ID')}
                    />
                  )}
                  {transaction.gatewayPaymentId && (
                    <InfoRow
                      label="Payment ID"
                      value={transaction.gatewayPaymentId}
                      mono
                      onCopy={() => copyToClipboard(transaction.gatewayPaymentId!, 'Payment ID')}
                    />
                  )}
                </CardContent>
              </Card>
            )}
        </div>

        {/* Transfer Details for Completed Withdrawal */}
        {isWithdrawal && transaction.status === 'SUCCESS' && (
          <Card className="shadow-none gap-2 h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Transfer Completed</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Withdrawal processed successfully
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {transaction.transferReference && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Transfer Reference</p>
                    <p className="font-mono font-medium">{transaction.transferReference}</p>
                  </div>
                )}
                {transaction.processedAt && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Processed At</p>
                    <p className="font-medium">
                      {format(new Date(transaction.processedAt), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejection Details */}
        {isWithdrawal && transaction.status === 'REJECTED' && (
          <Card className="shadow-none gap-2 h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Request Rejected</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Withdrawal was not processed
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">
                  This withdrawal request was rejected. No coins were deducted from the wallet.
                  {transaction.processedAt && (
                    <span className="block mt-2 text-xs text-red-600 dark:text-red-400">
                      Rejected on {format(new Date(transaction.processedAt), 'MMMM d, yyyy')} at{' '}
                      {format(new Date(transaction.processedAt), 'h:mm a')}
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <CompleteWithdrawalDialog
        transaction={transaction}
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
      />
      <RejectWithdrawalDialog
        transaction={transaction}
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      />
    </>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
}

const InfoRow = ({ label, value, mono, onCopy }: InfoRowProps) => (
  <div className="flex items-center justify-between group">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <span className={cn('text-sm font-medium', mono && 'font-mono text-xs bg-muted px-2 py-1 rounded')}>
        {value}
      </span>
      {onCopy && (
        <button
          onClick={onCopy}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  </div>
);