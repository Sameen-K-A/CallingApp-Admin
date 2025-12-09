import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format, differenceInYears, formatDistanceToNow } from "date-fns";
import type { ITelecaller } from "@/types/general";

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="mt-1 text-sm font-medium text-foreground sm:mt-0">{value}</dd>
  </div>
);

const getStatusBadgeVariant = (status: string): "success" | "warning" | "destructive" => {
  switch (status) {
    case 'APPROVED': return 'success';
    case 'PENDING': return 'warning';
    case 'REJECTED': return 'destructive';
    default: return 'warning';
  }
};

interface TelecallerInfoCardProps {
  telecaller: ITelecaller;
}

export function TelecallerInfoCard({ telecaller }: TelecallerInfoCardProps) {
  const status = telecaller.telecallerProfile.approvalStatus;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{telecaller.name || 'N/A'}</CardTitle>
        <CardDescription>
          Application status:
          <Badge variant={getStatusBadgeVariant(status)} className="ml-2 capitalize">
            {status.toLowerCase()}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <dl className="space-y-4">
          <DetailItem label="Phone Number" value={telecaller.phone} />
          <DetailItem label="Gender" value={telecaller.gender || 'N/A'} />
          <DetailItem
            label="Date of Birth"
            value={telecaller.dob ? format(new Date(telecaller.dob), "dd MMMM, yyyy") : 'N/A'}
          />
          <DetailItem
            label="Age"
            value={telecaller.dob ? `${differenceInYears(new Date(), new Date(telecaller.dob))} years old` : 'N/A'}
          />
          <DetailItem label="Account Status" value={
            <Badge variant={telecaller.accountStatus === 'ACTIVE' ? 'success' : 'destructive'} className="capitalize">
              {telecaller.accountStatus.toLowerCase()}
            </Badge>
          } />
          <DetailItem label="Wallet Balance" value={
            <span className="font-mono">₹{telecaller.walletBalance.toFixed(2)}</span>
          } />
          <DetailItem label="Joined" value={`${formatDistanceToNow(new Date(telecaller.createdAt))} ago`} />
        </dl>
        <Separator />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
          <p className="text-sm text-foreground leading-relaxed bg-muted p-4 rounded-md">
            {telecaller.telecallerProfile.about}
          </p>
        </div>

        {status === 'REJECTED' && telecaller.telecallerProfile.verificationNotes && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Reason for Rejection</h3>
              <p className="text-sm text-red-500 leading-relaxed bg-destructive/10 p-4 rounded-md">
                {telecaller.telecallerProfile.verificationNotes}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}