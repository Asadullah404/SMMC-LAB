// src/components/ReportPreview.tsx
import { LabReport } from "@/types/lab-report";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ReportPreviewProps {
  report: LabReport;
}

export function ReportPreview({ report }: ReportPreviewProps) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-lg font-bold">Report: {report.reportId}</h2>
        <Badge variant="outline">Verified</Badge>
      </div>
      <div className="text-sm">
        <p><span className="font-semibold">Patient:</span> {report.patient.name}</p>
        <p><span className="font-semibold">Doctor:</span> {report.patient.referringDoctor}</p>
        <p><span className="font-semibold">Date:</span> {report.verificationDate}</p>
      </div>
    </div>
  );
}
