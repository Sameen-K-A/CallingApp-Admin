import { RiCustomerServiceFill } from 'react-icons/ri';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TelecallersTable } from '@/components/telecallers/TelecallersTable';
import { TableSkeleton } from '@/components/skeletons/TableSkeleton';
import CustomPagination from '@/components/ui/custom-pagination';
import useErrorHandler from '@/hooks/useErrorHandler';
import type { ITelecaller } from '@/types/general';
import { useSearchParams } from 'react-router-dom';
import { useTelecallers } from '@/hooks/useApi';

const LIMIT = 20;

export default function Telecallers() {
  const { handleError } = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams({ status: 'PENDING', page: '1' });
  const currentTab = (searchParams.get('status') || 'PENDING') as ITelecaller["telecallerProfile"]["approvalStatus"];
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { data, isLoading, error } = useTelecallers(currentTab, currentPage, LIMIT);

  if (error) {
    handleError(error, `Failed to fetch ${currentTab.toLowerCase()} telecallers.`);
  };

  const telecallers = data?.telecallers || [];
  const totalPages = data?.totalPages || 0;

  const handleTabChange = (status: ITelecaller["telecallerProfile"]["approvalStatus"]) => {
    setSearchParams({ status, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ status: currentTab, page: page.toString() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Telecallers</h1>
        <p className="text-muted-foreground">
          Review new applications and manage existing telecallers.
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={(value) => handleTabChange(value as ITelecaller["telecallerProfile"]["approvalStatus"])} className="w-full">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger className='px-8' value="PENDING">Pending</TabsTrigger>
          <TabsTrigger className='px-8' value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger className='px-8' value="REJECTED">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : telecallers.length > 0 ? (
          <>
            <TelecallersTable
              telecallers={telecallers}
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
              <RiCustomerServiceFill className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">No {currentTab.toLowerCase()} applications</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are currently no telecallers with this status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};