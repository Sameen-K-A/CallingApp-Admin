import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeletePlan } from "@/hooks/useApi";
import type { IPlan } from "@/types/general";
import { getErrorMessage } from "@/utils/helper";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

interface DeletePlanAlertProps {
  plan: IPlan | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeletePlanAlert = ({ plan, open, onClose, onSuccess }: DeletePlanAlertProps) => {
  const deletePlan = useDeletePlan();

  const handleDelete = async () => {
    if (!plan) return;

    try {
      const response = await deletePlan.mutateAsync(plan._id);
      toast.success(response.message || "Plan deleted successfully.");

      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to delete plan.");
    }
  };

  if (!plan) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              This action will delete the following plan:
            </p>
            <div className="mt-3 p-3 bg-muted rounded-md space-y-1">
              <p className="font-medium">
                Amount: ₹{plan.amount.toFixed(2)}
              </p>
              <p className="font-medium">
                Coins: {plan.coins}
              </p>
              {plan.discountPercentage > 0 && (
                <p className="font-medium text-green-500">
                  Discount: {plan.discountPercentage}%
                </p>
              )}
            </div>
            <p className="text-red-500 font-medium mt-3">
              This plan will be permanently removed and cannot be recovered.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePlan.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deletePlan.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            <Trash />
            Yes, Delete
            {deletePlan.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};