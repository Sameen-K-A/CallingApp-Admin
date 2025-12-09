import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, UserCheck, UserX, Shield } from "lucide-react";
import type { IReportDetails } from "@/types/general";

interface UsersInfoCardProps {
  report: IReportDetails;
}

export const UsersInfoCard = ({ report }: UsersInfoCardProps) => {
  const { reporter, reportedAgainst } = report;

  const getAccountStatusBadgeVariant = (status: string): "success" | "destructive" => {
    return status === 'ACTIVE' ? 'success' : 'destructive';
  };

  const UserInfoSection = ({
    user,
    title,
    icon
  }: {
    user: typeof reporter,
    title: string,
    icon: React.ReactNode
  }) => (
    <div className="space-y-3 w-full">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-semibold text-sm text-foreground">{title}</h4>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">User ID</span>
          <span className="text-sm font-mono bg-muted/70 px-2.5 py-1 rounded border text-foreground">
            {user._id}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">Name</span>
          <span className="text-sm font-medium text-foreground">{user.name}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">Phone</span>
          <span className="text-sm font-medium text-foreground">{user.phone}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">Role</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize font-medium">
              {user.role.toLowerCase()}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">Account Status</span>
          <Badge
            variant={getAccountStatusBadgeVariant(user.accountStatus)}
            className="capitalize font-medium"
          >
            {user.accountStatus.toLowerCase()}
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
          <Users className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg">Users Information</CardTitle>
          <p className="text-sm text-muted-foreground">Details about both users involved in this report</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid lg:grid-cols-[4fr_1fr_4fr] gap-4 items-start">
          <UserInfoSection
            user={reporter}
            title="Reporter (Who Reported)"
            icon={<UserCheck className="h-4 w-4 text-green-500" />}
          />

          <div className="flex justify-center items-center h-full">
            <Separator orientation="vertical" className="hidden lg:block h-full min-h-[200px]" />
            <Separator orientation="horizontal" className="md:hidden w-full" />
          </div>

          <UserInfoSection
            user={reportedAgainst}
            title="Reported Against (Who Was Reported)"
            icon={<UserX className="h-4 w-4 text-red-500" />}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm text-foreground">Report Context</h4>
          </div>

          <div className="bg-muted/40 rounded-lg p-3.5 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">{reporter.name}</span> ({reporter.role.toLowerCase()})
              has reported <span className="font-medium text-foreground">{reportedAgainst.name}</span> ({reportedAgainst.role.toLowerCase()})
              for inappropriate behavior during their call session.
              {reportedAgainst.accountStatus === 'SUSPENDED' && (
                <span className="text-red-600 font-medium dark:text-red-400"> The reported user is currently suspended.</span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};