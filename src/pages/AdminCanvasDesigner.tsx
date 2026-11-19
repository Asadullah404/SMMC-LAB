// src/pages/AdminCanvasDesigner.tsx
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutTemplate,
  Save,
  Download,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  GripVertical,
  Sliders,
  Sparkles,
  Layers,
  HelpCircle,
} from "lucide-react";
import { TestTemplate, CanvasTemplate } from "@/types/dynamic-test";
import { getTestTemplates, getCanvasTemplate, saveCanvasTemplate } from "@/lib/testStorage";
import { downloadReportAsPdf } from "@/lib/dynamicPdfGenerator";
import { useToast } from "@/hooks/use-toast";

export default function AdminCanvasDesigner() {
  const { toast } = useToast();
  const [tests, setTests] = useState<TestTemplate[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [template, setTemplate] = useState<CanvasTemplate | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(85);
  const [isSaving, setIsSaving] = useState(false);

  // Drag and Drop state
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    loadTestsAndTemplate();
  }, []);

  const loadTestsAndTemplate = async () => {
    const list = await getTestTemplates();
    setTests(list);
    if (list.length > 0) {
      const initialId = list[0].id;
      setSelectedTestId(initialId);
      loadTemplate(initialId);
    }
  };

  const loadTemplate = async (testId: string) => {
    const tpl = await getCanvasTemplate(testId);
    setTemplate(tpl);
    if (tpl.blocks.length > 0) {
      setSelectedBlockId(tpl.blocks[0].id);
    }
  };

  const handleSelectTest = (testId: string) => {
    setSelectedTestId(testId);
    loadTemplate(testId);
  };

  const handleSave = async () => {
    if (!template) return;
    setIsSaving(true);
    try {
      await saveCanvasTemplate(template);
      toast({
        title: "Canvas Template Saved",
        description: `Royal Blue layout for "${tests.find((t) => t.id === selectedTestId)?.name || "Test"}" saved.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast({ title: "Save Failed", description: msg, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedBlock = template?.blocks.find((b) => b.id === selectedBlockId);

  const updateSelectedBlockConfig = (key: string, value: string | number | boolean | undefined) => {
    if (!template || !selectedBlockId) return;
    const updatedBlocks = template.blocks.map((b) => {
      if (b.id === selectedBlockId) {
        return {
          ...b,
          config: {
            ...b.config,
            [key]: value,
          },
        };
      }
      return b;
    });
    setTemplate({ ...template, blocks: updatedBlocks });
  };

  const toggleBlockVisibility = (blockId: string) => {
    if (!template) return;
    const updated = template.blocks.map((b) =>
      b.id === blockId ? { ...b, visible: !b.visible } : b
    );
    setTemplate({ ...template, blocks: updated });
  };

  const moveBlock = (blockId: string, direction: "up" | "down") => {
    if (!template) return;
    const idx = template.blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= template.blocks.length) return;

    const list = [...template.blocks];
    const temp = list[idx];
    list[idx] = list[newIdx];
    list[newIdx] = temp;

    setTemplate({ ...template, blocks: list });
  };

  // Drag and Drop reordering handlers
  const handleDragStart = (index: number) => {
    setDraggedBlockIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (targetIndex: number) => {
    if (!template || draggedBlockIndex === null) return;
    if (draggedBlockIndex === targetIndex) {
      setDraggedBlockIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updatedBlocks = [...template.blocks];
    const [movedBlock] = updatedBlocks.splice(draggedBlockIndex, 1);
    updatedBlocks.splice(targetIndex, 0, movedBlock);

    setTemplate({ ...template, blocks: updatedBlocks });
    setDraggedBlockIndex(null);
    setDragOverIndex(null);
    toast({
      title: "Block Reordered",
      description: `Moved "${movedBlock.type.replace("-", " ")}" to position ${targetIndex + 1}.`,
    });
  };

  // Direct test download from designer
  const handleTestDownload = async () => {
    if (!template) return;
    const currentTest = tests.find((t) => t.id === selectedTestId);
    if (!currentTest) return;

    const mockReport = {
      reportId: `REP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-TEST`,
      patient: {
        name: "Muhammad Ali Khan",
        relation: "S/O Tariq Khan",
        age: 34,
        sex: "Male" as const,
        referringDoctor: "Dr. Aamir",
        sampleId: "S-882194",
        collectionDateTime: new Date().toISOString(),
      },
      selectedTestIds: [currentTest.id],
      results: {
        [currentTest.id]: currentTest.fields.reduce((acc, f) => {
          acc[f.key] = f.options?.[0]?.value || (f.type === "number" ? 14 : "Normal");
          return acc;
        }, {} as Record<string, string | number | boolean>),
      },
      notes: "Sample verified and approved under certified internal quality control.",
      technicianName: "Staff Technician",
      verifiedBy: "Dr. Aamir (Consultant Pathologist)",
      verificationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const patientBlock = template.blocks.find((b) => b.type === "patient-info");
    const showOnlyPatientName = patientBlock?.config.showOnlyPatientName ?? false;

    await downloadReportAsPdf({
      report: mockReport,
      tests: [currentTest],
      template,
      showOnlyPatientName,
    });

    toast({
      title: "PDF Downloaded",
      description: `Saved as "${mockReport.patient.name.replace(/\s+/g, "_")}.pdf" in Royal Blue clinical theme.`,
    });
  };

  const currentTest = tests.find((t) => t.id === selectedTestId);
  const patientBlockConfig = template?.blocks.find((b) => b.type === "patient-info")?.config;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-blue-100 dark:border-blue-900/40">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-950 rounded-xl text-blue-700 dark:text-blue-400 shadow-xs">
                <LayoutTemplate className="h-6 w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Canvas Template Designer
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Interactive drag & drop canvas template builder. Rearrange components, customize green & white print styles, and preview in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Select value={selectedTestId} onValueChange={handleSelectTest}>
              <SelectTrigger className="w-56 h-9 text-xs border-blue-200 dark:border-blue-800">
                <SelectValue placeholder="Choose test layout..." />
              </SelectTrigger>
              <SelectContent>
                {tests.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleTestDownload}
              className="gap-1.5 text-xs h-9 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <Download className="h-4 w-4" />
              Test Download
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 shadow-md shadow-blue-600/20"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>

        {/* Drag Helper Notice */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              <strong>Drag & Drop Power Enabled:</strong> You can drag blocks either from the left sidebar list or grab them directly on the canvas sheet to reorder!
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] border-blue-400 text-blue-700 dark:text-blue-300">
            Royal Blue Theme Active
          </Badge>
        </div>

        {/* Designer Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* Left Inspector (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Draggable Block Hierarchy List */}
            <Card className="shadow-xs border-blue-100 dark:border-blue-900/50">
              <CardHeader className="pb-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-t-xl border-b border-blue-100 dark:border-blue-900/30">
                <CardTitle className="text-sm font-bold flex items-center justify-between text-slate-800 dark:text-slate-100">
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Draggable Components ({template?.blocks.length || 0})
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Grab the handle (⋮⋮) to drag components up and down.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2 p-3 pt-3">
                {template?.blocks.map((block, idx) => {
                  const isSelected = selectedBlockId === block.id;
                  const isBeingDragged = draggedBlockIndex === idx;
                  const isOver = dragOverIndex === idx;

                  return (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={() => handleDrop(idx)}
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing transition-all ${
                        isBeingDragged
                          ? "opacity-40 border-dashed border-blue-500 bg-blue-100/50"
                          : isOver
                          ? "border-2 border-blue-500 bg-blue-100/70 dark:bg-blue-950 scale-102"
                          : isSelected
                          ? "bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 shadow-xs"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Drag Handle */}
                        <div className="text-slate-400 hover:text-blue-600 cursor-grab">
                          <GripVertical className="h-4 w-4" />
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBlockVisibility(block.id);
                          }}
                          className="text-slate-400 hover:text-blue-600"
                        >
                          {block.visible ? <Eye className="h-4 w-4 text-blue-600" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 dark:text-slate-200 capitalize truncate">
                            {block.type.replace("-", " ")}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {block.config.title || "Standard configuration"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(block.id, "up");
                          }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-blue-700 disabled:opacity-20"
                        >
                          <MoveUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(block.id, "down");
                          }}
                          disabled={idx === (template?.blocks.length || 0) - 1}
                          className="p-1 text-slate-400 hover:text-blue-700 disabled:opacity-20"
                        >
                          <MoveDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Block Property Inspector */}
            {selectedBlock && (
              <Card className="shadow-xs border-blue-100 dark:border-blue-900/50">
                <CardHeader className="pb-3 border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/30 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-blue-600" />
                      {selectedBlock.type.replace("-", " ")} Settings
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] border-blue-400 text-blue-700 dark:text-blue-300">
                      Active
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                  {/* PATIENT INFO SPECIFIC */}
                  {selectedBlock.type === "patient-info" && (
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs font-bold text-blue-950 dark:text-blue-100">
                              Show ONLY Patient Name
                            </Label>
                            <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
                              Report displays patient name exclusively, omitting metadata.
                            </p>
                          </div>
                          <Switch
                            checked={selectedBlock.config.showOnlyPatientName ?? false}
                            onCheckedChange={(val) => updateSelectedBlockConfig("showOnlyPatientName", val)}
                          />
                        </div>
                      </div>

                      {!selectedBlock.config.showOnlyPatientName && (
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Included Patient Header Fields
                          </Label>
                          <label className="flex items-center justify-between cursor-pointer py-1">
                            <span>Referring Doctor</span>
                            <Switch
                              checked={selectedBlock.config.showDoctorName ?? true}
                              onCheckedChange={(v) => updateSelectedBlockConfig("showDoctorName", v)}
                            />
                          </label>
                          <label className="flex items-center justify-between cursor-pointer py-1">
                            <span>Age & Gender</span>
                            <Switch
                              checked={selectedBlock.config.showAgeGender ?? true}
                              onCheckedChange={(v) => updateSelectedBlockConfig("showAgeGender", v)}
                            />
                          </label>
                          <label className="flex items-center justify-between cursor-pointer py-1">
                            <span>Sample ID</span>
                            <Switch
                              checked={selectedBlock.config.showSampleId ?? true}
                              onCheckedChange={(v) => updateSelectedBlockConfig("showSampleId", v)}
                            />
                          </label>
                          <label className="flex items-center justify-between cursor-pointer py-1">
                            <span>Collection Date</span>
                            <Switch
                              checked={selectedBlock.config.showCollectionDate ?? true}
                              onCheckedChange={(v) => updateSelectedBlockConfig("showCollectionDate", v)}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* HEADER SPECIFIC */}
                  {selectedBlock.type === "header" && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-semibold">Laboratory Title</Label>
                        <Input
                          value={selectedBlock.config.title || ""}
                          onChange={(e) => updateSelectedBlockConfig("title", e.target.value)}
                          className="mt-1 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Accreditation Subtitle</Label>
                        <Input
                          value={selectedBlock.config.customText || ""}
                          onChange={(e) => updateSelectedBlockConfig("customText", e.target.value)}
                          className="mt-1 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* RESULTS TABLE SPECIFIC */}
                  {selectedBlock.type === "results-table" && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-semibold">Findings Table Title</Label>
                        <Input
                          value={selectedBlock.config.title || "LABORATORY FINDINGS"}
                          onChange={(e) => updateSelectedBlockConfig("title", e.target.value)}
                          className="mt-1 text-xs"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Rendered with Royal Blue clinical blue table headers and abnormal result alert flags.
                      </p>
                    </div>
                  )}

                  {/* DOCTOR NOTES SPECIFIC */}
                  {selectedBlock.type === "doctor-notes" && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-semibold">Section Heading</Label>
                        <Input
                          value={selectedBlock.config.title || "Pathologist Notes"}
                          onChange={(e) => updateSelectedBlockConfig("title", e.target.value)}
                          className="mt-1 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Standard Clinical Note</Label>
                        <textarea
                          rows={3}
                          value={selectedBlock.config.customText || ""}
                          onChange={(e) => updateSelectedBlockConfig("customText", e.target.value)}
                          className="w-full mt-1 p-2 text-xs border rounded-md dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* FOOTER SPECIFIC */}
                  {selectedBlock.type === "footer-signature" && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-semibold">Verification Title</Label>
                        <Input
                          value={selectedBlock.config.title || "Digitally Verified"}
                          onChange={(e) => updateSelectedBlockConfig("title", e.target.value)}
                          className="mt-1 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Footer Disclaimer</Label>
                        <Input
                          value={selectedBlock.config.customText || ""}
                          onChange={(e) => updateSelectedBlockConfig("customText", e.target.value)}
                          className="mt-1 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Area: Interactive Simulated A4 Canvas Sheet (8 cols) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            
            {/* Canvas Toolbar */}
            <div className="w-full flex items-center justify-between pb-3 text-xs text-slate-500">
              <span className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Live Royal Blue A4 Sheet Preview
              </span>
              <div className="flex items-center gap-2">
                <span>Zoom:</span>
                {[75, 85, 100].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoomLevel(z)}
                    className={`px-2 py-0.5 rounded text-xs transition ${
                      zoomLevel === z
                        ? "bg-blue-600 text-white font-medium"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {z}%
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Paper Container (Royal Blue Styled) */}
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
              className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[12mm] rounded-sm shadow-2xl border-2 border-blue-500 transition-transform duration-150 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Watermark Overlay in Canvas */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: 0.05 }}
              >
                <img src="/logo.png" alt="watermark" className="w-[130mm] h-[130mm] object-contain" />
              </div>

              {/* Dynamic Canvas Blocks with Direct Drag & Drop on the Sheet */}
              <div className="space-y-4 relative z-10">
                {template?.blocks.map((block, idx) => {
                  if (!block.visible) return null;
                  const isSelected = selectedBlockId === block.id;
                  const isOver = dragOverIndex === idx;

                  return (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={() => handleDrop(idx)}
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`relative group rounded-md transition-all cursor-grab active:cursor-grabbing ${
                        isOver
                          ? "border-2 border-dashed border-blue-500 bg-blue-50/50 p-2 scale-101"
                          : isSelected
                          ? "ring-2 ring-blue-500 shadow-sm"
                          : "hover:ring-1 hover:ring-blue-300"
                      }`}
                    >
                      {/* Floating Drag Handle on Hover */}
                      <div className="absolute -top-2.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-blue-700 text-white text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs pointer-events-none">
                        <GripVertical className="h-3 w-3" /> Drag to move
                      </div>

                      {/* 1. Header Block */}
                      {block.type === "header" && (
                        <div className="text-center pb-3 border-b-2 border-blue-600">
                          <img
                            src="/header.png"
                            alt="Header Banner"
                            className="w-full h-auto max-h-[30mm] object-contain mx-auto mb-2"
                            onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                          />
                          <h1 className="text-xl font-black text-blue-800 tracking-wide">
                            {block.config.title || "SMMC LABORATORY REPORT"}
                          </h1>
                          <p className="text-[10px] text-blue-600 font-medium">
                            {block.config.customText || "ISO 15189 Certified Diagnostic Center"}
                          </p>
                          <div className="mt-2 inline-block bg-blue-50 border border-blue-300 text-blue-800 text-[10px] font-bold px-4 py-0.5 rounded-full">
                            REPORT ID: REP-20261119-0001
                          </div>
                        </div>
                      )}

                      {/* 2. Patient Info Block */}
                      {block.type === "patient-info" && (
                        <div className="rounded-md p-3 border border-blue-200 bg-blue-50/60">
                          {patientBlockConfig?.showOnlyPatientName ? (
                            <div className="flex items-center gap-3 py-1">
                              <span className="text-xs font-bold text-blue-900">Patient Name:</span>
                              <span className="text-sm font-black text-blue-800">Muhammad Ali Khan</span>
                              <Badge className="bg-blue-600 text-white text-[9px] ml-auto">
                                Name-Only Mode Active
                              </Badge>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
                              <div>
                                <span className="font-bold text-blue-800">Patient: </span>
                                <span className="font-bold text-slate-900">Muhammad Ali Khan</span>
                              </div>
                              {patientBlockConfig?.showDoctorName !== false && (
                                <div>
                                  <span className="font-bold text-blue-800">Referring Dr: </span>
                                  <span>Dr. Aamir</span>
                                </div>
                              )}
                              {patientBlockConfig?.showAgeGender !== false && (
                                <div>
                                  <span className="font-bold text-blue-800">Age / Sex: </span>
                                  <span>34 Y / Male</span>
                                </div>
                              )}
                              {patientBlockConfig?.showCollectionDate !== false && (
                                <div>
                                  <span className="font-bold text-blue-800">Collection Date: </span>
                                  <span>19-Nov-2026 10:30</span>
                                </div>
                              )}
                              {patientBlockConfig?.showSampleId !== false && (
                                <div>
                                  <span className="font-bold text-blue-800">Sample ID: </span>
                                  <span className="font-mono">S-882194</span>
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-blue-800">Report Date: </span>
                                <span>19-Nov-2026 12:45</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. Results Table Block */}
                      {block.type === "results-table" && (
                        <div className="rounded-md overflow-hidden border border-blue-200 shadow-xs">
                          <div className="bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 flex justify-between">
                            <span>{currentTest?.name?.toUpperCase() || "TEST RESULTS"}</span>
                            <span className="font-normal text-[10px] opacity-90">{currentTest?.method || "ICT Method"}</span>
                          </div>

                          <table className="w-full text-[10px] text-left border-collapse">
                            <thead>
                              <tr className="bg-blue-100/70 text-blue-900 font-bold border-b border-blue-200">
                                <th className="p-2 w-5/12">Test Parameter</th>
                                <th className="p-2 text-center w-3/12">Observed Result</th>
                                <th className="p-2 text-center w-2/12">Unit</th>
                                <th className="p-2 text-center w-2/12">Reference Range</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-100">
                              {currentTest && currentTest.fields.length > 0 ? (
                                currentTest.fields.slice(0, 6).map((field, i) => (
                                  <tr key={field.id} className={i % 2 === 0 ? "bg-white" : "bg-blue-50/40"}>
                                    <td className="p-2 font-semibold text-slate-800">{field.label}</td>
                                    <td className="p-2 text-center font-bold text-blue-700">
                                      {field.options?.[0]?.value || "Negative"}
                                    </td>
                                    <td className="p-2 text-center text-slate-500">{field.unit || "-"}</td>
                                    <td className="p-2 text-center text-slate-500">{field.referenceRange || "-"}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                                    No parameters defined for this test.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* 4. Notes Block */}
                      {block.type === "doctor-notes" && (
                        <div className="rounded-md p-3 border border-blue-300 bg-blue-50/50 text-xs">
                          <p className="font-bold text-blue-900 text-[11px] mb-1">
                            {block.config.title || "Pathologist Notes"}:
                          </p>
                          <p className="text-[10px] text-blue-800">
                            {block.config.customText || "All tests processed under strict internal quality control measures."}
                          </p>
                        </div>
                      )}

                      {/* 5. Footer Signature Block */}
                      {block.type === "footer-signature" && (
                        <div className="pt-3 border-t border-blue-200 mt-4 text-[10px] text-slate-600">
                          <div className="flex justify-between items-end pb-2">
                            <div>
                              <p className="font-bold text-blue-900">Laboratory Technician</p>
                              <p className="text-slate-500 text-[9px]">Verified Examination</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-900">Dr. Aamir</p>
                              <p className="text-slate-500 text-[9px]">Consultant Pathologist (FCPS)</p>
                            </div>
                          </div>
                          <p className="text-center text-[9px] text-slate-400 italic pt-1 border-t border-blue-100">
                            {block.config.customText || "Computer-generated report. No manual signature required."}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-[9px] text-slate-400 text-center pt-2">
                SMMC Clinical Diagnostic Laboratory Management System
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
