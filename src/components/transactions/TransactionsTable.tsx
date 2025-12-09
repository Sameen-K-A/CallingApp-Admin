import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { ITransaction } from "@/types/general";

interface TransactionsTableProps {
  transactions: ITransaction[];
  currentPage: number;
  limit: number;
}

export const TransactionsTable = ({ transactions, currentPage, limit }: TransactionsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
  };

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

  return (
    <div className="rounded-md border-none">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="px-8 text-center">No.</TableHead>
            <TableHead className="px-8 w-full">User & Transaction ID</TableHead>
            <TableHead className="px-8 text-center">Amount (INR)</TableHead>
            <TableHead className="px-8 text-center">Status</TableHead>
            <TableHead className="px-8 text-center">Date & Time</TableHead>
            <TableHead className="px-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow
              key={transaction._id}
              onClick={() => handleRowClick(transaction._id)}
              className="cursor-pointer hover:bg-muted/30"
            >
              <TableCell className="font-medium px-8 text-center">
                {(currentPage - 1) * limit + index + 1}
              </TableCell>

              <TableCell className="px-8 w-full max-w-0">
                <div className="font-medium">
                  {transaction.user?.name || 'Unknown User'}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {transaction._id}
                </div>
              </TableCell>

              <TableCell className="text-center px-8 font-mono font-medium">
                ₹{transaction.amount.toFixed(2)}
              </TableCell>

              <TableCell className="text-center px-8">
                <Badge
                  variant={getStatusBadgeVariant(transaction.status)}
                  className="capitalize"
                >
                  {transaction.status.toLowerCase()}
                </Badge>
              </TableCell>

              <TableCell className="px-8 text-center">
                <div className="font-medium">
                  {format(new Date(transaction.createdAt), "MMMM do, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(transaction.createdAt), "hh:mm:ss a")}
                </div>
              </TableCell>

              <TableCell className="text-right px-8">
                <Button size="icon-sm" variant="outline">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};