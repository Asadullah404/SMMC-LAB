// src/pages/Reports.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Printer, ArrowLeft, AlertTriangle, FileText } from "lucide-react";
import { getTestTemplates, getCanvasTemplate } from "@/lib/testStorage";
import { downloadReportAsPdf, printReportAsPdf } from "@/lib/dynamicPdfGenerator";
import { TestTemplate, DynamicReportRecord } from "@/types/dynamic-test";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<DynamicReportRecord | null>(null);
  const [allTests, setAllTests] = useState<TestTemplate[]>([]);
  const [showOnlyPatientName, setShowOnlyPatientName] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchReportAndTests();
  }, [id]);

  const fetchReportAndTests = async () => {
    setLoading(true);
    try {
      const tests = await getTestTemplates();
      setAllTests(tests);

      if (!id) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, "reports", id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const raw = snapshot.data();

        // Convert legacy format if needed
        let formattedReport: DynamicReportRecord;

        if (raw.results) {
          formattedReport = { id: snapshot.id, ...raw } as DynamicReportRecord;
        } else {
          // Adapt legacy report schema to dynamic schema
          const legacyTests: Record<string, Record<string, string | number | boolean | null | undefined>> = {};
          const selectedIds: string[] = [];

          if (raw.tests?.malarialParasites?.selected) {
            selectedIds.push("malaria-parasites");
            legacyTests["malaria-parasites"] = {
              overallResult: raw.tests.malarialParasites.result,
              pFalciparum: raw.tests.malarialParasites.pFalciparumResult,
              pVivax: raw.tests.malarialParasites.pVivaxResult,
              parasiteDensity: raw.tests.malarialParasites.parasiteDensity,
            };
          }

          if (raw.tests?.dengueNS1?.selected) {
            selectedIds.push("dengue-ns1");
            legacyTests["dengue-ns1"] = {
              result: raw.tests.dengueNS1.result,
            };
          }

          if (raw.tests?.hepBsAg?.selected) {
            selectedIds.push("hep-bs-ag");
            legacyTests["hep-bs-ag"] = {
              result: raw.tests.hepBsAg.result,
            };
          }

          if (raw.tests?.antiHCV?.selected) {
            selectedIds.push("anti-hcv");
            legacyTests["anti-hcv"] = {
              result: raw.tests.antiHCV.result,
            };
          }

          if (raw.tests?.urine?.selected) {
            selectedIds.push("urine-analysis");
            legacyTests["urine-analysis"] = { ...raw.tests.urine };
          }

          formattedReport = {
            id: snapshot.id,
            reportId: raw.reportId || id,
            patient: raw.patient || { name: "Unknown" },
            selectedTestIds: selectedIds,
            results: legacyTests,
            notes: raw.notes || "",
            technicianName: raw.technicianName || "Staff Technician",
            verifiedBy: raw.verifiedBy || "Dr. Aamir",
            verificationDate: raw.verificationDate || new Date().toISOString(),
            createdAt: raw.createdAt || new Date().toISOString(),
          };
        }

        setReport(formattedReport);
      } else {
        setReport(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading report";
      console.error("Error loading report:", err);
      toast({ title: "Fetch Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const relevantTests = allTests.filter((t) => report?.selectedTestIds?.includes(t.id));

  const handleDownload = async () => {
    if (!report) return;
    setIsDownloading(true);
    try {
      const template = await getCanvasTemplate(report.selectedTestIds[0] || "all");
      await downloadReportAsPdf({
        report,
        tests: relevantTests.length > 0 ? relevantTests : allTests,
        template,
        showOnlyPatientName,
      });
      toast({
        title: "Download Initiated",
        description: `Saved as "${report.patient.name.trim().replace(/\s+/g, "_")}.pdf"`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "PDF export failed";
      toast({ title: "PDF Error", description: msg, variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    if (!report) return;
    setIsPrinting(true);
    try {
      const template = await getCanvasTemplate(report.selectedTestIds[0] || "all");
      await printReportAsPdf({
        report,
        tests: relevantTests.length > 0 ? relevantTests : allTests,
        template,
        showOnlyPatientName,
      });
      toast({
        title: "Print Dialog Ready",
        description: "Preparing clinical report print preview...",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Print failed";
      toast({ title: "Print Error", description: msg, variant: "destructive" });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-4 py-6 max-w-4xl w-full">
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-sm text-slate-500 font-medium">Retrieving laboratory report record...</p>
          </div>
        ) : !report ? (
          <Card className="p-8 sm:p-12 text-center border-dashed border-2">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold">Report Not Found</h2>
            <p className="text-sm text-slate-500 mt-1">No laboratory record exists with ID "{id}".</p>
            <Button onClick={() => navigate("/")} className="mt-4 gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Dashboard
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-xs shrink-0">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                    Record: {report.reportId}
                  </h1>
                  <p className="text-xs text-slate-500 truncate">Patient: {report.patient.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-end">
                {/* Specific User Requirement: Toggle "Only Patient Name" in exported report */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg shrink-0">
                  <Label className="text-xs font-semibold text-blue-900 dark:text-blue-200 cursor-pointer">
                    Only Patient Name
                  </Label>
                  <Switch
                    checked={showOnlyPatientName}
                    onCheckedChange={setShowOnlyPatientName}
                  />
                </div>

                <Button
                  onClick={handlePrint}
                  disabled={isPrinting}
                  variant="outline"
                  className="gap-1.5 text-xs h-9 border-blue-200 hover:bg-blue-50 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                >
                  <Printer className="h-4 w-4" /> Print
                </Button>

                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 shadow-md shadow-blue-500/20 font-bold"
                >
                  <Download className="h-4 w-4" /> Download PDF ({report.patient.name.trim().split(" ")[0]}.pdf)
                </Button>
              </div>
            </div>

            {/* Document Card Presentation (Matches Canvas Designer) */}
            <Card className="shadow-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative">
              
              {/* Background Watermark Logo (Matches Canvas Designer & Print PDF) */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
                style={{ opacity: 0.12 }}
              >
                <img src="/logo.png" alt="watermark" className="w-[120mm] h-[120mm] max-w-[80vw] object-contain" />
              </div>

              <div className="relative z-10">
                <CardHeader className="py-6 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
                  <img
                    src="/header.png"
                    alt="Header Banner"
                    className="w-full h-auto max-h-[30mm] object-contain mx-auto mb-2"
                    onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                  />
                  <h2 className="text-xl sm:text-2xl font-black text-blue-900 dark:text-blue-400 tracking-wide">
                    SMMC LABORATORY REPORT
                  </h2>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">ISO 15189 Certified Diagnostic Center</p>
                  <Badge variant="outline" className="mx-auto mt-2 font-mono text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950">
                    {report.reportId}
                  </Badge>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-6">
                  {/* Patient Information Section */}
                  <div className="p-4 rounded-xl border border-blue-200/80 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-950/60">
                    {showOnlyPatientName ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500">Patient Name:</span>
                          <span className="text-base font-extrabold text-blue-700 dark:text-blue-400">{report.patient.name}</span>
                        </div>
                        <Badge className="bg-blue-600 text-white text-[10px] font-semibold">
                          Name-Only Mode Active
                        </Badge>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs">
                        <div>
                          <span className="font-bold text-slate-500">Patient: </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {report.patient.name} {report.patient.relation ? `(${report.patient.relation})` : ""}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Referring Doctor: </span>
                          <span>{report.patient.referringDoctor || "Self"}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Age / Gender: </span>
                          <span>{report.patient.age || "-"} / {report.patient.sex || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Sample ID: </span>
                          <span className="font-mono text-blue-600">{report.patient.sampleId}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Collection Date: </span>
                          <span>
                            {report.patient.collectionDateTime ? format(new Date(report.patient.collectionDateTime), "dd-MMM-yyyy HH:mm") : "-"}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Report Date: </span>
                          <span>{format(new Date(report.verificationDate), "dd-MMM-yyyy HH:mm")}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Findings Table (Wrapped for Responsive Horizontal Scroll) */}
                  {relevantTests.map((test) => {
                    const testVals = report.results[test.id] || {};
                    return (
                      <div key={test.id} className="rounded-xl border border-blue-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
                        <div className="bg-blue-700 text-white px-4 py-2 text-xs font-bold flex justify-between">
                          <span>{test.name.toUpperCase()}</span>
                          <span className="opacity-90 font-normal">{test.method || ""}</span>
                        </div>

                        <div className="overflow-x-auto w-full">
                          <table className="w-full text-xs text-left min-w-[500px]">
                            <thead className="bg-blue-100/70 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 font-bold border-b border-blue-200">
                              <tr>
                                <th className="p-3 w-5/12">Test Parameter</th>
                                <th className="p-3 text-center w-3/12">Observed Result</th>
                                <th className="p-3 text-center w-2/12">Unit</th>
                                <th className="p-3 text-center w-2/12">Reference Range</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 dark:divide-slate-800">
                              {test.fields.map((f, i) => {
                                const val = testVals[f.key];
                                const display = val !== undefined && val !== "" ? String(val) : "-";
                                const isAbnormal = f.options?.find((o) => o.value === display)?.isAbnormal || 
                                  display === "Positive" || display === "Reactive" || display.includes("1+") || display.includes("2+");

                                return (
                                  <tr key={f.id} className={i % 2 === 0 ? "bg-white/90 dark:bg-slate-900/90" : "bg-blue-50/30 dark:bg-slate-950/50"}>
                                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{f.label}</td>
                                    <td className={`p-3 text-center font-bold ${isAbnormal ? "text-red-600" : "text-blue-700 dark:text-blue-400"}`}>
                                      {display}
                                    </td>
                                    <td className="p-3 text-center text-slate-500 font-mono">{f.unit || "-"}</td>
                                    <td className="p-3 text-center text-slate-500">{f.referenceRange || "-"}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}

                  {/* Doctor Notes */}
                  {report.notes && (
                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 dark:bg-slate-950/40 dark:border-slate-800 space-y-1">
                      <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                        Clinical Notes / Interpretation
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{report.notes}</p>
                    </div>
                  )}

                  {/* Footer Sign-off */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Lab Technician: </span>
                      {report.technicianName}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Verified By: </span>
                      {report.verifiedBy}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
