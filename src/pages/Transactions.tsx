import { useSearchParams } from 'react-router-dom';
import { MdPayments } from 'react-icons/md';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TableSkeleton } from '@/components/skeletons/TableSkeleton';
import CustomPagination from '@/components/ui/custom-pagination';
import useErrorHandler from '@/hooks/useErrorHandler';
import type { ITransaction } from '@/types/general';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTransactions } from '@/hooks/useApi';

const LIMIT = 20;

export default function Transactions() {
  const { handleError } = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams({ type: 'RECHARGE', page: '1' });
  const currentType = (searchParams.get('type') || 'RECHARGE') as ITransaction["type"];
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { data, isLoading, error } = useTransactions(currentType, currentPage, LIMIT);

  if (error) {
    handleError(error, `Failed to fetch ${currentType.toLowerCase()}s.`);
  };

  const transactions = data?.transactions || [];
  const totalPages = data?.totalPages || 0;

  const handleTabChange = (type: ITransaction["type"]) => {
    setSearchParams({ type, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ type: currentType, page: page.toString() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financial Transactions</h1>
        <p className="text-muted-foreground">
          Monitor all user recharges and telecaller withdrawals.
        </p>
      </div>

      <Tabs value={currentType} onValueChange={(value) => handleTabChange(value as ITransaction["type"])} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger className="px-8" value="RECHARGE">
            Recharges <span className="text-green-500"><TrendingUp /></span>
          </TabsTrigger>

          <TabsTrigger className="px-8" value="WITHDRAWAL">
            Withdrawals <span className="text-red-500"><TrendingDown /></span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : transactions.length > 0 ? (
          <>
            <TransactionsTable
              transactions={transactions}
              currentPage={currentPage}
              limit={LIMIT}
            />
            {totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPage={totalPages}
                onChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MdPayments className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">
              No {currentType.toLowerCase()}s found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are currently no transactions of this type.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}