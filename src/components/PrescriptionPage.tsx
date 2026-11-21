// src/components/PrescriptionPage.tsx
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { inventoryDB } from "@/inventoryFirebase";
import { auth, db } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Package,
  Search,
  ShoppingCart,
  Calendar,
  User,
  FileText,
  Download,
  Eye,
  Edit,
  Lock,
  HeartPulse,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSalePDF } from "./SalesPDF";

type InventoryMedicine = {
  id: string;
  name: string;
  quantity?: number;
  cost_price?: number;
  retail_price?: number;
  [key: string]: unknown;
};

type PrescriptionItem = {
  id: string;
  name: string;
  dosage?: string;
  qty: number;
  instructions?: string;
  cost_price?: number;
  retail_price?: number;
};

export default function PrescriptionPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const prescriptionData = location.state?.prescriptionData || null;
  const [isViewMode, setIsViewMode] = useState(!!prescriptionData);
  const patientData = prescriptionData?.patient || location.state?.patientData || null;

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [inventory, setInventory] = useState<InventoryMedicine[]>([]);
  const [loadingMeds, setLoadingMeds] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [prescription, setPrescription] = useState<PrescriptionItem[]>([]);
  const [selectedQty, setSelectedQty] = useState<Record<string, number | "">>({});
  const [selectedNotes, setSelectedNotes] = useState<Record<string, string>>({});

  const [vitals, setVitals] = useState({
    oxygen: "",
    bp: "",
    weight: "",
    temp: "",
  });

  const [phone, setPhone] = useState(patientData?.phone || "");
  const [lastSavedPREC, setLastSavedPREC] = useState<string | null>(prescriptionData?.precNumber || null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const userRef = doc(db, "users", u.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setIsAdmin(snap.data().role === "admin");
          } else {
            setIsAdmin(u.email === "admin@example.com");
          }
        } catch {
          setIsAdmin(true);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (prescriptionData) {
      setPrescription(prescriptionData.prescription || []);
      setVitals(prescriptionData.vitals || { oxygen: "", bp: "", weight: "", temp: "" });
      setPhone(prescriptionData.patient?.phone || "");
      setLastSavedPREC(prescriptionData.precNumber || null);
    }
  }, [prescriptionData]);

  // Inventory search
  useEffect(() => {
    if (!searchQuery.trim() || isViewMode) {
      setInventory([]);
      return;
    }

    let mounted = true;
    const fetchMeds = async () => {
      setLoadingMeds(true);
      try {
        const snap = await getDocs(collection(inventoryDB, "medicines"));
        const meds: InventoryMedicine[] = [];
        snap.forEach((d) => {
          const data = d.data();
          meds.push({
            id: d.id,
            name: data.name || "Unknown",
            quantity: data.quantity ?? 0,
            cost_price: data.cost_price ?? 0,
            retail_price: data.retail_price ?? 0,
            ...data,
          });
        });

        const q = searchQuery.toLowerCase().trim();
        const filtered = meds.filter((m) => m.name.toLowerCase().includes(q));
        if (mounted) setInventory(filtered);
      } catch (err) {
        console.warn("Could not query inventoryDB:", err);
      } finally {
        if (mounted) setLoadingMeds(false);
      }
    };

    fetchMeds();
    return () => {
      mounted = false;
    };
  }, [searchQuery, isViewMode]);

  const generatePREC = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    return `PREC-${datePart}-${randomPart}`;
  };

  const handleAddToPrescription = (med: InventoryMedicine) => {
    const raw = selectedQty[med.id];
    const qtyToAdd = raw === "" || raw === undefined ? 1 : Number(raw || 0);

    if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
      toast({ title: "Invalid quantity", description: "Please enter a valid quantity.", variant: "destructive" });
      return;
    }

    const note = selectedNotes[med.id] || "";

    setPrescription((prev) => {
      const existing = prev.find((p) => p.id === med.id);
      if (existing) {
        return prev.map((p) =>
          p.id === med.id
            ? { ...p, qty: qtyToAdd, instructions: note || p.instructions }
            : p
        );
      }
      return [
        ...prev,
        {
          id: med.id,
          name: med.name,
          qty: qtyToAdd,
          instructions: note,
          dosage: "",
          cost_price: med.cost_price,
          retail_price: med.retail_price,
        },
      ];
    });

    setSelectedQty((s) => ({ ...s, [med.id]: "" }));
    setSelectedNotes((s) => ({ ...s, [med.id]: "" }));
    toast({ title: "Added to Prescription", description: `${qtyToAdd}x ${med.name}` });
  };

  const handleRemoveItem = (id: string) => {
    setPrescription((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditItem = (id: string, field: keyof PrescriptionItem, value: string | number | undefined) => {
    setPrescription((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const totalRetail = prescription.reduce(
    (sum, p) => sum + (p.retail_price || 0) * p.qty,
    0
  );

  const handleDownloadPDF = async (withHeader: boolean) => {
    if (prescription.length === 0) {
      toast({ title: "Empty Prescription", description: "Add medicines before exporting.", variant: "destructive" });
      return;
    }

    const cart = prescription.map((p) => ({
      medicineName: p.name,
      dosage: p.dosage,
      quantity: p.qty,
      price: p.retail_price ?? 0,
      instructions: p.instructions ?? "-",
    }));

    try {
      await generateSalePDF({
        cart,
        patient: { ...patientData, phone },
        precNumber: lastSavedPREC,
        withHeader,
      });
      toast({ title: "PDF Exported", description: `Prescription saved ${withHeader ? "with" : "without"} banner.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "PDF export failed";
      toast({ title: "Export Error", description: msg, variant: "destructive" });
    }
  };

  const handleSaveToFirebase = async () => {
    if (!patientData?.name) {
      toast({ title: "Missing Patient", description: "No patient details found.", variant: "destructive" });
      return;
    }
    if (prescription.length === 0) {
      toast({ title: "Empty Prescription", description: "Add at least 1 medicine.", variant: "destructive" });
      return;
    }

    try {
      const precNumber = lastSavedPREC || generatePREC();
      const payload = {
        precNumber,
        patient: { ...patientData, phone },
        vitals,
        prescription,
        totalItems: prescription.reduce((s, p) => s + p.qty, 0),
        totalRetail,
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(inventoryDB, "prescriptions"), payload);
      setLastSavedPREC(precNumber);
      toast({ title: "Prescription Saved", description: `Record stored under ${precNumber}` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast({ title: "Save Error", description: msg, variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isViewMode ? "View Prescription" : "Patient Prescription & Medication"}
              </h1>
              <p className="text-xs text-slate-500">
                {isViewMode ? `Viewing Prescription: ${lastSavedPREC || "Archived"}` : "Prescribe medicines, review inventory, and record vitals"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {prescriptionData && (
              <Button
                variant={isViewMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsViewMode(!isViewMode)}
                className="gap-1.5 text-xs"
              >
                {isViewMode ? <Edit className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {isViewMode ? "Edit Mode" : "View Mode"}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-1.5 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
          </div>
        </div>

        {/* Patient Details Card */}
        {patientData && (
          <Card className="shadow-xs border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3.5 px-6 rounded-t-xl">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" /> Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Patient Name:</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{patientData.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Age / Gender:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{patientData.age ?? "-"} / {patientData.sex ?? "-"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Referring Doctor:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{patientData.referringDoctor || "Dr. Aamir"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Contact Phone:</span>
                  {isViewMode ? (
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{phone || "-"}</span>
                  ) : (
                    <Input
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-8 text-xs mt-1"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vitals Card */}
        <Card className="shadow-xs border-slate-200 dark:border-slate-800">
          <CardHeader className="py-3 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-red-500" /> Clinical Vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs font-medium text-slate-500">Oxygen Saturation (%)</Label>
                {isViewMode ? (
                  <p className="font-bold text-sm mt-1">{vitals.oxygen || "-"}</p>
                ) : (
                  <Input
                    placeholder="e.g. 98"
                    value={vitals.oxygen}
                    onChange={(e) => setVitals({ ...vitals, oxygen: e.target.value })}
                    className="h-9 mt-1 text-xs"
                  />
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">Blood Pressure</Label>
                {isViewMode ? (
                  <p className="font-bold text-sm mt-1">{vitals.bp || "-"}</p>
                ) : (
                  <Input
                    placeholder="e.g. 120/80"
                    value={vitals.bp}
                    onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                    className="h-9 mt-1 text-xs"
                  />
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">Weight (kg)</Label>
                {isViewMode ? (
                  <p className="font-bold text-sm mt-1">{vitals.weight || "-"}</p>
                ) : (
                  <Input
                    placeholder="e.g. 70"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    className="h-9 mt-1 text-xs"
                  />
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">Temperature (°C)</Label>
                {isViewMode ? (
                  <p className="font-bold text-sm mt-1">{vitals.temp || "-"}</p>
                ) : (
                  <Input
                    placeholder="e.g. 37.0"
                    value={vitals.temp}
                    onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                    className="h-9 mt-1 text-xs"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medicine Inventory Search (Edit mode only) */}
        {!isViewMode && (
          <Card className="shadow-xs border-slate-200 dark:border-slate-800">
            <CardHeader className="py-3 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600" /> Search Pharmacy Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Type medicine name to search stock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-sm"
                />
              </div>

              {searchQuery && (
                <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
                  {loadingMeds ? (
                    <p className="text-xs text-slate-400 text-center py-4">Searching medicine database...</p>
                  ) : inventory.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No matching medicines found for "{searchQuery}".</p>
                  ) : (
                    inventory.map((med) => (
                      <div
                        key={med.id}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-950"
                      >
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-white">{med.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Stock: {med.quantity ?? 0} • Price: PKR {(med.retail_price || 0).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={selectedQty[med.id] ?? ""}
                            onChange={(e) => setSelectedQty({ ...selectedQty, [med.id]: Number(e.target.value) })}
                            className="w-16 h-8 text-xs text-center shrink-0"
                          />
                          <Input
                            placeholder="Dosage / notes"
                            value={selectedNotes[med.id] || ""}
                            onChange={(e) => setSelectedNotes({ ...selectedNotes, [med.id]: e.target.value })}
                            className="flex-1 sm:w-32 h-8 text-xs"
                          />
                          <Button size="sm" onClick={() => handleAddToPrescription(med)} className="h-8 text-xs gap-1 bg-blue-600 hover:bg-blue-700 shrink-0">
                            <Plus className="h-3 w-3" /> Add
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Current Prescription Table */}
        <Card className="shadow-xs border-slate-200 dark:border-slate-800">
          <CardHeader className="py-4 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-blue-600" /> Prescribed Medications ({prescription.length})
              </CardTitle>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Grand Total: </span>
              <span className="text-sm font-black text-blue-600">PKR {totalRetail.toFixed(2)}</span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {prescription.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No medications added to this prescription yet.
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-xs text-left min-w-[620px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b">
                    <tr>
                      <th className="p-3 w-10">#</th>
                      <th className="p-3">Medicine</th>
                      <th className="p-3 text-center">Dosage</th>
                      <th className="p-3 text-center w-20">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3">Instructions</th>
                      {!isViewMode && <th className="p-3 text-center w-12">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {prescription.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                        <td className="p-3 text-center">
                          {isViewMode ? (
                            item.dosage || "-"
                          ) : (
                            <Input
                              value={item.dosage || ""}
                              onChange={(e) => handleEditItem(item.id, "dosage", e.target.value)}
                              placeholder="e.g. 1-0-1"
                              className="h-7 text-xs text-center w-24 mx-auto"
                            />
                          )}
                        </td>
                        <td className="p-3 text-center font-bold">{item.qty}</td>
                        <td className="p-3 text-right font-mono">PKR {(item.retail_price || 0).toFixed(2)}</td>
                        <td className="p-3 text-right font-bold font-mono text-blue-600">
                          PKR {((item.retail_price || 0) * item.qty).toFixed(2)}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">
                          {isViewMode ? (
                            item.instructions || "-"
                          ) : (
                            <Input
                              value={item.instructions || ""}
                              onChange={(e) => handleEditItem(item.id, "instructions", e.target.value)}
                              placeholder="e.g. After meals"
                              className="h-7 text-xs"
                            />
                          )}
                        </td>
                        {!isViewMode && (
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prescription Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2 text-xs w-full sm:w-auto">
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Lab
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            {!isViewMode && (
              <Button onClick={handleSaveToFirebase} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs flex-1 sm:flex-none">
                Save Prescription
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => handleDownloadPDF(false)}
              className="gap-1.5 text-xs border-slate-300 flex-1 sm:flex-none"
            >
              <Download className="h-3.5 w-3.5" /> PDF (Clean)
            </Button>
            <Button
              onClick={() => handleDownloadPDF(true)}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs flex-1 sm:flex-none"
            >
              <Download className="h-3.5 w-3.5" /> PDF (With Header)
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
