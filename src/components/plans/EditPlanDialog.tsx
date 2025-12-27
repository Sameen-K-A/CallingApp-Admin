import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPlanSchema, type EditPlanInput } from "@/schemas/plan.schema";
import { useUpdatePlan } from "@/hooks/useApi";
import type { IPlan } from "@/types/general";
import { Loader2, X, IndianRupee, Percent, Info, FilePenLine } from "lucide-react";
import { FaCoins } from "react-icons/fa";
import { useEffect } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helper";

interface EditPlanDialogProps {
  plan: IPlan | null;
  open: boolean;
  onClose: () => void;
}

export const EditPlanDialog = ({ plan, open, onClose }: EditPlanDialogProps) => {
  const updatePlan = useUpdatePlan();

  const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm<EditPlanInput>({
    resolver: zodResolver(editPlanSchema),
  });

  const isActive = useWatch({
    control,
    name: "isActive",
  });

  useEffect(() => {
    if (plan) {
      reset({
        amount: plan.amount,
        coins: plan.coins,
        discountPercentage: plan.discountPercentage,
        isActive: plan.isActive,
      });
    }
  }, [plan, reset]);

  const onSubmit = async (data: EditPlanInput) => {
    if (!plan) return;

    try {
      const updateData: EditPlanInput = {};

      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.coins !== undefined) updateData.coins = data.coins;
      if (data.discountPercentage !== undefined) updateData.discountPercentage = data.discountPercentage;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      const response = await updatePlan.mutateAsync({
        planId: plan._id,
        planData: updateData,
      });

      toast.success(response.message || "Plan updated successfully.");
      reset();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to update plan.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="w-[95vw] max-w-2xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col"
        showCloseButton={false}
      >

        <div className="relative bg-linear-to-br from-primary/10 via-primary/5 to-background p-4 sm:p-6 shrink-0 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 top-2 sm:top-4 rounded-full h-8 w-8 sm:h-10 sm:w-10"
            onClick={handleClose}
            disabled={updatePlan.isPending}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-2 pr-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <FilePenLine className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xl sm:text-2xl">Edit Plan</DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">Update plan details and settings</p>
              </div>
              <Badge
                variant={isActive ? "success" : "secondary"}
                className="shrink-0 hidden sm:inline-flex"
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form id="edit-plan-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4 sm:p-6 space-y-6">

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-orange-600" />
                    <span>Amount (₹)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="e.g., 99"
                      className={`pl-8 h-11 ${errors.amount ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      {...register("amount", { valueAsNumber: true })}
                    />
                    <IndianRupee className="absolute left-2.5 top-3 h-5 w-5 text-muted-foreground" />
                  </div>
                  {errors.amount ? (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
                      {errors.amount.message}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Enter the original price</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coins" className="flex items-center gap-2">
                    <FaCoins className="h-4 w-4 text-amber-600" />
                    <span>Coins</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="coins"
                      type="number"
                      placeholder="e.g., 500"
                      className={`pl-8 h-11 ${errors.coins ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      {...register("coins", { valueAsNumber: true })}
                    />
                    <FaCoins className="absolute left-2.5 top-3 h-5 w-5 text-muted-foreground" />
                  </div>
                  {errors.coins ? (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
                      {errors.coins.message}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Number of coins to credit</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPercentage" className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-green-600" />
                  <span>Discount Percentage</span>
                </Label>
                <div className="relative">
                  <Input
                    id="discountPercentage"
                    type="number"
                    placeholder="e.g., 20"
                    className={`pl-8 h-11 ${errors.discountPercentage ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    {...register("discountPercentage", { valueAsNumber: true })}
                  />
                  <Percent className="absolute left-2.5 top-3 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.discountPercentage ? (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
                    {errors.discountPercentage.message}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Add a discount (0-99%). Set to 0 for no discount.
                  </p>
                )}
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive" className="text-base font-medium cursor-pointer">
                      Plan Status
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {isActive
                        ? "Plan is currently visible to users"
                        : "Plan is hidden from users"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={isActive ? "success" : "secondary"} className="sm:hidden">
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Important Notes</p>
                    <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                      <li>Changes will affect this plan immediately</li>
                      <li>Existing user purchases are not affected</li>
                      <li>Toggle status to hide/show plan without deleting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="border-t bg-muted/30 p-4 sm:p-6 shrink-0">
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updatePlan.isPending}
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-plan-form"
              disabled={updatePlan.isPending}
              className="min-w-32"
            >
              {updatePlan.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FilePenLine className="h-4 w-4" />
                  Update Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};