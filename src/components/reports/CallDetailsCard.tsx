import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Phone, Coins, MessageSquare, Calendar, Timer, Info } from "lucide-react";
import type { IReportDetails } from "@/types/general";

interface CallDetailsCardProps {
  report: IReportDetails;
}

export const CallDetailsCard = ({ report }: CallDetailsCardProps) => {
  const { call } = report;

  const getCallStatusBadgeVariant = (status: string): "success" | "warning" | "destructive" | "secondary" => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'ACCEPTED':
      case 'RINGING':
        return 'warning';
      case 'REJECTED':
      case 'MISSED':
      case 'CANCELLED':
        return 'destructive';
      case 'INITIATED':
      default:
        return 'secondary';
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getEndReasonMessage = (endReason?: string) => {
    switch (endReason) {
      case 'NORMAL':
        return 'Call ended normally';
      case 'INSUFFICIENT_BALANCE':
        return 'Call ended due to insufficient balance';
      case 'USER_HANGUP':
        return 'User ended the call';
      case 'TELECALLER_HANGUP':
        return 'Telecaller ended the call';
      case 'NETWORK_ISSUE':
        return 'Call ended due to network issues';
      case 'TIMEOUT':
        return 'Call ended due to timeout';
      case 'REJECTED':
        return 'Call was rejected';
      case 'MISSED':
        return 'Call was missed';
      default:
        return 'Unknown reason';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
          <Phone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg">Call Details</CardTitle>
          <p className="text-sm text-muted-foreground">Information about the reported call session</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Basic Call Information */}
        <div className="grid gap-2.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-muted-foreground">Call ID</span>
            <span className="text-sm font-mono bg-muted/70 px-2.5 py-1 rounded border text-foreground">
              {call._id}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <Badge
              variant={getCallStatusBadgeVariant(call.status)}
              className="capitalize font-medium"
            >
              {call.status.toLowerCase()}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-muted-foreground">Duration</span>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{formatDuration(call.durationInSeconds)}</span>
            </div>
          </div>

          {call.endedBy && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">Ended By</span>
              <span className="text-sm font-medium text-foreground capitalize">
                {call.endedBy.toLowerCase()}
              </span>
            </div>
          )}

          {call.endReason && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">End Reason</span>
              <div className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-foreground">{getEndReasonMessage(call.endReason)}</span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Call Timeline Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm text-foreground">Call Timeline</h4>
          </div>

          <div className="grid gap-2.5 pl-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">Initiated At</span>
              <span className="text-sm font-medium text-foreground">
                {format(new Date(call.initiatedAt), "MMM do, yyyy h:mm:ss a")}
              </span>
            </div>

            {call.acceptedAt && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground">Accepted At</span>
                <span className="text-sm font-medium text-foreground">
                  {format(new Date(call.acceptedAt), "MMM do, yyyy h:mm:ss a")}
                </span>
              </div>
            )}

            {call.endedAt && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground">Ended At</span>
                <span className="text-sm font-medium text-foreground">
                  {format(new Date(call.endedAt), "MMM do, yyyy h:mm:ss a")}
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Financial Details Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm text-foreground">Financial Details</h4>
          </div>

          <div className="grid gap-2.5 pl-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">Coins Spent (User)</span>
              <span className="text-sm font-medium text-foreground font-mono">{call.coinsSpent.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">Coins Earned (Telecaller)</span>
              <span className="text-sm font-medium text-foreground font-mono">{call.coinsEarned.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        {(call.userFeedback || call.telecallerFeedback) && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm text-foreground">Post-Call Feedback</h4>
              </div>

              <div className="space-y-3 pl-1.5">
                {call.userFeedback && (
                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-muted-foreground">User Feedback</span>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 dark:bg-blue-950/20 dark:border-blue-800/30">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{call.userFeedback}</p>
                    </div>
                  </div>
                )}

                {call.telecallerFeedback && (
                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-muted-foreground">Telecaller Feedback</span>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3.5 dark:bg-green-950/20 dark:border-green-800/30">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{call.telecallerFeedback}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};