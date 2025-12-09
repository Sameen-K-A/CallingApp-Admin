import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import apiClient from '@/lib/axios';
import useErrorHandler from '@/hooks/useErrorHandler';
import type { IReportDetails } from '@/types/general';
import { ReportDetailsSkeleton } from '@/components/skeletons/ReportDetailsSkeleton';
import { ReportInfoCard } from '@/components/reports/ReportInfoCard';
import { CallDetailsCard } from '@/components/reports/CallDetailsCard';
import { UsersInfoCard } from '@/components/reports/UsersInfoCard';
import { AdminActionsCard } from '@/components/reports/AdminActionsCard';

interface IApiResponse {
  success: boolean;
  data: IReportDetails | null;
}

export default function ReportDetails() {
  const { id: reportId } = useParams<{ id: string }>();
  const [report, setReport] = useState<IReportDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const fetchReportDetails = async () => {
    if (!reportId) return;
    setIsLoading(true);

    try {
      const { data } = await apiClient.get<IApiResponse>(`/admin/reports/${reportId}`);
      if (data.success && data.data) {
        setReport(data.data);
      } else {
        throw new Error("Failed to fetch report details.");
      }
    } catch (error) {
      handleError(error, "Could not load report information.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportDetails();
  }, [reportId]);

  const handleReportUpdate = (updatedFields: { status: string, adminNotes?: string, resolvedAt?: string }) => {
    if (!report) return;

    setReport(prevReport => ({
      ...prevReport!,
      status: updatedFields.status as any,
      adminNotes: updatedFields.adminNotes,
      resolvedAt: updatedFields.resolvedAt
    }));
  };

  const handleUserStatusUpdate = (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED') => {
    if (!report) return;

    setReport(prevReport => {
      const updatedReport = { ...prevReport! };

      if (updatedReport.reporter._id === userId) {
        updatedReport.reporter = {
          ...updatedReport.reporter,
          accountStatus: newStatus
        };
      }

      if (updatedReport.reportedAgainst._id === userId) {
        updatedReport.reportedAgainst = {
          ...updatedReport.reportedAgainst,
          accountStatus: newStatus
        };
      }

      return updatedReport;
    });
  };

  if (isLoading) {
    return <ReportDetailsSkeleton />;
  }

  if (!report) {
    return (
      <div className="text-center h-full flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold">Report Not Found</h2>
        <p className="text-muted-foreground">The requested report does not exist.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Details</h1>
          <p className="text-muted-foreground">
            Review the complete information and take appropriate action.
          </p>
        </div>
      </div>

      <div className="grid gap-6">

        <div className="grid gap-6 lg:grid-cols-2">
          <ReportInfoCard report={report} />
          <CallDetailsCard report={report} />
        </div>

        <UsersInfoCard report={report} />

        <AdminActionsCard
          report={report}
          onReportUpdate={handleReportUpdate}
          onUserStatusUpdate={handleUserStatusUpdate}
        />
      </div>
    </div>
  );
}