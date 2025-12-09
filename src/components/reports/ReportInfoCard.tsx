import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { FileWarning, CheckCircle, Clock, XCircle, AlertTriangle, FileText, MessageCircle } from "lucide-react";
import type { IReportDetails } from "@/types/general";

interface ReportInfoCardProps {
  report: IReportDetails;
}

export const ReportInfoCard = ({ report }: ReportInfoCardProps) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'UNDER_REVIEW':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'DISMISSED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PENDING':
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'This report has been reviewed and resolved. Appropriate action has been taken.';
      case 'UNDER_REVIEW':
        return 'This report is currently being investigated by admin.';
      case 'DISMISSED':
        return 'This report has been reviewed and dismissed. No action was required.';
      case 'PENDING':
      default:
        return 'This report is waiting for admin review and investigation.';
    }
  };

  const getStatusBoxStyles = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30';
      case 'UNDER_REVIEW':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800/30';
      case 'DISMISSED':
        return 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/30';
      case 'PENDING':
      default:
        return 'bg-muted/50 border-border';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${format(date, "MMM do, yyyy")} at ${format(date, "hh:mm:ss a")}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
          <FileWarning className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg">Report Information</CardTitle>
          <p className="text-sm text-muted-foreground">Details about this report submission</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Report Details */}
        <div className="grid gap-2.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-muted-foreground">Report ID</span>
            <span className="text-sm font-mono bg-muted/70 px-2.5 py-1 rounded border text-foreground">
              {report._id}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(report.status)}
              <Badge
                variant={getStatusBadgeVariant(report.status)}
                className="capitalize font-medium"
              >
                {report.status.toLowerCase().replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-muted-foreground">Created At</span>
            <span className="text-sm font-medium text-foreground text-right">
              {formatDateTime(report.createdAt)}
            </span>
          </div>

          {report.resolvedAt && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">Resolved At</span>
              <span className="text-sm font-medium text-foreground text-right">
                {formatDateTime(report.resolvedAt)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Status Information */}
        <div className={`rounded-lg p-3.5 border ${getStatusBoxStyles(report.status)}`}>
          <div className="flex items-center gap-2.5 mb-2">
            {getStatusIcon(report.status)}
            <span className="font-semibold text-sm text-foreground">Current Status</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {getStatusMessage(report.status)}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm text-foreground">Report Description</h4>
          </div>
          <div className="bg-muted/40 rounded-lg p-3.5 border border-border">
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {report.description}
            </p>
          </div>
        </div>

        {/* Admin Notes */}
        {report.adminNotes && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <h4 className="font-semibold text-sm text-foreground">Admin Notes</h4>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 dark:bg-blue-950/20 dark:border-blue-800/30">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {report.adminNotes}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};