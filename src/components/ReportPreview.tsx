

// // import { useRef } from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Separator } from "@/components/ui/separator";
// // import { LabReport } from "@/types/lab-report";
// // import { FileText, Download, Printer, CheckCircle, XCircle } from "lucide-react";
// // import { jsPDF } from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import { format } from "date-fns";

// // interface ReportPreviewProps {
// //   report: LabReport;
// // }

// // export function ReportPreview({ report }: ReportPreviewProps) {
// //   const printRef = useRef<HTMLDivElement>(null);

// //   const formatDateTime = (dateString: string) => {
// //     try {
// //       const date = new Date(dateString);
// //       return format(date, "dd-MMM-yyyy HH:mm");
// //     } catch {
// //       return dateString;
// //     }
// //   };

// //   const createLuxuryPDF = () => {
// //     const pdf = new jsPDF('p', 'mm', 'a4');
// //     const pageWidth = pdf.internal.pageSize.getWidth();
// //     const pageHeight = pdf.internal.pageSize.getHeight();

// //     // Background + border
// //     pdf.setFillColor(248, 250, 252);
// //     pdf.rect(0, 0, pageWidth, pageHeight, 'F');
// //     pdf.setDrawColor(59, 130, 246);
// //     pdf.setLineWidth(0.5);
// //     pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
// //     pdf.setDrawColor(226, 232, 240);
// //     pdf.setLineWidth(0.2);
// //     pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

// //     // Report title
// //     pdf.setTextColor(30, 58, 138);
// //     pdf.setFontSize(18);
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text('LABORATORY REPORT', pageWidth / 2, 68, { align: 'center' });
// //     pdf.setDrawColor(147, 197, 253);
// //     pdf.setLineWidth(0.3);
// //     pdf.line(pageWidth / 2 - 45, 70, pageWidth / 2 + 45, 70);

// //     // Report ID
// //     pdf.setFillColor(239, 246, 255);
// //     pdf.setDrawColor(147, 197, 253);
// //     pdf.roundedRect(pageWidth / 2 - 30, 75, 60, 8, 2, 2, 'FD');
// //     pdf.setTextColor(30, 58, 138);
// //     pdf.setFontSize(10);
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text(`Report ID: ${report.reportId}`, pageWidth / 2, 80.5, { align: 'center' });

// //     // Patient Information
// //     const patientSectionY = 95;
// //     pdf.setFillColor(249, 250, 251);
// //     pdf.setDrawColor(209, 213, 219);
// //     pdf.roundedRect(20, patientSectionY, pageWidth - 40, 8, 1, 1, 'FD');
// //     pdf.setTextColor(55, 65, 81);
// //     pdf.setFontSize(12);
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text('PATIENT INFORMATION', 25, patientSectionY + 5.5);

// //     pdf.setFontSize(10);
// //     pdf.setFont('helvetica', 'normal');
// //     pdf.setTextColor(75, 85, 99);
// //     const leftColX = 25;
// //     const rightColX = pageWidth / 2 + 10;
// //     let infoY = patientSectionY + 15;

// //     // Left column
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text('Patient Name:', leftColX, infoY);
// //     pdf.setFont('helvetica', 'normal');
// //     pdf.text(`${report.patient.name} ${report.patient.relation}`, leftColX + 30, infoY);

// //     infoY += 6;
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text('Age / Gender:', leftColX, infoY);
// //     pdf.setFont('helvetica', 'normal');
// //     pdf.text(`${report.patient.age || 'N/A'} / ${report.patient.sex || 'N/A'}`, leftColX + 30, infoY);

// //     infoY += 6;
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text('Sample ID:', leftColX, infoY);
// //     pdf.setFont('helvetica', 'normal');
// //     pdf.text(report.patient.sampleId, leftColX + 30, infoY);

// //     // Right column
// //     infoY = patientSectionY + 15;
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text('Referring Doctor:', rightColX, infoY);
// //     pdf.setFont('helvetica', 'normal');
// //     pdf.text(report.patient.referringDoctor, rightColX + 35, infoY);

// //     infoY += 6;
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text('Collection Date:', rightColX, infoY);
// //     pdf.setFont('helvetica', 'normal');
// //     pdf.text(formatDateTime(report.patient.collectionDateTime), rightColX + 35, infoY);

// //     infoY += 6;
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text('Report Date:', rightColX, infoY);
// //     pdf.setFont('helvetica', 'normal');
// //     pdf.text(formatDateTime(report.verificationDate), rightColX + 35, infoY);

// //     // TEST RESULTS
// //     const testsStartY = patientSectionY + 45;
// //     pdf.setFillColor(249, 250, 251);
// //     pdf.setDrawColor(209, 213, 219);
// //     pdf.roundedRect(20, testsStartY, pageWidth - 40, 8, 1, 1, 'FD');
// //     pdf.setTextColor(55, 65, 81);
// //     pdf.setFontSize(12);
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text('LABORATORY RESULTS', 25, testsStartY + 5.5);

// //     const tableRows: any[] = [];

// //     if (report.tests.malarialParasites.selected) {
// //       const result = report.tests.malarialParasites.result || "Pending";

// //       const falciparum =
// //         report.tests.malarialParasites.pFalciparumResult
// //           ? `P. falciparum: ${report.tests.malarialParasites.pFalciparumResult}`
// //           : "P. falciparum: Pending";

// //       const vivax =
// //         report.tests.malarialParasites.pVivaxResult
// //           ? `P. vivax: ${report.tests.malarialParasites.pVivaxResult}`
// //           : "P. vivax: Pending";

// //       const speciesSummary = [falciparum, vivax].join("\n");

// //       tableRows.push([
// //         "Malarial Parasites",
// //         result,
// //         "-",
// //         speciesSummary,
// //         result === "Positive" ? "-" : result === "Negative" ? "-" : "⏳",
// //       ]);

// //       if (report.tests.malarialParasites.parasiteDensity) {
// //         tableRows.push([
// //           `Parasite Density`,
// //           `${report.tests.malarialParasites.parasiteDensity}`,
// //           "parasites/µL",
// //           "0",
// //           "⚠"
// //         ]);
// //       }
// //     }

// //     if (report.tests.dengueNS1.selected) {
// //       const result = report.tests.dengueNS1.result || "Pending";
// //       tableRows.push([
// //         "Dengue NS1 Antigen",
// //         result,
// //         "-",
// //         "Negative",
// //         result === "Positive" ? "-" : result === "Negative" ? "-" : "⏳"
// //       ]);
// //     }

// //     autoTable(pdf, {
// //       startY: testsStartY + 15,
// //       margin: { left: 20, right: 20 },
// //       head: [['Test Parameter', 'Result', 'Unit', 'Reference Range', 'Status']],
// //       body: tableRows,
// //       theme: 'grid',
// //       styles: {
// //         fontSize: 9,
// //         cellPadding: 4,
// //         fontStyle: 'normal',
// //         textColor: [55, 65, 81],
// //         lineColor: [209, 213, 219],
// //         lineWidth: 0.1,
// //       },
// //       headStyles: {
// //         fillColor: [30, 58, 138],
// //         textColor: [255, 255, 255],
// //         fontSize: 10,
// //         fontStyle: 'bold',
// //         halign: 'center'
// //       },
// //       columnStyles: {
// //         0: { fontStyle: 'bold' },
// //         1: { halign: 'center' },
// //         2: { halign: 'center' },
// //         3: { halign: 'center' },
// //         4: { halign: 'center', fontSize: 12 }
// //       },
// //       alternateRowStyles: { fillColor: [248, 250, 252] },
// //       didParseCell: function (data) {
// //         if (data.column.index === 1 && data.cell.text[0] === 'Positive') {
// //           data.cell.styles.textColor = [220, 38, 38];
// //           data.cell.styles.fontStyle = 'bold';
// //         }
// //         if (data.column.index === 1 && data.cell.text[0] === 'Negative') {
// //           data.cell.styles.textColor = [22, 163, 74];
// //           data.cell.styles.fontStyle = 'bold';
// //         }
// //       }
// //     });

// //     // FOOTER
// //     const finalY = (pdf as any).lastAutoTable.finalY + 20;
// //     pdf.setFillColor(239, 246, 255);
// //     pdf.setDrawColor(147, 197, 253);
// //     pdf.roundedRect(20, finalY, pageWidth - 40, 15, 2, 2, 'FD');
// //     pdf.setTextColor(30, 58, 138);
// //     pdf.setFontSize(9);
// //     pdf.setFont('helvetica', 'bold');
// //     pdf.text('VERIFIED & AUTHORIZED BY PATHOLOGIST', 25, finalY + 8);

// //     pdf.setFillColor(254, 243, 199);
// //     pdf.setDrawColor(245, 158, 11);
// //     pdf.roundedRect(20, finalY + 30, pageWidth - 40, 12, 1, 1, 'FD');
// //     pdf.setTextColor(146, 64, 14);
// //     pdf.setFontSize(8);
// //     pdf.setFont('helvetica', 'italic');
// //     const maxWidth = pageWidth - 50;
// //     pdf.text('This report is computer generated and digitally verified. No manual signature required.', 25, finalY + 35, { maxWidth });
// //     pdf.text('All tests performed under strict quality control measures as per international standards.', 25, finalY + 38, { maxWidth });

// //     pdf.setTextColor(156, 163, 175);
// //     pdf.setFontSize(8);
// //     pdf.setFont('helvetica', 'normal');
// //     pdf.text(`Generated on: ${formatDateTime(new Date().toISOString())}`, 20, pageHeight - 15);
// //     pdf.text(`Page 1 of 1`, pageWidth - 30, pageHeight - 15);

// //     return pdf;
// //   };

// //   const exportToPDF = () => {
// //     const pdf = createLuxuryPDF();
// //     pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
// //   };

// //   const handlePrintWithPDF = () => {
// //     const pdf = createLuxuryPDF();
// //     pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
// //     setTimeout(() => window.print(), 1000);
// //   };

// //   const getResultBadge = (result?: string) => {
// //     if (result === "Positive") return <Badge variant="destructive">Positive</Badge>;
// //     if (result === "Negative") return <Badge className="bg-success text-success-foreground">Negative</Badge>;
// //     return <Badge variant="secondary">Pending</Badge>;
// //   };

// //   return (
// //     <Card className="report-shadow">
// //       <CardHeader className="medical-gradient text-white">
// //         <CardTitle className="flex items-center gap-2">
// //           <FileText className="h-5 w-5" />
// //           Report Preview
// //         </CardTitle>
// //       </CardHeader>
// //       <CardContent className="p-6">
// //         <div ref={printRef} className="space-y-6 print:p-8">
// //           {/* Header */}
// //           <div className="text-center space-y-2">
// //             <h1 className="text-2xl font-bold tracking-wide">SMMC LABORATORY REPORT</h1>
// //             <p className="text-sm text-muted-foreground">Report ID: {report.reportId}</p>
// //             <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
// //               <CheckCircle className="h-3 w-3" />
// //               ISO 15189 Certified
// //             </div>
// //           </div>

// //           <Separator />
// // {/* Patient Info */}
// // <div className="space-y-4">
// //   <h2 className="text-lg font-semibold flex items-center gap-2">
// //     Patient Information
// //     <Badge variant="outline" className="text-xs">Verified</Badge>
// //   </h2>
// //   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 space-y-3 
// //                   text-gray-900 dark:text-gray-900"> 
// //     {/* ⬆ force dark:text-gray-900 so text stays dark in dark mode */}
// //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //       <div className="space-y-2">
// //         <p><span className="font-semibold text-blue-900">Patient:</span> {report.patient.name} {report.patient.relation}</p>
// //         <p><span className="font-semibold text-blue-900">Age/Sex:</span> {report.patient.age} / {report.patient.sex}</p>
// //         <p><span className="font-semibold text-blue-900">Sample ID:</span> {report.patient.sampleId}</p>
// //       </div>
// //       <div className="space-y-2">
// //         <p><span className="font-semibold text-blue-900">Referring Dr:</span> {report.patient.referringDoctor}</p>
// //         <p><span className="font-semibold text-blue-900">Collection:</span> {formatDateTime(report.patient.collectionDateTime)}</p>
// //         <p><span className="font-semibold text-blue-900">Report Date:</span> {formatDateTime(report.verificationDate)}</p>
// //       </div>
// //     </div>
// //   </div>
// // </div>

// // <Separator />

// // {/* Test Results Preview */}
// // <div className="space-y-4">
// //   <h2 className="text-lg font-semibold">Test Results</h2>

// //   {report.tests.malarialParasites.selected && (
// //     <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
// //       {/* ⬆ force dark:text-gray-900 */}
// //       <p className="font-semibold">
// //         Malarial Parasites: {getResultBadge(report.tests.malarialParasites.result)}
// //       </p>
// //       <ul className="text-sm pl-4 list-disc">
// //         <li>P. falciparum: {getResultBadge(report.tests.malarialParasites.pFalciparumResult)}</li>
// //         <li>P. vivax: {getResultBadge(report.tests.malarialParasites.pVivaxResult)}</li>
// //       </ul>
// //       {report.tests.malarialParasites.parasiteDensity && (
// //         <p className="text-sm">Parasite Density: {report.tests.malarialParasites.parasiteDensity} parasites/µL</p>
// //       )}
// //     </div>
// //   )}

// //   {report.tests.dengueNS1.selected && (
// //     <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
// //       {/* ⬆ force dark:text-gray-900 */}
// //       <p className="font-semibold">
// //         Dengue NS1 Antigen: {getResultBadge(report.tests.dengueNS1.result)}
// //       </p>
// //     </div>
// //   )}
// // </div>


// //           <Separator />

// //           {/* Verification */}
// //           <div className="bg-slate-50 p-4 rounded-lg">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
// //               <div>
// //                 <p><span className="font-semibold">Laboratory Technician:</span> {report.technicianName}</p>
// //                 <p><span className="font-semibold">Verified By:</span> {report.verifiedBy}</p>
// //               </div>
// //               <div>
// //                 <p><span className="font-semibold">Verification Date:</span> {formatDateTime(report.verificationDate)}</p>
// //                 <p className="text-xs text-slate-500 mt-2">This report is computer generated and digitally verified</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Buttons */}
// //         <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t print:hidden">
// //           <Button onClick={exportToPDF} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
// //             <Download className="h-4 w-4" />
// //             Export PDF
// //           </Button>
// //           <Button variant="outline" onClick={handlePrintWithPDF} className="flex items-center gap-2 border-blue-200 text-blue-700">
// //             <Printer className="h-4 w-4" />
// //             Generate PDF & Print
// //           </Button>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// import { useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { LabReport } from "@/types/lab-report";
// import { FileText, Download, Printer, CheckCircle } from "lucide-react";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import { format } from "date-fns";

// interface ReportPreviewProps {
//   report: LabReport;
// }

// export function ReportPreview({ report }: ReportPreviewProps) {
//   const printRef = useRef<HTMLDivElement>(null);

//   const formatDateTime = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return format(date, "dd-MMM-yyyy HH:mm");
//     } catch {
//       return dateString;
//     }
//   };

//   const getResultBadge = (result?: string) => {
//     if (result === "Positive") return <Badge variant="destructive">Positive</Badge>;
//     if (result === "Negative") return <Badge className="bg-success text-success-foreground">Negative</Badge>;
//     return <Badge variant="secondary">Pending</Badge>;
//   };

//   const createLuxuryPDF = () => {
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     // Background + border
//     pdf.setFillColor(248, 250, 252);
//     pdf.rect(0, 0, pageWidth, pageHeight, 'F');
//     pdf.setDrawColor(59, 130, 246);
//     pdf.setLineWidth(0.5);
//     pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
//     pdf.setDrawColor(226, 232, 240);
//     pdf.setLineWidth(0.2);
//     pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

//     // Report title
//     pdf.setTextColor(30, 58, 138);
//     pdf.setFontSize(18);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('LABORATORY REPORT', pageWidth / 2, 68, { align: 'center' });
//     pdf.setDrawColor(147, 197, 253);
//     pdf.setLineWidth(0.3);
//     pdf.line(pageWidth / 2 - 45, 70, pageWidth / 2 + 45, 70);

//     // Report ID
//     pdf.setFillColor(239, 246, 255);
//     pdf.setDrawColor(147, 197, 253);
//     pdf.roundedRect(pageWidth / 2 - 30, 75, 60, 8, 2, 2, 'FD');
//     pdf.setTextColor(30, 58, 138);
//     pdf.setFontSize(10);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text(`Report ID: ${report.reportId}`, pageWidth / 2, 80.5, { align: 'center' });

//     // Patient Info
//     const patientSectionY = 95;
//     pdf.setFillColor(249, 250, 251);
//     pdf.setDrawColor(209, 213, 219);
//     pdf.roundedRect(20, patientSectionY, pageWidth - 40, 8, 1, 1, 'FD');
//     pdf.setTextColor(55, 65, 81);
//     pdf.setFontSize(12);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('PATIENT INFORMATION', 25, patientSectionY + 5.5);

//     pdf.setFontSize(10);
//     pdf.setFont('helvetica', 'normal');
//     const leftColX = 25;
//     const rightColX = pageWidth / 2 + 10;
//     let infoY = patientSectionY + 15;

//     // Left column
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Patient Name:', leftColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`${report.patient.name} ${report.patient.relation}`, leftColX + 30, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Age / Gender:', leftColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`${report.patient.age || 'N/A'} / ${report.patient.sex || 'N/A'}`, leftColX + 30, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Sample ID:', leftColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(report.patient.sampleId, leftColX + 30, infoY);

//     // Right column
//     infoY = patientSectionY + 15;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Referring Doctor:', rightColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(report.patient.referringDoctor, rightColX + 35, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Collection Date:', rightColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(formatDateTime(report.patient.collectionDateTime), rightColX + 35, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Report Date:', rightColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(formatDateTime(report.verificationDate), rightColX + 35, infoY);

//     // TEST RESULTS
//     const testsStartY = patientSectionY + 45;
//     pdf.setFillColor(249, 250, 251);
//     pdf.setDrawColor(209, 213, 219);
//     pdf.roundedRect(20, testsStartY, pageWidth - 40, 8, 1, 1, 'FD');
//     pdf.setTextColor(55, 65, 81);
//     pdf.setFontSize(12);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('LABORATORY RESULTS', 25, testsStartY + 5.5);

//     const tableRows: any[] = [];

//     // Malarial Parasites
//     if (report.tests.malarialParasites.selected) {
//       const result = report.tests.malarialParasites.result || "Pending";
//       const falciparum = report.tests.malarialParasites.pFalciparumResult ? `P. falciparum: ${report.tests.malarialParasites.pFalciparumResult}` : "P. falciparum: Pending";
//       const vivax = report.tests.malarialParasites.pVivaxResult ? `P. vivax: ${report.tests.malarialParasites.pVivaxResult}` : "P. vivax: Pending";
//       tableRows.push(["Malarial Parasites", result, "-", [falciparum, vivax].join("\n"), "-"]);
//       if (report.tests.malarialParasites.parasiteDensity) {
//         tableRows.push(["Parasite Density", `${report.tests.malarialParasites.parasiteDensity}`, "parasites/µL", "0", "⚠"]);
//       }
//     }

//     // Dengue NS1
//     if (report.tests.dengueNS1.selected) {
//       const result = report.tests.dengueNS1.result || "Pending";
//       tableRows.push(["Dengue NS1 Antigen", result, "-", "Negative", "-"]);
//     }

//     // Urine Test
//     if (report.tests.urine.selected) {
//       const u = report.tests.urine;
//       tableRows.push(
//         ["Urine Test", "-", "-", "-", "-"],
//         ["Color", u.color || "N/A", "-", "Normal", "-"],
//         ["Appearance", u.appearance || "N/A", "-", "Clear", "-"],
//         ["Specific Gravity", u.specificGravity || "N/A", "-", "1.005–1.030", "-"],
//         ["pH", u.pH || "N/A", "-", "4.6–8.0", "-"],
//         ["Protein", u.protein || "N/A", "-", "Negative", "-"],
//         ["RBCs", u.rbcs || "N/A", "-", "0–2 /hpf", "-"],
//         ["WBCs", u.wbcs || "N/A", "-", "0–5 /hpf", "-"],
//         ["Ketones", u.ketones || "N/A", "-", "Negative", "-"],
//         ["Urobilinogen", u.urobilinogen || "N/A", "-", "Normal", "-"]
//       );
//     }

//     autoTable(pdf, {
//       startY: testsStartY + 15,
//       margin: { left: 20, right: 20 },
//       head: [['Test Parameter', 'Result', 'Unit', 'Reference Range', 'Status']],
//       body: tableRows,
//       theme: 'grid',
//       styles: {
//         fontSize: 9,
//         cellPadding: 4,
//         fontStyle: 'normal',
//         textColor: [55, 65, 81],
//         lineColor: [209, 213, 219],
//         lineWidth: 0.1,
//       },
//       headStyles: {
//         fillColor: [30, 58, 138],
//         textColor: [255, 255, 255],
//         fontSize: 10,
//         fontStyle: 'bold',
//         halign: 'center'
//       },
//       columnStyles: { 0: { fontStyle: 'bold' }, 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center', fontSize: 12 } },
//       alternateRowStyles: { fillColor: [248, 250, 252] },
//     });

//     // Footer
//     const finalY = (pdf as any).lastAutoTable.finalY + 20;
//     pdf.setFillColor(239, 246, 255);
//     pdf.setDrawColor(147, 197, 253);
//     pdf.roundedRect(20, finalY, pageWidth - 40, 15, 2, 2, 'FD');
//     pdf.setTextColor(30, 58, 138);
//     pdf.setFontSize(9);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('VERIFIED & AUTHORIZED BY PATHOLOGIST', 25, finalY + 8);

//     pdf.setFillColor(254, 243, 199);
//     pdf.setDrawColor(245, 158, 11);
//     pdf.roundedRect(20, finalY + 30, pageWidth - 40, 12, 1, 1, 'FD');
//     pdf.setTextColor(146, 64, 14);
//     pdf.setFontSize(8);
//     pdf.setFont('helvetica', 'italic');
//     const maxWidth = pageWidth - 50;
//     pdf.text('This report is computer generated and digitally verified. No manual signature required.', 25, finalY + 35, { maxWidth });
//     pdf.text('All tests performed under strict quality control measures as per international standards.', 25, finalY + 38, { maxWidth });

//     pdf.setTextColor(156, 163, 175);
//     pdf.setFontSize(8);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`Generated on: ${formatDateTime(new Date().toISOString())}`, 20, pageHeight - 15);
//     pdf.text(`Page 1 of 1`, pageWidth - 30, pageHeight - 15);

//     return pdf;
//   };

//   const exportToPDF = () => {
//     const pdf = createLuxuryPDF();
//     pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
//   };

//   const handlePrintWithPDF = () => {
//     const pdf = createLuxuryPDF();
//     pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
//     setTimeout(() => window.print(), 1000);
//   };

//   return (
//     <Card className="report-shadow">
//       <CardHeader className="medical-gradient text-white">
//         <CardTitle className="flex items-center gap-2">
//           <FileText className="h-5 w-5" />
//           Report Preview
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-6">
//         <div ref={printRef} className="space-y-6 print:p-8">
//           {/* Patient Info */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold flex items-center gap-2">
//               Patient Information
//               <Badge variant="outline" className="text-xs">Verified</Badge>
//             </h2>
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border space-y-3 text-gray-900 dark:text-gray-900">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <p><span className="font-semibold text-blue-900">Patient:</span> {report.patient.name} {report.patient.relation}</p>
//                   <p><span className="font-semibold text-blue-900">Age/Sex:</span> {report.patient.age} / {report.patient.sex}</p>
//                   <p><span className="font-semibold text-blue-900">Sample ID:</span> {report.patient.sampleId}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p><span className="font-semibold text-blue-900">Referring Dr:</span> {report.patient.referringDoctor}</p>
//                   <p><span className="font-semibold text-blue-900">Collection:</span> {formatDateTime(report.patient.collectionDateTime)}</p>
//                   <p><span className="font-semibold text-blue-900">Report Date:</span> {formatDateTime(report.verificationDate)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Separator />

//           {/* Test Results Preview */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold">Test Results</h2>

//             {report.tests.malarialParasites.selected && (
//               <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
//                 <p className="font-semibold">
//                   Malarial Parasites: {getResultBadge(report.tests.malarialParasites.result)}
//                 </p>
//                 <ul className="text-sm pl-4 list-disc">
//                   <li>P. falciparum: {getResultBadge(report.tests.malarialParasites.pFalciparumResult)}</li>
//                   <li>P. vivax: {getResultBadge(report.tests.malarialParasites.pVivaxResult)}</li>
//                 </ul>
//                 {report.tests.malarialParasites.parasiteDensity && (
//                   <p className="text-sm">Parasite Density: {report.tests.malarialParasites.parasiteDensity} parasites/µL</p>
//                 )}
//               </div>
//             )}

//             {report.tests.dengueNS1.selected && (
//               <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
//                 <p className="font-semibold">
//                   Dengue NS1 Antigen: {getResultBadge(report.tests.dengueNS1.result)}
//                 </p>
//               </div>
//             )}

//             {report.tests.urine.selected && (
//               <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
//                 <p className="font-semibold">Urine Test:</p>
//                 <ul className="text-sm pl-4 list-disc">
//                   <li>Color: {report.tests.urine.color || "N/A"}</li>
//                   <li>Appearance: {report.tests.urine.appearance || "N/A"}</li>
//                   <li>Specific Gravity: {report.tests.urine.specificGravity || "N/A"}</li>
//                   <li>pH: {report.tests.urine.pH || "N/A"}</li>
//                   <li>Protein: {report.tests.urine.protein || "N/A"}</li>
//                   <li>RBCs: {report.tests.urine.rbcs || "N/A"}</li>
//                   <li>WBCs: {report.tests.urine.wbcs || "N/A"}</li>
//                   <li>Ketones: {report.tests.urine.ketones || "N/A"}</li>
//                   <li>Urobilinogen: {report.tests.urine.urobilinogen || "N/A"}</li>
//                 </ul>
//               </div>
//             )}
//           </div>

//           <Separator />

//           {/* Verification */}
//           <div className="bg-slate-50 p-4 rounded-lg">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
//               <div>
//                 <p><span className="font-semibold">Laboratory Technician:</span> {report.technicianName}</p>
//                 <p><span className="font-semibold">Verified By:</span> {report.verifiedBy}</p>
//               </div>
//               <div>
//                 <p><span className="font-semibold">Verification Date:</span> {formatDateTime(report.verificationDate)}</p>
//                 <p className="text-xs text-slate-500 mt-2">This report is computer generated and digitally verified</p>
//               </div>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t print:hidden">
//             <Button onClick={exportToPDF} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
//               <Download className="h-4 w-4" />
//               Export PDF
//             </Button>
//             <Button variant="outline" onClick={handlePrintWithPDF} className="flex items-center gap-2 border-blue-200 text-blue-700">
//               <Printer className="h-4 w-4" />
//               Generate PDF & Print
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// // }
// import { useRef, useState } from "react"; // ✅ add useState
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { LabReport } from "@/types/lab-report";
// import { FileText, Download, Printer, CheckCircle } from "lucide-react";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import { format } from "date-fns";

// interface ReportPreviewProps {
//   report: LabReport;
// }

// export function ReportPreview({ report }: ReportPreviewProps) {
//   const printRef = useRef<HTMLDivElement>(null);
//   const [doctorNotes, setDoctorNotes] = useState(report.notes || ""); // local state
//   const [editingNotes, setEditingNotes] = useState(false); // toggle edit mode
 

//   const formatDateTime = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return format(date, "dd-MMM-yyyy HH:mm");
//     } catch {
//       return dateString;
//     }
//   };

//   const getResultBadge = (result?: string) => {
//     if (result === "Positive") return <Badge variant="destructive">Positive</Badge>;
//     if (result === "Negative") return <Badge className="bg-success text-success-foreground">Negative</Badge>;
//     return <Badge variant="secondary">Pending</Badge>;
//   };

//   const createLuxuryPDF = () => {
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     // Background + border
//     pdf.setFillColor(248, 250, 252);
//     pdf.rect(0, 0, pageWidth, pageHeight, 'F');
//     pdf.setDrawColor(59, 130, 246);
//     pdf.setLineWidth(0.5);
//     pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
//     pdf.setDrawColor(226, 232, 240);
//     pdf.setLineWidth(0.2);
//     pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

//     // Report title
//     pdf.setTextColor(30, 58, 138);
//     pdf.setFontSize(18);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('LABORATORY REPORT', pageWidth / 2, 68, { align: 'center' });
//     pdf.setDrawColor(147, 197, 253);
//     pdf.setLineWidth(0.3);
//     pdf.line(pageWidth / 2 - 45, 70, pageWidth / 2 + 45, 70);

//     // Report ID
//     pdf.setFillColor(239, 246, 255);
//     pdf.setDrawColor(147, 197, 253);
//     pdf.roundedRect(pageWidth / 2 - 30, 75, 60, 8, 2, 2, 'FD');
//     pdf.setTextColor(30, 58, 138);
//     pdf.setFontSize(10);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text(`Report ID: ${report.reportId}`, pageWidth / 2, 80.5, { align: 'center' });

//     // Patient Info
//     const patientSectionY = 95;
//     pdf.setFillColor(249, 250, 251);
//     pdf.setDrawColor(209, 213, 219);
//     pdf.roundedRect(20, patientSectionY, pageWidth - 40, 8, 1, 1, 'FD');
//     pdf.setTextColor(55, 65, 81);
//     pdf.setFontSize(12);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('PATIENT INFORMATION', 25, patientSectionY + 5.5);

//     pdf.setFontSize(10);
//     pdf.setFont('helvetica', 'normal');
//     const leftColX = 25;
//     const rightColX = pageWidth / 2 + 10;
//     let infoY = patientSectionY + 15;

//     // Left column
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Patient Name:', leftColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`${report.patient.name} ${report.patient.relation}`, leftColX + 30, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Age / Gender:', leftColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`${report.patient.age || 'N/A'} / ${report.patient.sex || 'N/A'}`, leftColX + 30, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Sample ID:', leftColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(report.patient.sampleId, leftColX + 30, infoY);

//     // Right column
//     infoY = patientSectionY + 15;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Referring Doctor:', rightColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(report.patient.referringDoctor, rightColX + 35, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Collection Date:', rightColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(formatDateTime(report.patient.collectionDateTime), rightColX + 35, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Report Date:', rightColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(formatDateTime(report.verificationDate), rightColX + 35, infoY);

//     // TEST RESULTS
//     const testsStartY = patientSectionY + 45;
//     pdf.setFillColor(249, 250, 251);
//     pdf.setDrawColor(209, 213, 219);
//     pdf.roundedRect(20, testsStartY, pageWidth - 40, 8, 1, 1, 'FD');
//     pdf.setTextColor(55, 65, 81);
//     pdf.setFontSize(12);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('LABORATORY RESULTS', 25, testsStartY + 5.5);

//     const tableRows: any[] = [];

//     // Malarial Parasites
//     if (report.tests.malarialParasites.selected) {
//       const result = report.tests.malarialParasites.result || "Pending";
//       const falciparum = report.tests.malarialParasites.pFalciparumResult ? `P.falciparum: ${report.tests.malarialParasites.pFalciparumResult}` : "P. falciparum: Pending";
//       const vivax = report.tests.malarialParasites.pVivaxResult ? `P. vivax: ${report.tests.malarialParasites.pVivaxResult}` : "P. vivax: Pending";
//       tableRows.push(["Malarial Parasites", result, "-", [falciparum, vivax].join("\n"), "-"]);
//       if (report.tests.malarialParasites.parasiteDensity) {
//         tableRows.push(["Parasite Density", `${report.tests.malarialParasites.parasiteDensity}`, "parasites/µL", "0", "⚠"]);
//       }
//     }

//     // Dengue NS1
//     if (report.tests.dengueNS1.selected) {
//       const result = report.tests.dengueNS1.result || "Pending";
//       tableRows.push(["Dengue NS1 Antigen", result, "-", "Positive", "-"]);
//     }

//     if (report.notes) {
//       const notesY = (pdf as any).lastAutoTable.finalY + 15;
//       pdf.setFillColor(249, 250, 251);
//       pdf.setDrawColor(209, 213, 219);
//       pdf.roundedRect(20, notesY, pageWidth - 40, 20, 2, 2, 'FD');
    
//       pdf.setTextColor(55, 65, 81);
//       pdf.setFontSize(12);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Doctor’s Notes', 25, notesY + 7);
    
//       pdf.setFontSize(10);
//       pdf.setFont('helvetica', 'normal');
//       const maxWidth = pageWidth - 50;
//       pdf.text(report.notes, 25, notesY + 14, { maxWidth });
//     }

//  // ✅ Doctor's Notes
// // ✅ Doctor's Notes at bottom of page
// if (doctorNotes) {
//   const pageHeight = pdf.internal.pageSize.height;
//   const pageWidth = pdf.internal.pageSize.width;

//   const margin = 20;
//   const lineHeight = 6; // line spacing

//   pdf.setFont('helvetica', 'normal');
//   pdf.setFontSize(10);

//   // ✅ Split text into lines that fit page width
//   const wrappedText = pdf.splitTextToSize(doctorNotes, pageWidth - margin * 2 - 10);

//   // ✅ Calculate dynamic box height
//   const textHeight = wrappedText.length * lineHeight;
//   const titleHeight = 10;
//   const boxHeight = textHeight + titleHeight + 10; // padding

//   const notesY = pageHeight - boxHeight - margin;

//   // ✅ Draw box dynamically
//   pdf.setFillColor(255, 251, 235);
//   pdf.setDrawColor(202, 138, 4);
//   pdf.roundedRect(margin, notesY, pageWidth - margin * 2, boxHeight, 2, 2, 'FD');

//   // ✅ Title
//   pdf.setTextColor(133, 77, 14);
//   pdf.setFontSize(10);
//   pdf.setFont('helvetica', 'bold');
//   pdf.text("Doctor’s Notes:", margin + 5, notesY + 10);

//   // ✅ Body text
//   pdf.setFont('helvetica', 'normal');
//   pdf.setTextColor(0, 0, 0);
//   pdf.text(wrappedText, margin + 5, notesY + 20, {
//     maxWidth: pageWidth - margin * 2 - 10,
//     lineHeightFactor: 1.5,
//   });
// }
// if (report.tests.urine.selected) {
//   const u = report.tests.urine;

//   // ✅ Normal reference ranges (hardcoded)
//   const urineNormalRanges = [
//     "Volume: 800 – 2000 ",
//     "Color: Pale Yellow",
//     "Appearance: Clear",
//     "Sp Gr: 1.005 – 1.030",
//     "pH: 4.5 – 8.0",
//     "Protein: Negative",
//     "RBCs: 0 – 2 ",
//     "WBCs: 0 – 5 ",
//     "Ketones: Negative",
//     "Urobilinogen: 0.2 – 1.0 "
//   ].join("\n");

//   // ✅ Patient’s observed results (from input)
//   const urineResults = [
//     `Volume: ${u.volume || "N/A"}`,
//     `Color: ${u.color || "N/A"}`,
//     `Appearance: ${u.appearance || "N/A"}`,
//     `Specific Gravity: ${u.specificGravity || "N/A"}`,
//     `pH: ${u.pH || "N/A"}`,
//     `Protein: ${u.protein || "N/A"}`,
//     `RBCs: ${u.rbcs || "N/A"}`,
//     `WBCs: ${u.wbcs || "N/A"}`,
//     `Ketones: ${u.ketones || "N/A"}`,
//     `Urobilinogen: ${u.urobilinogen || "N/A"}`
//   ].join("\n");

//   // ✅ Push row into PDF table
//   tableRows.push([
//     "Urine Test",
//     urineResults,   // Normal Range column
//     [
//       "ml/24hr",
//       "-", 
//       "-",
//       "",
//       "",
//       "",
//       "/HPF",
//       "/HPF",
//       "",
//       "EU/dl"
//     ].join("\n"),       // Result column
//     urineNormalRanges,        // Result Details column
//     "-"                  // Remarks
//   ]);
// }

// autoTable(pdf, {
//   startY: testsStartY + 15,
//   margin: { left: 20, right: 20 },
//   head: [['Test Parameter', 'Result', 'Unit', 'Result Details', 'Status']],
//   body: tableRows,
//   theme: 'grid',
//   styles: {
//     fontSize: 9,
//     cellPadding: 3,
//     fontStyle: 'normal',
//     textColor: [55, 65, 81],
//     lineColor: [209, 213, 219],
//     lineWidth: 0.1,
//   },
//   headStyles: {
//     fillColor: [30, 58, 138],
//     textColor: [255, 255, 255],
//     fontSize: 10,
//     fontStyle: 'bold',
//     halign: 'center'
//   },
//   columnStyles: {
//     0: { fontStyle: 'bold', halign: 'left' },   // Test Parameter
//     1: { halign: 'center' },                    // Result (default center)
//     2: { halign: 'center' },                    // Normal Ranges
//     3: { halign: 'left' },                      // Result Details
//     4: { halign: 'center', fontSize: 12 }       // Status
//   },
//   alternateRowStyles: { fillColor: [248, 250, 252] },

//   didParseCell: function (data) {
//     // ✅ Make "Urine Test" Result column left-aligned only
//     if (data.column.index === 1 && data.row.raw[0] === "Urine Test") {
//       data.cell.styles.halign = 'left';
//     }

//     // ✅ Coloring for Positive/Negative
//     if (data.column.index === 1 && data.cell.text[0] === 'Positive') {
//       data.cell.styles.textColor = [220, 38, 38];
//       data.cell.styles.fontStyle = 'bold';
//     }
//     if (data.column.index === 1 && data.cell.text[0] === 'Negative') {
//       data.cell.styles.textColor = [22, 163, 74];
//       data.cell.styles.fontStyle = 'bold';
//     }
//   }
// });

    

//     // Footer
//     const finalY = (pdf as any).lastAutoTable.finalY + 20;
//     pdf.setTextColor(156, 163, 175);
//     pdf.setFontSize(8);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`Generated on: ${formatDateTime(new Date().toISOString())}`, 20, pageHeight - 15);
//     pdf.text(`Page 1 of 1`, pageWidth - 30, pageHeight - 15);

//     return pdf;
//   };

//   const exportToPDF = () => {
//     const pdf = createLuxuryPDF();
//     pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
//   };

//   const handlePrintWithPDF = () => {
//     const pdf = createLuxuryPDF();
//     pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
//     setTimeout(() => window.print(), 1000);
//   };

//   return (
//     <Card className="report-shadow">
//       <CardHeader className="medical-gradient text-white">
//         <CardTitle className="flex items-center gap-2">
//           <FileText className="h-5 w-5" />
//           Report Preview
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-6">
//         <div ref={printRef} className="space-y-6 print:p-8">
//           {/* Patient Info */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold flex items-center gap-2">
//               Patient Information
//               <Badge variant="outline" className="text-xs">Verified</Badge>
//             </h2>
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border space-y-3 text-gray-900 dark:text-gray-900">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <p><span className="font-semibold text-blue-900">Patient:</span> {report.patient.name} {report.patient.relation}</p>
//                   <p><span className="font-semibold text-blue-900">Age/Sex:</span> {report.patient.age} / {report.patient.sex}</p>
//                   <p><span className="font-semibold text-blue-900">Sample ID:</span> {report.patient.sampleId}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p><span className="font-semibold text-blue-900">Referring Dr:</span> {report.patient.referringDoctor}</p>
//                   <p><span className="font-semibold text-blue-900">Collection:</span> {formatDateTime(report.patient.collectionDateTime)}</p>
//                   <p><span className="font-semibold text-blue-900">Report Date:</span> {formatDateTime(report.verificationDate)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Separator />


        

//           {/* Test Results Preview */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold">Test Results</h2>

//             {report.tests.malarialParasites.selected && (
//               <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
//                 <p className="font-semibold">
//                   Malarial Parasites: {getResultBadge(report.tests.malarialParasites.result)}
//                 </p>
//                 <ul className="text-sm pl-4 list-disc">
//                   <li>P. falciparum: {getResultBadge(report.tests.malarialParasites.pFalciparumResult)}</li>
//                   <li>P. vivax: {getResultBadge(report.tests.malarialParasites.pVivaxResult)}</li>
//                 </ul>
//                 {report.tests.malarialParasites.parasiteDensity && (
//                   <p className="text-sm">Parasite Density: {report.tests.malarialParasites.parasiteDensity} parasites/µL</p>
//                 )}
//               </div>
//             )}

//             {report.tests.dengueNS1.selected && (
//               <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
//                 <p className="font-semibold">
//                   Dengue NS1 Antigen: {getResultBadge(report.tests.dengueNS1.result)}
//                 </p>
//               </div>
//             )}

//             {report.tests.urine.selected && (
//               <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
//                 <p className="font-semibold">Urine Test:</p>
//                 <ul className="text-sm pl-4 list-disc">
//                   <li>Color: {report.tests.urine.color || "N/A"}</li>
//                   <li>Appearance: {report.tests.urine.appearance || "N/A"}</li>
//                   <li>Specific Gravity: {report.tests.urine.specificGravity || "N/A"}</li>
//                   <li>pH: {report.tests.urine.pH || "N/A"}</li>
//                   <li>Protein: {report.tests.urine.protein || "N/A"}</li>
//                   <li>RBCs: {report.tests.urine.rbcs || "N/A"}</li>
//                   <li>WBCs: {report.tests.urine.wbcs || "N/A"}</li>
//                   <li>Ketones: {report.tests.urine.ketones || "N/A"}</li>
//                   <li>Urobilinogen: {report.tests.urine.urobilinogen || "N/A"}</li>
//                 </ul>
//               </div>
//             )}
//           </div>

//           <Separator />
//           <Separator />

// {/* Doctor’s Notes */}
// <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//   <div className="flex justify-between items-center mb-2">
//     <h2 className="text-lg font-semibold text-yellow-800">Doctor’s Notes</h2>
//     {!editingNotes && (
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => setEditingNotes(true)}
//         className="border-yellow-400 text-yellow-800"
//       >
//         Add / Edit Notes
//       </Button>
//     )}
//   </div>

//   {editingNotes ? (
//     <div className="space-y-2">
//       <textarea
//         value={doctorNotes}
//         onChange={(e) => setDoctorNotes(e.target.value)}
//         className="w-full p-2 border rounded-md text-sm"
//         rows={4}
//         placeholder="Write doctor’s notes here..."
//       />
//       <div className="flex gap-2">
//         <Button
//           size="sm"
//           className="bg-yellow-600 text-white"
//           onClick={() => setEditingNotes(false)}
//         >
//           Save
//         </Button>
//         <Button
//           size="sm"
//           variant="ghost"
//           onClick={() => {
//             setDoctorNotes("");
//             setEditingNotes(false);
//           }}
//         >
//           Cancel
//         </Button>
//       </div>
//     </div>
//   ) : (
//     <p className="text-sm text-gray-900 mt-2">
//       {doctorNotes || "No notes added."}
//     </p>
//   )}
// </div>

// <Separator />


//           {/* Verification */}
//           <div className="bg-slate-50 p-4 rounded-lg">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
//               <div>
//                 <p><span className="font-semibold">Laboratory Technician:</span> {report.technicianName}</p>
//                 <p><span className="font-semibold">Verified By:</span> {report.verifiedBy}</p>
//               </div>
//               <div>
//                 <p><span className="font-semibold">Verification Date:</span> {formatDateTime(report.verificationDate)}</p>
//                 <p className="text-xs text-slate-500 mt-2">This report is computer generated and digitally verified</p>
//               </div>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t print:hidden">
//             <Button onClick={exportToPDF} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
//               <Download className="h-4 w-4" />
//               Export PDF
//             </Button>
//             <Button variant="outline" onClick={handlePrintWithPDF} className="flex items-center gap-2 border-blue-200 text-blue-700">
//               <Printer className="h-4 w-4" />
//               Generate PDF & Print
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// import { jsPDF } from "jspdf";
// import autoTable, { RowInput } from "jspdf-autotable";
// import { useRef, useState } from "react"; // ✅ add useState
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { LabReport } from "@/types/lab-report";
// import { FileText, Download, Printer, CheckCircle } from "lucide-react";

// // import autoTable from "jspdf-autotable";
// import { format } from "date-fns";


// interface ReportPreviewProps {
//   report: LabReport;
// }

// export function ReportPreview({ report }: ReportPreviewProps) {
//   const printRef = useRef<HTMLDivElement>(null);
//   const [doctorNotes, setDoctorNotes] = useState(report.notes || ""); // local state
//   const [editingNotes, setEditingNotes] = useState(false); // toggle edit mode
//   const urineRows: any[] = [];
//   const otherRows: any[] = [];

//   const formatDateTime = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return format(date, "dd-MMM-yyyy HH:mm");
//     } catch {
//       return dateString;
//     }
//   };

//   const getResultBadge = (result?: string) => {
//     if (result === "Positive") return <Badge variant="destructive">Positive</Badge>;
//     if (result === "Negative") return <Badge className="bg-success text-success-foreground">Negative</Badge>;
//     return <Badge variant="secondary">Pending</Badge>;
//   };

//   const createLuxuryPDF = () => {
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     // Background + border
//     pdf.setFillColor(248, 250, 252);
//     pdf.rect(0, 0, pageWidth, pageHeight, 'F');
//     pdf.setDrawColor(59, 130, 246);
//     pdf.setLineWidth(0.5);
//     pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
//     pdf.setDrawColor(226, 232, 240);
//     pdf.setLineWidth(0.2);
//     pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

//     // Report title
//     pdf.setTextColor(30, 58, 138);
//     pdf.setFontSize(18);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('LABORATORY REPORT', pageWidth / 2, 68, { align: 'center' });
//     pdf.setDrawColor(147, 197, 253);
//     pdf.setLineWidth(0.3);
//     pdf.line(pageWidth / 2 - 45, 70, pageWidth / 2 + 45, 70);

//     // Report ID
//     pdf.setFillColor(239, 246, 255);
//     pdf.setDrawColor(147, 197, 253);
//     pdf.roundedRect(pageWidth / 2 - 30, 75, 60, 8, 2, 2, 'FD');
//     pdf.setTextColor(30, 58, 138);
//     pdf.setFontSize(10);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text(`Report ID: ${report.reportId}`, pageWidth / 2, 80.5, { align: 'center' });

//     // Patient Info
//     const patientSectionY = 95;
//     pdf.setFillColor(249, 250, 251);
//     pdf.setDrawColor(209, 213, 219);
//     pdf.roundedRect(20, patientSectionY, pageWidth - 40, 8, 1, 1, 'FD');
//     pdf.setTextColor(55, 65, 81);
//     pdf.setFontSize(12);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('PATIENT INFORMATION', 25, patientSectionY + 5.5);

//     pdf.setFontSize(10);
//     pdf.setFont('helvetica', 'normal');
//     const leftColX = 25;
//     const rightColX = pageWidth / 2 + 10;
//     let infoY = patientSectionY + 15;

//     // Left column
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Patient Name:', leftColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`${report.patient.name} ${report.patient.relation}`, leftColX + 30, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Age / Gender:', leftColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`${report.patient.age || 'N/A'} / ${report.patient.sex || 'N/A'}`, leftColX + 30, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Sample ID:', leftColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(report.patient.sampleId, leftColX + 30, infoY);

//     // Right column
//     infoY = patientSectionY + 15;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Referring Doctor:', rightColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(report.patient.referringDoctor, rightColX + 35, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Collection Date:', rightColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(formatDateTime(report.patient.collectionDateTime), rightColX + 35, infoY);

//     infoY += 6;
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('Report Date:', rightColX, infoY);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(formatDateTime(report.verificationDate), rightColX + 35, infoY);

//     // TEST RESULTS
//     const testsStartY = patientSectionY + 45;
//     pdf.setFillColor(249, 250, 251);
//     pdf.setDrawColor(209, 213, 219);
//     pdf.roundedRect(20, testsStartY, pageWidth - 40, 8, 1, 1, 'FD');
//     pdf.setTextColor(55, 65, 81);
//     pdf.setFontSize(12);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('LABORATORY RESULTS', 25, testsStartY + 5.5);

//     // const tableRows: any[] = [];
//     const urineRows: any[] = [];
//     const otherRows: any[] = [];

//     // ---- Malarial Parasites ----
//     if (report.tests.malarialParasites.selected) {
//       const result = report.tests.malarialParasites.result || "Pending";
//       const falciparum = report.tests.malarialParasites.pFalciparumResult ? `P.falciparum: ${report.tests.malarialParasites.pFalciparumResult}` : "P. falciparum: Pending";
//       const vivax = report.tests.malarialParasites.pVivaxResult ? `P. vivax: ${report.tests.malarialParasites.pVivaxResult}` : "P. vivax: Pending";
//       otherRows.push(["Malarial Parasites", result, "-", [falciparum, vivax].join("\n"), "-"]);
//       if (report.tests.malarialParasites.parasiteDensity) {
//         otherRows.push(["Parasite Density", `${report.tests.malarialParasites.parasiteDensity}`, "parasites/µL", "0", "⚠"]);
//       }
//     }

//     // ---- Dengue ----
//     if (report.tests.dengueNS1.selected) {
//       const result = report.tests.dengueNS1.result || "Pending";
//       otherRows.push(["Dengue NS1 Antigen", result, "-", "Positive", "-"]);
//     }

//     // ---- Urine Test ----
//     import jsPDF from "jspdf";
//     import autoTable, { RowInput } from "jspdf-autotable";
    
//     // ... inside your function/component
    
//     if (report.tests.urine?.selected) {
//       const u = report.tests.urine;
    
//       const urineSections = [
//         {
//           heading: "Physical Examination",
//           fields: [
//             { param: "Volume", result: u.volume || "N/A", unit: "ml", normal: "800 – 2000 ml / 24hr" },
//             { param: "Colour", result: u.colour || "N/A", unit: "-", normal: "Pale Yellow - Yellow" },
//             { param: "Appearance", result: u.appearance || "N/A", unit: "-", normal: "Clear" },
//             { param: "Specific Gravity", result: u.specificGravity || "N/A", unit: "-", normal: "1.005 – 1.025" },
//             { param: "Reaction pH", result: u.pH || "N/A", unit: "-", normal: "5.0 – 8.0" },
//           ],
//         },
//         {
//           heading: "Chemical Examination",
//           fields: [
//             { param: "Protein", result: u.protein || "N/A", unit: "-", normal: "Negative" },
//             { param: "Glucose", result: u.glucose || "N/A", unit: "-", normal: "Negative" },
//             { param: "Ketone Bodies", result: u.ketoneBodies || "N/A", unit: "-", normal: "Negative" },
//             { param: "Urobilinogen", result: u.urobilinogen || "N/A", unit: "-", normal: "Normal" },
//             { param: "Bilirubin", result: u.bilirubin || "N/A", unit: "-", normal: "Negative" },
//             { param: "Haemoglobin", result: u.haemoglobin || "N/A", unit: "-", normal: "Negative" },
//             { param: "Nitrite", result: u.nitrite || "N/A", unit: "-", normal: "Negative" },
//           ],
//         },
//         {
//           heading: "Microscopic Examination",
//           fields: [
//             { param: "RBCs", result: u.rbcs || "N/A", unit: "/HPF", normal: "0 – 2 /HPF" },
//             { param: "WBCs", result: u.wbcs || "N/A", unit: "/HPF", normal: "0 – 4 /HPF" },
//             { param: "Leukocytes", result: u.leukocytes || "N/A", unit: "/HPF", normal: "0 – 4 /HPF" },
//             { param: "Epithelial Cells", result: u.epithelialCells || "N/A", unit: "/HPF", normal: "0 – 4 /HPF" },
//             { param: "Bacteria", result: u.bacteria || "N/A", unit: "-", normal: "Nil" },
//             { param: "Yeast", result: u.yeast || "N/A", unit: "-", normal: "Nil" },
//             { param: "Casts", result: u.casts || "N/A", unit: "/LPF", normal: "Nil /LPF" },
//             { param: "Crystals", result: u.crystals || "N/A", unit: "-", normal: "Nil" },
//             { param: "Others", result: u.others || "N/A", unit: "-", normal: "Nil" },
//           ],
//         },
//       ];
    
//       const urineRows: RowInput[] = [];
    
//       urineSections.forEach((section, sIndex) => {
//         // ✅ Bold heading row with colSpan
//         urineRows.push([
//           {
//             content: (sIndex === 0 ? "Urine DA - " : "") + section.heading,
//             colSpan: 6,
//             styles: {
//               fontStyle: "bold",
//               halign: "left",
//               fillColor: [240, 240, 240],
//               textColor: [0, 0, 0],
//             },
//           },
//         ]);
    
//         // ✅ Add fields
//         section.fields.forEach((field) => {
//           urineRows.push([
//             "",
//             field.param,
//             field.result,
//             field.unit,
//             field.normal,
//             "", // Status column blank for now
//           ]);
//         });
//       });
    
//       if (urineRows.length > 0) {
//         const pdf = new jsPDF(); // ✅ make sure this is jsPDF, not HTMLElement
    
//         autoTable(pdf, {
//           startY: testsStartY + 15,
//           margin: { left: 20, right: 20 },
//           head: [["Test", "Parameter", "Result", "Unit", "Normal Range", "Status"]],
//           body: urineRows,
//           theme: "grid",
//           styles: { fontSize: 9, cellPadding: 0.5, textColor: [55, 65, 81] },
//           headStyles: {
//             fillColor: [30, 58, 138],
//             textColor: [255, 255, 255],
//             fontSize: 10,
//             fontStyle: "bold",
//             halign: "center",
//           },
//           columnStyles: {
//             0: { fontStyle: "bold", halign: "left" },
//             1: { halign: "left" },
//             2: { halign: "center" },
//             3: { halign: "center" },
//             4: { halign: "left" },
//             5: { halign: "center" },
//           },
//           alternateRowStyles: { fillColor: [248, 250, 252] },
//         });
    
//         pdf.save("urine-report.pdf"); // ✅ no more TS error
//       }
//     }
    

//     // ---- Render other tests table if exists ----
//     if (otherRows.length > 0) {
//       autoTable(pdf, {
//         startY: (pdf as any).lastAutoTable ? (pdf as any).lastAutoTable.finalY + 15 : testsStartY + 15,
//         margin: { left: 20, right: 20 },
//         head: [['Test Parameter', 'Result', 'Unit', 'Result Details', 'Status']],
//         body: otherRows,
//         theme: 'grid',
//         styles: { fontSize: 9, cellPadding: 3, textColor: [55, 65, 81] },
//         headStyles: {
//           fillColor: [30, 58, 138],
//           textColor: [255, 255, 255],
//           fontSize: 10,
//           fontStyle: 'bold',
//           halign: 'center'
//         },
//         columnStyles: {
//           0: { fontStyle: 'bold', halign: 'left' },
//           1: { halign: 'center' },
//           2: { halign: 'center' },
//           3: { halign: 'left' },
//           4: { halign: 'center', fontSize: 12 }
//         },
//         alternateRowStyles: { fillColor: [248, 250, 252] }
//       });
//     }


    

//     // Footer
//     const finalY = (pdf as any).lastAutoTable.finalY + 20;
//     pdf.setTextColor(156, 163, 175);
//     pdf.setFontSize(8);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`Generated on: ${formatDateTime(new Date().toISOString())}`, 20, pageHeight - 15);
//     pdf.text(`Page 1 of 1`, pageWidth - 30, pageHeight - 15);

//     return pdf;
//   };

//   const exportToPDF = () => {
//     const pdf = createLuxuryPDF();
//     pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
//   };

//   const handlePrintWithPDF = () => {
//     const pdf = createLuxuryPDF();
//     pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
//     setTimeout(() => window.print(), 1000);
//   };

//   return (
//     <Card className="report-shadow">
//       <CardHeader className="medical-gradient text-white">
//         <CardTitle className="flex items-center gap-2">
//           <FileText className="h-5 w-5" />
//           Report Preview
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-6">
//         <div ref={printRef} className="space-y-6 print:p-8">
//           {/* Patient Info */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold flex items-center gap-2">
//               Patient Information
//               <Badge variant="outline" className="text-xs">Verified</Badge>
//             </h2>
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border space-y-3 text-gray-900 dark:text-gray-900">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <p><span className="font-semibold text-blue-900">Patient:</span> {report.patient.name} {report.patient.relation}</p>
//                   <p><span className="font-semibold text-blue-900">Age/Sex:</span> {report.patient.age} / {report.patient.sex}</p>
//                   <p><span className="font-semibold text-blue-900">Sample ID:</span> {report.patient.sampleId}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p><span className="font-semibold text-blue-900">Referring Dr:</span> {report.patient.referringDoctor}</p>
//                   <p><span className="font-semibold text-blue-900">Collection:</span> {formatDateTime(report.patient.collectionDateTime)}</p>
//                   <p><span className="font-semibold text-blue-900">Report Date:</span> {formatDateTime(report.verificationDate)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Separator />


        

//           {/* Test Results Preview */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold">Test Results</h2>

//             {report.tests.malarialParasites.selected && (
//               <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
//                 <p className="font-semibold">
//                   Malarial Parasites: {getResultBadge(report.tests.malarialParasites.result)}
//                 </p>
//                 <ul className="text-sm pl-4 list-disc">
//                   <li>P. falciparum: {getResultBadge(report.tests.malarialParasites.pFalciparumResult)}</li>
//                   <li>P. vivax: {getResultBadge(report.tests.malarialParasites.pVivaxResult)}</li>
//                 </ul>
//                 {report.tests.malarialParasites.parasiteDensity && (
//                   <p className="text-sm">Parasite Density: {report.tests.malarialParasites.parasiteDensity} parasites/µL</p>
//                 )}
//               </div>
//             )}

//             {report.tests.dengueNS1.selected && (
//               <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
//                 <p className="font-semibold">
//                   Dengue NS1 Antigen: {getResultBadge(report.tests.dengueNS1.result)}
//                 </p>
//               </div>
//             )}

// {report.tests.urine.selected && (
//   <div className="bg-slate-50 p-4 rounded-lg border space-y-3 text-gray-900 dark:text-gray-900">
//     <p className="font-semibold text-lg">Urine Test:</p>

//     {/* 🔹 Physical Examination */}
//     <div>
//       <p className="font-medium text-gray-700">Physical Examination</p>
//       <ul className="text-sm pl-5 list-disc">
//         <li>Volume: {report.tests.urine.volume || "N/A"}</li>
//         <li>Color: {report.tests.urine.colour || "N/A"}</li>
//         <li>Appearance: {report.tests.urine.appearance || "N/A"}</li>
//         <li>Specific Gravity: {report.tests.urine.specificGravity || "N/A"}</li>
//         <li>pH: {report.tests.urine.pH || "N/A"}</li>
//       </ul>
//     </div>

//     {/* 🔹 Chemical Examination */}
//     <div>
//       <p className="font-medium text-gray-700">Chemical Examination</p>
//       <ul className="text-sm pl-5 list-disc">
//         <li>Protein: {report.tests.urine.protein || "N/A"}</li>
//         <li>Glucose: {report.tests.urine.glucose || "N/A"}</li>
//         <li>Ketone Bodies: {report.tests.urine.ketoneBodies || "N/A"}</li>
//         <li>Urobilinogen: {report.tests.urine.urobilinogen || "N/A"}</li>
//         <li>Bilirubin: {report.tests.urine.bilirubin || "N/A"}</li>
//         <li>Haemoglobin: {report.tests.urine.haemoglobin || "N/A"}</li>
//         <li>Nitrite: {report.tests.urine.nitrite || "N/A"}</li>
//       </ul>
//     </div>

//     {/* 🔹 Microscopic Examination */}
//     <div>
//       <p className="font-medium text-gray-700">Microscopic Examination</p>
//       <ul className="text-sm pl-5 list-disc">
//         <li>RBCs: {report.tests.urine.rbcs || "N/A"}</li>
//         <li>WBCs: {report.tests.urine.wbcs || "N/A"}</li>
//         <li>Leukocytes: {report.tests.urine.leukocytes || "N/A"}</li>
//         <li>Epithelial Cells: {report.tests.urine.epithelialCells || "N/A"}</li>
//         <li>Bacteria: {report.tests.urine.bacteria || "N/A"}</li>
//         <li>Yeast: {report.tests.urine.yeast || "N/A"}</li>
//         <li>Casts: {report.tests.urine.casts || "N/A"}</li>
//         <li>Crystals: {report.tests.urine.crystals || "N/A"}</li>
//         <li>Others: {report.tests.urine.others || "N/A"}</li>
//       </ul>
//     </div>
//   </div>
// )}

//           </div>

//           <Separator />
//           <Separator />

// {/* Doctor’s Notes */}
// <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//   <div className="flex justify-between items-center mb-2">
//     <h2 className="text-lg font-semibold text-yellow-800">Doctor’s Notes</h2>
//     {!editingNotes && (
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => setEditingNotes(true)}
//         className="border-yellow-400 text-yellow-800"
//       >
//         Add / Edit Notes
//       </Button>
//     )}
//   </div>

//   {editingNotes ? (
//     <div className="space-y-2">
//       <textarea
//         value={doctorNotes}
//         onChange={(e) => setDoctorNotes(e.target.value)}
//         className="w-full p-2 border rounded-md text-sm"
//         rows={4}
//         placeholder="Write doctor’s notes here..."
//       />
//       <div className="flex gap-2">
//         <Button
//           size="sm"
//           className="bg-yellow-600 text-white"
//           onClick={() => setEditingNotes(false)}
//         >
//           Save
//         </Button>
//         <Button
//           size="sm"
//           variant="ghost"
//           onClick={() => {
//             setDoctorNotes("");
//             setEditingNotes(false);
//           }}
//         >
//           Cancel
//         </Button>
//       </div>
//     </div>
//   ) : (
//     <p className="text-sm text-gray-900 mt-2">
//       {doctorNotes || "No notes added."}
//     </p>
//   )}
// </div>

// <Separator />


//           {/* Verification */}
//           <div className="bg-slate-50 p-4 rounded-lg">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
//               <div>
//                 <p><span className="font-semibold">Laboratory Technician:</span> {report.technicianName}</p>
//                 <p><span className="font-semibold">Verified By:</span> {report.verifiedBy}</p>
//               </div>
//               <div>
//                 <p><span className="font-semibold">Verification Date:</span> {formatDateTime(report.verificationDate)}</p>
//                 <p className="text-xs text-slate-500 mt-2">This report is computer generated and digitally verified</p>
//               </div>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t print:hidden">
//             <Button onClick={exportToPDF} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
//               <Download className="h-4 w-4" />
//               Export PDF
//             </Button>
//             <Button variant="outline" onClick={handlePrintWithPDF} className="flex items-center gap-2 border-blue-200 text-blue-700">
//               <Printer className="h-4 w-4" />
//               Generate PDF & Print
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


// ReportPreview.tsx
import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LabReport } from "@/types/lab-report";
import { FileText, Download, Printer, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface ReportPreviewProps {
  report: LabReport;
}

export function ReportPreview({ report }: ReportPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [doctorNotes, setDoctorNotes] = useState(report.notes || "");
  const [editingNotes, setEditingNotes] = useState(false);

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd-MMM-yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  const getResultBadge = (result?: string) => {
    if (result === "Positive") return <Badge variant="destructive">Positive</Badge>;
    if (result === "Negative") return <Badge className="bg-success text-success-foreground">Negative</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  // -------------------------
  // PDF builder
  // -------------------------
  const createLuxuryPDF = () => {
    // create jsPDF instance
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Background + border
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.5);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.2);
    pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Report title
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("LABORATORY REPORT", pageWidth / 2, 68, { align: "center" });
    pdf.setDrawColor(147, 197, 253);
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth / 2 - 45, 70, pageWidth / 2 + 45, 70);

    // Report ID
    pdf.setFillColor(239, 246, 255);
    pdf.setDrawColor(147, 197, 253);
    pdf.roundedRect(pageWidth / 2 - 30, 75, 60, 8, 2, 2, "FD");
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Report ID: ${report.reportId}`, pageWidth / 2, 80.5, { align: "center" });

    // Patient Info
    const patientSectionY = 95;
    pdf.setFillColor(249, 250, 251);
    pdf.setDrawColor(209, 213, 219);
    pdf.roundedRect(20, patientSectionY, pageWidth - 40, 8, 1, 1, "FD");
    pdf.setTextColor(55, 65, 81);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("PATIENT INFORMATION", 25, patientSectionY + 5.5);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const leftColX = 25;
    const rightColX = pageWidth / 2 + 10;
    let infoY = patientSectionY + 15;

    // Left column
    pdf.setFont("helvetica", "bold");
    pdf.text("Patient Name:", leftColX, infoY);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${report.patient.name} ${report.patient.relation}`, leftColX + 30, infoY);

    infoY += 6;
    pdf.setFont("helvetica", "bold");
    pdf.text("Age / Gender:", leftColX, infoY);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${report.patient.age || "N/A"} / ${report.patient.sex || "N/A"}`, leftColX + 30, infoY);

    infoY += 6;
    pdf.setFont("helvetica", "bold");
    pdf.text("Sample ID:", leftColX, infoY);
    pdf.setFont("helvetica", "normal");
    pdf.text(report.patient.sampleId, leftColX + 30, infoY);

    // Right column
    infoY = patientSectionY + 15;
    pdf.setFont("helvetica", "bold");
    pdf.text("Referring Doctor:", rightColX, infoY);
    pdf.setFont("helvetica", "normal");
    pdf.text(report.patient.referringDoctor, rightColX + 35, infoY);

    infoY += 6;
    pdf.setFont("helvetica", "bold");
    pdf.text("Collection Date:", rightColX, infoY);
    pdf.setFont("helvetica", "normal");
    pdf.text(formatDateTime(report.patient.collectionDateTime), rightColX + 35, infoY);

    infoY += 6;
    pdf.setFont("helvetica", "bold");
    pdf.text("Report Date:", rightColX, infoY);
    pdf.setFont("helvetica", "normal");
    pdf.text(formatDateTime(report.verificationDate), rightColX + 35, infoY);

    // TEST RESULTS header
    const testsStartY = patientSectionY + 45;
    pdf.setFillColor(249, 250, 251);
    pdf.setDrawColor(209, 213, 219);
    pdf.roundedRect(20, testsStartY, pageWidth - 40, 8, 1, 1, "FD");
    pdf.setTextColor(55, 65, 81);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("LABORATORY RESULTS", 25, testsStartY + 5.5);

    // ----- Build table rows for tests -----
    const urineRows: RowInput[] = [];
    const otherRows: any[] = [];

    // Malarial Parasites
    if (report.tests.malarialParasites.selected) {
      const result = report.tests.malarialParasites.result || "Pending";
      const falciparum = report.tests.malarialParasites.pFalciparumResult
        ? `P.falciparum: ${report.tests.malarialParasites.pFalciparumResult}`
        : "P. falciparum: Pending";
      const vivax = report.tests.malarialParasites.pVivaxResult
        ? `P. vivax: ${report.tests.malarialParasites.pVivaxResult}`
        : "P. vivax: Pending";

      otherRows.push(["Malarial Parasites", result, "-", [falciparum, vivax].join("\n"), "-"]);
      if (report.tests.malarialParasites.parasiteDensity) {
        otherRows.push(["Parasite Density", `${report.tests.malarialParasites.parasiteDensity}`, "parasites/µL", "0", "⚠"]);
      }
    }

    // Dengue
    if (report.tests.dengueNS1.selected) {
      const result = report.tests.dengueNS1.result || "Pending";
      otherRows.push(["Dengue NS1 Antigen", result, "-", "Positive", "-"]);
    }

    // Urine Test (grouped)
    if (report.tests.urine?.selected) {
      const u = report.tests.urine;

      const urineSections = [
        {
          heading: "Physical Examination",
          fields: [
            { param: "Volume", result: u.volume || "N/A", unit: "ml", normal: "800 – 2000 ml / 24hr" },
            { param: "Colour", result: u.colour || "N/A", unit: "-", normal: "Pale Yellow - Yellow" },
            { param: "Appearance", result: u.appearance || "N/A", unit: "-", normal: "Clear" },
            { param: "Specific Gravity", result: u.specificGravity || "N/A", unit: "-", normal: "1.005 – 1.025" },
            { param: "Reaction pH", result: u.pH || "N/A", unit: "-", normal: "5.0 – 8.0" },
          ],
        },
        {
          heading: "Chemical Examination",
          fields: [
            { param: "Protein", result: u.protein || "N/A", unit: "-", normal: "Negative" },
            { param: "Glucose", result: u.glucose || "N/A", unit: "-", normal: "Negative" },
            { param: "Ketone Bodies", result: u.ketoneBodies || "N/A", unit: "-", normal: "Negative" },
            { param: "Urobilinogen", result: u.urobilinogen || "N/A", unit: "-", normal: "Normal" },
            { param: "Bilirubin", result: u.bilirubin || "N/A", unit: "-", normal: "Negative" },
            { param: "Haemoglobin", result: u.haemoglobin || "N/A", unit: "-", normal: "Negative" },
            { param: "Nitrite", result: u.nitrite || "N/A", unit: "-", normal: "Negative" },
          ],
        },
        {
          heading: "Microscopic Examination",
          fields: [
            { param: "RBCs", result: u.rbcs || "N/A", unit: "/HPF", normal: "0 – 2 /HPF" },
            { param: "WBCs", result: u.wbcs || "N/A", unit: "/HPF", normal: "0 – 4 /HPF" },
            { param: "Leukocytes", result: u.leukocytes || "N/A", unit: "/HPF", normal: "0 – 4 /HPF" },
            { param: "Epithelial Cells", result: u.epithelialCells || "N/A", unit: "/HPF", normal: "0 – 4 /HPF" },
            { param: "Bacteria", result: u.bacteria || "N/A", unit: "-", normal: "Nil" },
            { param: "Yeast", result: u.yeast || "N/A", unit: "-", normal: "Nil" },
            { param: "Casts", result: u.casts || "N/A", unit: "/LPF", normal: "Nil /LPF" },
            { param: "Crystals", result: u.crystals || "N/A", unit: "-", normal: "Nil" },
            { param: "Others", result: u.others || "N/A", unit: "-", normal: "Nil" },
          ],
        },
      ];

      // urineSections.forEach((section, sIndex) => {
      //   // Heading row spanning all columns (bold + bg)
      //   urineRows.push([
      //     {
      //       content: (sIndex === 0 ? "Urine DA - " : "") + section.heading,
      //       colSpan: 6,
      //       styles: {
      //         fontStyle: "bold",
      //         halign: "left",
      //         fillColor: [240, 240, 240],
      //         textColor: [0, 0, 0],
      //       },
      //     },
      //   ]);

      //   // Data rows for fields
      //   section.fields.forEach((field) => {
      //     urineRows.push([
      //       "", // Test column (left empty because heading spans)
      //       field.param,
      //       field.result,
      //       field.unit,
      //       field.normal,
      //       "", // Status
      //     ]);
      //   });
      // });
      urineSections.forEach((section, sIndex) => {
        if (sIndex === 0) {
          // ✅ Full-row "Urine DA" heading
          urineRows.push([
            {
              content: "Urine Analysis",
              colSpan: 6, // span across all columns
              styles: {
                fontStyle: "bold",
                halign: "left",
                fillColor: [200, 200, 200], // grey background
                textColor: [0, 0, 0],
              },
            },
          ]);
        }
      
        // ✅ Section Heading row (inside Parameter column → Status)
        urineRows.push([
          "", // keep Test column empty
          {
            content: section.heading,
            colSpan: 5, // Parameter → Status
            styles: {
              fontStyle: "bold",
              halign: "left",
              fillColor: [240, 240, 240], // light grey
              textColor: [0, 0, 0],
            },
          },
        ]);
      
        // ✅ Section fields
        section.fields.forEach((field) => {
          urineRows.push([
            "", // Test column stays empty
            field.param,
            field.result,
            field.unit,
            field.normal,
            "", // Status blank
          ]);
        });
      });
      
      
      

    }

    // Render urine table if exists
    // if (urineRows.length > 0) {
    //   autoTable(pdf, {
    //     startY: testsStartY + 15,
    //     margin: { left: 20, right: 20 },
    //     head: [["Test", "Parameter", "Result", "Unit", "Normal Range", "Status"]],
    //     body: urineRows,
    //     theme: "grid",
    //     styles: { fontSize: 9, cellPadding: 0.5, textColor: [55, 65, 81] },
    //     headStyles: {
    //       fillColor: [30, 58, 138],
    //       textColor: [255, 255, 255],
    //       fontSize: 10,
    //       fontStyle: "bold",
    //       halign: "center",
    //     },
    //     columnStyles: {
    //       0: { fontStyle: "bold", halign: "left" },
    //       1: { halign: "left" },
    //       2: { halign: "center" },
    //       3: { halign: "center" },
    //       4: { halign: "left" },
    //       5: { halign: "center" },
    //     },
    //     alternateRowStyles: { fillColor: [248, 250, 252] },
    //   });
    // }

    autoTable(pdf, {
      startY: testsStartY + 15,
      margin: { left: 20, right: 20 },
      head: [["Test", "Parameter", "Result", "Unit", "Normal Range", "Status"]],
      body: urineRows,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 0.5, textColor: [55, 65, 81] },
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "left" },
        5: { halign: "center" },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    

    // Render other tests table if exists
    if (otherRows.length > 0) {
      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable ? (pdf as any).lastAutoTable.finalY + 15 : testsStartY + 15,
        margin: { left: 20, right: 20 },
        head: [["Test Parameter", "Result", "Unit", "Result Details", "Status"]],
        body: otherRows,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3, textColor: [55, 65, 81] },
        headStyles: {
          fillColor: [30, 58, 138],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { fontStyle: "bold", halign: "left" },
          1: { halign: "center" },
          2: { halign: "center" },
          3: { halign: "left" },
          4: { halign: "center", fontSize: 12 },
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });
    }

    // Footer
    const finalY = (pdf as any).lastAutoTable ? (pdf as any).lastAutoTable.finalY + 20 : pageHeight - 30;
    pdf.setTextColor(156, 163, 175);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Generated on: ${formatDateTime(new Date().toISOString())}`, 20, pageHeight - 15);
    pdf.text(`Page 1 of 1`, pageWidth - 30, pageHeight - 15);

    return pdf;
  };

  // Export handlers
  const exportToPDF = () => {
    const pdf = createLuxuryPDF();
    pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
  };

  const handlePrintWithPDF = () => {
    const pdf = createLuxuryPDF();
    pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
    setTimeout(() => window.print(), 1000);
  };

  // -------------------------
  // JSX preview UI (unchanged except removed stray vars)
  // -------------------------
  return (
    <Card className="report-shadow">
      <CardHeader className="medical-gradient text-white">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Report Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div ref={printRef} className="space-y-6 print:p-8">
          {/* Patient Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Patient Information
              <Badge variant="outline" className="text-xs">Verified</Badge>
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border space-y-3 text-gray-900 dark:text-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><span className="font-semibold text-blue-900">Patient:</span> {report.patient.name} {report.patient.relation}</p>
                  <p><span className="font-semibold text-blue-900">Age/Sex:</span> {report.patient.age} / {report.patient.sex}</p>
                  <p><span className="font-semibold text-blue-900">Sample ID:</span> {report.patient.sampleId}</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-semibold text-blue-900">Referring Dr:</span> {report.patient.referringDoctor}</p>
                  <p><span className="font-semibold text-blue-900">Collection:</span> {formatDateTime(report.patient.collectionDateTime)}</p>
                  <p><span className="font-semibold text-blue-900">Report Date:</span> {formatDateTime(report.verificationDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Test Results Preview */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Test Results</h2>

            {report.tests.malarialParasites.selected && (
              <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
                <p className="font-semibold">
                  Malarial Parasites: {getResultBadge(report.tests.malarialParasites.result)}
                </p>
                <ul className="text-sm pl-4 list-disc">
                  <li>P. falciparum: {getResultBadge(report.tests.malarialParasites.pFalciparumResult)}</li>
                  <li>P. vivax: {getResultBadge(report.tests.malarialParasites.pVivaxResult)}</li>
                </ul>
                {report.tests.malarialParasites.parasiteDensity && (
                  <p className="text-sm">Parasite Density: {report.tests.malarialParasites.parasiteDensity} parasites/µL</p>
                )}
              </div>
            )}

            {report.tests.dengueNS1.selected && (
              <div className="bg-slate-50 p-4 rounded-lg border space-y-2 text-gray-900 dark:text-gray-900">
                <p className="font-semibold">
                  Dengue NS1 Antigen: {getResultBadge(report.tests.dengueNS1.result)}
                </p>
              </div>
            )}

            {report.tests.urine.selected && (
              <div className="bg-slate-50 p-4 rounded-lg border space-y-3 text-gray-900 dark:text-gray-900">
                <p className="font-semibold text-lg">Urine Test:</p>

                {/* 🔹 Physical Examination */}
                <div>
                  <p className="font-medium text-gray-700">Physical Examination</p>
                  <ul className="text-sm pl-5 list-disc">
                    <li>Volume: {report.tests.urine.volume || "N/A"}</li>
                    <li>Color: {report.tests.urine.colour || "N/A"}</li>
                    <li>Appearance: {report.tests.urine.appearance || "N/A"}</li>
                    <li>Specific Gravity: {report.tests.urine.specificGravity || "N/A"}</li>
                    <li>pH: {report.tests.urine.pH || "N/A"}</li>
                  </ul>
                </div>

                {/* 🔹 Chemical Examination */}
                <div>
                  <p className="font-medium text-gray-700">Chemical Examination</p>
                  <ul className="text-sm pl-5 list-disc">
                    <li>Protein: {report.tests.urine.protein || "N/A"}</li>
                    <li>Glucose: {report.tests.urine.glucose || "N/A"}</li>
                    <li>Ketone Bodies: {report.tests.urine.ketoneBodies || "N/A"}</li>
                    <li>Urobilinogen: {report.tests.urine.urobilinogen || "N/A"}</li>
                    <li>Bilirubin: {report.tests.urine.bilirubin || "N/A"}</li>
                    <li>Haemoglobin: {report.tests.urine.haemoglobin || "N/A"}</li>
                    <li>Nitrite: {report.tests.urine.nitrite || "N/A"}</li>
                  </ul>
                </div>

                {/* 🔹 Microscopic Examination */}
                <div>
                  <p className="font-medium text-gray-700">Microscopic Examination</p>
                  <ul className="text-sm pl-5 list-disc">
                    <li>RBCs: {report.tests.urine.rbcs || "N/A"}</li>
                    <li>WBCs: {report.tests.urine.wbcs || "N/A"}</li>
                    <li>Leukocytes: {report.tests.urine.leukocytes || "N/A"}</li>
                    <li>Epithelial Cells: {report.tests.urine.epithelialCells || "N/A"}</li>
                    <li>Bacteria: {report.tests.urine.bacteria || "N/A"}</li>
                    <li>Yeast: {report.tests.urine.yeast || "N/A"}</li>
                    <li>Casts: {report.tests.urine.casts || "N/A"}</li>
                    <li>Crystals: {report.tests.urine.crystals || "N/A"}</li>
                    <li>Others: {report.tests.urine.others || "N/A"}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <Separator />
          <Separator />

          {/* Doctor’s Notes */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-yellow-800">Doctor’s Notes</h2>
              {!editingNotes && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingNotes(true)}
                  className="border-yellow-400 text-yellow-800"
                >
                  Add / Edit Notes
                </Button>
              )}
            </div>

            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  rows={4}
                  placeholder="Write doctor’s notes here..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-yellow-600 text-white"
                    onClick={() => setEditingNotes(false)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setDoctorNotes("");
                      setEditingNotes(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-900 mt-2">
                {doctorNotes || "No notes added."}
              </p>
            )}
          </div>

          <Separator />

          {/* Verification */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <p><span className="font-semibold">Laboratory Technician:</span> {report.technicianName}</p>
                <p><span className="font-semibold">Verified By:</span> {report.verifiedBy}</p>
              </div>
              <div>
                <p><span className="font-semibold">Verification Date:</span> {formatDateTime(report.verificationDate)}</p>
                <p className="text-xs text-slate-500 mt-2">This report is computer generated and digitally verified</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t print:hidden">
            <Button onClick={exportToPDF} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handlePrintWithPDF} className="flex items-center gap-2 border-blue-200 text-blue-700">
              <Printer className="h-4 w-4" />
              Generate PDF & Print
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
