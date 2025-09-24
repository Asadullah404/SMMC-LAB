// import { useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { LabReport } from "@/types/lab-report";
// import { FileText, Download, Printer, CheckCircle, XCircle } from "lucide-react";
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

//   const createLuxuryPDF = () => {
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     // Add luxury gradient background
//     pdf.setFillColor(248, 250, 252); // Light blue-gray background
//     pdf.rect(0, 0, pageWidth, pageHeight, 'F');

//     // Add elegant border
//     pdf.setDrawColor(59, 130, 246); // Professional blue
//     pdf.setLineWidth(0.5);
//     pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

//     // Inner border for premium look
//     pdf.setDrawColor(226, 232, 240);
//     pdf.setLineWidth(0.2);
//     pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

//     // PREMIUM HEADER SECTION
//     // Header background with gradient effect
//     // pdf.setFillColor(30, 58, 138); // Deep professional blue
//     pdf.roundedRect(15, 15, pageWidth - 30, 35, 3, 3, 'F');

//     // Company/Lab logo area (simulated with elegant text)

//     // pdf.setTextColor(255, 255, 255);
//     // pdf.setFontSize(24);
//     // pdf.setFont('helvetica', 'bold');
//     // pdf.text('PREMIUM DIAGNOSTICS', pageWidth / 2, 25, { align: 'center' });
    
//     // pdf.setFontSize(11);
//     // pdf.setFont('helvetica', 'normal');
//     // pdf.text('Advanced Laboratory Services', pageWidth / 2, 32, { align: 'center' });
    
//     // pdf.setFontSize(9);
//     // pdf.text('ISO 15189 Certified Laboratory', pageWidth / 2, 38, { align: 'center' });
    
//     // // Decorative line under header
//     // pdf.setDrawColor(59, 130, 246);
//     // pdf.setLineWidth(0.8);
//     // pdf.line(15, 55, pageWidth - 15, 55);

//     // REPORT TITLE SECTION
//     pdf.setTextColor(30, 58, 138);
//     pdf.setFontSize(18);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('LABORATORY REPORT', pageWidth / 2, 68, { align: 'center' });
    
//     // Elegant underline
//     pdf.setDrawColor(147, 197, 253);
//     pdf.setLineWidth(0.3);
//     pdf.line(pageWidth / 2 - 45, 70, pageWidth / 2 + 45, 70);

//     // Report ID in elegant box
//     pdf.setFillColor(239, 246, 255);
//     pdf.setDrawColor(147, 197, 253);
//     pdf.roundedRect(pageWidth / 2 - 30, 75, 60, 8, 2, 2, 'FD');
//     pdf.setTextColor(30, 58, 138);
//     pdf.setFontSize(10);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text(`Report ID: ${report.reportId}`, pageWidth / 2, 80.5, { align: 'center' });

//     // PATIENT INFORMATION SECTION
//     const patientSectionY = 95;
    
//     // Section header with background
//     pdf.setFillColor(249, 250, 251);
//     pdf.setDrawColor(209, 213, 219);
//     pdf.roundedRect(20, patientSectionY, pageWidth - 40, 8, 1, 1, 'FD');
//     pdf.setTextColor(55, 65, 81);
//     pdf.setFontSize(12);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('PATIENT INFORMATION', 25, patientSectionY + 5.5);

//     // Patient info in elegant two-column layout
//     pdf.setFontSize(10);
//     pdf.setFont('helvetica', 'normal');
//     pdf.setTextColor(75, 85, 99);
    
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

//     // TEST RESULTS SECTION
//     const testsStartY = patientSectionY + 45;
    
//     // Section header
//     pdf.setFillColor(249, 250, 251);
//     pdf.setDrawColor(209, 213, 219);
//     pdf.roundedRect(20, testsStartY, pageWidth - 40, 8, 1, 1, 'FD');
//     pdf.setTextColor(55, 65, 81);
//     pdf.setFontSize(12);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('LABORATORY RESULTS', 25, testsStartY + 5.5);

//     // Prepare table data
//     const tableRows: any[] = [];

//     if (report.tests.malarialParasites.selected) {
//       const result = report.tests.malarialParasites.result || "Pending";
    
//       // Build species result string (always include both)
//       const falciparum =
//         result === "Positive" &&
//         report.tests.malarialParasites.species.includes("P. falciparum")
//           ? "P. falciparum: Positive"
//           : "P. falciparum: Negitive";
    
//       const vivax =
//         result === "Positive" &&
//         report.tests.malarialParasites.species.includes("P. vivax")
//           ? "P. vivax: Positive"
//           : "P. vivax: Negitive";
    
//           const speciesSummary = [falciparum, vivax].join("\n");
    
//       // Single row for Malarial Parasites
//       tableRows.push([
//         "Malarial Parasites",
//         result,
//         "-",
//         speciesSummary, // ✅ stacked vertically
//         result === "Positive" ? "-" : result === "Negative" ? "✓" : "⏳",
//       ]);
    
//       // Parasite density if available
//       if (report.tests.malarialParasites.parasiteDensity) {
//         tableRows.push([
//           `Parasite Density`,
//           `${report.tests.malarialParasites.parasiteDensity}`,
//           "parasites/µL",
//           "0",
//           "⚠"
//         ]);
//       }
//     }
    

//     if (report.tests.dengueNS1.selected) {
//       const result = report.tests.dengueNS1.result || "Pending";
//       tableRows.push([
//         "Dengue NS1 Antigen",
//         result,
//         "-",
//         "Negative",
//         result === "Positive" ? "⚠" : result === "Negative" ? "✓" : "⏳"
//       ]);
//     }

//     // Create luxury table with full width
//     autoTable(pdf, {
//       startY: testsStartY + 15,
//       margin: { left: 20, right: 20 }, // Full width from margin to margin
//       head: [['Test Parameter', 'Result', 'Unit', 'Reference Range', 'Status']],
//       body: tableRows,
//       theme: 'grid',
//       tableWidth: 'auto', // Use full available width
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
//       columnStyles: {
//         0: { fontStyle: 'bold' },
//         1: { halign: 'center' },
//         2: { halign: 'center' },
//         3: { halign: 'center' },
//         4: { halign: 'center', fontSize: 12 }
//       },
//       alternateRowStyles: {
//         fillColor: [248, 250, 252]
//       },
//       didParseCell: function(data) {
//         // Style positive results
//         if (data.column.index === 1 && data.cell.text[0] === 'Positive') {
//           data.cell.styles.textColor = [220, 38, 38]; // Red
//           data.cell.styles.fontStyle = 'bold';
//         }
//         // Style negative results
//         if (data.column.index === 1 && data.cell.text[0] === 'Negative') {
//           data.cell.styles.textColor = [22, 163, 74]; // Green
//           data.cell.styles.fontStyle = 'bold';
//         }
//       }
//     });

//     // FOOTER SECTION
//     const finalY = (pdf as any).lastAutoTable.finalY + 20;
    
//     // Verification section with elegant styling
//     pdf.setFillColor(239, 246, 255);
//     pdf.setDrawColor(147, 197, 253);
//     pdf.roundedRect(20, finalY, pageWidth - 40, 15, 2, 2, 'FD');
    
//     pdf.setTextColor(30, 58, 138);
//     pdf.setFontSize(9);
//     pdf.setFont('helvetica', 'bold');
//     pdf.text('VERIFIED & AUTHORIZED BY PATHOLOGIST', 25, finalY + 8);
    
//     // pdf.setFontSize(9);
//     // pdf.setFont('helvetica', 'normal');
//     // pdf.setTextColor(75, 85, 99);
//     // pdf.text(`Laboratory Technician: ${report.technicianName}`, 25, finalY + 14);
//     // // pdf.text(`Verified & Authorized by: ${report.verifiedBy}`, 25, finalY + 18);
//     // pdf.text(`Verification Date: ${formatDateTime(report.verificationDate)}`, 25, finalY + 22);

//     // Quality assurance note - fixed to stay within box
//     pdf.setFillColor(254, 243, 199);
//     pdf.setDrawColor(245, 158, 11);
//     pdf.roundedRect(20, finalY + 30, pageWidth - 40, 12, 1, 1, 'FD');
    
//     pdf.setTextColor(146, 64, 14);
//     pdf.setFontSize(8);
//     pdf.setFont('helvetica', 'italic');
//     // Ensure text stays within the yellow box boundaries
//     const maxWidth = pageWidth - 50; // Leave 5mm margin on each side from box edges
//     pdf.text('This report is computer generated and digitally verified. No manual signature required.', 25, finalY + 35, { maxWidth: maxWidth });
//     pdf.text('All tests performed under strict quality control measures as per international standards.', 25, finalY + 38, { maxWidth: maxWidth });

//     // Footer with timestamp
//     pdf.setTextColor(156, 163, 175);
//     pdf.setFontSize(8);
//     pdf.setFont('helvetica', 'normal');
//     pdf.text(`Generated on: ${formatDateTime(new Date().toISOString())}`, 20, pageHeight - 15);
//     pdf.text(`Page 1 of 1`, pageWidth - 30, pageHeight - 15);

//     // Elegant corner decorations
//     pdf.setDrawColor(147, 197, 253);
//     pdf.setLineWidth(1);
//     // Top left
//     pdf.line(15, 15, 25, 15);
//     pdf.line(15, 15, 15, 25);
//     // Top right
//     pdf.line(pageWidth - 25, 15, pageWidth - 15, 15);
//     pdf.line(pageWidth - 15, 15, pageWidth - 15, 25);
//     // Bottom left
//     pdf.line(15, pageHeight - 25, 15, pageHeight - 15);
//     pdf.line(15, pageHeight - 15, 25, pageHeight - 15);
//     // Bottom right
//     pdf.line(pageWidth - 25, pageHeight - 15, pageWidth - 15, pageHeight - 15);
//     pdf.line(pageWidth - 15, pageHeight - 25, pageWidth - 15, pageHeight - 15);

//     return pdf;
//   };

//   const exportToPDF = () => {
//     const pdf = createLuxuryPDF();
//     pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
//   };

//   const handlePrintWithPDF = () => {
//     // First create and download the PDF
//     const pdf = createLuxuryPDF();
//     pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
    
//     // Then open print dialog after a short delay
//     setTimeout(() => {
//       window.print();
//     }, 1000);
//   };

//   const getResultIcon = (result?: string) => {
//     if (result === "Positive") return <XCircle className="h-4 w-4 text-destructive" />;
//     if (result === "Negative") return <CheckCircle className="h-4 w-4 text-success" />;
//     return null;
//   };

//   const getResultBadge = (result?: string) => {
//     if (result === "Positive") return <Badge variant="destructive">Positive</Badge>;
//     if (result === "Negative") return <Badge className="bg-success text-success-foreground">Negative</Badge>;
//     return <Badge variant="secondary">Pending</Badge>;
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
//           {/* PREVIEW UI same as before */}
//           <div className="text-center space-y-2">
//             <h1 className="text-2xl font-bold tracking-wide">PREMIUM LABORATORY REPORT</h1>
//             <p className="text-sm text-muted-foreground">Report ID: {report.reportId}</p>
//             <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
//               <CheckCircle className="h-3 w-3" />
//               ISO 15189 Certified
//             </div>
//           </div>

//           <Separator />

//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold flex items-center gap-2">
//               Patient Information
//               <Badge variant="outline" className="text-xs">Verified</Badge>
//             </h2>
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 space-y-3">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <p className="flex items-center gap-2">
//                     <span className="font-semibold text-blue-900 min-w-[100px]">Patient:</span> 
//                     <span className="text-gray-800">{report.patient.name} {report.patient.relation}</span>
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <span className="font-semibold text-blue-900 min-w-[100px]">Age/Sex:</span> 
//                     <span className="text-gray-800">{report.patient.age} / {report.patient.sex}</span>
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <span className="font-semibold text-blue-900 min-w-[100px]">Sample ID:</span> 
//                     <span className="text-gray-800 font-mono">{report.patient.sampleId}</span>
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="flex items-center gap-2">
//                     <span className="font-semibold text-blue-900 min-w-[120px]">Referring Dr:</span> 
//                     <span className="text-gray-800">{report.patient.referringDoctor}</span>
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <span className="font-semibold text-blue-900 min-w-[120px]">Collection:</span> 
//                     <span className="text-gray-800">{formatDateTime(report.patient.collectionDateTime)}</span>
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <span className="font-semibold text-blue-900 min-w-[120px]">Report Date:</span> 
//                     <span className="text-gray-800">{formatDateTime(report.verificationDate)}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Separator />

//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold">Test Results</h2>
//             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
//               <p className="text-sm text-amber-800 flex items-center gap-2">
//                 <FileText className="h-4 w-4" />
//                 Complete formatted results with professional styling available in PDF export
//               </p>
//             </div>
//           </div>

//           <Separator />

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
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t print:hidden">
//           <Button onClick={exportToPDF} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
//             <Download className="h-4 w-4" />
//             Export  PDF
//           </Button>
//           <Button variant="outline" onClick={handlePrintWithPDF} className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
//             <Printer className="h-4 w-4" />
//             Generate PDF & Print
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }



import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LabReport } from "@/types/lab-report";
import { FileText, Download, Printer, CheckCircle, XCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface ReportPreviewProps {
  report: LabReport;
}

export function ReportPreview({ report }: ReportPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd-MMM-yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  const createLuxuryPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Background + border
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.5);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.2);
    pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Report title
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LABORATORY REPORT', pageWidth / 2, 68, { align: 'center' });
    pdf.setDrawColor(147, 197, 253);
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth / 2 - 45, 70, pageWidth / 2 + 45, 70);

    // Report ID
    pdf.setFillColor(239, 246, 255);
    pdf.setDrawColor(147, 197, 253);
    pdf.roundedRect(pageWidth / 2 - 30, 75, 60, 8, 2, 2, 'FD');
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Report ID: ${report.reportId}`, pageWidth / 2, 80.5, { align: 'center' });

    // Patient Information
    const patientSectionY = 95;
    pdf.setFillColor(249, 250, 251);
    pdf.setDrawColor(209, 213, 219);
    pdf.roundedRect(20, patientSectionY, pageWidth - 40, 8, 1, 1, 'FD');
    pdf.setTextColor(55, 65, 81);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PATIENT INFORMATION', 25, patientSectionY + 5.5);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(75, 85, 99);
    const leftColX = 25;
    const rightColX = pageWidth / 2 + 10;
    let infoY = patientSectionY + 15;

    // Left column
    pdf.setFont('helvetica', 'bold');
    pdf.text('Patient Name:', leftColX, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${report.patient.name} ${report.patient.relation}`, leftColX + 30, infoY);

    infoY += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Age / Gender:', leftColX, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${report.patient.age || 'N/A'} / ${report.patient.sex || 'N/A'}`, leftColX + 30, infoY);

    infoY += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Sample ID:', leftColX, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(report.patient.sampleId, leftColX + 30, infoY);

    // Right column
    infoY = patientSectionY + 15;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Referring Doctor:', rightColX, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(report.patient.referringDoctor, rightColX + 35, infoY);

    infoY += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Collection Date:', rightColX, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatDateTime(report.patient.collectionDateTime), rightColX + 35, infoY);

    infoY += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Report Date:', rightColX, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatDateTime(report.verificationDate), rightColX + 35, infoY);

    // TEST RESULTS
    const testsStartY = patientSectionY + 45;
    pdf.setFillColor(249, 250, 251);
    pdf.setDrawColor(209, 213, 219);
    pdf.roundedRect(20, testsStartY, pageWidth - 40, 8, 1, 1, 'FD');
    pdf.setTextColor(55, 65, 81);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LABORATORY RESULTS', 25, testsStartY + 5.5);

    const tableRows: any[] = [];

    if (report.tests.malarialParasites.selected) {
      const result = report.tests.malarialParasites.result || "Pending";

      const falciparum =
        report.tests.malarialParasites.pFalciparumResult
          ? `P. falciparum: ${report.tests.malarialParasites.pFalciparumResult}`
          : "P. falciparum: Pending";

      const vivax =
        report.tests.malarialParasites.pVivaxResult
          ? `P. vivax: ${report.tests.malarialParasites.pVivaxResult}`
          : "P. vivax: Pending";

      const speciesSummary = [falciparum, vivax].join("\n");

      tableRows.push([
        "Malarial Parasites",
        result,
        "-",
        speciesSummary,
        result === "Positive" ? "-" : result === "Negative" ? "-" : "⏳",
      ]);

      if (report.tests.malarialParasites.parasiteDensity) {
        tableRows.push([
          `Parasite Density`,
          `${report.tests.malarialParasites.parasiteDensity}`,
          "parasites/µL",
          "0",
          "⚠"
        ]);
      }
    }

    if (report.tests.dengueNS1.selected) {
      const result = report.tests.dengueNS1.result || "Pending";
      tableRows.push([
        "Dengue NS1 Antigen",
        result,
        "-",
        "Negative",
        result === "Positive" ? "-" : result === "Negative" ? "-" : "⏳"
      ]);
    }

    autoTable(pdf, {
      startY: testsStartY + 15,
      margin: { left: 20, right: 20 },
      head: [['Test Parameter', 'Result', 'Unit', 'Reference Range', 'Status']],
      body: tableRows,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        fontStyle: 'normal',
        textColor: [55, 65, 81],
        lineColor: [209, 213, 219],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center', fontSize: 12 }
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didParseCell: function (data) {
        if (data.column.index === 1 && data.cell.text[0] === 'Positive') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
        if (data.column.index === 1 && data.cell.text[0] === 'Negative') {
          data.cell.styles.textColor = [22, 163, 74];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    // FOOTER
    const finalY = (pdf as any).lastAutoTable.finalY + 20;
    pdf.setFillColor(239, 246, 255);
    pdf.setDrawColor(147, 197, 253);
    pdf.roundedRect(20, finalY, pageWidth - 40, 15, 2, 2, 'FD');
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('VERIFIED & AUTHORIZED BY PATHOLOGIST', 25, finalY + 8);

    pdf.setFillColor(254, 243, 199);
    pdf.setDrawColor(245, 158, 11);
    pdf.roundedRect(20, finalY + 30, pageWidth - 40, 12, 1, 1, 'FD');
    pdf.setTextColor(146, 64, 14);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    const maxWidth = pageWidth - 50;
    pdf.text('This report is computer generated and digitally verified. No manual signature required.', 25, finalY + 35, { maxWidth });
    pdf.text('All tests performed under strict quality control measures as per international standards.', 25, finalY + 38, { maxWidth });

    pdf.setTextColor(156, 163, 175);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${formatDateTime(new Date().toISOString())}`, 20, pageHeight - 15);
    pdf.text(`Page 1 of 1`, pageWidth - 30, pageHeight - 15);

    return pdf;
  };

  const exportToPDF = () => {
    const pdf = createLuxuryPDF();
    pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
  };

  const handlePrintWithPDF = () => {
    const pdf = createLuxuryPDF();
    pdf.save(`Lab_Report_${report.reportId}_Premium.pdf`);
    setTimeout(() => window.print(), 1000);
  };

  const getResultBadge = (result?: string) => {
    if (result === "Positive") return <Badge variant="destructive">Positive</Badge>;
    if (result === "Negative") return <Badge className="bg-success text-success-foreground">Negative</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

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
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-wide">SMMC LABORATORY REPORT</h1>
            <p className="text-sm text-muted-foreground">Report ID: {report.reportId}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              ISO 15189 Certified
            </div>
          </div>

          <Separator />
{/* Patient Info */}
<div className="space-y-4">
  <h2 className="text-lg font-semibold flex items-center gap-2">
    Patient Information
    <Badge variant="outline" className="text-xs">Verified</Badge>
  </h2>
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 space-y-3 
                  text-gray-900 dark:text-gray-900"> 
    {/* ⬆ force dark:text-gray-900 so text stays dark in dark mode */}
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
      {/* ⬆ force dark:text-gray-900 */}
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
      {/* ⬆ force dark:text-gray-900 */}
      <p className="font-semibold">
        Dengue NS1 Antigen: {getResultBadge(report.tests.dengueNS1.result)}
      </p>
    </div>
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
      </CardContent>
    </Card>
  );
}

