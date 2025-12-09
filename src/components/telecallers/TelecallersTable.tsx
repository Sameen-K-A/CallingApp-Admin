import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ITelecaller } from "@/types/general";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TelecallersTableProps {
  telecallers: ITelecaller[];
  currentPage: number;
  limit: number;
}

export const TelecallersTable = ({ telecallers, currentPage, limit }: TelecallersTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (telecallerId: string) => {
    navigate(`/telecallers/${telecallerId}`);
  };

  return (
    <div className="rounded-md border-none">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="px-8 text-center">No.</TableHead>
            <TableHead className="px-8 w-full">Name</TableHead>
            <TableHead className="px-8 text-center">Phone</TableHead>
            <TableHead className="px-8 text-center">Joined On</TableHead>
            <TableHead className="px-8 text-center">Status</TableHead>
            <TableHead className="px-8 text-center" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {telecallers.map((telecaller, index) => (
            <TableRow
              key={telecaller._id}
              onClick={() => handleRowClick(telecaller._id)}
              className="cursor-pointer"
            >

              <TableCell className="font-medium px-8 text-center">
                {(currentPage - 1) * limit + index + 1}
              </TableCell>

              <TableCell className="px-8 w-full max-w-0">
                <span className="block truncate">
                  {telecaller.name || "N/A"}
                </span>
              </TableCell>

              <TableCell className="px-8 text-center">
                {telecaller.phone}
              </TableCell>

              <TableCell className="px-8 text-center">
                {format(telecaller.createdAt, "dd/LL/yyyy")}
              </TableCell>

              <TableCell className="px-8 text-center capitalize">
                <Badge variant={telecaller.accountStatus === "ACTIVE" ? "success" : "warning"}>
                  {telecaller.accountStatus.toLowerCase()}
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