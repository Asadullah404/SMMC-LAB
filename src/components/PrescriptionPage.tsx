// // "use client";

// // import React, { useEffect, useState } from "react";
// // import Layout from "@/components/Layout";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { collection, getDocs, addDoc } from "firebase/firestore";
// // import { inventoryDB } from "@/inventoryFirebase";
// // import { db, loginWithGoogle, logout } from "@/firebase";
// // import {
// //   Card,
// //   CardHeader,
// //   CardTitle,
// //   CardContent,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Plus,
// //   Trash2,
// //   ArrowLeft,
// //   Package,
// //   Send,
// //   Search,
// //   ShoppingCart,
// //   Calendar,
// //   User,
// //   FileText,
// //   Download,
// //   X,
// //   Edit,
// //   Eye,
// // } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";

// // import autoTable from "jspdf-autotable";
// // import { jsPDF } from "jspdf";
// // import { generateSalePDF } from "./SalesPDF";

// // type InventoryMedicine = {
// //   id: string;
// //   name: string;
// //   quantity?: number;
// //   cost_price?: number;
// //   retail_price?: number;
// //   [key: string]: any;
// // };

// // type PrescriptionItem = {
// //   id: string;
// //   name: string;
// //   dosage?: string;
// //   qty: number;
// //   instructions?: string;
// //   cost_price?: number;
// //   retail_price?: number;
// // };

// // export default function PrescriptionPage(): JSX.Element {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { toast } = useToast();

// //   const [showDownloadOptions, setShowDownloadOptions] = useState(false);
// //   const [includeHeader, setIncludeHeader] = useState<boolean | null>(null);

// //   // 🔹 NEW: Check if we're in view mode
// //   const prescriptionData = location.state?.prescriptionData || null;
// //   const disableSend = location.state?.disableSend || false;
// //   const [isViewMode, setIsViewMode] = useState(!!prescriptionData);

// //   const patientData = prescriptionData?.patient || location.state?.patientData || null;

// //   // Navbar states
// //   const [isDarkMode, setIsDarkMode] = useState(false);
// //   const [user, setUser] = useState<any>(null);
// //   const [role, setRole] = useState<string | null>(null);
// //   const [searchCode, setSearchCode] = useState("");

// //   const toggleDarkMode = () => {
// //     setIsDarkMode((prev) => !prev);
// //     if (!isDarkMode) {
// //       document.documentElement.classList.add("dark");
// //       localStorage.setItem("theme", "dark");
// //     } else {
// //       document.documentElement.classList.remove("dark");
// //       localStorage.setItem("theme", "light");
// //     }
// //   };

// //   const handleLogin = async () => {
// //     const userData = await loginWithGoogle();
// //     setUser(userData);
// //   };

// //   const handleLogout = async () => {
// //     await logout();
// //     setUser(null);
// //     setRole(null);
// //   };

// //   const handleSearch = () => {
// //     if (searchCode.trim() !== "") {
// //       navigate(`/report/${searchCode.trim()}`);
// //       setSearchCode("");
// //     }
// //   };

// //   const [inventory, setInventory] = useState<InventoryMedicine[]>([]);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [searchQuery, setSearchQuery] = useState<string>("");
// //   const [prescription, setPrescription] = useState<PrescriptionItem[]>([]);
// //   const [selectedQty, setSelectedQty] = useState<Record<string, number | "">>({});
// //   const [selectedNotes, setSelectedNotes] = useState<Record<string, string>>({});

// //   // vitals state
// //   const [vitals, setVitals] = useState({
// //     oxygen: "",
// //     bp: "",
// //     weight: "",
// //     temp: "",
// //   });

// //   // phone inside patient card
// //   const [phone, setPhone] = useState<string>(patientData?.phone || "");

// //   // preview modal state
// //   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
// //   const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
// //   const [lastSavedPREC, setLastSavedPREC] = useState<string | null>(null);
// //   const [savingPreview, setSavingPreview] = useState(false);

// //   // 🔹 NEW: Load prescription data if in view mode
// //   useEffect(() => {
// //     if (prescriptionData) {
// //       setPrescription(prescriptionData.prescription || []);
// //       setVitals(prescriptionData.vitals || { oxygen: "", bp: "", weight: "", temp: "" });
// //       setPhone(prescriptionData.patient?.phone || "");
// //       setLastSavedPREC(prescriptionData.precNumber || null);
// //     }
// //   }, [prescriptionData]);

// //   useEffect(() => {
// //     if (!searchQuery.trim() || isViewMode) {
// //       setInventory([]);
// //       return;
// //     }

// //     let mounted = true;
// //     const fetchMedicines = async () => {
// //       try {
// //         setLoading(true);
// //         const snap = await getDocs(collection(inventoryDB, "medicines"));
// //         const meds = snap.docs.map((d) => {
// //           const data = d.data() as Partial<InventoryMedicine>;
// //           return {
// //             id: d.id,
// //             name: data.name || "Unknown",
// //             quantity: data.quantity ?? 0,
// //             cost_price: data.cost_price ?? 0,
// //             retail_price: data.retail_price ?? 0,
// //             ...data,
// //           } as InventoryMedicine;
// //         });

// //         const q = searchQuery.toLowerCase().trim();
// //         const filtered = meds.filter((m) =>
// //           String(m.name || "").toLowerCase().includes(q)
// //         );

// //         if (mounted) setInventory(filtered);
// //       } catch (err) {
// //         console.error("Error fetching medicines:", err);
// //         toast({
// //           title: "Error",
// //           description: "Failed to fetch medicines.",
// //           variant: "destructive",
// //         });
// //       } finally {
// //         if (mounted) setLoading(false);
// //       }
// //     };

// //     fetchMedicines();
// //     return () => {
// //       mounted = false;
// //     };
// //   }, [searchQuery, toast, isViewMode]);

// //   const generatePREC = () => {
// //     const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
// //     const randomPart = Math.floor(10000 + Math.random() * 90000);
// //     return `PREC-${datePart}-${randomPart}`;
// //   };

// //   const handleAddToPrescription = (med: InventoryMedicine) => {
// //     const raw = selectedQty[med.id];
// //     const qtyToAdd = raw === "" || raw === undefined ? 1 : Number(raw || 0);

// //     if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
// //       toast({
// //         title: "Invalid quantity",
// //         description: "Please enter a valid quantity.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     if (qtyToAdd > (med.quantity ?? 0)) {
// //       toast({
// //         title: "Insufficient Stock",
// //         description: `Only ${med.quantity} in stock for ${med.name}.`,
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     const note = selectedNotes[med.id] || "";

// //     setPrescription((prev) => {
// //       const existing = prev.find((p) => p.id === med.id);
// //       if (existing) {
// //         return prev.map((p) =>
// //           p.id === med.id
// //             ? {
// //                 ...p,
// //                 qty: qtyToAdd,
// //                 instructions: note || p.instructions,
// //               }
// //             : p
// //         );
// //       }
// //       return [
// //         ...prev,
// //         {
// //           id: med.id,
// //           name: med.name || "Unnamed",
// //           qty: qtyToAdd,
// //           instructions: note,
// //           dosage: "",
// //           cost_price: med.cost_price,
// //           retail_price: med.retail_price,
// //         },
// //       ];
// //     });

// //     setSelectedQty((s) => ({ ...s, [med.id]: "" }));
// //     setSelectedNotes((s) => ({ ...s, [med.id]: "" }));
// //   };

// //   const handleRemoveFromPrescription = (id: string) => {
// //     setPrescription((prev) => prev.filter((p) => p.id !== id));
// //   };

// //   const handleQtyChange = (id: string, value: string) => {
// //     if (value === "") {
// //       setSelectedQty((s) => ({ ...s, [id]: "" }));
// //       return;
// //     }
// //     const clean = value.replace(/[^0-9]/g, "");
// //     const normalized = clean.replace(/^0+(?=\d)/, "");
// //     setSelectedQty((s) => ({ ...s, [id]: normalized === "" ? "" : Number(normalized) }));
// //   };

// //   const handleNoteChange = (id: string, value: string) => {
// //     setSelectedNotes((s) => ({ ...s, [id]: value }));
// //   };

// //   const handleEditPrescriptionItem = (
// //     id: string,
// //     field: keyof PrescriptionItem,
// //     value: any
// //   ) => {
// //     setPrescription((prev) =>
// //       prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
// //     );
// //   };

// //   const totalItems = prescription.reduce((sum, p) => sum + p.qty, 0);
// //   const totalRetail = prescription.reduce(
// //     (sum, p) => sum + (p.retail_price || 0) * p.qty,
// //     0
// //   );

// //   const savePrescriptionToFirebase = async (precNumber: string) => {
// //     const payload = {
// //       precNumber,
// //       patient: {
// //         ...patientData,
// //         phone,
// //       },
// //       vitals,
// //       prescription,
// //       totalItems,
// //       totalRetail,
// //       timestamp: new Date().toISOString(),
// //     };

// //     await addDoc(collection(inventoryDB, "prescriptions"), payload);
// //   };

// //   const generatePDFBlob = async (precNumber: string) => {
// //     try {
// //       const doc = new jsPDF({ compress: true });
// //       const pageWidth = doc.internal.pageSize.getWidth();

// //       let yPos = 6 * 10;

// //       try {
// //         const response = await fetch("/logo.png");
// //         const blob = await response.blob();
// //         const base64 = await new Promise<string>((resolve, reject) => {
// //           const reader = new FileReader();
// //           reader.onloadend = () => resolve(reader.result as string);
// //           reader.onerror = reject;
// //           reader.readAsDataURL(blob);
// //         });

// //         const logoSize = 150;
// //         const x = (pageWidth - logoSize) / 2;
// //         const y = 40;
// //         (doc as any).setGState(new (doc as any).GState({ opacity: 0.06 }));
// //         doc.addImage(base64, "PNG", x, y, logoSize, logoSize);
// //         (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
// //       } catch {
// //         // ignore if logo not found
// //       }

// //       doc.setFontSize(14);
// //       doc.setFont("helvetica", "bold");
// //       doc.text("Prescription", 14, yPos - 2);
// //       doc.setFontSize(9);
// //       doc.setFont("helvetica", "normal");
// //       doc.text(`${precNumber}`, pageWidth - 18, yPos - 2, { align: "right" });

// //       if (patientData?.name || phone) {
// //         doc.setFontSize(9);
// //         doc.setFont("helvetica", "bold");
// //         doc.text("PATIENT INFORMATION", 14, yPos + 6);
// //         doc.setFont("helvetica", "normal");
// //         doc.setFontSize(9);
// //         const name = patientData?.name || "-";
// //         const docText = `Name: ${name}`;
// //         doc.text(docText, 14, yPos + 12);

// //         const doctor = `Doctor: ${patientData?.referringDoctor || "-"}`;
// //         doc.text(doctor, 14, yPos + 17);
// //         const rightInfo = `Phone: ${phone || "-"}`;
// //         doc.text(rightInfo, pageWidth - 18, yPos + 12, { align: "right" });

// //         const ageGenderLine = `Age: ${patientData?.age ?? "-"} | Gender: ${patientData?.sex ?? "-"}`;
// //         doc.text(ageGenderLine, pageWidth - 18, yPos + 17, { align: "right" });

// //         yPos += 26;
// //       }

// //       doc.setFont("helvetica", "bold");
// //       doc.setFontSize(9);
// //       doc.text("VITALS", 14, yPos + 6);
// //       doc.setFont("helvetica", "normal");
// //       doc.setFontSize(9);
// //       const vitalsText = `O₂: ${vitals.oxygen || "-"} | BP: ${vitals.bp || "-"} | Weight: ${vitals.weight || "-"} | Temp: ${vitals.temp || "-"}`;
// //       doc.text(vitalsText, 14, yPos + 12);
// //       yPos += 22;

// //       const tableBody = prescription.map((p, i) => [
// //         (i + 1).toString(),
// //         p.name,
// //         p.dosage || "-",
// //         p.qty.toString(),
// //         `PKR ${(p.retail_price || 0).toFixed(2)}`,
// //         `PKR ${((p.retail_price || 0) * p.qty).toFixed(2)}`,
// //         p.instructions || "-",
// //       ]);

// //       autoTable(doc, {
// //         startY: yPos,
// //         head: [["#", "Medicine", "Dosage", "Qty", "Price", "Total", "Instructions"]],
// //         body: tableBody,
// //         theme: "grid",
// //         styles: {
// //           fontSize: 9,
// //           cellPadding: 5,
// //         },
// //         headStyles: {
// //           fillColor: [0, 102, 204],
// //           textColor: [255, 255, 255],
// //           fontStyle: "bold",
// //         },
// //       });

// //       const totalAmount = prescription.reduce((sum, i) => sum + (i.retail_price || 0) * i.qty, 0);
// //       const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : yPos + 80;

// //       doc.setFont("helvetica", "bold");
// //       doc.setFontSize(10);
// //       doc.text("TOTAL AMOUNT", pageWidth - 75, finalY + 6);
// //       doc.setFontSize(12);
// //       doc.text(`PKR ${totalAmount.toFixed(2)}`, pageWidth - 18, finalY + 14, { align: "right" });

// //       const pageHeight = doc.internal.pageSize.getHeight();
// //       const footerY = pageHeight - 20;
// //       doc.setFont("helvetica", "italic");
// //       doc.setFontSize(9);
// //       doc.text("Thank you for choosing SMMC Laboratory", pageWidth / 2, footerY, { align: "center" });

// //       const blob = doc.output("blob");
// //       return blob;
// //     } catch (err) {
// //       console.error("Preview PDF generation failed:", err);
// //       throw err;
// //     }
// //   };

// //   const handlePreviewAndSave = async () => {
// //     if (!patientData?.name) {
// //       toast({
// //         title: "Missing data",
// //         description: "No patient data found.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     if (prescription.length === 0) {
// //       toast({
// //         title: "Empty prescription",
// //         description: "Please add medicines before previewing.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     setSavingPreview(true);

// //     try {
// //       let precNumber = lastSavedPREC;

// //       if (!precNumber && !isViewMode) {
// //         precNumber = generatePREC();
// //         await savePrescriptionToFirebase(precNumber);
// //         setLastSavedPREC(precNumber);

// //         toast({
// //           title: "Saved",
// //           description: `Prescription ${precNumber} saved successfully.`,
// //           variant: "default",
// //         });
// //       } else if (precNumber) {
// //         console.log("Prescription already saved:", precNumber);
// //       }

// //       const blob = await generatePDFBlob(precNumber || "VIEW-MODE");
// //       const url = URL.createObjectURL(blob);
// //       setPdfBlobUrl(url);
// //       setIsPreviewOpen(true);

// //     } catch (err) {
// //       console.error("Error while previewing/saving:", err);
// //       toast({
// //         title: "Error",
// //         description: "Failed to save or preview prescription.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setSavingPreview(false);
// //     }
// //   };

// //   const handleDownloadFromPreview = async () => {
// //     if (!prescription || prescription.length === 0) {
// //       toast({
// //         title: "No data",
// //         description: "Nothing to generate.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     const cart = prescription.map((p) => ({
// //       medicineName: p.name,
// //       dosage: p.dosage,
// //       quantity: p.qty,
// //       price: p.retail_price ?? 0,
// //       instructions: p.instructions ?? "-",
// //     }));

// //     try {
// //       await generateSalePDF({
// //         cart,
// //         patient: { ...patientData, phone },
// //         precNumber: lastSavedPREC,
// //         withHeader: true,
// //       });
// //     } catch (err) {
// //       console.error("Error calling SalesPDF:", err);
// //       toast({
// //         title: "Error",
// //         description: "Failed to generate final PDF.",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   const handleSendToFirebase = async () => {
// //     if (!patientData) {
// //       toast({
// //         title: "Missing data",
// //         description: "No patient data found.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     if (prescription.length === 0) {
// //       toast({
// //         title: "Empty prescription",
// //         description: "Please add medicines before sending.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     try {
// //       const precNumber = lastSavedPREC ?? generatePREC();
// //       await savePrescriptionToFirebase(precNumber);
// //       setLastSavedPREC(precNumber);

// //       toast({
// //         title: "Success",
// //         description: `Prescription ${precNumber} saved successfully.`,
// //         variant: "default",
// //       });

// //       setPrescription([]);
// //       setSearchQuery("");
// //       setInventory([]);
// //     } catch (error) {
// //       console.error("Error saving prescription:", error);
// //       toast({
// //         title: "Error",
// //         description: "Failed to save prescription.",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   const closePreview = () => {
// //     setIsPreviewOpen(false);
// //     if (pdfBlobUrl) {
// //       URL.revokeObjectURL(pdfBlobUrl);
// //       setPdfBlobUrl(null);
// //     }
// //   };

// //   // 🔹 Toggle between view and edit mode
// //   const toggleEditMode = () => {
// //     setIsViewMode(!isViewMode);
// //   };

// //   return (
// //     <Layout
// //       isDarkMode={isDarkMode}
// //       toggleDarkMode={toggleDarkMode}
// //       user={user}
// //       role={role}
// //       handleLogin={handleLogin}
// //       handleLogout={handleLogout}
// //       searchCode={searchCode}
// //       setSearchCode={setSearchCode}
// //       handleSearch={handleSearch}
// //     >
// //       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 lg:p-8">
// //         {/* Professional Header */}
// //         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
// //           <div className="flex items-center gap-4">
// //             <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg">
// //               {isViewMode ? <Eye className="h-7 w-7 text-white" /> : <FileText className="h-7 w-7 text-white" />}
// //             </div>
// //             <div>
// //               <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
// //                 {isViewMode ? "View Prescription" : "Create Prescription"}
// //               </h1>
// //               <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
// //                 {isViewMode ? "Review prescription details" : "Add medicines and manage patient prescriptions"}
// //               </p>
// //             </div>
// //           </div>

// //           <div className="flex gap-2">
// //             {prescriptionData && (
// //               <Button
// //                 variant={isViewMode ? "default" : "outline"}
// //                 onClick={toggleEditMode}
// //                 className="dark:border-slate-600"
// //               >
// //                 {isViewMode ? <Edit className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
// //                 {isViewMode ? "Edit Mode" : "View Mode"}
// //               </Button>
// //             )}
// //             <Button
// //               variant="outline"
// //               onClick={() => navigate(-1)}
// //               className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
// //             >
// //               <ArrowLeft className="mr-2 h-4 w-4" />
// //               Back
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Patient Details Card */}
// //         {patientData && (
// //           <Card className="shadow-lg border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
// //             <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white">
// //               <div className="flex items-center gap-3">
// //                 <User className="h-6 w-6" />
// //                 <CardTitle className="text-xl">Patient Information</CardTitle>
// //               </div>
// //             </CardHeader>
// //             <CardContent className="p-6 bg-white dark:bg-slate-800">
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                 <div className="space-y-2">
// //                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
// //                     Patient Name
// //                   </Label>
// //                   <p className="text-lg font-semibold text-slate-900 dark:text-white">
// //                     {patientData.name || "-"}
// //                   </p>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
// //                     Relation
// //                   </Label>
// //                   <p className="text-lg font-semibold text-slate-900 dark:text-white">
// //                     {patientData.relation || "-"}
// //                   </p>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
// //                     Age / Gender
// //                   </Label>
// //                   <p className="text-lg font-semibold text-slate-900 dark:text-white">
// //                     {(patientData.age ?? "-")} / {patientData.sex ?? "-"}
// //                   </p>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
// //                     Referring Doctor
// //                   </Label>
// //                   <p className="text-lg font-semibold text-slate-900 dark:text-white">
// //                     {patientData.referringDoctor || "-"}
// //                   </p>
// //                 </div>

// //                 <div className="space-y-2 md:col-span-2">
// //                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
// //                     Phone
// //                   </Label>
// //                   {isViewMode ? (
// //                     <p className="text-lg font-semibold text-slate-900 dark:text-white">
// //                       {phone || "-"}
// //                     </p>
// //                   ) : (
// //                     <Input
// //                       placeholder="Phone number"
// //                       value={phone}
// //                       onChange={(e) => setPhone(e.target.value)}
// //                       className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
// //                     />
// //                   )}
// //                 </div>

// //                 <div className="space-y-2 md:col-span-2">
// //                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
// //                     <Calendar className="h-3 w-3" />
// //                     Collection Date & Time
// //                   </Label>
// //                   <p className="text-lg font-semibold text-slate-900 dark:text-white">
// //                     {patientData.collectionDateTime || "-"}
// //                   </p>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         )}

// //         {/* Vitals Card */}
// //         <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
// //           <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white">
// //             <div className="flex items-center gap-3">
// //               <User className="h-6 w-6" />
// //               <CardTitle className="text-xl">Vitals</CardTitle>
// //             </div>
// //           </CardHeader>
// //           <CardContent className="p-6 bg-white dark:bg-slate-800">
// //             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //               {isViewMode ? (
// //                 <>
// //                   <div>
// //                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Oxygen (%)</Label>
// //                     <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{vitals.oxygen || "-"}</p>
// //                   </div>
// //                   <div>
// //                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Blood Pressure</Label>
// //                     <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{vitals.bp || "-"}</p>
// //                   </div>
// //                   <div>
// //                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weight (kg)</Label>
// //                     <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{vitals.weight || "-"}</p>
// //                   </div>
// //                   <div>
// //                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Temperature (°C)</Label>
// //                     <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{vitals.temp || "-"}</p>
// //                   </div>
// //                 </>
// //               ) : (
// //                 <>
// //                   <div>
// //                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Oxygen (%)</Label>
// //                     <Input
// //                       placeholder="e.g., 98"
// //                       value={vitals.oxygen}
// //                       onChange={(e) => setVitals({ ...vitals, oxygen: e.target.value })}
// //                       className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Blood Pressure</Label>
// //                     <Input
// //                       placeholder="e.g., 120/80"
// //                       value={vitals.bp}
// //                       onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
// //                       className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weight (kg)</Label>
// //                     <Input
// //                       placeholder="e.g., 70"
// //                       value={vitals.weight}
// //                       onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
// //                       className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Temperature (°C)</Label>
// //                     <Input
// //                       placeholder="e.g., 37.0"
// //                       value={vitals.temp}
// //                       onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
// //                       className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
// //                     />
// //                   </div>
// //                 </>
// //               )}
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Search Medicine Card - Only show in edit mode */}
// //         {!isViewMode && (
// //           <>
// //             <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
// //               <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
// //                 <div className="flex items-center gap-3">
// //                   <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
// //                   <CardTitle className="text-slate-900 dark:text-white">Search Medicines</CardTitle>
// //                 </div>
// //               </CardHeader>
// //               <CardContent className="p-6 bg-white dark:bg-slate-800">
// //                 <div className="relative">
// //                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5 pointer-events-none" />
// //                   <Input
// //                     placeholder="Type medicine name to search..."
// //                     value={searchQuery}
// //                     onChange={(e) => setSearchQuery(e.target.value)}
// //                     className="pl-10 h-12 text-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
// //                   />
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Search Results */}
// //             {searchQuery && (
// //               <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
// //                 <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
// //                   <CardTitle className="text-slate-900 dark:text-white">
// //                     Search Results {!loading && `(${inventory.length})`}
// //                   </CardTitle>
// //                 </CardHeader>
// //                 <CardContent className="p-6 bg-white dark:bg-slate-800">
// //                   {loading ? (
// //                     <div className="text-center py-8">
// //                       <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
// //                       <p className="mt-3 text-slate-600 dark:text-slate-400">Loading medicines...</p>
// //                     </div>
// //                   ) : inventory.length === 0 ? (
// //                     <div className="text-center py-8">
// //                       <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
// //                       <p className="text-slate-600 dark:text-slate-400">
// //                         No medicines found for '<span className="font-semibold">{searchQuery}</span>'
// //                       </p>
// //                     </div>
// //                   ) : (
// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //                       {inventory.map((med) => (
// //                         <div
// //                           key={med.id}
// //                           className="p-5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-700"
// //                         >
// //                           <div className="flex items-start justify-between mb-3">
// //                             <div className="flex-1">
// //                               <p className="font-bold text-lg text-slate-900 dark:text-white mb-1">
// //                                 {med.name}
// //                               </p>
// //                               <div className="flex items-center gap-3 text-sm">
// //                                 <span className="text-slate-600 dark:text-slate-400">
// //                                   Stock: <span className="font-semibold text-slate-900 dark:text-white">{med.quantity ?? 0}</span>
// //                                 </span>
// //                                 <span className="text-slate-400 dark:text-slate-600">•</span>
// //                                 <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
// //                                   PKR {med.retail_price ?? "N/A"}
// //                                 </span>
// //                               </div>
// //                             </div>
// //                           </div>

// //                           <div className="space-y-2 mb-3">
// //                             <Input
// //                               type="text"
// //                               placeholder="Quantity"
// //                               value={selectedQty[med.id] ?? ""}
// //                               onChange={(e) => handleQtyChange(med.id, e.target.value)}
// //                               className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
// //                             />
// //                             <Input
// //                               placeholder="Instructions (e.g., after food)"
// //                               value={selectedNotes[med.id] ?? ""}
// //                               onChange={(e) =>
// //                                 handleNoteChange(med.id, e.target.value)
// //                               }
// //                               className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500"
// //                             />
// //                           </div>

// //                           <Button
// //                             className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
// //                             onClick={() => handleAddToPrescription(med)}
// //                           >
// //                             <Plus className="mr-2 h-4 w-4" /> Add to Prescription
// //                           </Button>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   )}
// //                 </CardContent>
// //               </Card>
// //             )}
// //           </>
// //         )}

// //         {/* Prescription Summary */}
// //         <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
// //           <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 text-white">
// //             <div className="flex items-center justify-between">
// //               <div className="flex items-center gap-3">
// //                 <ShoppingCart className="h-6 w-6" />
// //                 <CardTitle className="text-xl">Prescription Summary</CardTitle>
// //               </div>
// //               <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
// //                 {prescription.length} {prescription.length === 1 ? 'item' : 'items'}
// //               </div>
// //             </div>
// //           </CardHeader>
// //           <CardContent className="p-6 bg-white dark:bg-slate-800">
// //             {prescription.length === 0 ? (
// //               <div className="text-center py-12">
// //                 <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
// //                 <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
// //                   No medicines added yet
// //                 </p>
// //                 <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
// //                   {isViewMode ? "This prescription is empty" : "Search and add medicines to create a prescription"}
// //                 </p>
// //               </div>
// //             ) : (
// //               <div className="space-y-4">
// //                 {prescription.map((p, index) => (
// //                   <div
// //                     key={p.id}
// //                     className="p-5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
// //                   >
// //                     <div className="flex items-start justify-between mb-4">
// //                       <div className="flex-1">
// //                         <div className="flex items-center gap-3 mb-2">
// //                           <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm font-bold">
// //                             {index + 1}
// //                           </span>
// //                           <p className="text-xl font-bold text-slate-900 dark:text-white">
// //                             {p.name}
// //                           </p>
// //                         </div>
// //                         <div className="ml-10 space-y-1">
// //                           <p className="text-sm text-slate-600 dark:text-slate-400">
// //                             <span className="font-semibold text-slate-700 dark:text-slate-300">Instructions:</span>{" "}
// //                             {p.instructions || <span className="italic">No instructions</span>}
// //                           </p>
// //                           {p.dosage && (
// //                             <p className="text-sm text-slate-600 dark:text-slate-400">
// //                               <span className="font-semibold text-slate-700 dark:text-slate-300">Dosage:</span>{" "}
// //                               {p.dosage}
// //                             </p>
// //                           )}
// //                         </div>
// //                       </div>
// //                       <div className="text-right ml-4">
// //                         <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Quantity</p>
// //                         <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
// //                           {p.qty}
// //                         </p>
// //                         <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
// //                           PKR {((p.retail_price || 0) * p.qty).toFixed(2)}
// //                         </p>
// //                       </div>
// //                     </div>

// //                     {!isViewMode && (
// //                       <div className="flex gap-2">
// //                         <Input
// //                           placeholder="Dosage (e.g., 500mg, 2 tablets)"
// //                           value={p.dosage ?? ""}
// //                           onChange={(e) =>
// //                             handleEditPrescriptionItem(p.id, "dosage", e.target.value)
// //                           }
// //                           className="flex-1 dark:bg-slate-900 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500"
// //                         />
// //                         <Button
// //                           variant="destructive"
// //                           size="icon"
// //                           onClick={() => handleRemoveFromPrescription(p.id)}
// //                           className="dark:bg-red-600 dark:hover:bg-red-700"
// //                         >
// //                           <Trash2 className="h-4 w-4" />
// //                         </Button>
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))}

// //                 {/* Total Summary */}
// //                 <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-700 space-y-3">
// //                   <div className="flex justify-between items-center text-lg">
// //                     <span className="text-slate-700 dark:text-slate-300 font-medium">Total Items</span>
// //                     <span className="font-bold text-slate-900 dark:text-white text-2xl">
// //                       {totalItems}
// //                     </span>
// //                   </div>
// //                   <div className="flex justify-between items-center text-lg">
// //                     <span className="text-slate-700 dark:text-slate-300 font-medium">Total Amount</span>
// //                     <span className="font-bold text-emerald-600 dark:text-emerald-400 text-3xl">
// //                       PKR {totalRetail.toFixed(2)}
// //                     </span>
// //                   </div>

// //                   <div className="pt-4 flex gap-3">
// //                     {!isViewMode && (
// //                       <Button
// //                         onClick={() => {
// //                           if (!confirm("Are you sure you want to clear the entire prescription?")) return;
// //                           setPrescription([]);
// //                         }}
// //                         variant="outline"
// //                         className="flex-1 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
// //                       >
// //                         Clear All
// //                       </Button>
// //                     )}

// //                     <Button
// //                       onClick={handlePreviewAndSave}
// //                       className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-lg h-12"
// //                       disabled={savingPreview}
// //                     >
// //                       <Download className="mr-2 h-5 w-5" /> Preview PDF
// //                     </Button>

// //                     {!isViewMode && !disableSend && (
// //                       <Button
// //                         onClick={handleSendToFirebase}
// //                         className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-lg h-12"
// //                       >
// //                         <Send className="mr-2 h-5 w-5" /> Send Prescription
// //                       </Button>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* PDF Preview Modal */}
// //         {isPreviewOpen && pdfBlobUrl && (
// //           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// //             <div className="relative w-full max-w-5xl h-[80vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
// //               <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
// //                 <div className="flex items-center gap-3">
// //                   <FileText className="h-5 w-5 text-slate-700 dark:text-slate-200" />
// //                   <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Preview Prescription {lastSavedPREC ? `- ${lastSavedPREC}` : ""}</h3>
// //                 </div>
// //                 <div className="flex items-center gap-2">
// //                   <Button onClick={handleDownloadFromPreview} className="bg-emerald-600 hover:bg-emerald-700">
// //                     <Download className="mr-2 h-4 w-4" /> Download PDF
// //                   </Button>
// //                   <Button variant="ghost" onClick={closePreview} className="h-9 w-9">
// //                     <X />
// //                   </Button>
// //                 </div>
// //               </div>

// //               <div className="w-full h-full">
// //                 <iframe
// //                   src={pdfBlobUrl}
// //                   title="Prescription Preview"
// //                   className="w-full h-full border-0"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //       </div>
// //     </Layout>
// //   );
// // }




// "use client";

// import React, { useEffect, useState } from "react";
// import Layout from "@/components/Layout";
// import { useLocation, useNavigate } from "react-router-dom";
// import { collection, getDocs, addDoc } from "firebase/firestore";
// import { inventoryDB } from "@/inventoryFirebase";
// import { db, loginWithGoogle, logout } from "@/firebase";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Plus,
//   Trash2,
//   ArrowLeft,
//   Package,
//   Send,
//   Search,
//   ShoppingCart,
//   Calendar,
//   User,
//   FileText,
//   Download,
//   X,
//   Edit,
//   Eye,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// import autoTable from "jspdf-autotable";
// import { jsPDF } from "jspdf";
// import { generateSalePDF } from "./SalesPDF";

// type InventoryMedicine = {
//   id: string;
//   name: string;
//   quantity?: number;
//   cost_price?: number;
//   retail_price?: number;
//   [key: string]: any;
// };

// type PrescriptionItem = {
//   id: string;
//   name: string;
//   dosage?: string;
//   qty: number;
//   instructions?: string;
//   cost_price?: number;
//   retail_price?: number;
// };

// export default function PrescriptionPage(): JSX.Element {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { toast } = useToast();

//   const [showDownloadOptions, setShowDownloadOptions] = useState(false);
//   const [includeHeader, setIncludeHeader] = useState<boolean | null>(null);

//   // 🔹 Check if we're in view mode
//   const prescriptionData = location.state?.prescriptionData || null;
//   const disableSend = location.state?.disableSend || false;
//   const [isViewMode, setIsViewMode] = useState(!!prescriptionData);

//   const patientData = prescriptionData?.patient || location.state?.patientData || null;

//   // Navbar states
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const [role, setRole] = useState<string | null>(null);
//   const [searchCode, setSearchCode] = useState("");

//   const toggleDarkMode = () => {
//     setIsDarkMode((prev) => !prev);
//     if (!isDarkMode) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   };

//   const handleLogin = async () => {
//     const userData = await loginWithGoogle();
//     setUser(userData);
//   };

//   const handleLogout = async () => {
//     await logout();
//     setUser(null);
//     setRole(null);
//   };

//   const handleSearch = () => {
//     if (searchCode.trim() !== "") {
//       navigate(`/report/${searchCode.trim()}`);
//       setSearchCode("");
//     }
//   };

//   const [inventory, setInventory] = useState<InventoryMedicine[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [prescription, setPrescription] = useState<PrescriptionItem[]>([]);
//   const [selectedQty, setSelectedQty] = useState<Record<string, number | "">>({});
//   const [selectedNotes, setSelectedNotes] = useState<Record<string, string>>({});

//   // vitals state
//   const [vitals, setVitals] = useState({
//     oxygen: "",
//     bp: "",
//     weight: "",
//     temp: "",
//   });

//   // phone inside patient card
//   const [phone, setPhone] = useState<string>(patientData?.phone || "");

//   // preview modal state
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
//   const [lastSavedPREC, setLastSavedPREC] = useState<string | null>(null);
//   const [savingPreview, setSavingPreview] = useState(false);

//   // 🔹 Load prescription data if in view mode
//   useEffect(() => {
//     if (prescriptionData) {
//       setPrescription(prescriptionData.prescription || []);
//       setVitals(prescriptionData.vitals || { oxygen: "", bp: "", weight: "", temp: "" });
//       setPhone(prescriptionData.patient?.phone || "");
//       setLastSavedPREC(prescriptionData.precNumber || null);
//     }
//   }, [prescriptionData]);

//   useEffect(() => {
//     if (!searchQuery.trim() || isViewMode) {
//       setInventory([]);
//       return;
//     }

//     let mounted = true;
//     const fetchMedicines = async () => {
//       try {
//         setLoading(true);
//         const snap = await getDocs(collection(inventoryDB, "medicines"));
//         const meds = snap.docs.map((d) => {
//           const data = d.data() as Partial<InventoryMedicine>;
//           return {
//             id: d.id,
//             name: data.name || "Unknown",
//             quantity: data.quantity ?? 0,
//             cost_price: data.cost_price ?? 0,
//             retail_price: data.retail_price ?? 0,
//             ...data,
//           } as InventoryMedicine;
//         });

//         const q = searchQuery.toLowerCase().trim();
//         const filtered = meds.filter((m) =>
//           String(m.name || "").toLowerCase().includes(q)
//         );

//         if (mounted) setInventory(filtered);
//       } catch (err) {
//         console.error("Error fetching medicines:", err);
//         toast({
//           title: "Error",
//           description: "Failed to fetch medicines.",
//           variant: "destructive",
//         });
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchMedicines();
//     return () => {
//       mounted = false;
//     };
//   }, [searchQuery, toast, isViewMode]);

//   const generatePREC = () => {
//     const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
//     const randomPart = Math.floor(10000 + Math.random() * 90000);
//     return `PREC-${datePart}-${randomPart}`;
//   };

//   const handleAddToPrescription = (med: InventoryMedicine) => {
//     const raw = selectedQty[med.id];
//     const qtyToAdd = raw === "" || raw === undefined ? 1 : Number(raw || 0);

//     if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
//       toast({
//         title: "Invalid quantity",
//         description: "Please enter a valid quantity.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (qtyToAdd > (med.quantity ?? 0)) {
//       toast({
//         title: "Insufficient Stock",
//         description: `Only ${med.quantity} in stock for ${med.name}.`,
//         variant: "destructive",
//       });
//       return;
//     }

//     const note = selectedNotes[med.id] || "";

//     setPrescription((prev) => {
//       const existing = prev.find((p) => p.id === med.id);
//       if (existing) {
//         return prev.map((p) =>
//           p.id === med.id
//             ? {
//                 ...p,
//                 qty: qtyToAdd,
//                 instructions: note || p.instructions,
//               }
//             : p
//         );
//       }
//       return [
//         ...prev,
//         {
//           id: med.id,
//           name: med.name || "Unnamed",
//           qty: qtyToAdd,
//           instructions: note,
//           dosage: "",
//           cost_price: med.cost_price,
//           retail_price: med.retail_price,
//         },
//       ];
//     });

//     setSelectedQty((s) => ({ ...s, [med.id]: "" }));
//     setSelectedNotes((s) => ({ ...s, [med.id]: "" }));
//   };

//   const handleRemoveFromPrescription = (id: string) => {
//     setPrescription((prev) => prev.filter((p) => p.id !== id));
//   };

//   const handleQtyChange = (id: string, value: string) => {
//     if (value === "") {
//       setSelectedQty((s) => ({ ...s, [id]: "" }));
//       return;
//     }
//     const clean = value.replace(/[^0-9]/g, "");
//     const normalized = clean.replace(/^0+(?=\d)/, "");
//     setSelectedQty((s) => ({ ...s, [id]: normalized === "" ? "" : Number(normalized) }));
//   };

//   const handleNoteChange = (id: string, value: string) => {
//     setSelectedNotes((s) => ({ ...s, [id]: value }));
//   };

//   const handleEditPrescriptionItem = (
//     id: string,
//     field: keyof PrescriptionItem,
//     value: any
//   ) => {
//     setPrescription((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
//     );
//   };

//   const totalItems = prescription.reduce((sum, p) => sum + p.qty, 0);
//   const totalRetail = prescription.reduce(
//     (sum, p) => sum + (p.retail_price || 0) * p.qty,
//     0
//   );

//   const savePrescriptionToFirebase = async (precNumber: string) => {
//     const payload = {
//       precNumber,
//       patient: {
//         ...patientData,
//         phone,
//       },
//       vitals,
//       prescription,
//       totalItems,
//       totalRetail,
//       timestamp: new Date().toISOString(),
//     };

//     await addDoc(collection(inventoryDB, "prescriptions"), payload);
//   };

//   const generatePDFBlob = async (precNumber: string) => {
//     try {
//       const doc = new jsPDF({ compress: true });
//       const pageWidth = doc.internal.pageSize.getWidth();

//       let yPos = 6 * 10;

//       try {
//         const response = await fetch("/logo.png");
//         const blob = await response.blob();
//         const base64 = await new Promise<string>((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onloadend = () => resolve(reader.result as string);
//           reader.onerror = reject;
//           reader.readAsDataURL(blob);
//         });

//         const logoSize = 150;
//         const x = (pageWidth - logoSize) / 2;
//         const y = 40;
//         (doc as any).setGState(new (doc as any).GState({ opacity: 0.06 }));
//         doc.addImage(base64, "PNG", x, y, logoSize, logoSize);
//         (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
//       } catch {
//         // ignore if logo not found
//       }

//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.text("Prescription", 14, yPos - 2);
//       doc.setFontSize(9);
//       doc.setFont("helvetica", "normal");
//       doc.text(`${precNumber}`, pageWidth - 18, yPos - 2, { align: "right" });

//       if (patientData?.name || phone) {
//         doc.setFontSize(9);
//         doc.setFont("helvetica", "bold");
//         doc.text("PATIENT INFORMATION", 14, yPos + 6);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(9);
//         const name = patientData?.name || "-";
//         const docText = `Name: ${name}`;
//         doc.text(docText, 14, yPos + 12);

//         const doctor = `Doctor: ${patientData?.referringDoctor || "-"}`;
//         doc.text(doctor, 14, yPos + 17);
//         const rightInfo = `Phone: ${phone || "-"}`;
//         doc.text(rightInfo, pageWidth - 18, yPos + 12, { align: "right" });

//         const ageGenderLine = `Age: ${patientData?.age ?? "-"} | Gender: ${patientData?.sex ?? "-"}`;
//         doc.text(ageGenderLine, pageWidth - 18, yPos + 17, { align: "right" });

//         yPos += 26;
//       }

//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(9);
//       doc.text("VITALS", 14, yPos + 6);
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(9);
//       const vitalsText = `O₂: ${vitals.oxygen || "-"} | BP: ${vitals.bp || "-"} | Weight: ${vitals.weight || "-"} | Temp: ${vitals.temp || "-"}`;
//       doc.text(vitalsText, 14, yPos + 12);
//       yPos += 22;

//       const tableBody = prescription.map((p, i) => [
//         (i + 1).toString(),
//         p.name,
//         p.dosage || "-",
//         p.qty.toString(),
//         `PKR ${(p.retail_price || 0).toFixed(2)}`,
//         `PKR ${((p.retail_price || 0) * p.qty).toFixed(2)}`,
//         p.instructions || "-",
//       ]);

//       autoTable(doc, {
//         startY: yPos,
//         head: [["#", "Medicine", "Dosage", "Qty", "Price", "Total", "Instructions"]],
//         body: tableBody,
//         theme: "grid",
//         styles: {
//           fontSize: 9,
//           cellPadding: 5,
//         },
//         headStyles: {
//           fillColor: [0, 102, 204],
//           textColor: [255, 255, 255],
//           fontStyle: "bold",
//         },
//       });

//       const totalAmount = prescription.reduce((sum, i) => sum + (i.retail_price || 0) * i.qty, 0);
//       const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : yPos + 80;

//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(10);
//       doc.text("TOTAL AMOUNT", pageWidth - 75, finalY + 6);
//       doc.setFontSize(12);
//       doc.text(`PKR ${totalAmount.toFixed(2)}`, pageWidth - 18, finalY + 14, { align: "right" });

//       const pageHeight = doc.internal.pageSize.getHeight();
//       const footerY = pageHeight - 20;
//       doc.setFont("helvetica", "italic");
//       doc.setFontSize(9);
//       doc.text("Thank you for choosing SMMC Laboratory", pageWidth / 2, footerY, { align: "center" });

//       const blob = doc.output("blob");
//       return blob;
//     } catch (err) {
//       console.error("Preview PDF generation failed:", err);
//       throw err;
//     }
//   };

//   const handlePreviewAndSave = async () => {
//     if (!patientData?.name) {
//       toast({
//         title: "Missing data",
//         description: "No patient data found.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (prescription.length === 0) {
//       toast({
//         title: "Empty prescription",
//         description: "Please add medicines before previewing.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setSavingPreview(true);

//     try {
//       let precNumber = lastSavedPREC;

//       if (!precNumber && !isViewMode) {
//         precNumber = generatePREC();
//         await savePrescriptionToFirebase(precNumber);
//         setLastSavedPREC(precNumber);

//         toast({
//           title: "Saved",
//           description: `Prescription ${precNumber} saved successfully.`,
//           variant: "default",
//         });
//       } else if (precNumber) {
//         console.log("Prescription already saved:", precNumber);
//       }

//       const blob = await generatePDFBlob(precNumber || "VIEW-MODE");
//       const url = URL.createObjectURL(blob);
//       setPdfBlobUrl(url);
//       setIsPreviewOpen(true);

//     } catch (err) {
//       console.error("Error while previewing/saving:", err);
//       toast({
//         title: "Error",
//         description: "Failed to save or preview prescription.",
//         variant: "destructive",
//       });
//     } finally {
//       setSavingPreview(false);
//     }
//   };

//   const handleDownloadPDF = async (withHeader: boolean) => {
//     if (!prescription || prescription.length === 0) {
//       toast({
//         title: "No data",
//         description: "Nothing to generate.",
//         variant: "destructive",
//       });
//       return;
//     }

//     const cart = prescription.map((p) => ({
//       medicineName: p.name,
//       dosage: p.dosage,
//       quantity: p.qty,
//       price: p.retail_price ?? 0,
//       instructions: p.instructions ?? "-",
//     }));

//     try {
//       await generateSalePDF({
//         cart,
//         patient: { ...patientData, phone },
//         precNumber: lastSavedPREC,
//         withHeader,
//       });
      
//       toast({
//         title: "Success",
//         description: `PDF downloaded ${withHeader ? 'with' : 'without'} header.`,
//         variant: "default",
//       });
//     } catch (err) {
//       console.error("Error calling SalesPDF:", err);
//       toast({
//         title: "Error",
//         description: "Failed to generate final PDF.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleSendToFirebase = async () => {
//     if (!patientData) {
//       toast({
//         title: "Missing data",
//         description: "No patient data found.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (prescription.length === 0) {
//       toast({
//         title: "Empty prescription",
//         description: "Please add medicines before sending.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const precNumber = lastSavedPREC ?? generatePREC();
//       await savePrescriptionToFirebase(precNumber);
//       setLastSavedPREC(precNumber);

//       toast({
//         title: "Success",
//         description: `Prescription ${precNumber} saved successfully.`,
//         variant: "default",
//       });

//       setPrescription([]);
//       setSearchQuery("");
//       setInventory([]);
//     } catch (error) {
//       console.error("Error saving prescription:", error);
//       toast({
//         title: "Error",
//         description: "Failed to save prescription.",
//         variant: "destructive",
//       });
//     }
//   };

//   const closePreview = () => {
//     setIsPreviewOpen(false);
//     if (pdfBlobUrl) {
//       URL.revokeObjectURL(pdfBlobUrl);
//       setPdfBlobUrl(null);
//     }
//   };

//   // 🔹 Toggle between view and edit mode
//   const toggleEditMode = () => {
//     setIsViewMode(!isViewMode);
//   };

//   return (
//     <Layout
//       isDarkMode={isDarkMode}
//       toggleDarkMode={toggleDarkMode}
//       user={user}
//       role={role}
//       handleLogin={handleLogin}
//       handleLogout={handleLogout}
//       searchCode={searchCode}
//       setSearchCode={setSearchCode}
//       handleSearch={handleSearch}
//     >
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 lg:p-8">
//         {/* Professional Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg">
//               {isViewMode ? <Eye className="h-7 w-7 text-white" /> : <FileText className="h-7 w-7 text-white" />}
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
//                 {isViewMode ? "View Prescription" : "Create Prescription"}
//               </h1>
//               <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
//                 {isViewMode ? "Review prescription details" : "Add medicines and manage patient prescriptions"}
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             {prescriptionData && (
//               <Button
//                 variant={isViewMode ? "default" : "outline"}
//                 onClick={toggleEditMode}
//                 className="dark:border-slate-600"
//               >
//                 {isViewMode ? <Edit className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
//                 {isViewMode ? "Edit Mode" : "View Mode"}
//               </Button>
//             )}
//             <Button
//               variant="outline"
//               onClick={() => navigate(-1)}
//               className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//           </div>
//         </div>

//         {/* Patient Details Card */}
//         {patientData && (
//           <Card className="shadow-lg border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
//             <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white">
//               <div className="flex items-center gap-3">
//                 <User className="h-6 w-6" />
//                 <CardTitle className="text-xl">Patient Information</CardTitle>
//               </div>
//             </CardHeader>
//             <CardContent className="p-6 bg-white dark:bg-slate-800">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="space-y-2">
//                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                     Patient Name
//                   </Label>
//                   <p className="text-lg font-semibold text-slate-900 dark:text-white">
//                     {patientData.name || "-"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                     Relation
//                   </Label>
//                   <p className="text-lg font-semibold text-slate-900 dark:text-white">
//                     {patientData.relation || "-"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                     Age / Gender
//                   </Label>
//                   <p className="text-lg font-semibold text-slate-900 dark:text-white">
//                     {(patientData.age ?? "-")} / {patientData.sex ?? "-"}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                     Referring Doctor
//                   </Label>
//                   <p className="text-lg font-semibold text-slate-900 dark:text-white">
//                     {patientData.referringDoctor || "-"}
//                   </p>
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                     Phone
//                   </Label>
//                   {isViewMode ? (
//                     <p className="text-lg font-semibold text-slate-900 dark:text-white">
//                       {phone || "-"}
//                     </p>
//                   ) : (
//                     <Input
//                       placeholder="Phone number"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
//                     />
//                   )}
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
//                     <Calendar className="h-3 w-3" />
//                     Collection Date & Time
//                   </Label>
//                   <p className="text-lg font-semibold text-slate-900 dark:text-white">
//                     {patientData.collectionDateTime || "-"}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Vitals Card */}
//         <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
//           <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white">
//             <div className="flex items-center gap-3">
//               <User className="h-6 w-6" />
//               <CardTitle className="text-xl">Vitals</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent className="p-6 bg-white dark:bg-slate-800">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {isViewMode ? (
//                 <>
//                   <div>
//                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Oxygen (%)</Label>
//                     <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{vitals.oxygen || "-"}</p>
//                   </div>
//                   <div>
//                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Blood Pressure</Label>
//                     <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{vitals.bp || "-"}</p>
//                   </div>
//                   <div>
//                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weight (kg)</Label>
//                     <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{vitals.weight || "-"}</p>
//                   </div>
//                   <div>
//                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Temperature (°C)</Label>
//                     <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{vitals.temp || "-"}</p>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div>
//                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Oxygen (%)</Label>
//                     <Input
//                       placeholder="e.g., 98"
//                       value={vitals.oxygen}
//                       onChange={(e) => setVitals({ ...vitals, oxygen: e.target.value })}
//                       className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
//                     />
//                   </div>
//                   <div>
//                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Blood Pressure</Label>
//                     <Input
//                       placeholder="e.g., 120/80"
//                       value={vitals.bp}
//                       onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
//                       className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
//                     />
//                   </div>
//                   <div>
//                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weight (kg)</Label>
//                     <Input
//                       placeholder="e.g., 70"
//                       value={vitals.weight}
//                       onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
//                       className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
//                     />
//                   </div>
//                   <div>
//                     <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Temperature (°C)</Label>
//                     <Input
//                       placeholder="e.g., 37.0"
//                       value={vitals.temp}
//                       onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
//                       className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Search Medicine Card - Only show in edit mode */}
//         {!isViewMode && (
//           <>
//             <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
//               <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
//                 <div className="flex items-center gap-3">
//                   <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                   <CardTitle className="text-slate-900 dark:text-white">Search Medicines</CardTitle>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-6 bg-white dark:bg-slate-800">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5 pointer-events-none" />
//                   <Input
//                     placeholder="Type medicine name to search..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10 h-12 text-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Search Results */}
//             {searchQuery && (
//               <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
//                 <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
//                   <CardTitle className="text-slate-900 dark:text-white">
//                     Search Results {!loading && `(${inventory.length})`}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6 bg-white dark:bg-slate-800">
//                   {loading ? (
//                     <div className="text-center py-8">
//                       <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
//                       <p className="mt-3 text-slate-600 dark:text-slate-400">Loading medicines...</p>
//                     </div>
//                   ) : inventory.length === 0 ? (
//                     <div className="text-center py-8">
//                       <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
//                       <p className="text-slate-600 dark:text-slate-400">
//                         No medicines found for '<span className="font-semibold">{searchQuery}</span>'
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                       {inventory.map((med) => (
//                         <div
//                           key={med.id}
//                           className="p-5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-700"
//                         >
//                           <div className="flex items-start justify-between mb-3">
//                             <div className="flex-1">
//                               <p className="font-bold text-lg text-slate-900 dark:text-white mb-1">
//                                 {med.name}
//                               </p>
//                               <div className="flex items-center gap-3 text-sm">
//                                 <span className="text-slate-600 dark:text-slate-400">
//                                   Stock: <span className="font-semibold text-slate-900 dark:text-white">{med.quantity ?? 0}</span>
//                                 </span>
//                                 <span className="text-slate-400 dark:text-slate-600">•</span>
//                                 <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
//                                   PKR {med.retail_price ?? "N/A"}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="space-y-2 mb-3">
//                             <Input
//                               type="text"
//                               placeholder="Quantity"
//                               value={selectedQty[med.id] ?? ""}
//                               onChange={(e) => handleQtyChange(med.id, e.target.value)}
//                               className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
//                             />
//                             <Input
//                               placeholder="Instructions (e.g., after food)"
//                               value={selectedNotes[med.id] ?? ""}
//                               onChange={(e) =>
//                                 handleNoteChange(med.id, e.target.value)
//                               }
//                               className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500"
//                             />
//                           </div>

//                           <Button
//                             className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//                             onClick={() => handleAddToPrescription(med)}
//                           >
//                             <Plus className="mr-2 h-4 w-4" /> Add to Prescription
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//           </>
//         )}

//         {/* Prescription Summary */}
//         <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
//           <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <ShoppingCart className="h-6 w-6" />
//                 <CardTitle className="text-xl">Prescription Summary</CardTitle>
//               </div>
//               <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
//                 {prescription.length} {prescription.length === 1 ? 'item' : 'items'}
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="p-6 bg-white dark:bg-slate-800">
//             {prescription.length === 0 ? (
//               <div className="text-center py-12">
//                 <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
//                 <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
//                   No medicines added yet
//                 </p>
//                 <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
//                   {isViewMode ? "This prescription is empty" : "Search and add medicines to create a prescription"}
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {prescription.map((p, index) => (
//                   <div
//                     key={p.id}
//                     className="p-5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
//                   >
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm font-bold">
//                             {index + 1}
//                           </span>
//                           <p className="text-xl font-bold text-slate-900 dark:text-white">
//                             {p.name}
//                           </p>
//                         </div>
//                         <div className="ml-10 space-y-1">
//                           <p className="text-sm text-slate-600 dark:text-slate-400">
//                             <span className="font-semibold text-slate-700 dark:text-slate-300">Instructions:</span>{" "}
//                             {p.instructions || <span className="italic">No instructions</span>}
//                           </p>
//                           {p.dosage && (
//                             <p className="text-sm text-slate-600 dark:text-slate-400">
//                               <span className="font-semibold text-slate-700 dark:text-slate-300">Dosage:</span>{" "}
//                               {p.dosage}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="text-right ml-4">
//                         <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Quantity</p>
//                         <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
//                           {p.qty}
//                         </p>
//                         <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
//                           PKR {((p.retail_price || 0) * p.qty).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>

//                     {!isViewMode && (
//                       <div className="flex gap-2">
//                         <Input
//                           placeholder="Dosage (e.g., 500mg, 2 tablets)"
//                           value={p.dosage ?? ""}
//                           onChange={(e) =>
//                             handleEditPrescriptionItem(p.id, "dosage", e.target.value)
//                           }
//                           className="flex-1 dark:bg-slate-900 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500"
//                         />
//                         <Button
//                           variant="destructive"
//                           size="icon"
//                           onClick={() => handleRemoveFromPrescription(p.id)}
//                           className="dark:bg-red-600 dark:hover:bg-red-700"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Total Summary */}
//                 <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-700 space-y-3">
//                   <div className="flex justify-between items-center text-lg">
//                     <span className="text-slate-700 dark:text-slate-300 font-medium">Total Items</span>
//                     <span className="font-bold text-slate-900 dark:text-white text-2xl">
//                       {totalItems}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center text-lg">
//                     <span className="text-slate-700 dark:text-slate-300 font-medium">Total Amount</span>
//                     <span className="font-bold text-emerald-600 dark:text-emerald-400 text-3xl">
//                       PKR {totalRetail.toFixed(2)}
//                     </span>
//                   </div>

//                   <div className="pt-4 flex gap-3">
//                     {!isViewMode && (
//                       <Button
//                         onClick={() => {
//                           if (!confirm("Are you sure you want to clear the entire prescription?")) return;
//                           setPrescription([]);
//                         }}
//                         variant="outline"
//                         className="flex-1 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
//                       >
//                         Clear All
//                       </Button>
//                     )}

//                     <Button
//                       onClick={handlePreviewAndSave}
//                       className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-lg h-12"
//                       disabled={savingPreview}
//                     >
//                       <Download className="mr-2 h-5 w-5" /> Preview PDF
//                     </Button>

//                     {!isViewMode && !disableSend && (
//                       <Button
//                         onClick={handleSendToFirebase}
//                         className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-lg h-12"
//                       >
//                         <Send className="mr-2 h-5 w-5" /> Send Prescription
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* PDF Preview Modal */}
// {/* PDF Preview Modal with Header Options */}
// {isPreviewOpen && pdfBlobUrl && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
//     <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b-2 border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900">
//         <div className="flex items-center gap-3">
//           <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//           <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
//             Prescription Preview {lastSavedPREC && `- ${lastSavedPREC}`}
//           </h3>
//         </div>
//         <Button 
//           variant="ghost" 
//           onClick={closePreview} 
//           className="h-10 w-10 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
//         >
//           <X className="h-5 w-5" />
//         </Button>
//       </div>

//       {/* PDF Iframe */}
//       <div className="w-full h-[calc(85vh-140px)]">
//         <iframe
//           src={pdfBlobUrl}
//           title="Prescription Preview"
//           className="w-full h-full border-0"
//         />
//       </div>

//       {/* Footer with Download Options */}
//       <div className="p-4 border-t-2 border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
//         <div className="flex gap-3 max-w-3xl mx-auto">
//           <Button 
//             onClick={() => handleDownloadPDF(false)}
//             className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 h-12 text-base font-semibold shadow-lg"
//           >
//             <Download className="mr-2 h-5 w-5" /> 
//             Download (No Header)
//           </Button>
//           <Button 
//             onClick={() => handleDownloadPDF(true)}
//             className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 h-12 text-base font-semibold shadow-lg"
//           >
//             <Download className="mr-2 h-5 w-5" /> 
//             Download With Header
//           </Button>
//         </div>
//         <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
//           Choose to download with or without the official header
//         </p>
//       </div>
//     </div>
//   </div>
// )}

//       </div>
//     </Layout>
//   );
// }




"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { inventoryDB } from "@/inventoryFirebase";
import { db, loginWithGoogle, logout, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Package,
  Send,
  Search,
  ShoppingCart,
  Calendar,
  User,
  FileText,
  Download,
  X,
  Edit,
  Eye,
  Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import { generateSalePDF } from "./SalesPDF";

type InventoryMedicine = {
  id: string;
  name: string;
  quantity?: number;
  cost_price?: number;
  retail_price?: number;
  [key: string]: any;
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

  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [includeHeader, setIncludeHeader] = useState<boolean | null>(null);

  // 🔹 Check if we're in view mode
  const prescriptionData = location.state?.prescriptionData || null;
  const disableSend = location.state?.disableSend || false;
  const [isViewMode, setIsViewMode] = useState(!!prescriptionData);

  const patientData = prescriptionData?.patient || location.state?.patientData || null;

  // Navbar states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [searchCode, setSearchCode] = useState("");

  // 🔹 NEW: Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔹 NEW: Listen to auth state and fetch user role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch user role from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRole(userData.role || "user");
          setIsAdmin(userData.role === "admin");
        } else {
          setRole("user");
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setRole(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogin = async () => {
    const userData = await loginWithGoogle();
    setUser(userData);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setRole(null);
    setIsAdmin(false);
  };

  const handleSearch = () => {
    if (searchCode.trim() !== "") {
      navigate(`/report/${searchCode.trim()}`);
      setSearchCode("");
    }
  };

  const [inventory, setInventory] = useState<InventoryMedicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [prescription, setPrescription] = useState<PrescriptionItem[]>([]);
  const [selectedQty, setSelectedQty] = useState<Record<string, number | "">>({});
  const [selectedNotes, setSelectedNotes] = useState<Record<string, string>>({});

  // vitals state
  const [vitals, setVitals] = useState({
    oxygen: "",
    bp: "",
    weight: "",
    temp: "",
  });

  // phone inside patient card
  const [phone, setPhone] = useState<string>(patientData?.phone || "");

  // preview modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [lastSavedPREC, setLastSavedPREC] = useState<string | null>(null);
  const [savingPreview, setSavingPreview] = useState(false);

  // 🔹 Load prescription data if in view mode
  useEffect(() => {
    if (prescriptionData) {
      setPrescription(prescriptionData.prescription || []);
      setVitals(prescriptionData.vitals || { oxygen: "", bp: "", weight: "", temp: "" });
      setPhone(prescriptionData.patient?.phone || "");
      setLastSavedPREC(prescriptionData.precNumber || null);
    }
  }, [prescriptionData]);

  useEffect(() => {
    if (!searchQuery.trim() || isViewMode) {
      setInventory([]);
      return;
    }

    let mounted = true;
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const snap = await getDocs(collection(inventoryDB, "medicines"));
        const meds = snap.docs.map((d) => {
          const data = d.data() as Partial<InventoryMedicine>;
          return {
            id: d.id,
            name: data.name || "Unknown",
            quantity: data.quantity ?? 0,
            cost_price: data.cost_price ?? 0,
            retail_price: data.retail_price ?? 0,
            ...data,
          } as InventoryMedicine;
        });

        const q = searchQuery.toLowerCase().trim();
        const filtered = meds.filter((m) =>
          String(m.name || "").toLowerCase().includes(q)
        );

        if (mounted) setInventory(filtered);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        toast({
          title: "Error",
          description: "Failed to fetch medicines.",
          variant: "destructive",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMedicines();
    return () => {
      mounted = false;
    };
  }, [searchQuery, toast, isViewMode]);

  const generatePREC = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    return `PREC-${datePart}-${randomPart}`;
  };

  const handleAddToPrescription = (med: InventoryMedicine) => {
    const raw = selectedQty[med.id];
    const qtyToAdd = raw === "" || raw === undefined ? 1 : Number(raw || 0);

    if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity.",
        variant: "destructive",
      });
      return;
    }

    if (qtyToAdd > (med.quantity ?? 0)) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${med.quantity} in stock for ${med.name}.`,
        variant: "destructive",
      });
      return;
    }

    const note = selectedNotes[med.id] || "";

    setPrescription((prev) => {
      const existing = prev.find((p) => p.id === med.id);
      if (existing) {
        return prev.map((p) =>
          p.id === med.id
            ? {
                ...p,
                qty: qtyToAdd,
                instructions: note || p.instructions,
              }
            : p
        );
      }
      return [
        ...prev,
        {
          id: med.id,
          name: med.name || "Unnamed",
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
  };

  const handleRemoveFromPrescription = (id: string) => {
    setPrescription((prev) => prev.filter((p) => p.id !== id));
  };

  const handleQtyChange = (id: string, value: string) => {
    if (value === "") {
      setSelectedQty((s) => ({ ...s, [id]: "" }));
      return;
    }
    const clean = value.replace(/[^0-9]/g, "");
    const normalized = clean.replace(/^0+(?=\d)/, "");
    setSelectedQty((s) => ({ ...s, [id]: normalized === "" ? "" : Number(normalized) }));
  };

  const handleNoteChange = (id: string, value: string) => {
    setSelectedNotes((s) => ({ ...s, [id]: value }));
  };

  const handleEditPrescriptionItem = (
    id: string,
    field: keyof PrescriptionItem,
    value: any
  ) => {
    setPrescription((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const totalItems = prescription.reduce((sum, p) => sum + p.qty, 0);
  const totalRetail = prescription.reduce(
    (sum, p) => sum + (p.retail_price || 0) * p.qty,
    0
  );

  const savePrescriptionToFirebase = async (precNumber: string) => {
    const payload = {
      precNumber,
      patient: {
        ...patientData,
        phone,
      },
      vitals,
      prescription,
      totalItems,
      totalRetail,
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(inventoryDB, "prescriptions"), payload);
  };

  const generatePDFBlob = async (precNumber: string) => {
    try {
      const doc = new jsPDF({ compress: true });
      const pageWidth = doc.internal.pageSize.getWidth();

      let yPos = 6 * 10;

      try {
        const response = await fetch("/logo.png");
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        const logoSize = 150;
        const x = (pageWidth - logoSize) / 2;
        const y = 40;
        (doc as any).setGState(new (doc as any).GState({ opacity: 0.06 }));
        doc.addImage(base64, "PNG", x, y, logoSize, logoSize);
        (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
      } catch {
        // ignore if logo not found
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Prescription", 14, yPos - 2);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`${precNumber}`, pageWidth - 18, yPos - 2, { align: "right" });

      if (patientData?.name || phone) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("PATIENT INFORMATION", 14, yPos + 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const name = patientData?.name || "-";
        const docText = `Name: ${name}`;
        doc.text(docText, 14, yPos + 12);

        const doctor = `Doctor: ${patientData?.referringDoctor || "-"}`;
        doc.text(doctor, 14, yPos + 17);
        const rightInfo = `Phone: ${phone || "-"}`;
        doc.text(rightInfo, pageWidth - 18, yPos + 12, { align: "right" });

        const ageGenderLine = `Age: ${patientData?.age ?? "-"} | Gender: ${patientData?.sex ?? "-"}`;
        doc.text(ageGenderLine, pageWidth - 18, yPos + 17, { align: "right" });

        yPos += 26;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("VITALS", 14, yPos + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const vitalsText = `O₂: ${vitals.oxygen || "-"} | BP: ${vitals.bp || "-"} | Weight: ${vitals.weight || "-"} | Temp: ${vitals.temp || "-"}`;
      doc.text(vitalsText, 14, yPos + 12);
      yPos += 22;

      const tableBody = prescription.map((p, i) => [
        (i + 1).toString(),
        p.name,
        p.dosage || "-",
        p.qty.toString(),
        `PKR ${(p.retail_price || 0).toFixed(2)}`,
        `PKR ${((p.retail_price || 0) * p.qty).toFixed(2)}`,
        p.instructions || "-",
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["#", "Medicine", "Dosage", "Qty", "Price", "Total", "Instructions"]],
        body: tableBody,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
      });

      const totalAmount = prescription.reduce((sum, i) => sum + (i.retail_price || 0) * i.qty, 0);
      const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : yPos + 80;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("TOTAL AMOUNT", pageWidth - 75, finalY + 6);
      doc.setFontSize(12);
      doc.text(`PKR ${totalAmount.toFixed(2)}`, pageWidth - 18, finalY + 14, { align: "right" });

      const pageHeight = doc.internal.pageSize.getHeight();
      const footerY = pageHeight - 20;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("Thank you for choosing SMMC Laboratory", pageWidth / 2, footerY, { align: "center" });

      const blob = doc.output("blob");
      return blob;
    } catch (err) {
      console.error("Preview PDF generation failed:", err);
      throw err;
    }
  };

  const handlePreviewAndSave = async () => {
    if (!patientData?.name) {
      toast({
        title: "Missing data",
        description: "No patient data found.",
        variant: "destructive",
      });
      return;
    }

    if (prescription.length === 0) {
      toast({
        title: "Empty prescription",
        description: "Please add medicines before previewing.",
        variant: "destructive",
      });
      return;
    }

    setSavingPreview(true);

    try {
      let precNumber = lastSavedPREC;

      if (!precNumber && !isViewMode) {
        precNumber = generatePREC();
        await savePrescriptionToFirebase(precNumber);
        setLastSavedPREC(precNumber);

        toast({
          title: "Saved",
          description: `Prescription ${precNumber} saved successfully.`,
          variant: "default",
        });
      } else if (precNumber) {
        console.log("Prescription already saved:", precNumber);
      }

      const blob = await generatePDFBlob(precNumber || "VIEW-MODE");
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      setIsPreviewOpen(true);

    } catch (err) {
      console.error("Error while previewing/saving:", err);
      toast({
        title: "Error",
        description: "Failed to save or preview prescription.",
        variant: "destructive",
      });
    } finally {
      setSavingPreview(false);
    }
  };

  const handleDownloadPDF = async (withHeader: boolean) => {
    if (!prescription || prescription.length === 0) {
      toast({
        title: "No data",
        description: "Nothing to generate.",
        variant: "destructive",
      });
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
      
      toast({
        title: "Success",
        description: `PDF downloaded ${withHeader ? 'with' : 'without'} header.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Error calling SalesPDF:", err);
      toast({
        title: "Error",
        description: "Failed to generate final PDF.",
        variant: "destructive",
      });
    }
  };

  const handleSendToFirebase = async () => {
    if (!patientData) {
      toast({
        title: "Missing data",
        description: "No patient data found.",
        variant: "destructive",
      });
      return;
    }

    if (prescription.length === 0) {
      toast({
        title: "Empty prescription",
        description: "Please add medicines before sending.",
        variant: "destructive",
      });
      return;
    }

    try {
      const precNumber = lastSavedPREC ?? generatePREC();
      await savePrescriptionToFirebase(precNumber);
      setLastSavedPREC(precNumber);

      toast({
        title: "Success",
        description: `Prescription ${precNumber} saved successfully.`,
        variant: "default",
      });

      setPrescription([]);
      setSearchQuery("");
      setInventory([]);
    } catch (error) {
      console.error("Error saving prescription:", error);
      toast({
        title: "Error",
        description: "Failed to save prescription.",
        variant: "destructive",
      });
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  // 🔹 NEW: Toggle between view and edit mode (Admin only if viewing from PREC search)
  const toggleEditMode = () => {
    // If prescription data exists (view mode from search), check if admin
    if (prescriptionData && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can edit this prescription.",
        variant: "destructive",
      });
      return;
    }
    setIsViewMode(!isViewMode);
  };

  // 🔹 NEW: Determine if Edit button should be shown
  const canToggleEditMode = prescriptionData && (!prescriptionData || isAdmin);

  return (
    <Layout
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      user={user}
      role={role}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      searchCode={searchCode}
      setSearchCode={setSearchCode}
      handleSearch={handleSearch}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 lg:p-8">
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg">
              {isViewMode ? <Eye className="h-7 w-7 text-white" /> : <FileText className="h-7 w-7 text-white" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {isViewMode ? "View Prescription" : "Create Prescription"}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isViewMode ? "Review prescription details" : "Add medicines and manage patient prescriptions"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* 🔹 Show edit button only for admins when viewing prescription */}
            {prescriptionData && isAdmin && (
              <Button
                variant={isViewMode ? "default" : "outline"}
                onClick={toggleEditMode}
                className="dark:border-slate-600"
              >
                {isViewMode ? <Edit className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {isViewMode ? "Edit Mode" : "View Mode"}
              </Button>
            )}
            {/* 🔹 Show lock icon if non-admin tries to see edit option */}
            {prescriptionData && !isAdmin && (
              <Button
                variant="outline"
                disabled
                className="dark:border-slate-600 opacity-50 cursor-not-allowed"
                title="Admin access required"
              >
                <Lock className="mr-2 h-4 w-4" />
                Edit Locked
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        {/* Patient Details Card */}
        {patientData && (
          <Card className="shadow-lg border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6" />
                <CardTitle className="text-xl">Patient Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Patient Name
                  </Label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {patientData.name || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Relation
                  </Label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {patientData.relation || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Age / Gender
                  </Label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {(patientData.age ?? "-")} / {patientData.sex ?? "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Referring Doctor
                  </Label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {patientData.referringDoctor || "-"}
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Phone
                  </Label>
                  {isViewMode ? (
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {phone || "-"}
                    </p>
                  ) : (
                    <Input
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Collection Date & Time
                  </Label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {patientData.collectionDateTime || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vitals Card */}
        <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6" />
              <CardTitle className="text-xl">Vitals</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white dark:bg-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {isViewMode ? (
                <>
                  <div>
                    <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Blood Pressure</Label>
                    <Input
                      placeholder="e.g., 120/80"
                      value={vitals.bp}
                      onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                      className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weight (kg)</Label>
                    <Input
                      placeholder="e.g., 70"
                      value={vitals.weight}
                      onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                      className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Temperature (°C)</Label>
                    <Input
                      placeholder="e.g., 37.0"
                      value={vitals.temp}
                      onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                      className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Search Medicine Card - Only show in edit mode */}
        {!isViewMode && (
          <>
            <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
              <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-slate-900 dark:text-white">Search Medicines</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-slate-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5 pointer-events-none" />
                  <Input
                    placeholder="Type medicine name to search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchQuery && (
              <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
                <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <CardTitle className="text-slate-900 dark:text-white">
                    Search Results {!loading && `(${inventory.length})`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white dark:bg-slate-800">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-3 text-slate-600 dark:text-slate-400">Loading medicines...</p>
                    </div>
                  ) : inventory.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-slate-400">
                        No medicines found for '<span className="font-semibold">{searchQuery}</span>'
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {inventory.map((med) => (
                        <div
                          key={med.id}
                          className="p-5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-700"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <p className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                                {med.name}
                              </p>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-slate-600 dark:text-slate-400">
                                  Stock: <span className="font-semibold text-slate-900 dark:text-white">{med.quantity ?? 0}</span>
                                </span>
                                <span className="text-slate-400 dark:text-slate-600">•</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                  PKR {med.retail_price ?? "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            <Input
                              type="text"
                              placeholder="Quantity"
                              value={selectedQty[med.id] ?? ""}
                              onChange={(e) => handleQtyChange(med.id, e.target.value)}
                              className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                            />
                            <Input
                              placeholder="Instructions (e.g., after food)"
                              value={selectedNotes[med.id] ?? ""}
                              onChange={(e) =>
                                handleNoteChange(med.id, e.target.value)
                              }
                              className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500"
                            />
                          </div>

                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            onClick={() => handleAddToPrescription(med)}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add to Prescription
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Prescription Summary */}
        <Card className="shadow-lg border-slate-200 dark:border-slate-700 mt-6">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6" />
                <CardTitle className="text-xl">Prescription Summary</CardTitle>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                {prescription.length} {prescription.length === 1 ? 'item' : 'items'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white dark:bg-slate-800">
            {prescription.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                  No medicines added yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                  {isViewMode ? "This prescription is empty" : "Search and add medicines to create a prescription"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescription.map((p, index) => (
                  <div
                    key={p.id}
                    className="p-5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm font-bold">
                            {index + 1}
                          </span>
                          <p className="text-xl font-bold text-slate-900 dark:text-white">
                            {p.name}
                          </p>
                        </div>
                        <div className="ml-10 space-y-1">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Instructions:</span>{" "}
                            {p.instructions || <span className="italic">No instructions</span>}
                          </p>
                          {p.dosage && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Dosage:</span>{" "}
                              {p.dosage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Quantity</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          {p.qty}
                        </p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          PKR {((p.retail_price || 0) * p.qty).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {!isViewMode && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Dosage (e.g., 500mg, 2 tablets)"
                          value={p.dosage ?? ""}
                          onChange={(e) =>
                            handleEditPrescriptionItem(p.id, "dosage", e.target.value)
                          }
                          className="flex-1 dark:bg-slate-900 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveFromPrescription(p.id)}
                          className="dark:bg-red-600 dark:hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Total Summary */}
                <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Total Items</span>
                    <span className="font-bold text-slate-900 dark:text-white text-2xl">
                      {totalItems}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Total Amount</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-3xl">
                      PKR {totalRetail.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 flex gap-3">
                    {!isViewMode && (
                      <Button
                        onClick={() => {
                          if (!confirm("Are you sure you want to clear the entire prescription?")) return;
                          setPrescription([]);
                        }}
                        variant="outline"
                        className="flex-1 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        Clear All
                      </Button>
                    )}

                    <Button
                      onClick={handlePreviewAndSave}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-lg h-12"
                      disabled={savingPreview}
                    >
                      <Download className="mr-2 h-5 w-5" /> Preview PDF
                    </Button>

                    {!isViewMode && !disableSend && (
                      <Button
                        onClick={handleSendToFirebase}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-lg h-12"
                      >
                        <Send className="mr-2 h-5 w-5" /> Send Prescription
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PDF Preview Modal with Header Options */}
        {isPreviewOpen && pdfBlobUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b-2 border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Prescription Preview {lastSavedPREC && `- ${lastSavedPREC}`}
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={closePreview} 
                  className="h-10 w-10 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="w-full h-[calc(85vh-140px)]">
                <iframe
                  src={pdfBlobUrl}
                  title="Prescription Preview"
                  className="w-full h-full border-0"
                />
              </div>

              <div className="p-4 border-t-2 border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="flex gap-3 max-w-3xl mx-auto">
                  <Button 
                    onClick={() => handleDownloadPDF(false)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 h-12 text-base font-semibold shadow-lg"
                  >
                    <Download className="mr-2 h-5 w-5" /> 
                    Download (No Header)
                  </Button>
                  <Button 
                    onClick={() => handleDownloadPDF(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 h-12 text-base font-semibold shadow-lg"
                  >
                    <Download className="mr-2 h-5 w-5" /> 
                    Download With Header
                  </Button>
                </div>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
                  Choose to download with or without the official header
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
