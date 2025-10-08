// // // import { useLocation, useNavigate } from "react-router-dom";
// // // import { useState } from "react";
// // // import {
// // //   Card,
// // //   CardHeader,
// // //   CardTitle,
// // //   CardContent,
// // // } from "@/components/ui/card";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { PlusCircle, Trash2, ArrowLeft, FileText } from "lucide-react";

// // // interface Medicine {
// // //   name: string;
// // //   dosage: string;
// // //   frequency: string;
// // //   duration: string;
// // //   instructions: string;
// // // }

// // // export default function PrescriptionPage() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   const patientData = location.state?.patientData;

// // //   const [medicines, setMedicines] = useState<Medicine[]>([
// // //     { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
// // //   ]);

// // //   const addMedicine = () => {
// // //     setMedicines([
// // //       ...medicines,
// // //       { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
// // //     ]);
// // //   };

// // //   const removeMedicine = (index: number) => {
// // //     const newMeds = [...medicines];
// // //     newMeds.splice(index, 1);
// // //     setMedicines(newMeds);
// // //   };

// // //   const handleChange = (
// // //     index: number,
// // //     field: keyof Medicine,
// // //     value: string
// // //   ) => {
// // //     const newMeds = [...medicines];
// // //     newMeds[index][field] = value;
// // //     setMedicines(newMeds);
// // //   };

// // //   const handleGeneratePDF = () => {
// // //     // later we’ll add actual jsPDF logic here
// // //     console.log("Patient:", patientData);
// // //     console.log("Medicines:", medicines);
// // //     alert("PDF generation coming next!");
// // //   };

// // //   if (!patientData) {
// // //     return (
// // //       <div className="p-8 text-center">
// // //         <p className="text-gray-600">
// // //           ⚠️ No patient data found. Please go back to the patient form.
// // //         </p>
// // //         <Button className="mt-4" onClick={() => navigate(-1)}>
// // //           Go Back
// // //         </Button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-6 space-y-6">
// // //       {/* Header */}
// // //       <div className="flex justify-between items-center">
// // //         <h1 className="text-2xl font-bold">🩺 Prescription Page</h1>
// // //         <div className="flex gap-3">
// // //           <Button variant="outline" onClick={() => navigate(-1)}>
// // //             <ArrowLeft className="mr-2 h-4 w-4" />
// // //             Back
// // //           </Button>
// // //           <Button onClick={handleGeneratePDF}>
// // //             <FileText className="mr-2 h-4 w-4" />
// // //             Generate PDF
// // //           </Button>
// // //         </div>
// // //       </div>

// // //       {/* Patient Info */}
// // //       <Card className="border-blue-400">
// // //         <CardHeader className="bg-blue-500 text-white">
// // //           <CardTitle>Patient Details</CardTitle>
// // //         </CardHeader>
// // //         <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
// // //           <div>
// // //             <Label>Name</Label>
// // //             <p className="font-semibold">{patientData.name}</p>
// // //           </div>
// // //           <div>
// // //             <Label>Relation</Label>
// // //             <p className="font-semibold">{patientData.relation}</p>
// // //           </div>
// // //           <div>
// // //             <Label>Age / Sex</Label>
// // //             <p className="font-semibold">
// // //               {patientData.age} / {patientData.sex}
// // //             </p>
// // //           </div>
// // //           <div>
// // //             <Label>Referring Doctor</Label>
// // //             <p className="font-semibold">{patientData.referringDoctor}</p>
// // //           </div>
// // //           <div>
// // //             <Label>Sample ID</Label>
// // //             <p className="font-semibold">{patientData.sampleId}</p>
// // //           </div>
// // //           <div>
// // //             <Label>Collection Date/Time</Label>
// // //             <p className="font-semibold">{patientData.collectionDateTime}</p>
// // //           </div>
// // //         </CardContent>
// // //       </Card>

// // //       {/* Medicine Table */}
// // //       <Card>
// // //         <CardHeader className="bg-green-500 text-white">
// // //           <CardTitle>Prescription Details</CardTitle>
// // //         </CardHeader>
// // //         <CardContent className="space-y-4 mt-4">
// // //           {medicines.map((med, index) => (
// // //             <div
// // //               key={index}
// // //               className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border-b pb-4"
// // //             >
// // //               <div>
// // //                 <Label>Medicine Name</Label>
// // //                 <Input
// // //                   value={med.name}
// // //                   onChange={(e) =>
// // //                     handleChange(index, "name", e.target.value)
// // //                   }
// // //                   placeholder="e.g., Paracetamol"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <Label>Dosage</Label>
// // //                 <Input
// // //                   value={med.dosage}
// // //                   onChange={(e) =>
// // //                     handleChange(index, "dosage", e.target.value)
// // //                   }
// // //                   placeholder="e.g., 500mg"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <Label>Frequency</Label>
// // //                 <Input
// // //                   value={med.frequency}
// // //                   onChange={(e) =>
// // //                     handleChange(index, "frequency", e.target.value)
// // //                   }
// // //                   placeholder="e.g., 2 times/day"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <Label>Duration</Label>
// // //                 <Input
// // //                   value={med.duration}
// // //                   onChange={(e) =>
// // //                     handleChange(index, "duration", e.target.value)
// // //                   }
// // //                   placeholder="e.g., 5 days"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <Label>Instructions</Label>
// // //                 <Input
// // //                   value={med.instructions}
// // //                   onChange={(e) =>
// // //                     handleChange(index, "instructions", e.target.value)
// // //                   }
// // //                   placeholder="Before meal / After meal"
// // //                 />
// // //               </div>
// // //               <div className="col-span-full flex justify-end mt-2">
// // //                 {medicines.length > 1 && (
// // //                   <Button
// // //                     type="button"
// // //                     variant="destructive"
// // //                     size="sm"
// // //                     onClick={() => removeMedicine(index)}
// // //                   >
// // //                     <Trash2 className="mr-2 h-4 w-4" />
// // //                     Remove
// // //                   </Button>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           ))}

// // //           <div className="flex justify-end">
// // //             <Button
// // //               type="button"
// // //               variant="outline"
// // //               onClick={addMedicine}
// // //               className="flex items-center gap-2"
// // //             >
// // //               <PlusCircle className="h-4 w-4" />
// // //               Add Medicine
// // //             </Button>
// // //           </div>
// // //         </CardContent>
// // //       </Card>
// // //     </div>
// // //   );
// // // }

// // // src/components/PrescriptionPage.tsx

// // "use client";

// // import React, { useEffect, useMemo, useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import {
// //   collection,
// //   getDocs,
// //   addDoc,
// //   DocumentData,
// //   QueryDocumentSnapshot,
// // } from "firebase/firestore";
// // import { inventoryDB } from "@/inventoryFirebase"; // ✅ inventory firebase config
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
// // } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast"; // ✅ toast hook

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

// //   const patientData = location.state?.patientData || null;

// //   // states
// //   const [inventory, setInventory] = useState<InventoryMedicine[]>([]);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [searchQuery, setSearchQuery] = useState<string>("");
// //   const [prescription, setPrescription] = useState<PrescriptionItem[]>([]);
// //   const [selectedQty, setSelectedQty] = useState<Record<string, number>>({});
// //   const [selectedNotes, setSelectedNotes] = useState<Record<string, string>>(
// //     {}
// //   );

// //   // ✅ fetch medicines from inventory only when searched
// //   useEffect(() => {
// //     if (!searchQuery.trim()) return; // only fetch when search has text

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
// //         const q = searchQuery.toLowerCase();
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
// //   }, [searchQuery, toast]);

// //   const handleAddToPrescription = (med: InventoryMedicine) => {
// //     const qtyToAdd =
// //       selectedQty[med.id] && selectedQty[med.id] > 0
// //         ? selectedQty[med.id]
// //         : 1;
// //     const note = selectedNotes[med.id] || "";

// //     setPrescription((prev) => {
// //       const existing = prev.find((p) => p.id === med.id);
// //       if (existing) {
// //         return prev.map((p) =>
// //           p.id === med.id
// //             ? {
// //                 ...p,
// //                 qty: p.qty + qtyToAdd,
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

// //     setSelectedQty((s) => ({ ...s, [med.id]: 1 }));
// //     setSelectedNotes((s) => ({ ...s, [med.id]: "" }));
// //   };

// //   const handleRemoveFromPrescription = (id: string) => {
// //     setPrescription((prev) => prev.filter((p) => p.id !== id));
// //   };

// //   const handleQtyChange = (id: string, value: number) => {
// //     setSelectedQty((s) => ({ ...s, [id]: value }));
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

// //   // ✅ save to Firestore
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
// //       const payload = {
// //         patient: patientData,
// //         prescription,
// //         totalItems,
// //         totalRetail,
// //         timestamp: new Date().toISOString(),
// //       };

// //       await addDoc(collection(inventoryDB, "prescriptions"), payload);

// //       toast({
// //         title: "Success",
// //         description: "Prescription saved successfully.",
// //         variant: "default",
// //       });

// //       // reset after success
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

// //   // ✅ UI starts here
// //   return (
// //     <div className="p-6 space-y-6">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <h1 className="text-2xl font-bold flex items-center gap-3">
// //           <Package className="h-6 w-6" />
// //           Prescription
// //         </h1>

// //         <Button variant="outline" onClick={() => navigate(-1)}>
// //           <ArrowLeft className="mr-2 h-4 w-4" />
// //           Back
// //         </Button>
// //       </div>

// //       {/* Patient details */}
// //       {patientData && (
// //         <Card>
// //           <CardHeader className="bg-blue-600 text-white">
// //             <CardTitle>Patient Details</CardTitle>
// //           </CardHeader>
// //           <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //             <div>
// //               <Label>Name</Label>
// //               <p className="font-semibold">{patientData.name || "-"}</p>
// //             </div>
// //             <div>
// //               <Label>Relation</Label>
// //               <p className="font-semibold">{patientData.relation || "-"}</p>
// //             </div>
// //             <div>
// //               <Label>Age / Sex</Label>
// //               <p className="font-semibold">
// //                 {(patientData.age ?? "-")} / {patientData.sex ?? "-"}
// //               </p>
// //             </div>
// //             <div>
// //               <Label>Referring Doctor</Label>
// //               <p className="font-semibold">
// //                 {patientData.referringDoctor || "-"}
// //               </p>
// //             </div>
// //             <div>
// //               <Label>Collection Date/Time</Label>
// //               <p className="font-semibold">
// //                 {patientData.collectionDateTime || "-"}
// //               </p>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {/* Search input */}
// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Search Medicines</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="flex items-center gap-3">
// //             <Search className="text-slate-500" />
// //             <Input
// //               placeholder="Type to search medicines..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               className="w-80"
// //             />
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Only show results if searched */}
// //       {searchQuery && (
// //         <Card>
// //           <CardHeader>
// //             <CardTitle>Search Results</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             {loading ? (
// //               <p>Loading...</p>
// //             ) : inventory.length === 0 ? (
// //               <p>No medicines found for '{searchQuery}'.</p>
// //             ) : (
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {inventory.map((med) => (
// //                   <div
// //                     key={med.id}
// //                     className="p-4 border rounded-xl bg-white shadow-sm"
// //                   >
// //                     <p className="font-semibold text-lg">{med.name}</p>
// //                     <p className="text-sm text-slate-600">
// //                       Stock: {med.quantity ?? 0} • Price: PKR{" "}
// //                       {med.retail_price ?? "N/A"}
// //                     </p>

// //                     <div className="mt-3 grid grid-cols-2 gap-2">
// //                       <Input
// //                         type="number"
// //                         min={1}
// //                         value={selectedQty[med.id] ?? 1}
// //                         onChange={(e) =>
// //                           handleQtyChange(
// //                             med.id,
// //                             Math.max(1, Number(e.target.value))
// //                           )
// //                         }
// //                         className="h-9"
// //                       />
// //                       <Input
// //                         placeholder="notes (e.g. after food)"
// //                         value={selectedNotes[med.id] ?? ""}
// //                         onChange={(e) =>
// //                           handleNoteChange(med.id, e.target.value)
// //                         }
// //                         className="h-9"
// //                       />
// //                     </div>

// //                     <Button
// //                       className="mt-3 w-full"
// //                       onClick={() => handleAddToPrescription(med)}
// //                     >
// //                       <Plus className="mr-2 h-4 w-4" /> Add
// //                     </Button>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>
// //       )}

// //       {/* Summary */}
// //       <Card>
// //         <CardHeader className="bg-emerald-600 text-white">
// //           <CardTitle>Prescription Summary</CardTitle>
// //         </CardHeader>
// //         <CardContent className="space-y-3">
// //           {prescription.length === 0 ? (
// //             <p>No medicines added yet.</p>
// //           ) : (
// //             prescription.map((p) => (
// //               <div key={p.id} className="p-3 border rounded-xl bg-white">
// //                 <div className="flex justify-between items-start">
// //                   <div>
// //                     <p className="font-semibold">{p.name}</p>
// //                     <p className="text-sm text-slate-600">
// //                       Instructions: {p.instructions || "-"}
// //                     </p>
// //                   </div>
// //                   <div className="text-right">
// //                     <p>Qty: {p.qty}</p>
// //                     <p>PKR {(p.retail_price || 0) * p.qty}</p>
// //                   </div>
// //                 </div>
// //                 <div className="mt-2 flex gap-2">
// //                   <Input
// //                     placeholder="dosage (e.g., 500mg)"
// //                     value={p.dosage ?? ""}
// //                     onChange={(e) =>
// //                       handleEditPrescriptionItem(p.id, "dosage", e.target.value)
// //                     }
// //                   />
// //                   <Button
// //                     variant="destructive"
// //                     onClick={() => handleRemoveFromPrescription(p.id)}
// //                   >
// //                     <Trash2 className="h-4 w-4" />
// //                   </Button>
// //                 </div>
// //               </div>
// //             ))
// //           )}

// //           <div className="pt-3 border-t flex flex-col gap-2">
// //             <div className="flex justify-between">
// //               <span>Total items</span>
// //               <span className="font-semibold">{totalItems}</span>
// //             </div>
// //             <div className="flex justify-between">
// //               <span>Total (Retail)</span>
// //               <span className="font-semibold">PKR {totalRetail.toFixed(2)}</span>
// //             </div>

// //             <div className="pt-2 flex gap-2">
// //               <Button
// //                 onClick={() => {
// //                   if (!confirm("Clear prescription?")) return;
// //                   setPrescription([]);
// //                 }}
// //                 variant="outline"
// //               >
// //                 Clear
// //               </Button>
// //               <Button onClick={handleSendToFirebase} className="ml-auto">
// //                 <Send className="mr-2 h-4 w-4" /> Send
// //               </Button>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }

// "use client";

// import React, { useEffect, useState } from "react";
// import Layout from "@/components/Layout";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   collection,
//   getDocs,
//   addDoc,
// } from "firebase/firestore";
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
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

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

//   // ✅ GET PATIENT DATA FROM LOCATION STATE (from patient form)
//   const patientData = location.state?.patientData || null;

//     // ✅ navbar states
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [user, setUser] = useState<any>(null);
//     const [role, setRole] = useState<string | null>(null);
//     const [searchCode, setSearchCode] = useState("");
  
//     // ✅ dark mode toggle
//     const toggleDarkMode = () => {
//       setIsDarkMode((prev) => !prev);
//       if (!isDarkMode) {
//         document.documentElement.classList.add("dark");
//         localStorage.setItem("theme", "dark");
//       } else {
//         document.documentElement.classList.remove("dark");
//         localStorage.setItem("theme", "light");
//       }
//     };
  
//     // ✅ login/logout
//     const handleLogin = async () => {
//       const userData = await loginWithGoogle();
//       setUser(userData);
//       // you can also fetch role here if needed
//     };
//     const handleLogout = async () => {
//         await logout();
//         setUser(null);
//         setRole(null);
//       };
//         // ✅ report search
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
//   const [selectedQty, setSelectedQty] = useState<Record<string, number>>({});
//   const [selectedNotes, setSelectedNotes] = useState<Record<string, string>>({});

//   // ✅ FETCH ALL MEDICINES WHEN SEARCH QUERY CHANGES
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setInventory([]);
//       return (
//         <Layout
//           isDarkMode={isDarkMode}
//           toggleDarkMode={toggleDarkMode}
//           user={user}
//           role={role}
//           handleLogin={handleLogin}
//           handleLogout={handleLogout}
//           searchCode={searchCode}
//           setSearchCode={setSearchCode}
//           handleSearch={handleSearch}
//         >
//         </Layout>
//       );
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
        
//         // ✅ FILTER BY SEARCH QUERY - case insensitive partial match
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
//   }, [searchQuery, toast]);

//   const handleAddToPrescription = (med: InventoryMedicine) => {
//     const qtyToAdd = selectedQty[med.id] && selectedQty[med.id] > 0 ? selectedQty[med.id] : 1;
//     const note = selectedNotes[med.id] || "";

//     setPrescription((prev) => {
//       const existing = prev.find((p) => p.id === med.id);
//       if (existing) {
//         return prev.map((p) =>
//           p.id === med.id
//             ? {
//                 ...p,
//                 qty: p.qty + qtyToAdd,
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

//     setSelectedQty((s) => ({ ...s, [med.id]: 1 }));
//     setSelectedNotes((s) => ({ ...s, [med.id]: "" }));
//   };

//   const handleRemoveFromPrescription = (id: string) => {
//     setPrescription((prev) => prev.filter((p) => p.id !== id));
//   };

//   const handleQtyChange = (id: string, value: number) => {
//     setSelectedQty((s) => ({ ...s, [id]: value }));
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
//       const payload = {
//         patient: patientData,
//         prescription,
//         totalItems,
//         totalRetail,
//         timestamp: new Date().toISOString(),
//       };

//       await addDoc(collection(inventoryDB, "prescriptions"), payload);

//       toast({
//         title: "Success",
//         description: "Prescription saved successfully.",
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

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Professional Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg">
//               <FileText className="h-7 w-7 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
//                 Create Prescription
//               </h1>
//               <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
//                 Add medicines and manage patient prescriptions
//               </p>
//             </div>
//           </div>

//           <Button 
//             variant="outline" 
//             onClick={() => navigate(-1)}
//             className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back
//           </Button>
//         </div>

//         {/* Patient Details Card */}
//         {patientData && (
//           <Card className="shadow-lg border-slate-200 dark:border-slate-700 overflow-hidden">
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

//         {/* Search Medicine Card */}
//         <Card className="shadow-lg border-slate-200 dark:border-slate-700">
//           <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
//             <div className="flex items-center gap-3">
//               <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//               <CardTitle className="text-slate-900 dark:text-white">Search Medicines</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent className="p-6 bg-white dark:bg-slate-800">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5 pointer-events-none" />
//               <Input
//                 placeholder="Type medicine name to search..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 h-12 text-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Search Results */}
//         {searchQuery && (
//           <Card className="shadow-lg border-slate-200 dark:border-slate-700">
//             <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
//               <CardTitle className="text-slate-900 dark:text-white">
//                 Search Results {!loading && `(${inventory.length})`}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 bg-white dark:bg-slate-800">
//               {loading ? (
//                 <div className="text-center py-8">
//                   <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
//                   <p className="mt-3 text-slate-600 dark:text-slate-400">Loading medicines...</p>
//                 </div>
//               ) : inventory.length === 0 ? (
//                 <div className="text-center py-8">
//                   <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
//                   <p className="text-slate-600 dark:text-slate-400">
//                     No medicines found for '<span className="font-semibold">{searchQuery}</span>'
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {inventory.map((med) => (
//                     <div
//                       key={med.id}
//                       className="p-5 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-700"
//                     >
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex-1">
//                           <p className="font-bold text-lg text-slate-900 dark:text-white mb-1">
//                             {med.name}
//                           </p>
//                           <div className="flex items-center gap-3 text-sm">
//                             <span className="text-slate-600 dark:text-slate-400">
//                               Stock: <span className="font-semibold text-slate-900 dark:text-white">{med.quantity ?? 0}</span>
//                             </span>
//                             <span className="text-slate-400 dark:text-slate-600">•</span>
//                             <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
//                               PKR {med.retail_price ?? "N/A"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="space-y-2 mb-3">
//                         <Input
//                           type="number"
//                           min={1}
//                           placeholder="Quantity"
//                           value={selectedQty[med.id] ?? 1}
//                           onChange={(e) =>
//                             handleQtyChange(
//                               med.id,
//                               Math.max(1, Number(e.target.value))
//                             )
//                           }
//                           className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
//                         />
//                         <Input
//                           placeholder="Instructions (e.g., after food)"
//                           value={selectedNotes[med.id] ?? ""}
//                           onChange={(e) =>
//                             handleNoteChange(med.id, e.target.value)
//                           }
//                           className="h-10 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500"
//                         />
//                       </div>

//                       <Button
//                         className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//                         onClick={() => handleAddToPrescription(med)}
//                       >
//                         <Plus className="mr-2 h-4 w-4" /> Add to Prescription
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {/* Prescription Summary */}
//         <Card className="shadow-lg border-slate-200 dark:border-slate-700">
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
//                   Search and add medicines to create a prescription
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

//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Dosage (e.g., 500mg, 2 tablets)"
//                         value={p.dosage ?? ""}
//                         onChange={(e) =>
//                           handleEditPrescriptionItem(p.id, "dosage", e.target.value)
//                         }
//                         className="flex-1 dark:bg-slate-900 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500"
//                       />
//                       <Button
//                         variant="destructive"
//                         size="icon"
//                         onClick={() => handleRemoveFromPrescription(p.id)}
//                         className="dark:bg-red-600 dark:hover:bg-red-700"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
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
//                     <Button
//                       onClick={() => {
//                         if (!confirm("Are you sure you want to clear the entire prescription?")) return;
//                         setPrescription([]);
//                       }}
//                       variant="outline"
//                       className="flex-1 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
//                     >
//                       Clear All
//                     </Button>
//                     <Button 
//                       onClick={handleSendToFirebase} 
//                       className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-lg h-12"
//                     >
//                       <Send className="mr-2 h-5 w-5" /> Send Prescription
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { inventoryDB } from "@/inventoryFirebase";
import { db, loginWithGoogle, logout } from "@/firebase";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const patientData = location.state?.patientData || null;

  // Navbar states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [searchCode, setSearchCode] = useState("");

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
  const [selectedQty, setSelectedQty] = useState<Record<string, number>>({});
  const [selectedNotes, setSelectedNotes] = useState<Record<string, string>>({});

  // ✅ Fixed useEffect (removed JSX return)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setInventory([]);
      return; // ❌ removed JSX return, only plain return allowed
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
  }, [searchQuery, toast]);

  const handleAddToPrescription = (med: InventoryMedicine) => {
    const qtyToAdd =
      selectedQty[med.id] && selectedQty[med.id] > 0 ? selectedQty[med.id] : 1;
    const note = selectedNotes[med.id] || "";

    setPrescription((prev) => {
      const existing = prev.find((p) => p.id === med.id);
      if (existing) {
        return prev.map((p) =>
          p.id === med.id
            ? {
                ...p,
                qty: p.qty + qtyToAdd,
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

    setSelectedQty((s) => ({ ...s, [med.id]: 1 }));
    setSelectedNotes((s) => ({ ...s, [med.id]: "" }));
  };

  const handleRemoveFromPrescription = (id: string) => {
    setPrescription((prev) => prev.filter((p) => p.id !== id));
  };

  const handleQtyChange = (id: string, value: number) => {
    setSelectedQty((s) => ({ ...s, [id]: value }));
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
      const payload = {
        patient: patientData,
        prescription,
        totalItems,
        totalRetail,
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(inventoryDB, "prescriptions"), payload);

      toast({
        title: "Success",
        description: "Prescription saved successfully.",
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
      {/* ✅ Wrapped your entire JSX in Layout children */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6 lg:p-8">
         {/* Professional Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Create Prescription
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Add medicines and manage patient prescriptions
              </p>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Patient Details Card */}
        {patientData && (
          <Card className="shadow-lg border-slate-200 dark:border-slate-700 overflow-hidden">
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

        {/* Search Medicine Card */}
        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
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
          <Card className="shadow-lg border-slate-200 dark:border-slate-700">
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
                          type="number"
                          min={1}
                          placeholder="Quantity"
                          value={selectedQty[med.id] ?? 1}
                          onChange={(e) =>
                            handleQtyChange(
                              med.id,
                              Math.max(1, Number(e.target.value))
                            )
                          }
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

        {/* Prescription Summary */}
        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
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
                  Search and add medicines to create a prescription
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
                    <Button 
                      onClick={handleSendToFirebase} 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-lg h-12"
                    >
                      <Send className="mr-2 h-5 w-5" /> Send Prescription
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
    </Layout>
  );
}
