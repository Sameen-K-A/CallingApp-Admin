import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import useErrorHandler from '@/hooks/useErrorHandler';
import { TransactionDetailsSkeleton } from '@/components/skeletons/TransactionDetailsSkeleton';
import { TransactionInfoCard } from '@/components/transactions/TransactionInfoCard';
import { useTransactionDetails } from '@/hooks/useApi';

export default function TransactionDetails() {
  const { id: transactionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { data: transaction, isLoading, error } = useTransactionDetails(transactionId);

  if (error) {
    handleError(error, "Could not load transaction information.");
  };

  if (isLoading) {
    return <TransactionDetailsSkeleton />;
  };

  if (!transaction) {
    return (
      <div className="text-center h-full flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold">Transaction Not Found</h2>
        <p className="text-muted-foreground">The requested transaction does not exist.</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Transaction Details</h1>
          <p className="text-muted-foreground">Complete information about this transaction.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <TransactionInfoCard transaction={transaction} />
      </div>
    </div>
  );
}