import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { IPlan } from "@/types/general";
import { format } from "date-fns";
import { Trash2, IndianRupee, Percent, Calendar, X, FilePenLine } from "lucide-react";
import { FaCoins } from "react-icons/fa";

interface ViewPlanDialogProps {
  plan: IPlan | null;
  open: boolean;
  onClose: () => void;
  onEdit: (plan: IPlan) => void;
  onDelete: (plan: IPlan) => void;
}

export const ViewPlanDialog = ({ plan, open, onClose, onEdit, onDelete }: ViewPlanDialogProps) => {
  if (!plan) return null;

  const calculateFinalAmount = (amount: number, discount: number) => {
    return amount - (amount * discount / 100);
  };

  const finalAmount = calculateFinalAmount(plan.amount, plan.discountPercentage);
  const savings = plan.amount - finalAmount;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] max-w-lg p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col"
        showCloseButton={false}
      >
        <div className="relative bg-linear-to-br from-primary/10 via-primary/5 to-background p-4 sm:p-6 pb-6 sm:pb-8 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 top-2 sm:top-4 rounded-full h-8 w-8 sm:h-10 sm:w-10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-2 sm:space-y-3 pr-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-xl sm:text-2xl truncate">Plan Details</DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Recharge plan information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

            <div className="flex justify-center">
              <Badge
                variant={plan.isActive ? "success" : "secondary"}
                className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium"
              >
                {plan.isActive ? "✓ Active Plan" : "Inactive Plan"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">

              <div className="relative overflow-hidden rounded-lg border bg-card p-3 sm:p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                      Original Price
                    </p>
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      ₹{plan.amount}
                    </p>
                  </div>
                  <div className="rounded-full bg-orange-500/10 p-1.5 sm:p-2 shrink-0 ml-2">
                    <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg border bg-card p-3 sm:p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                      Coins
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-amber-600 truncate">
                      {plan.coins}
                    </p>
                  </div>
                  <div className="rounded-full bg-amber-500/10 p-1.5 sm:p-2 shrink-0 ml-2">
                    <FaCoins className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Percent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Discount Applied</span>
                </div>
                {plan.discountPercentage > 0 ? (
                  <Badge variant="outline" className="bg-green-600 text-white border-green-600 text-xs shrink-0">
                    {plan.discountPercentage}% OFF
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground text-xs shrink-0">
                    No Discount
                  </Badge>
                )}
              </div>

              <Separator className="my-2 sm:my-3" />

              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Final Amount</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 truncate">
                    ₹{finalAmount}
                  </p>
                </div>
                {plan.discountPercentage > 0 && (
                  <div className="text-right min-w-0 shrink-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">You Save</p>
                    <p className="text-base sm:text-lg font-semibold text-green-600 truncate">
                      ₹{savings}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 text-sm">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Created</p>
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {format(new Date(plan.createdAt), "dd MMM yyyy 'at' hh:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-sm">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {format(new Date(plan.updatedAt), "dd MMM yyyy 'at' hh:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t bg-muted/30 p-3 sm:p-4 shrink-0">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="flex-1 text-destructive hover:text-destructive text-xs sm:text-sm h-9 sm:h-10"
              onClick={() => onDelete(plan)}
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Delete
            </Button>

            <Button
              className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
              onClick={() => onEdit(plan)}
            >
              <FilePenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};