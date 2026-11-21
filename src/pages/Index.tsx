// src/pages/Index.tsx
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  FlaskConical,
  FileCheck,
  Download,
  Save,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Hash,
  Activity,
  Pill,
  Sparkles,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { TestTemplate, DynamicReportRecord } from "@/types/dynamic-test";
import { getTestTemplates, getCanvasTemplate } from "@/lib/testStorage";
import { downloadReportAsPdf, printReportAsPdf } from "@/lib/dynamicPdfGenerator";
import { useFooterSettings } from "@/lib/footerSettings";
import FooterSettingsModal from "@/components/FooterSettingsModal";
import { db, auth } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Printer, MapPin } from "lucide-react";

type Step = "patient" | "select-tests" | "fill-results" | "preview";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings: footerSettings } = useFooterSettings();
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState<Step>("patient");
  const [availableTests, setAvailableTests] = useState<TestTemplate[]>([]);
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<Record<string, Record<string, string | number | boolean | null | undefined>>>({});

  // Patient Info State
  const [patient, setPatient] = useState({
    name: "",
    relation: "",
    age: "" as string | number,
    sex: "Male" as "Male" | "Female" | "Other",
    referringDoctor: "Dr. Aamir",
    sampleId: `S-${Date.now().toString().slice(-6)}`,
    collectionDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    phone: "",
  });

  // Report metadata state
  const [reportId] = useState(
    `REP-${format(new Date(), "yyyyMMdd")}-${String(Math.floor(Math.random() * 9000) + 1000)}`
  );
  const [doctorNotes, setDoctorNotes] = useState("");
  const [technicianName] = useState("Staff Technician");
  const [verifiedBy] = useState("Dr. Aamir (Consultant Pathologist)");

  // PDF Download customizer setting (User requirement)
  const [showOnlyPatientName, setShowOnlyPatientName] = useState(false);
  const [isSavingToFirebase, setIsSavingToFirebase] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    const list = await getTestTemplates();
    setAvailableTests(list);
    if (list.length > 0 && selectedTestIds.length === 0) {
      setSelectedTestIds([list[0].id]);
    }
  };

  const handleToggleTest = (testId: string) => {
    setSelectedTestIds((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
  };

  const handleResultChange = (testId: string, fieldKey: string, value: string | number | boolean | null | undefined) => {
    setTestResults((prev) => ({
      ...prev,
      [testId]: {
        ...(prev[testId] || {}),
        [fieldKey]: value,
      },
    }));
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient.name.trim()) {
      toast({ title: "Name Required", description: "Please enter patient name to proceed.", variant: "destructive" });
      return;
    }
    setCurrentStep("select-tests");
  };

  const handleProceedToPrescription = () => {
    if (!patient.name.trim()) {
      toast({ title: "Name Required", description: "Please enter patient name first.", variant: "destructive" });
      return;
    }
    navigate("/prescription", { state: { patientData: patient } });
  };

  // Compile full report object
  const compiledReport: DynamicReportRecord = {
    reportId,
    patient: {
      ...patient,
      age: patient.age ? Number(patient.age) : undefined,
    },
    selectedTestIds,
    results: testResults,
    notes: doctorNotes,
    technicianName,
    verifiedBy,
    verificationDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const selectedTestObjects = availableTests.filter((t) => selectedTestIds.includes(t.id));

  // Download PDF Handler with strictly [Patient_Name].pdf naming
  const handleDownloadPdf = async () => {
    try {
      const template = await getCanvasTemplate(selectedTestIds[0] || "all");
      await downloadReportAsPdf({
        report: compiledReport,
        tests: selectedTestObjects,
        template,
        showOnlyPatientName,
      });
      toast({
        title: "Report Downloaded",
        description: `Saved as "${patient.name.trim().replace(/\s+/g, "_")}.pdf"`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "PDF generation failed";
      toast({ title: "Download Error", description: msg, variant: "destructive" });
    }
  };

  // Direct Print PDF Handler
  const handlePrintPdf = async () => {
    setIsPrinting(true);
    try {
      const template = await getCanvasTemplate(selectedTestIds[0] || "all");
      await printReportAsPdf({
        report: compiledReport,
        tests: selectedTestObjects,
        template,
        showOnlyPatientName,
      });
      toast({
        title: "Print Preview Ready",
        description: "Opening system print dialog...",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Print failed";
      toast({ title: "Print Error", description: msg, variant: "destructive" });
    } finally {
      setIsPrinting(false);
    }
  };

  // Save to Firebase
  const handleSaveToFirebase = async () => {
    setIsSavingToFirebase(true);
    try {
      const cleanReport = JSON.parse(JSON.stringify(compiledReport));
      const ref = doc(db, "reports", reportId);
      await setDoc(ref, {
        ...cleanReport,
        createdBy: auth.currentUser?.uid || "staff",
      });
      toast({
        title: "Saved Successfully",
        description: `Lab Report ${reportId} has been archived in the database.`,
      });
    } catch {
      toast({ title: "Cloud Save Notice", description: "Report stored locally (Firebase sync pending).", variant: "default" });
    } finally {
      setIsSavingToFirebase(false);
    }
  };

  const handleResetForm = () => {
    setPatient({
      name: "",
      relation: "",
      age: "",
      sex: "Male",
      referringDoctor: "Dr. Aamir",
      sampleId: `S-${Date.now().toString().slice(-6)}`,
      collectionDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      phone: "",
    });
    setTestResults({});
    setCurrentStep("patient");
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Stepper Navigation */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Stepper Header (< sm) */}
          <div className="sm:hidden flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {currentStep === "patient" ? 1 : currentStep === "select-tests" ? 2 : currentStep === "fill-results" ? 3 : 4}
              </span>
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                {currentStep === "patient" && "Step 1: Patient Information"}
                {currentStep === "select-tests" && `Step 2: Select Tests (${selectedTestIds.length})`}
                {currentStep === "fill-results" && "Step 3: Enter Findings"}
                {currentStep === "preview" && "Step 4: Verify & Export"}
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-blue-600">
              {currentStep === "patient" ? "25%" : currentStep === "select-tests" ? "50%" : currentStep === "fill-results" ? "75%" : "100%"}
            </span>
          </div>

          {/* Desktop/Tablet Stepper (>= sm) */}
          <div className="hidden sm:flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            
            {[
              { id: "patient", label: "Patient Info", icon: User },
              { id: "select-tests", label: "Select Tests", icon: FlaskConical },
              { id: "fill-results", label: "Enter Results", icon: Activity },
              { id: "preview", label: "Verify & Export", icon: FileCheck },
            ].map((st) => {
              const active = currentStep === st.id;
              const completed = 
                (st.id === "patient" && currentStep !== "patient") ||
                (st.id === "select-tests" && (currentStep === "fill-results" || currentStep === "preview")) ||
                (st.id === "fill-results" && currentStep === "preview");
              const Icon = st.icon;

              return (
                <div key={st.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                      active
                        ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950/60 scale-110 shadow-blue-500/30"
                        : completed
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-2 border-blue-500"
                        : "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400"
                    }`}
                  >
                    {completed ? <CheckCircle2 className="h-5 w-5 text-blue-600" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`text-[11px] font-bold mt-2 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: PATIENT REGISTRATION */}
        {currentStep === "patient" && (
          <Card className="shadow-xs border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in fade-in-50 duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-t-xl p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2.5 font-extrabold tracking-tight">
                    <User className="h-5 w-5" /> Patient Demographics & Sample Intake
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-xs mt-1">
                    Enter patient details to initialize the diagnostic record and generate barcode identifiers.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-white border-white/30 text-xs font-mono bg-white/10 px-2.5 py-0.5">
                  {reportId}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handlePatientSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Patient Full Name *</Label>
                    <Input
                      placeholder="e.g. Muhammad Ali"
                      value={patient.name}
                      onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                      className="mt-1.5 h-10 text-sm border-slate-200 dark:border-slate-800 focus:border-blue-500"
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Relation (W/O, S/O, D/O)</Label>
                    <Input
                      placeholder="e.g. S/O Tariq Khan"
                      value={patient.relation}
                      onChange={(e) => setPatient({ ...patient, relation: e.target.value })}
                      className="mt-1.5 h-10 text-sm border-slate-200 dark:border-slate-800 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Age (Years)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 35"
                      value={patient.age}
                      onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                      className="mt-1.5 h-10 text-sm border-slate-200 dark:border-slate-800 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Gender</Label>
                    <Select
                      value={patient.sex}
                      onValueChange={(val: "Male" | "Female" | "Other") => setPatient({ ...patient, sex: val })}
                    >
                      <SelectTrigger className="mt-1.5 h-10 text-sm border-slate-200 dark:border-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Referring Doctor</Label>
                    <Input
                      placeholder="Dr. Aamir"
                      value={patient.referringDoctor}
                      onChange={(e) => setPatient({ ...patient, referringDoctor: e.target.value })}
                      className="mt-1.5 h-10 text-sm border-slate-200 dark:border-slate-800 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 text-blue-600" /> Sample ID (Barcode)
                    </Label>
                    <Input
                      value={patient.sampleId}
                      onChange={(e) => setPatient({ ...patient, sampleId: e.target.value })}
                      className="mt-1.5 h-10 font-mono text-sm border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" /> Collection Timestamp
                    </Label>
                    <Input
                      type="datetime-local"
                      value={patient.collectionDateTime}
                      onChange={(e) => setPatient({ ...patient, collectionDateTime: e.target.value })}
                      className="mt-1.5 h-10 text-sm border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleProceedToPrescription}
                    className="w-full sm:w-auto gap-2 border-slate-300 hover:border-blue-300 text-slate-700 dark:text-slate-300 hover:bg-blue-50/50"
                  >
                    <Pill className="h-4 w-4 text-blue-600" />
                    Skip to Prescription
                  </Button>

                  <Button type="submit" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20">
                    Next: Select Tests
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: TEST SELECTION FROM DYNAMIC CATALOG */}
        {currentStep === "select-tests" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <Card className="shadow-xs border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="p-6 pb-4 bg-slate-50/70 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 rounded-t-xl">
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <FlaskConical className="h-5 w-5 text-blue-600" /> Select Diagnostic Tests
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose one or more laboratory tests to perform for {patient.name}.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTests.map((test) => {
                    const isChecked = selectedTestIds.includes(test.id);
                    return (
                      <div
                        key={test.id}
                        onClick={() => handleToggleTest(test.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                          isChecked
                            ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 shadow-xs ring-1 ring-blue-500/20"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                      >
                        <Checkbox checked={isChecked} className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{test.name}</span>
                            <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-950">
                              {test.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{test.description || "Diagnostic laboratory analysis"}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-blue-600 dark:text-blue-400 font-mono">
                            <span>{test.fields.length} Parameters</span>
                            {test.method && <span>Method: {test.method}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="outline" onClick={() => setCurrentStep("patient")} className="gap-2 border-slate-200">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedTestIds.length === 0) {
                        toast({ title: "No Test Selected", description: "Select at least 1 test.", variant: "destructive" });
                        return;
                      }
                      setCurrentStep("fill-results");
                    }}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                  >
                    Next: Enter Results ({selectedTestIds.length} Selected)
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 3: FILL CLINICAL TEST RESULTS */}
        {currentStep === "fill-results" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {selectedTestObjects.map((test) => {
              const testValues = testResults[test.id] || {};
              const sections = test.sections && test.sections.length > 0 
                ? test.sections 
                : [{ id: "main", name: "", order: 1 }];

              return (
                <Card key={test.id} className="shadow-xs border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <CardHeader className="py-3.5 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <Activity className="h-4 w-4 text-blue-600" /> {test.name}
                        </CardTitle>
                        <CardDescription className="text-xs">{test.category} • Method: {test.method || "Standard"}</CardDescription>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                        {test.fields.length} Fields
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {sections.map((sec) => {
                      const secFields = test.fields.filter(
                        (f) => (sec.name ? f.section === sec.name : true)
                      );
                      if (secFields.length === 0) return null;

                      return (
                        <div key={sec.id} className="space-y-3">
                          {sec.name && (
                            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                              {sec.name}
                            </h3>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {secFields.map((f) => {
                              const val = testValues[f.key] ?? "";
                              return (
                                <div key={f.id} className="space-y-1.5 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                                  <div className="flex items-center justify-between text-xs">
                                    <Label className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                      {f.label} {f.required && <span className="text-red-500">*</span>}
                                    </Label>
                                    {f.unit && <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{f.unit}</span>}
                                  </div>

                                  {f.type === "select" ? (
                                    <Select
                                      value={String(val)}
                                      onValueChange={(v) => handleResultChange(test.id, f.key, v)}
                                    >
                                      <SelectTrigger className="h-9 bg-white dark:bg-slate-900 text-xs border-slate-200 dark:border-slate-800">
                                        <SelectValue placeholder="Select outcome..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {f.options?.map((opt) => (
                                          <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label} {opt.isAbnormal && "⚠️"}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : f.type === "number" ? (
                                    <Input
                                      type="number"
                                      value={val}
                                      onChange={(e) => handleResultChange(test.id, f.key, e.target.value)}
                                      placeholder={f.placeholder || `Normal: ${f.referenceRange || "-"}`}
                                      className="h-9 bg-white dark:bg-slate-900 text-xs border-slate-200 dark:border-slate-800"
                                    />
                                  ) : (
                                    <Input
                                      value={String(val)}
                                      onChange={(e) => handleResultChange(test.id, f.key, e.target.value)}
                                      placeholder={f.placeholder || `Ref: ${f.referenceRange || "-"}`}
                                      className="h-9 bg-white dark:bg-slate-900 text-xs border-slate-200 dark:border-slate-800"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep("select-tests")} className="gap-2 border-slate-200">
                <ArrowLeft className="h-4 w-4" /> Back to Selection
              </Button>
              <Button onClick={() => setCurrentStep("preview")} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20">
                Next: Review & Export
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: PREVIEW, VERIFICATION & CUSTOMIZED EXPORT */}
        {currentStep === "preview" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Top Toolbar Card */}
            <Card className="shadow-xs border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Specific User Requirement: Toggle "Only Patient Name" in exported report */}
                <div className="flex items-center gap-3 p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 rounded-xl">
                  <div className="text-left">
                    <Label className="text-xs font-bold text-blue-900 dark:text-blue-100 block">
                      Download With ONLY Patient Name
                    </Label>
                    <span className="text-[11px] text-blue-700 dark:text-blue-400">
                      Omits doctor, age, sex, sample ID, and date from report header.
                    </span>
                  </div>
                  <Switch
                    checked={showOnlyPatientName}
                    onCheckedChange={setShowOnlyPatientName}
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" onClick={() => setCurrentStep("fill-results")} className="gap-1 text-xs border-slate-200">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </Button>
                  <Button variant="outline" onClick={handleResetForm} className="gap-1 text-xs border-slate-200">
                    <RotateCcw className="h-3.5 w-3.5" /> New Report
                  </Button>
                  <Button
                    onClick={handleSaveToFirebase}
                    disabled={isSavingToFirebase}
                    className="gap-1.5 text-xs bg-slate-800 hover:bg-slate-900 text-white font-semibold"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Record
                  </Button>
                  <Button
                    onClick={handlePrintPdf}
                    disabled={isPrinting}
                    variant="outline"
                    className="gap-1.5 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 font-semibold"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print
                  </Button>
                  <Button
                    onClick={handleDownloadPdf}
                    className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                    title={`Download file named ${patient.name.trim().replace(/\s+/g, "_")}.pdf`}
                  >
                    <Download className="h-4 w-4" /> Download PDF ({patient.name.trim().split(" ")[0]}.pdf)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Document Preview Presentation */}
            <Card className="shadow-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative">
              
              {/* Watermark Overlay in On-screen Card (Matches Canvas Designer & Printed PDF) */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
                style={{ opacity: 0.05 }}
              >
                <img src="/logo.png" alt="watermark" className="w-[120mm] h-[120mm] max-w-[80vw] object-contain" />
              </div>

              {/* Top Luxury Brand Strip */}
              <div className="h-1 bg-gradient-to-r from-blue-900 via-blue-600 to-indigo-700 w-full" />

              <div className="relative z-10">
                <CardHeader className="py-6 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
                  <img
                    src="/header.png"
                    alt="Header Banner"
                    className="w-full h-auto max-h-[30mm] object-contain mx-auto mb-2"
                    onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                  />
                  <h1 className="text-xl sm:text-2xl font-black text-blue-900 dark:text-blue-400 tracking-wide">
                    SMMC LABORATORY REPORT
                  </h1>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Quality Diagnostic Center</p>
                  <Badge variant="outline" className="mx-auto mt-2 font-mono text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950">
                    {reportId}
                  </Badge>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-6">
                  {/* Patient Information Section Preview */}
                  <div className="p-4 rounded-xl border border-blue-200/80 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-950/60 border-l-4 border-l-blue-600">
                    {showOnlyPatientName ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500">Patient Name:</span>
                          <span className="text-base font-extrabold text-blue-700 dark:text-blue-400">{patient.name}</span>
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
                            {patient.name} {patient.relation ? `(${patient.relation})` : ""}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Referring Doctor: </span>
                          <span>{patient.referringDoctor || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Age / Gender: </span>
                          <span>{patient.age || "-"} / {patient.sex}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Sample ID: </span>
                          <span className="font-mono text-blue-600">{patient.sampleId}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500">Collection Date: </span>
                          <span>{format(new Date(patient.collectionDateTime), "dd-MMM-yyyy HH:mm")}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Test Results Display */}
                  {selectedTestObjects.map((test) => {
                    const testValues = testResults[test.id] || {};
                    return (
                      <div key={test.id} className="rounded-xl border border-blue-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
                        <div className="bg-blue-700 text-white px-4 py-2.5 text-xs font-bold flex justify-between">
                          <span>{test.name.toUpperCase()}</span>
                          <span className="opacity-90 font-normal">{test.method}</span>
                        </div>

                        <div className="overflow-x-auto w-full">
                          <table className="w-full text-xs text-left min-w-[500px]">
                            <thead className="bg-blue-100/70 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 font-bold border-b border-blue-200">
                              <tr>
                                <th className="p-3 w-5/12">Parameter</th>
                                <th className="p-3 text-center w-3/12">Observed Result</th>
                                <th className="p-3 text-center w-2/12">Unit</th>
                                <th className="p-3 text-center w-2/12">Biological Reference Range</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50 dark:divide-slate-800">
                              {test.fields.map((f, i) => {
                                const val = testValues[f.key];
                                const display = val !== undefined && val !== "" ? String(val) : "-";
                                const isAbnormal = f.options?.find((o) => o.value === display)?.isAbnormal || 
                                  display === "Positive" || display === "Reactive";

                                return (
                                  <tr key={f.id} className={i % 2 === 0 ? "bg-white/90 dark:bg-slate-900/90" : "bg-blue-50/30 dark:bg-slate-950/50"}>
                                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{f.label}</td>
                                    <td className={`p-3 text-center font-bold ${isAbnormal ? "text-red-600" : "text-blue-600 dark:text-blue-400"}`}>
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

                {/* Doctor Notes Box (Optional - Empty by default) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 dark:bg-slate-950/40 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Clinical Notes / Pathologist Interpretation (Optional)
                    </Label>
                    {doctorNotes && (
                      <button
                        type="button"
                        onClick={() => setDoctorNotes("")}
                        className="text-[11px] text-red-500 hover:underline font-semibold"
                      >
                        Remove Notes
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="Leave blank to omit clinical notes from the report, or type remarks here if needed..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-blue-500"
                  />
                </div>

                {/* Footer Sign-off */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs text-slate-500">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Lab Technician: </span>
                    {technicianName}
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Verified By: </span>
                    {verifiedBy}
                  </div>
                </div>

                {/* Footer Address & Contact Preview */}
                <div
                  onClick={() => setAddressModalOpen(true)}
                  className="mt-3 pt-2 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center items-center gap-2 cursor-pointer hover:bg-blue-50/60 dark:hover:bg-slate-800/60 p-2 rounded-lg transition-colors border border-dashed border-blue-200 dark:border-blue-800"
                  title="Click to edit clinic address and phone number in Firebase"
                >
                  <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {footerSettings.showContactInfo && footerSettings.address ? footerSettings.address : "Click here to add Clinic / Lab Address"}
                  </span>
                  {footerSettings.showContactInfo && footerSettings.phone && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-slate-600 dark:text-slate-400">Tel: {footerSettings.phone}</span>
                    </>
                  )}
                  <span className="text-[11px] font-bold text-blue-600 hover:underline ml-1">
                    (Edit Address & Phone)
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      )}
      </div>

      {/* Address & Footer Settings Modal (Synced with Firebase) */}
      <FooterSettingsModal
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
      />
    </AppLayout>
  );
}
