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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Printer, ArrowLeft, RotateCcw, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { getTestTemplates, getCanvasTemplate } from "@/lib/testStorage";
import { downloadReportAsPdf } from "@/lib/dynamicPdfGenerator";
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
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-sm text-slate-500 font-medium">Retrieving laboratory report record...</p>
          </div>
        ) : !report ? (
          <Card className="p-12 text-center border-dashed border-2">
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-xs">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
                <div>
                  <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Report Record: {report.reportId}
                  </h1>
                  <p className="text-xs text-slate-500">Patient: {report.patient.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Specific User Requirement: Toggle "Only Patient Name" in exported report */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg">
                  <Label className="text-xs font-semibold text-amber-900 dark:text-amber-200 cursor-pointer">
                    Only Patient Name
                  </Label>
                  <Switch
                    checked={showOnlyPatientName}
                    onCheckedChange={setShowOnlyPatientName}
                  />
                </div>

                <Button onClick={handleDownload} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 shadow-xs">
                  <Download className="h-4 w-4" /> Download PDF ({report.patient.name.trim().split(" ")[0]}.pdf)
                </Button>
              </div>
            </div>

            {/* Document Card */}
            <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="py-6 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <h2 className="text-2xl font-black text-blue-900 dark:text-blue-400 tracking-wide">
                  SMMC LABORATORY REPORT
                </h2>
                <p className="text-xs text-slate-500">Accredited Clinical Pathology & Diagnostic Services</p>
                <Badge variant="outline" className="mx-auto mt-2 font-mono text-xs border-blue-300 text-blue-800 dark:border-blue-700 dark:text-blue-300">
                  {report.reportId}
                </Badge>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Patient Information Section */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950">
                  {showOnlyPatientName ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-600">Patient Name:</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">{report.patient.name}</span>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-[10px]">
                        Clean Name-Only Export Mode
                      </Badge>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-xs">
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
                        <span className="font-mono">{report.patient.sampleId}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">Collection Date: </span>
                        <span>
                          {report.patient.collectionDateTime ? format(new Date(report.patient.collectionDateTime), "dd-MMM-yyyy HH:mm") : "-"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Findings Table */}
                {relevantTests.map((test) => {
                  const testVals = report.results[test.id] || {};
                  return (
                    <div key={test.id} className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="bg-blue-800 text-white px-4 py-2 text-xs font-bold flex justify-between">
                        <span>{test.name.toUpperCase()}</span>
                        <span className="opacity-80 font-normal">{test.method || ""}</span>
                      </div>

                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b">
                          <tr>
                            <th className="p-3">Test Parameter</th>
                            <th className="p-3 text-center">Result</th>
                            <th className="p-3 text-center">Unit</th>
                            <th className="p-3 text-center">Reference Range</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {test.fields.map((f) => {
                            const val = testVals[f.key];
                            const display = val !== undefined && val !== "" ? String(val) : "-";
                            const isAbnormal = f.options?.find((o) => o.value === display)?.isAbnormal || 
                              display === "Positive" || display === "Reactive";

                            return (
                              <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{f.label}</td>
                                <td className={`p-3 text-center font-bold ${isAbnormal ? "text-red-600" : "text-blue-600"}`}>
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
                  );
                })}

                {/* Doctor Notes */}
                {report.notes && (
                  <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/40 dark:border-yellow-900 space-y-1">
                    <p className="text-xs font-bold text-yellow-900 dark:text-yellow-200">
                      Clinical Notes / Interpretation
                    </p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">{report.notes}</p>
                  </div>
                )}

                {/* Footer Sign-off */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs text-slate-500">
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
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
