import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format, differenceInYears, formatDistanceToNow } from "date-fns";
import type { IUserDetails } from "@/types/general";

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="mt-1 text-sm font-medium text-foreground sm:mt-0">{value}</dd>
  </div>
);

interface UserInfoCardProps {
  user: IUserDetails;
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name || 'N/A'}</CardTitle>
        <CardDescription>
          User account information and details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <dl className="space-y-4">
          <DetailItem label="Phone Number" value={user.phone} />
          <DetailItem label="Gender" value={user.gender ? (
            <span className="capitalize">{user.gender.toLowerCase()}</span>
          ) : 'N/A'} />
          <DetailItem
            label="Date of Birth"
            value={user.dob ? format(new Date(user.dob), "dd MMMM, yyyy") : 'N/A'}
          />
          <DetailItem
            label="Age"
            value={user.dob ? `${differenceInYears(new Date(), new Date(user.dob))} years old` : 'N/A'}
          />
          <DetailItem label="Account Status" value={
            <Badge variant={user.accountStatus === 'ACTIVE' ? 'success' : 'destructive'} className="capitalize">
              {user.accountStatus.toLowerCase()}
            </Badge>
          } />
          <DetailItem label="Wallet Balance" value={
            <span className="font-mono">{user.walletBalance || 0} coins</span>
          } />
          <DetailItem label="Joined" value={`${formatDistanceToNow(new Date(user.createdAt))} ago`} />
          <DetailItem label="Registration Date" value={format(new Date(user.createdAt), "dd MMMM, yyyy 'at' hh:mm a")} />
        </dl>
      </CardContent>
    </Card>
  );
}