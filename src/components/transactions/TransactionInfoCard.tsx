import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { CreditCard, TrendingDown, TrendingUp, User, Wallet, ArrowDownCircle, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import type { ITransactionDetails } from "@/types/general";

interface TransactionInfoCardProps {
  transaction: ITransactionDetails;
}

export const TransactionInfoCard = ({ transaction }: TransactionInfoCardProps) => {
  const getStatusBadgeVariant = (status: string): "success" | "warning" | "destructive" | "secondary" => {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = () => {
    return transaction.type === 'RECHARGE'
      ? <TrendingUp className="h-5 w-5 text-green-500" />
      : <TrendingDown className="h-5 w-5 text-red-500" />;
  };

  const getTypeColor = () => {
    return transaction.type === 'RECHARGE' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusMessage = (type: string, status: string) => {
    if (type === 'RECHARGE') {
      switch (status) {
        case 'SUCCESS':
          return 'Payment completed successfully. Coins have been added to user wallet.';
        case 'PENDING':
          return 'Payment is being processed by the gateway. Coins will be credited upon confirmation.';
        case 'FAILED':
          return 'Payment failed at gateway level. No amount was charged.';
        case 'CANCELLED':
          return 'Payment was cancelled by user or gateway timeout.';
        default:
          return 'Payment status unknown.';
      }
    } else {
      switch (status) {
        case 'SUCCESS':
          return 'Withdrawal completed successfully. Amount has been credited to user account.';
        case 'PENDING':
          return 'Withdrawal is being processed. Amount will be credited within 1-3 business days.';
        case 'FAILED':
          return 'Withdrawal failed due to technical issues. Amount has been refunded to wallet.';
        case 'CANCELLED':
          return 'Withdrawal was cancelled by user or admin. Amount has been refunded to wallet.';
        default:
          return 'Withdrawal status unknown.';
      }
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Transaction Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
            {getTypeIcon()}
          </div>
          <div>
            <CardTitle className="text-lg">Transaction Overview</CardTitle>
            <p className="text-sm text-muted-foreground">Basic transaction information</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transaction ID</span>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {transaction._id}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Type</span>
              <span className={`text-sm font-medium capitalize ${getTypeColor()}`}>
                {transaction.type.toLocaleLowerCase()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Amount</span>
              <span className="text-lg font-bold">₹{transaction.amount.toFixed(2)}</span>
            </div>

            {transaction.coins && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Coins</span>
                <span className="text-sm font-medium">{transaction.coins.toLocaleString()}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(transaction.status)}
                <Badge variant={getStatusBadgeVariant(transaction.status)} className="capitalize">
                  {transaction.status.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Created At</span>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {format(new Date(transaction.createdAt), "MMMM do, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(transaction.createdAt), "hh:mm:ss a")}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">User Information</CardTitle>
            <p className="text-sm text-muted-foreground">Details about the user</p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 h-full">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">User ID</span>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {transaction.user._id}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Name</span>
            <span className="text-sm font-medium">
              {transaction.user.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Phone</span>
            <span className="text-sm font-medium">
              {transaction.user.phone}
            </span>
          </div>

          <Separator className="mt-2" />

          <div className="mt-auto flex items-center justify-between">
            <span className="text-sm font-medium">Current Wallet Balance</span>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                ₹{transaction.user.walletBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Transaction Details Card */}
      {(transaction.gatewayOrderId || transaction.gatewayPaymentId || transaction.payoutId || transaction.utr) && (
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
              {transaction.type === 'RECHARGE' ? (
                <CreditCard className="h-5 w-5 text-green-600" />
              ) : (
                <ArrowDownCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">
                {transaction.type === 'RECHARGE' ? 'Payment Gateway Details' : 'Withdrawal Details'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {transaction.type === 'RECHARGE'
                  ? 'Gateway transaction and payment information'
                  : 'Complete withdrawal transaction information'
                }
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl p-4 border bg-background">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(transaction.status)}
                <span className="font-medium">Transaction Status</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getStatusMessage(transaction.type, transaction.status)}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="grid gap-4">
              <h4 className="font-medium text-sm">
                {transaction.type === 'RECHARGE' ? 'Gateway Information' : 'Processing Information'}
              </h4>

              <div className="grid gap-3 md:grid-cols-2">
                {/* Recharge Fields */}
                {transaction.gatewayOrderId && (
                  <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Gateway Order ID</span>
                      <p className="text-xs text-muted-foreground">Payment gateway reference</p>
                    </div>
                    <span className="text-sm font-mono bg-muted px-3 py-1 rounded">
                      {transaction.gatewayOrderId}
                    </span>
                  </div>
                )}

                {transaction.gatewayPaymentId && (
                  <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Gateway Payment ID</span>
                      <p className="text-xs text-muted-foreground">Successful payment reference</p>
                    </div>
                    <span className="text-sm font-mono bg-muted px-3 py-1 rounded">
                      {transaction.gatewayPaymentId}
                    </span>
                  </div>
                )}

                {/* Withdrawal Fields */}
                {transaction.payoutId && (
                  <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Payout ID</span>
                      <p className="text-xs text-muted-foreground">Internal processing reference</p>
                    </div>
                    <span className="text-sm font-mono bg-muted px-3 py-1 rounded">
                      {transaction.payoutId}
                    </span>
                  </div>
                )}

                {transaction.utr && (
                  <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">UTR Number</span>
                      <p className="text-xs text-muted-foreground">Bank transaction reference</p>
                    </div>
                    <span className="text-sm font-mono bg-muted px-3 py-1 rounded">
                      {transaction.utr}
                    </span>
                  </div>
                )}
              </div>

              {/* Empty State */}
              {!transaction.gatewayOrderId && !transaction.gatewayPaymentId && !transaction.payoutId && !transaction.utr && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No processing details available</p>
                  <p className="text-xs">
                    {transaction.type === 'RECHARGE'
                      ? 'Details will appear once payment is processed'
                      : 'Details will appear once withdrawal is processed'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Additional Information */}
            {(transaction.gatewayOrderId || transaction.payoutId) && (
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-medium text-sm mb-1">Important Information</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {transaction.type === 'RECHARGE' ? (
                        <>
                          This transaction was processed through our secure payment gateway.
                          All payment information is encrypted and stored securely.
                          Gateway fees (if any) are automatically handled.
                        </>
                      ) : (
                        <>
                          Withdrawal processing typically takes 1-3 business days depending on your bank.
                          You will receive confirmation once the amount is credited to your account.
                          {transaction.utr && ' The UTR number can be used to track the transaction with your bank.'}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};