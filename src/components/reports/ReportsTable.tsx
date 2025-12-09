import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { IReport } from "@/types/general";

interface ReportsTableProps {
  reports: IReport[];
  currentPage: number;
  limit: number;
}

export const ReportsTable = ({ reports, currentPage, limit }: ReportsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const getStatusBadgeVariant = (status: string): "success" | "warning" | "destructive" | "secondary" => {
    switch (status) {
      case 'RESOLVED':
        return 'success';
      case 'UNDER_REVIEW':
        return 'warning';
      case 'DISMISSED':
        return 'destructive';
      case 'PENDING':
      default:
        return 'secondary';
    }
  };

  const truncateDescription = (description: string, maxLength: number = 50) => {
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  return (
    <div className="rounded-md border-none">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="px-4 text-center">No.</TableHead>
            <TableHead className="px-8">Reporter</TableHead>
            <TableHead className="px-8">Reported Against</TableHead>
            <TableHead className="px-8 w-full">Description</TableHead>
            <TableHead className="px-8 text-center">Status</TableHead>
            <TableHead className="px-8 text-center">Date</TableHead>
            <TableHead className="px-4" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => (
            <TableRow
              key={report._id}
              onClick={() => handleRowClick(report._id)}
              className="cursor-pointer hover:bg-muted/30"
            >
              <TableCell className="font-medium px-4 text-center">
                {(currentPage - 1) * limit + index + 1}
              </TableCell>

              <TableCell className="px-8">
                <div className="font-medium">{report.reportedByName}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {report.reportedBy}
                </div>
              </TableCell>

              <TableCell className="px-8">
                <div className="font-medium">{report.reportedAgainstName}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {report.reportedAgainst}
                </div>
              </TableCell>

              <TableCell className="px-8 w-full max-w-0">
                <div className="text-xs">{truncateDescription(report.description)}</div>
              </TableCell>

              <TableCell className="text-center px-8">
                <Badge
                  variant={getStatusBadgeVariant(report.status)}
                  className="capitalize"
                >
                  {report.status.toLowerCase().replace('_', ' ')}
                </Badge>
              </TableCell>

              <TableCell className="px-8 text-center">
                <div className="font-medium">
                  {format(new Date(report.createdAt), "MMM do, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(report.createdAt), "hh:mm a")}
                </div>
              </TableCell>

              <TableCell className="text-right px-4">
                <Button size="icon-sm" variant="outline">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};