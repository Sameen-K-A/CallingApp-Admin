import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlansTable } from '@/components/plans/PlansTable';
import { ViewPlanDialog } from '@/components/plans/ViewPlanDialog';
import { CreatePlanDialog } from '@/components/plans/CreatePlanDialog';
import { EditPlanDialog } from '@/components/plans/EditPlanDialog';
import { DeletePlanAlert } from '@/components/plans/DeletePlanAlert';
import { TableSkeleton } from '@/components/skeletons/TableSkeleton';
import CustomPagination from '@/components/ui/custom-pagination';
import useErrorHandler from '@/hooks/useErrorHandler';
import { usePlans } from '@/hooks/useApi';
import type { IPlan } from '@/types/general';
import { FaCoins } from 'react-icons/fa';

const LIMIT = 20;

export default function Plans() {
  const { handleError } = useErrorHandler();
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { data, isLoading, error } = usePlans(currentPage, LIMIT);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);

  if (error) {
    handleError(error, 'Failed to fetch plans list.');
  }

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const handlePlanClick = (plan: IPlan) => {
    setSelectedPlan(plan);
    setViewDialogOpen(true);
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleEditClick = (plan: IPlan) => {
    setSelectedPlan(plan);
    setViewDialogOpen(false);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (plan: IPlan) => {
    setSelectedPlan(plan);
    setViewDialogOpen(false);
    setDeleteAlertOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedPlan(null);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedPlan(null);
  };

  const handleDeleteAlertClose = () => {
    setDeleteAlertOpen(false);
    setSelectedPlan(null);
  };

  const handleDeleteSuccess = () => {
    setSelectedPlan(null);
  };

  const plans = data?.plans || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Plans</h1>
          <p className="text-muted-foreground">
            Create and manage recharge plans for users.
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Create Plan
        </Button>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : plans.length > 0 ? (
          <>
            <PlansTable
              plans={plans}
              currentPage={currentPage}
              limit={LIMIT}
              onPlanClick={handlePlanClick}
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
              <FaCoins className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">No plans found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by creating your first recharge plan.
            </p>
            <Button onClick={handleCreateClick} className="mt-4">
              <Plus className="h-4 w-4" />
              Create Plan
            </Button>
          </div>
        )}
      </div>

      <ViewPlanDialog
        plan={selectedPlan}
        open={viewDialogOpen}
        onClose={handleViewDialogClose}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <CreatePlanDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
      />

      <EditPlanDialog
        plan={selectedPlan}
        open={editDialogOpen}
        onClose={handleEditDialogClose}
      />

      <DeletePlanAlert
        plan={selectedPlan}
        open={deleteAlertOpen}
        onClose={handleDeleteAlertClose}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}