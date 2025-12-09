import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IPlan } from "@/types/general";
import { ChevronRight } from "lucide-react";

interface PlansTableProps {
  plans: IPlan[];
  currentPage: number;
  limit: number;
  onPlanClick: (plan: IPlan) => void;
};

export const PlansTable = ({ plans, currentPage, limit, onPlanClick }: PlansTableProps) => {
  return (
    <div className="rounded-md border-none">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="px-4 text-center">No.</TableHead>
            <TableHead className="px-8 w-full">Amount</TableHead>
            <TableHead className="px-8 text-center">Coins</TableHead>
            <TableHead className="px-8 text-center">Discount</TableHead>
            <TableHead className="px-8 text-center">Status</TableHead>
            <TableHead className="px-4 text-center" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {plans.map((plan, index) => (
            <TableRow
              key={plan._id}
              onClick={() => onPlanClick(plan)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium px-4 text-center">
                {(currentPage - 1) * limit + index + 1}
              </TableCell>

              <TableCell className="px-8">
                <span className="font-medium">
                  ₹{plan.amount.toFixed(2)}
                </span>
              </TableCell>

              <TableCell className="text-center px-8">
                {plan.coins} <span className="text-muted-foreground">- coins</span>
              </TableCell>

              <TableCell className="text-center px-8">
                {plan.discountPercentage > 0 ? (
                  <span className="font-medium text-green-600">
                    {plan.discountPercentage}%
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>

              <TableCell className="text-center px-8">
                <Badge variant={plan.isActive ? "success" : "secondary"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell className="px-8 text-center">
                <Button size="icon-sm" variant="outline">
                  <ChevronRight />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};