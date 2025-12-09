import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface TelecallerComplaint {
  _id: string;
  reportedBy: string;
  reportedByName: string;
  description: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

interface TelecallerComplaintsCardProps {
  complaints: TelecallerComplaint[];
  totalComplaints: number;
}

export const TelecallerComplaintsCard = ({ complaints, totalComplaints }: TelecallerComplaintsCardProps) => {
  const navigate = useNavigate();

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

  const truncateDescription = (description: string, maxLength: number = 80) => {
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  const handleRowClick = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg">Complaints Against Telecaller</CardTitle>
          <p className="text-sm text-muted-foreground">
            {totalComplaints > 0
              ? `Showing ${Math.min(5, complaints.length)} of ${totalComplaints} total complaints`
              : 'No complaints filed against this telecaller'
            }
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {complaints.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="px-4">Reporter</TableHead>
                  <TableHead className="px-4 w-full">Description</TableHead>
                  <TableHead className="px-4 text-center">Status</TableHead>
                  <TableHead className="px-4 text-center">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow
                    key={complaint._id}
                    onClick={() => handleRowClick(complaint._id)}
                    className="cursor-pointer hover:bg-muted/30"
                  >
                    <TableCell className="px-4">
                      <div className="font-medium">{complaint.reportedByName}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {complaint.reportedBy}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 w-full max-w-0">
                      <div className="text-sm text-foreground">
                        {truncateDescription(complaint.description)}
                      </div>
                    </TableCell>

                    <TableCell className="text-center px-4">
                      <Badge
                        variant={getStatusBadgeVariant(complaint.status)}
                        className="capitalize font-medium"
                      >
                        {complaint.status.toLowerCase().replace('_', ' ')}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 text-center">
                      <div className="font-medium text-sm">
                        {format(new Date(complaint.createdAt), "MMM do, yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(complaint.createdAt), "hh:mm a")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Complaints</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This telecaller has a clean record with no complaints filed against them.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};