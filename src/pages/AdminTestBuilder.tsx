// src/pages/AdminTestBuilder.tsx
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Edit2,
  Copy,
  Save,
  ArrowUp,
  ArrowDown,
  Layers,
  Settings2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FolderPlus,
  Eye,
} from "lucide-react";
import { TestTemplate, FieldDefinition, FieldType, FieldOption } from "@/types/dynamic-test";
import { getTestTemplates, saveTestTemplate, deleteTestTemplate } from "@/lib/testStorage";
import { useToast } from "@/hooks/use-toast";

const COMMON_UNITS = [
  "mg/dL",
  "g/dL",
  "µL",
  "parasites/µL",
  "ml",
  "/HPF",
  "/LPF",
  "%",
  "mmol/L",
  "IU/L",
  "ng/mL",
  "pg/mL",
];

const COMMON_CATEGORIES = [
  "Hematology",
  "Serology",
  "Parasitology",
  "Biochemistry",
  "Clinical Pathology",
  "Microbiology",
  "Immunology",
  "Endocrinology",
];

export default function AdminTestBuilder() {
  const { toast } = useToast();
  const [tests, setTests] = useState<TestTemplate[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activePreview, setActivePreview] = useState(false);
  const [mobileTab, setMobileTab] = useState<"catalog" | "editor">("catalog");

  // Field edit modal state
  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FieldDefinition | null>(null);
  const [fieldSectionName, setFieldSectionName] = useState<string>("");

  // New Section modal state
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    const list = await getTestTemplates();
    setTests(list);
    if (list.length > 0 && !selectedTest) {
      setSelectedTest(list[0]);
    }
  };

  const handleSelectTest = (test: TestTemplate) => {
    setSelectedTest(JSON.parse(JSON.stringify(test)));
    setIsEditing(false);
    setMobileTab("editor");
  };

  const handleCreateNewTest = () => {
    const newTest: TestTemplate = {
      id: `test-${Date.now()}`,
      code: `TEST-${Math.floor(100 + Math.random() * 900)}`,
      name: "New Laboratory Test",
      category: "Hematology",
      method: "Manual / ICT",
      description: "Diagnostic test parameter definition",
      price: 300,
      sections: [{ id: "sec-1", name: "Main Parameters", order: 1 }],
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSelectedTest(newTest);
    setIsEditing(true);
    setMobileTab("editor");
  };

  const handleDuplicateTest = (test: TestTemplate) => {
    const dup: TestTemplate = {
      ...JSON.parse(JSON.stringify(test)),
      id: `test-${Date.now()}`,
      code: `${test.code}-COPY`,
      name: `${test.name} (Copy)`,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSelectedTest(dup);
    setIsEditing(true);
    setMobileTab("editor");
    toast({ title: "Test Duplicated", description: "You can now modify the copied test." });
  };

  const handleSaveTest = async () => {
    if (!selectedTest) return;
    if (!selectedTest.name.trim()) {
      toast({ title: "Name Required", description: "Please provide a valid test name.", variant: "destructive" });
      return;
    }

    try {
      await saveTestTemplate(selectedTest);
      await loadTests();
      setIsEditing(false);
      toast({
        title: "Test Saved",
        description: `"${selectedTest.name}" has been updated successfully.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      toast({ title: "Error Saving", description: msg, variant: "destructive" });
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      await deleteTestTemplate(testId);
      await loadTests();
      setSelectedTest(null);
      toast({ title: "Test Deleted" });
    }
  };

  // Section handling
  const handleAddSection = () => {
    if (!selectedTest || !newSectionName.trim()) return;
    const newSec = {
      id: `sec-${Date.now()}`,
      name: newSectionName.trim(),
      order: selectedTest.sections.length + 1,
    };
    setSelectedTest({
      ...selectedTest,
      sections: [...selectedTest.sections, newSec],
    });
    setNewSectionName("");
    setSectionModalOpen(false);
  };

  const handleDeleteSection = (secName: string) => {
    if (!selectedTest) return;
    setSelectedTest({
      ...selectedTest,
      sections: selectedTest.sections.filter((s) => s.name !== secName),
      // Move fields under this section to default
      fields: selectedTest.fields.map((f) => (f.section === secName ? { ...f, section: undefined } : f)),
    });
  };

  // Field modal handling
  const openFieldModal = (field?: FieldDefinition, defaultSection?: string) => {
    if (field) {
      setEditingField(JSON.parse(JSON.stringify(field)));
      setFieldSectionName(field.section || "");
    } else {
      setEditingField({
        id: `field-${Date.now()}`,
        key: `param_${Date.now().toString().slice(-4)}`,
        label: "New Parameter",
        type: "text",
        section: defaultSection || selectedTest?.sections[0]?.name || "",
        order: (selectedTest?.fields.length || 0) + 1,
        options: [
          { label: "Negative", value: "Negative", isAbnormal: false },
          { label: "Positive", value: "Positive", isAbnormal: true },
        ],
        unit: "",
        referenceRange: "Negative",
      });
      setFieldSectionName(defaultSection || selectedTest?.sections[0]?.name || "");
    }
    setFieldModalOpen(true);
  };

  const handleSaveField = () => {
    if (!selectedTest || !editingField) return;
    if (!editingField.label.trim()) {
      toast({ title: "Label Required", description: "Parameter label is required", variant: "destructive" });
      return;
    }

    // Auto generate clean key if default
    const cleanKey = editingField.key.trim()
      ? editingField.key.trim()
      : editingField.label.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_");

    const finalField: FieldDefinition = {
      ...editingField,
      key: cleanKey,
      section: fieldSectionName || undefined,
    };

    const existingIdx = selectedTest.fields.findIndex((f) => f.id === finalField.id);
    let updatedFields: FieldDefinition[];
    if (existingIdx >= 0) {
      updatedFields = [...selectedTest.fields];
      updatedFields[existingIdx] = finalField;
    } else {
      updatedFields = [...selectedTest.fields, finalField];
    }

    setSelectedTest({
      ...selectedTest,
      fields: updatedFields,
    });
    setFieldModalOpen(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!selectedTest) return;
    setSelectedTest({
      ...selectedTest,
      fields: selectedTest.fields.filter((f) => f.id !== fieldId),
    });
  };

  const handleMoveField = (fieldId: string, direction: "up" | "down") => {
    if (!selectedTest) return;
    const idx = selectedTest.fields.findIndex((f) => f.id === fieldId);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= selectedTest.fields.length) return;

    const list = [...selectedTest.fields];
    const temp = list[idx];
    list[idx] = list[newIdx];
    list[newIdx] = temp;

    setSelectedTest({ ...selectedTest, fields: list });
  };

  // Dropdown options helpers inside field modal
  const handleAddOption = () => {
    if (!editingField) return;
    const currentOptions = editingField.options || [];
    setEditingField({
      ...editingField,
      options: [
        ...currentOptions,
        { label: `Option ${currentOptions.length + 1}`, value: `Option ${currentOptions.length + 1}`, isAbnormal: false },
      ],
    });
  };

  const handleUpdateOption = (index: number, key: keyof FieldOption, value: string | boolean | undefined) => {
    if (!editingField || !editingField.options) return;
    const updated = [...editingField.options];
    if (key === "isAbnormal") {
      updated[index] = { ...updated[index], isAbnormal: Boolean(value) };
    } else if (key === "label") {
      updated[index] = { ...updated[index], label: String(value), value: String(value) };
    } else {
      updated[index] = { ...updated[index], [key]: value };
    }
    setEditingField({ ...editingField, options: updated });
  };

  const handleDeleteOption = (index: number) => {
    if (!editingField || !editingField.options) return;
    setEditingField({
      ...editingField,
      options: editingField.options.filter((_, i) => i !== index),
    });
  };

  const filteredTests = tests.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                <Settings2 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Laboratory Test & Field Builder
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Add or modify any laboratory test with custom sections, dynamic field types, dropdown choices, and unit editors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setActivePreview(!activePreview)}
              className="gap-2 border-slate-300 dark:border-slate-700"
            >
              <Eye className="h-4 w-4" />
              {activePreview ? "Close Preview" : "Live Form Preview"}
            </Button>
            <Button onClick={handleCreateNewTest} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
              <Plus className="h-4 w-4" />
              Create New Test
            </Button>
          </div>
        </div>

        {/* Mobile View Switcher (lg:hidden) */}
        <div className="lg:hidden flex rounded-xl bg-blue-50/80 dark:bg-blue-950/50 p-1 border border-blue-200 dark:border-blue-900 mt-4">
          <button
            type="button"
            onClick={() => setMobileTab("catalog")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mobileTab === "catalog"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-blue-700"
            }`}
          >
            Catalog ({filteredTests.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("editor")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mobileTab === "editor"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-blue-700"
            }`}
          >
            {selectedTest ? `${selectedTest.name.slice(0, 18)}...` : "Parameter Editor"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Left Column: Test Directory Catalog */}
          <div className={`lg:col-span-4 space-y-4 ${mobileTab === "catalog" ? "block" : "hidden lg:block"}`}>
            <Card className="shadow-xs border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                  <span>Test Catalog</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {filteredTests.length} Tests
                  </Badge>
                </CardTitle>
                <div className="pt-2 space-y-2">
                  <Input
                    placeholder="Search test name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Category filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {COMMON_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 max-h-[600px] overflow-y-auto space-y-2">
                {filteredTests.map((test) => {
                  const isSelected = selectedTest?.id === test.id;
                  return (
                    <div
                      key={test.id}
                      onClick={() => handleSelectTest(test)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/80 shadow-xs"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{test.name}</span>
                            {test.isBuiltIn && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{test.code}</p>
                        </div>
                        <Badge variant="outline" className="text-[11px] font-normal shrink-0">
                          {test.category}
                        </Badge>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                        <span>{test.fields.length} Parameters</span>
                        <span>PKR {test.price || 0}</span>
                      </div>
                    </div>
                  );
                })}

                {filteredTests.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No tests found matching your criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Test Editor / Field Configuration */}
          <div className={`lg:col-span-8 space-y-6 ${mobileTab === "editor" ? "block" : "hidden lg:block"}`}>
            {selectedTest ? (
              <>
                {/* Test Meta Card */}
                <Card className="shadow-xs border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">{selectedTest.name}</CardTitle>
                      <CardDescription>Code: {selectedTest.code} • Category: {selectedTest.category}</CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicateTest(selectedTest)}
                        className="gap-1 text-xs"
                      >
                        <Copy className="h-3.5 w-3.5" /> Duplicate
                      </Button>
                      {!selectedTest.isBuiltIn && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTest(selectedTest.id)}
                          className="gap-1 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={handleSaveTest}
                        className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                      >
                        <Save className="h-3.5 w-3.5" /> Save Changes
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs font-semibold">Test Name *</Label>
                        <Input
                          value={selectedTest.name}
                          onChange={(e) => setSelectedTest({ ...selectedTest, name: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Test Code</Label>
                        <Input
                          value={selectedTest.code}
                          onChange={(e) => setSelectedTest({ ...selectedTest, code: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Category</Label>
                        <Select
                          value={selectedTest.category}
                          onValueChange={(cat) => setSelectedTest({ ...selectedTest, category: cat })}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COMMON_CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Test Method</Label>
                        <Input
                          placeholder="e.g. ICT, Automated, Microscopy"
                          value={selectedTest.method || ""}
                          onChange={(e) => setSelectedTest({ ...selectedTest, method: e.target.value })}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Section & Parameter Builder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="h-5 w-5 text-blue-600" />
                        Test Parameters & Fields
                      </h2>
                      <p className="text-xs text-slate-500">Configure parameters, dropdown options, and biological reference ranges.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSectionModalOpen(true)}
                        className="gap-1.5 text-xs"
                      >
                        <FolderPlus className="h-3.5 w-3.5 text-blue-600" />
                        Add Section
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openFieldModal()}
                        className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Parameter
                      </Button>
                    </div>
                  </div>

                  {/* Render Fields Grouped by Section */}
                  {selectedTest.sections && selectedTest.sections.length > 0 ? (
                    selectedTest.sections.map((sec) => {
                      const secFields = selectedTest.fields.filter((f) => f.section === sec.name);
                      return (
                        <Card key={sec.id} className="shadow-xs border-slate-200 dark:border-slate-800">
                          <CardHeader className="py-3 px-5 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{sec.name}</span>
                              <Badge variant="secondary" className="text-[10px]">
                                {secFields.length} fields
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openFieldModal(undefined, sec.name)}
                                className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700"
                              >
                                + Add Field Here
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteSection(sec.name)}
                                className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                              >
                                Delete Section
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 space-y-2.5">
                            {secFields.map((field) => renderFieldRow(field))}
                            {secFields.length === 0 && (
                              <p className="text-xs text-slate-400 py-3 text-center italic">No parameters in this section yet.</p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : null}

                  {/* Render unsectioned fields */}
                  {selectedTest.fields.filter((f) => !f.section).length > 0 && (
                    <Card className="shadow-xs border-slate-200 dark:border-slate-800">
                      <CardHeader className="py-3 px-5 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">General Parameters</span>
                      </CardHeader>
                      <CardContent className="p-4 space-y-2.5">
                        {selectedTest.fields
                          .filter((f) => !f.section)
                          .map((field) => renderFieldRow(field))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center text-slate-400">
                <Settings2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Select a test from the directory or create a new test to start editing.</p>
              </Card>
            )}
          </div>
        </div>

        {/* Live Form Preview Drawer / Modal */}
        <Dialog open={activePreview} onOpenChange={setActivePreview}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Live Form Preview: {selectedTest?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="py-4 space-y-6">
              <p className="text-xs text-slate-500">
                This is how the data entry form will render for lab technicians when testing a patient:
              </p>

              {selectedTest?.fields.map((f) => (
                <div key={f.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {f.label}
                      {f.required && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {f.unit && <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">{f.unit}</span>}
                      {f.referenceRange && <span>Ref: {f.referenceRange}</span>}
                    </div>
                  </div>

                  {f.type === "select" ? (
                    <Select defaultValue={f.options?.[0]?.value}>
                      <SelectTrigger className="bg-white dark:bg-slate-900">
                        <SelectValue placeholder="Select outcome" />
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
                    <Input type="number" placeholder={f.placeholder || "Enter value..."} className="bg-white dark:bg-slate-900" />
                  ) : (
                    <Input placeholder={f.placeholder || "Enter value..."} className="bg-white dark:bg-slate-900" />
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button onClick={() => setActivePreview(false)}>Close Preview</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal: Add/Edit Parameter Field */}
        <Dialog open={fieldModalOpen} onOpenChange={setFieldModalOpen}>
          <DialogContent className="w-[95vw] sm:max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editingField ? "Edit Parameter Field" : "Add New Parameter"}
              </DialogTitle>
            </DialogHeader>

            {editingField && (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Parameter Label *</Label>
                    <Input
                      placeholder="e.g. Hemoglobin, RBCs, Dengue NS1"
                      value={editingField.label}
                      onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Field Type *</Label>
                    <Select
                      value={editingField.type}
                      onValueChange={(t: FieldType) => setEditingField({ ...editingField, type: t })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Input (Single line)</SelectItem>
                        <SelectItem value="number">Numeric Value</SelectItem>
                        <SelectItem value="select">Dropdown Choice (Select)</SelectItem>
                        <SelectItem value="multiselect">Multi-Select Checkboxes</SelectItem>
                        <SelectItem value="boolean">Boolean Switch (Yes/No)</SelectItem>
                        <SelectItem value="textarea">Text Area (Multi-line notes)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold">Assigned Section</Label>
                    <Select value={fieldSectionName} onValueChange={setFieldSectionName}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="No Section (General)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Section</SelectItem>
                        {selectedTest?.sections.map((s) => (
                          <SelectItem key={s.id} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Biological Reference / Normal Range</Label>
                    <Input
                      placeholder="e.g. Negative, 0 - 4 /HPF, 12 - 16 g/dL"
                      value={editingField.referenceRange || ""}
                      onChange={(e) => setEditingField({ ...editingField, referenceRange: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Custom Unit Editor */}
                <div>
                  <Label className="text-xs font-semibold">Unit of Measurement</Label>
                  <Input
                    placeholder="e.g. mg/dL, parasites/µL, /HPF, ml"
                    value={editingField.unit || ""}
                    onChange={(e) => setEditingField({ ...editingField, unit: e.target.value })}
                    className="mt-1"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {COMMON_UNITS.map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setEditingField({ ...editingField, unit: u })}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                          editingField.unit === u
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dropdown Options Manager (Shown when type is select or multiselect) */}
                {(editingField.type === "select" || editingField.type === "multiselect") && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Dropdown Options List
                      </Label>
                      <Button size="sm" variant="outline" onClick={handleAddOption} className="h-7 text-xs gap-1">
                        <Plus className="h-3 w-3" /> Add Choice
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {editingField.options?.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            value={opt.label}
                            onChange={(e) => handleUpdateOption(i, "label", e.target.value)}
                            placeholder="Option text..."
                            className="h-8 text-xs flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateOption(i, "isAbnormal", !opt.isAbnormal)}
                            className={`h-8 px-2.5 rounded text-[11px] font-medium border flex items-center gap-1 transition ${
                              opt.isAbnormal
                                ? "bg-red-50 text-red-600 border-red-300 dark:bg-red-950 dark:border-red-800"
                                : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                            }`}
                            title="Flag if this choice represents an abnormal/positive diagnostic finding"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            {opt.isAbnormal ? "Abnormal" : "Normal"}
                          </button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteOption(i)}
                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setFieldModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveField} className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Parameter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal: Add Section */}
        <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
          <DialogContent className="w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Category Section</DialogTitle>
            </DialogHeader>
            <div className="py-3">
              <Label className="text-xs font-semibold">Section Name</Label>
              <Input
                placeholder="e.g. Physical Examination, Microscopic, Serology"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="mt-1.5"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSectionModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSection} className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Section
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );

  function renderFieldRow(field: FieldDefinition) {
    return (
      <div
        key={field.id}
        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => handleMoveField(field.id, "up")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleMoveField(field.id, "down")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{field.label}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                {field.type}
              </Badge>
              {field.unit && (
                <Badge variant="secondary" className="text-[10px] px-1 py-0 font-mono bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {field.unit}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              Ref: <span className="text-slate-600 dark:text-slate-300 font-medium">{field.referenceRange || "None"}</span>
              {field.options && ` • Choices (${field.options.length}): ${field.options.map((o) => o.label).join(", ")}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => openFieldModal(field, field.section)}
            className="h-8 w-8 text-slate-500 hover:text-blue-600"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDeleteField(field.id)}
            className="h-8 w-8 text-slate-500 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }
}
