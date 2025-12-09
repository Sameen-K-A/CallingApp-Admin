import { useSearchParams } from 'react-router-dom';
import { MdPeopleAlt } from 'react-icons/md';
import { UsersTable } from '@/components/users/UsersTable';
import { TableSkeleton } from '@/components/skeletons/TableSkeleton';
import CustomPagination from '@/components/ui/custom-pagination';
import useErrorHandler from '@/hooks/useErrorHandler';
import { useUsers } from '@/hooks/useApi';

const LIMIT = 20;

export default function Users() {
  const { handleError } = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { data, isLoading, error } = useUsers(currentPage, LIMIT);

  if (error) {
    handleError(error, 'Failed to fetch users list.');
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const users = data?.users || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground">
          View and manage all registered users on the platform.
        </p>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <TableSkeleton rows={10} columns={5} />
        ) : users.length > 0 ? (
          <>
            <UsersTable
              users={users}
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
              <MdPeopleAlt className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">No users found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Users who sign up will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}