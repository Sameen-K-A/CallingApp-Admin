import { useSearchParams } from 'react-router-dom';
import { MdWarning } from 'react-icons/md';
import { TableSkeleton } from '@/components/skeletons/TableSkeleton';
import CustomPagination from '@/components/ui/custom-pagination';
import useErrorHandler from '@/hooks/useErrorHandler';
import { ReportsTable } from '@/components/reports/ReportsTable';
import { useReports } from '@/hooks/useApi';

const LIMIT = 20;

export default function Reports() {
  const { handleError } = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { data, isLoading, error } = useReports(currentPage, LIMIT);

  if (error) {
    handleError(error, 'Failed to fetch reports.');
  }

  const reports = data?.reports || [];
  const totalPages = data?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Complaints</h1>
        <p className="text-muted-foreground">
          Monitor and manage user reports about inappropriate behavior during calls.
        </p>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <TableSkeleton rows={10} columns={7} />
        ) : reports.length > 0 ? (
          <>
            <ReportsTable
              reports={reports}
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
          <div className="flex flex-col items-center justify-center p-12 text-center h-[500px]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MdWarning className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">
              No reports found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are currently no reports submitted by users.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};