import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlanSchema, type CreatePlanInput } from "@/schemas/plan.schema";
import { useCreatePlan } from "@/hooks/useApi";
import { Loader2, X, IndianRupee, Percent, Calculator, TrendingDown } from "lucide-react";
import { FaCoins } from "react-icons/fa";
import { useMemo } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helper";

interface CreatePlanDialogProps {
  open: boolean;
  onClose: () => void;
};

export const CreatePlanDialog = ({ open, onClose }: CreatePlanDialogProps) => {
  const createPlan = useCreatePlan();

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<CreatePlanInput>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      discountPercentage: 0,
    },
  });

  const watchedAmount = useWatch({ control, name: "amount" });
  const watchedDiscount = useWatch({ control, name: "discountPercentage" });
  const watchedCoins = useWatch({ control, name: "coins" });

  const calculatedValues = useMemo(() => {
    const amount = watchedAmount || 0;
    const discount = watchedDiscount || 0;
    const coins = watchedCoins || 0;
    const savings = amount * discount / 100;
    const finalAmount = amount - savings;
    return { amount, discount, coins, savings, finalAmount };
  }, [watchedAmount, watchedDiscount, watchedCoins]);

  const onSubmit = async (data: CreatePlanInput) => {
    try {
      const response = await createPlan.mutateAsync(data);
      toast.success(response.message || "Plan created successfully.");
      reset();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to create plan.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

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
            disabled={createPlan.isPending}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-2 pr-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <FaCoins className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-xl sm:text-2xl">Create New Plan</DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">Add a new recharge plan for users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form id="create-plan-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4 sm:p-6 space-y-6">

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-orange-600" />
                    <span>Amount (₹)</span>
                    <span className="text-destructive">*</span>
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
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="coins"
                      type="number"
                      placeholder="e.g., 500"
                      className={`pl-10 h-11 ${errors.coins ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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
                  <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="discountPercentage"
                    type="number"
                    placeholder="e.g., 20"
                    defaultValue={0}
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
                    Add a discount (0-99%). Leave at 0 for no discount.
                  </p>
                )}
              </div>

              {/* Real-time Calculator Preview */}
              <div className="rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-background to-green-500/5 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Calculator className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Live Price Calculator</p>
                    <p className="text-xs text-muted-foreground">Preview of final pricing</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Original Price */}
                  <div className="rounded-lg bg-background/80 border p-3 text-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1">Original</p>
                    <p className="text-base sm:text-lg font-bold text-foreground">
                      ₹{calculatedValues.amount.toLocaleString()}
                    </p>
                  </div>

                  {/* Discount Savings */}
                  <div className="rounded-lg bg-background/80 border p-3 text-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1">Savings</p>
                    <p className="text-base sm:text-lg font-bold text-red-500">
                      {calculatedValues.savings > 0 ? `-₹${calculatedValues.savings.toLocaleString()}` : "₹0"}
                    </p>
                  </div>

                  {/* Coins */}
                  <div className="rounded-lg bg-background/80 border p-3 text-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1">Coins</p>
                    <p className="text-base sm:text-lg font-bold text-amber-600">
                      {calculatedValues.coins.toLocaleString()}
                    </p>
                  </div>

                  {/* Final Amount */}
                  <div className="rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-3 text-center">
                    <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">Final</p>
                    <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                      ₹{calculatedValues.finalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {calculatedValues.discount > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      <Badge variant="outline" className="bg-green-600 text-white border-green-600 text-xs">
                        {calculatedValues.discount}% OFF
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        User pays <span className="font-semibold text-green-600">₹{calculatedValues.finalAmount.toLocaleString()}</span> for <span className="font-semibold text-amber-600">{calculatedValues.coins.toLocaleString()}</span> coins
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="border-t bg-muted/30 p-3 sm:p-4 shrink-0">
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createPlan.isPending}
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-plan-form"
              disabled={createPlan.isPending}
              className="min-w-32"
            >
              {createPlan.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FaCoins className="h-4 w-4" />
                  Create Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};