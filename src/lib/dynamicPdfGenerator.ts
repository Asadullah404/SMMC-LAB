// src/lib/dynamicPdfGenerator.ts
import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { format } from "date-fns";
import { TestTemplate, CanvasTemplate, DynamicReportRecord } from "@/types/dynamic-test";

interface GeneratePdfOptions {
  report: DynamicReportRecord;
  tests: TestTemplate[];
  template?: CanvasTemplate;
  showOnlyPatientName?: boolean;
}

interface JsPDFExtended extends jsPDF {
  setGState: (state: unknown) => void;
  GState: new (options: { opacity: number }) => unknown;
  lastAutoTable?: { finalY: number };
}

/**
 * Generates and downloads a clinical laboratory report PDF in Green & White theme.
 * Adheres strictly to the user requirements:
 * 1. File is saved with the name: [Patient_Name].pdf
 * 2. If showOnlyPatientName is enabled, the report header displays ONLY the patient's name.
 * 3. Styled with the clinical Green & White medical theme.
 */
export async function generateDynamicReportPDF({
  report,
  tests,
  template,
  showOnlyPatientName = false,
}: GeneratePdfOptions): Promise<jsPDF> {
  const doc = new jsPDF("p", "mm", "a4");
  const extDoc = doc as unknown as JsPDFExtended;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background subtle fill (pure crisp white)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Luxury Medical Green Borders
  doc.setDrawColor(5, 150, 105); // Emerald-600
  doc.setLineWidth(0.5);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setDrawColor(167, 243, 208); // Emerald-200
  doc.setLineWidth(0.2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // 1. Watermark Layer
  try {
    const response = await fetch("/logo.png");
    if (response.ok) {
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const logoSize = 130;
      const x = (pageWidth - logoSize) / 2;
      const y = (pageHeight - logoSize) / 2;

      extDoc.setGState(new extDoc.GState({ opacity: 0.05 }));
      doc.addImage(base64, "PNG", x, y, logoSize, logoSize);
      extDoc.setGState(new extDoc.GState({ opacity: 1 }));
    }
  } catch (_err) {
    // Continue if watermark is unavailable
  }

  // 2. Header
  let yPos = 18;
  try {
    const headerResp = await fetch("/header.png");
    if (headerResp.ok) {
      const blob = await headerResp.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      const headerH = 26;
      doc.addImage(base64, "PNG", 12, 12, pageWidth - 24, headerH);
      yPos = 12 + headerH + 6;
    } else {
      throw new Error("No header image");
    }
  } catch {
    doc.setTextColor(30, 64, 175); // Royal Medical Blue
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SMMC DIAGNOSTIC LABORATORY", pageWidth / 2, yPos, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Accredited Clinical Pathology & Diagnostic Services", pageWidth / 2, yPos + 4, { align: "center" });
    yPos += 10;
  }

  // Report Title Badge & Report ID (Royal Blue Styled)
  doc.setFillColor(239, 246, 255); // Blue-50
  doc.setDrawColor(191, 219, 254); // Blue-200
  doc.roundedRect(pageWidth / 2 - 45, yPos, 90, 7, 2, 2, "FD");
  doc.setTextColor(29, 78, 216); // Blue-700
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`REPORT ID: ${report.reportId}`, pageWidth / 2, yPos + 4.8, { align: "center" });
  yPos += 12;

  // 3. Patient Information Section
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.setLineWidth(0.3);

  // Determine if template overrides showOnlyPatientName
  const onlyPatientName = showOnlyPatientName || 
    template?.blocks.find((b) => b.type === "patient-info")?.config.showOnlyPatientName || 
    false;

  if (onlyPatientName) {
    // Compact Box with ONLY the Patient Name
    doc.roundedRect(12, yPos, pageWidth - 24, 12, 1.5, 1.5, "FD");
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Name:", 16, yPos + 7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(29, 78, 216);
    doc.setFontSize(12);
    doc.text(report.patient.name, 45, yPos + 7.5);
    yPos += 16;
  } else {
    // Full Patient Information Box
    doc.roundedRect(12, yPos, pageWidth - 24, 24, 1.5, 1.5, "FD");

    const leftX = 16;
    const midX = pageWidth / 2 + 6;
    let lineY = yPos + 6;

    // Line 1
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Patient Name:", leftX, lineY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(29, 78, 216); // Royal Blue
    doc.text(`${report.patient.name} ${report.patient.relation ? `(${report.patient.relation})` : ""}`, leftX + 26, lineY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Referring Doctor:", midX, lineY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(report.patient.referringDoctor || "Self", midX + 30, lineY);

    // Line 2
    lineY += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Age / Gender:", leftX, lineY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(`${report.patient.age ?? "-"} / ${report.patient.sex ?? "-"}`, leftX + 26, lineY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Collection Date:", midX, lineY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(formatDateTime(report.patient.collectionDateTime), midX + 30, lineY);

    // Line 3
    lineY += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 78, 59);
    doc.text("Sample ID:", leftX, lineY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(report.patient.sampleId, leftX + 26, lineY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 78, 59);
    doc.text("Report Date:", midX, lineY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(formatDateTime(report.verificationDate), midX + 30, lineY);

    yPos += 28;
  }

  // 4. Test Results Tables (Emerald Theme)
  for (const test of tests) {
    const testResults = report.results[test.id] || {};
    const tableRows: RowInput[] = [];

    // Header banner for each test
    tableRows.push([
      {
        content: `${test.name.toUpperCase()} ${test.method ? `(${test.method})` : ""}`,
        colSpan: 5,
        styles: {
          fontStyle: "bold",
          fontSize: 9.5,
          halign: "left",
          fillColor: [209, 250, 229], // Emerald-100
          textColor: [6, 78, 59],     // Emerald-900
        },
      },
    ]);

    // Group by section or output fields
    const sections = test.sections && test.sections.length > 0 
      ? test.sections 
      : [{ id: "main", name: "", order: 1 }];

    for (const sec of sections) {
      const secFields = test.fields.filter(
        (f) => (sec.name ? f.section === sec.name : true)
      );

      if (secFields.length === 0) continue;

      if (sec.name) {
        tableRows.push([
          {
            content: `• ${sec.name}`,
            colSpan: 5,
            styles: {
              fontStyle: "bold",
              fontSize: 8.5,
              fillColor: [239, 246, 255], // Blue-50
              textColor: [30, 64, 175],   // Blue-800
            },
          },
        ]);
      }

      for (const field of secFields) {
        const val = testResults[field.key];
        const displayVal = val !== undefined && val !== null && val !== "" ? String(val) : "-";
        const unit = field.unit || "-";
        const refRange = field.referenceRange || "-";

        let status = "Normal";
        if (field.options) {
          const matchOpt = field.options.find((o) => o.value === displayVal);
          if (matchOpt?.isAbnormal) status = "Abnormal";
        } else if (displayVal === "Positive" || displayVal === "Reactive") {
          status = "Abnormal";
        }

        tableRows.push([
          field.label,
          displayVal,
          unit,
          refRange,
          status,
        ]);
      }
    }

    autoTable(doc, {
      startY: yPos,
      margin: { left: 12, right: 12 },
      head: [["Test Parameter", "Observed Result", "Unit", "Biological Reference Range", "Status"]],
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 8.5,
        cellPadding: 2.5,
        textColor: [15, 23, 42],
        lineColor: [226, 232, 240], // Slate-200
        lineWidth: 0.15,
      },
      headStyles: {
        fillColor: [29, 78, 216], // Royal Sapphire Blue #1d4ed8
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { fontStyle: "bold", halign: "left", cellWidth: 55 },
        1: { halign: "center", cellWidth: 40 },
        2: { halign: "center", cellWidth: 25 },
        3: { halign: "center", cellWidth: 42 },
        4: { halign: "center", cellWidth: 24 },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didParseCell: (data) => {
        if (data.column.index === 1 || data.column.index === 4) {
          const cellText = String(data.cell.text?.[0] || "");
          if (cellText === "Positive" || cellText === "Reactive" || cellText === "Abnormal") {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fontStyle = "bold";
          } else if (cellText === "Negative" || cellText === "Non-Reactive" || cellText === "Normal") {
            data.cell.styles.textColor = [29, 78, 216]; // Royal Blue
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    yPos = (extDoc.lastAutoTable ? extDoc.lastAutoTable.finalY : yPos + 40) + 6;
  }

  // 5. Clinical / Doctor Notes
  const notesText = report.notes || template?.blocks.find((b) => b.type === "doctor-notes")?.config.customText;
  if (notesText) {
    if (yPos > pageHeight - 45) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(12, yPos, pageWidth - 24, 14, 1.5, 1.5, "FD");

    doc.setTextColor(6, 78, 59);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text("Clinical Notes / Interpretation:", 16, yPos + 4.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(notesText, 16, yPos + 9.5, { maxWidth: pageWidth - 32 });
    yPos += 18;
  }

  // 6. Verification and Footer
  const footerY = Math.max(yPos + 4, pageHeight - 25);
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.setLineWidth(0.2);
  doc.line(12, footerY, pageWidth - 12, footerY);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175); // Royal Blue
  doc.text(`Lab Technician: ${report.technicianName || "Staff"}`, 14, footerY + 5);
  doc.text(`Verified By: ${report.verifiedBy || "Dr. Aamir (Consultant Pathologist)"}`, pageWidth - 14, footerY + 5, { align: "right" });

  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  doc.text("This report is digitally signed and electronically verified. No physical signature is required.", pageWidth / 2, footerY + 10, { align: "center" });

  return doc;
}

/**
 * Trigger browser download with the patient's name as the file name.
 */
export async function downloadReportAsPdf(options: GeneratePdfOptions): Promise<void> {
  const doc = await generateDynamicReportPDF(options);

  // Requirement: "that report only have the name of the patient nothing else"
  // Format filename cleanly using only the patient's name
  const rawName = options.report.patient.name.trim();
  const cleanName = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
  const fileName = `${cleanName || "Patient"}.pdf`;

  doc.save(fileName);
}

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    return format(new Date(dateStr), "dd-MMM-yyyy HH:mm");
  } catch {
    return dateStr;
  }
}
