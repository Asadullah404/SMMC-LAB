// src/lib/dynamicPdfGenerator.ts
import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { format } from "date-fns";
import { TestTemplate, CanvasTemplate, DynamicReportRecord } from "@/types/dynamic-test";

export interface GeneratePdfOptions {
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

// In-memory cache for base64 images so subsequent PDF downloads & prints are instantaneous
const imageCache: Record<string, string> = {};

/**
 * Bulletproof image loader: handles absolute URLs, relative URLs, fetch blob conversion,
 * and falls back to HTML Canvas Image rendering.
 */
async function loadImageAsBase64(url: string): Promise<string | null> {
  if (imageCache[url]) return imageCache[url];

  // Strategy 1: Fetch -> Blob -> FileReader
  try {
    const fullUrl = typeof window !== "undefined" && !url.startsWith("http") && !url.startsWith("data:")
      ? `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`
      : url;

    const res = await fetch(fullUrl);
    if (res.ok) {
      const blob = await res.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      if (base64 && base64.startsWith("data:image")) {
        imageCache[url] = base64;
        return base64;
      }
    }
  } catch (e) {
    console.warn("Fetch image failed, attempting canvas fallback for:", url, e);
  }

  // Strategy 2: Image DOM element with canvas
  if (typeof window !== "undefined") {
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Canvas 2D context unavailable"));
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = reject;
        img.src = url;
      });
      if (base64 && base64.startsWith("data:image")) {
        imageCache[url] = base64;
        return base64;
      }
    } catch (e) {
      console.warn("Canvas image fallback failed for:", url, e);
    }
  }

  return null;
}

/**
 * Draws the outer double frame and the centered semi-transparent watermark logo.
 */
function drawPageDecorations(doc: jsPDF, extDoc: JsPDFExtended, logoBase64: string | null) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Crisp White Page Base
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Outer Royal Blue Border (matches canvas designer)
  doc.setDrawColor(37, 99, 235); // Blue-600
  doc.setLineWidth(0.6);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Inner Soft Blue Hairline
  doc.setDrawColor(219, 234, 254); // Blue-100
  doc.setLineWidth(0.2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Watermark Logo: centered, visible 0.12 opacity so it prints and displays clearly
  if (logoBase64) {
    try {
      const logoSize = 130;
      const x = (pageWidth - logoSize) / 2;
      const y = (pageHeight - logoSize) / 2;
      extDoc.setGState(new extDoc.GState({ opacity: 0.12 }));
      doc.addImage(logoBase64, "PNG", x, y, logoSize, logoSize);
      extDoc.setGState(new extDoc.GState({ opacity: 1 }));
    } catch (err) {
      console.warn("Failed to draw watermark:", err);
    }
  }
}

/**
 * Generates an exact-match clinical laboratory report PDF in Royal Navy & Blue theme.
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

  // Pre-load assets
  const [logoBase64, headerBase64] = await Promise.all([
    loadImageAsBase64("/logo.png"),
    loadImageAsBase64("/header.png"),
  ]);

  // Initial page decorations
  drawPageDecorations(doc, extDoc, logoBase64);

  let yPos = 12;

  // 1. Header Banner Image & Title
  if (headerBase64) {
    try {
      // header.png aspect ratio is 965:258 (~3.74:1)
      const bannerH = 26;
      const bannerW = bannerH * (965 / 258); // ~97mm
      const bannerX = (pageWidth - bannerW) / 2;
      doc.addImage(headerBase64, "PNG", bannerX, yPos, bannerW, bannerH);
      yPos += bannerH + 3;
    } catch {
      yPos += 2;
    }
  }

  // Clinic Report Title & Accreditation (matches canvas designer)
  doc.setTextColor(30, 58, 138); // Blue-900 / Navy
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("SMMC LABORATORY REPORT", pageWidth / 2, yPos, { align: "center" });
  yPos += 4.5;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(37, 99, 235); // Blue-600
  doc.text("ISO 15189 Certified Diagnostic Center", pageWidth / 2, yPos, { align: "center" });
  yPos += 4.5;

  // Report ID Pill Badge
  doc.setFillColor(239, 246, 255); // Blue-50
  doc.setDrawColor(191, 219, 254); // Blue-200
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth / 2 - 40, yPos, 80, 6, 2, 2, "FD");

  doc.setTextColor(29, 78, 216); // Blue-700
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text(`REPORT ID: ${report.reportId}`, pageWidth / 2, yPos + 4.2, { align: "center" });
  yPos += 10;

  // 2. Patient Information Section
  const onlyPatientName = showOnlyPatientName || 
    template?.blocks.find((b) => b.type === "patient-info")?.config.showOnlyPatientName || 
    false;

  doc.setDrawColor(191, 219, 254); // Blue-200
  doc.setLineWidth(0.35);

  if (onlyPatientName) {
    // Mode: Only Patient Name (User Requirement)
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(12, yPos, pageWidth - 24, 12, 1.5, 1.5, "FD");

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Name:", 16, yPos + 7.5);

    doc.setTextColor(29, 78, 216); // Royal Blue
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(report.patient.name, 45, yPos + 7.5);
    yPos += 16;
  } else {
    // Mode: Full Clinical Patient Information Card
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(12, yPos, pageWidth - 24, 22, 1.5, 1.5, "FD");

    const leftX = 16;
    const midX = pageWidth / 2 + 4;
    let lineY = yPos + 5.5;

    // Line 1: Patient Name & Doctor
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Patient:", leftX, lineY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`${report.patient.name} ${report.patient.relation ? `(${report.patient.relation})` : ""}`, leftX + 22, lineY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Referring Doctor:", midX, lineY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(report.patient.referringDoctor || "Self", midX + 30, lineY);

    // Line 2: Age / Sex & Collection Date
    lineY += 5.5;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Age / Sex:", leftX, lineY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(`${report.patient.age ?? "-"} / ${report.patient.sex ?? "-"}`, leftX + 22, lineY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Collection Date:", midX, lineY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(formatDateTime(report.patient.collectionDateTime), midX + 30, lineY);

    // Line 3: Sample ID & Report Date
    lineY += 5.5;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Sample ID:", leftX, lineY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(29, 78, 216); // Royal Blue
    doc.text(report.patient.sampleId, leftX + 22, lineY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text("Report Date:", midX, lineY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(formatDateTime(report.verificationDate), midX + 30, lineY);

    yPos += 26;
  }

  // 3. Test Findings Tables (Matches Canvas Designer & Real Laboratory Style)
  for (const test of tests) {
    const testResults = report.results[test.id] || {};
    const tableRows: RowInput[] = [];

    // Test Title Bar (matches canvas designer: blue-700 with method on the right)
    tableRows.push([
      {
        content: `${test.name.toUpperCase()}${test.method ? `   •   Method: ${test.method}` : ""}`,
        colSpan: 4,
        styles: {
          fontStyle: "bold",
          fontSize: 9,
          halign: "left",
          fillColor: [29, 78, 216], // Royal Blue #1d4ed8
          textColor: [255, 255, 255],
        },
      },
    ]);

    const sections = test.sections && test.sections.length > 0 
      ? test.sections 
      : [{ id: "main", name: "", order: 1 }];

    for (const sec of sections) {
      const secFields = test.fields.filter(
        (f) => (sec.name ? f.section === sec.name : true)
      );

      if (secFields.length === 0) continue;

      // Section row divider (e.g., Physical Examination, Chemical Examination, Microscopic Examination)
      if (sec.name) {
        tableRows.push([
          {
            content: `• ${sec.name.toUpperCase()}`,
            colSpan: 4,
            styles: {
              fontStyle: "bold",
              fontSize: 8.5,
              fillColor: [239, 246, 255], // Soft Ice Blue #eff6ff
              textColor: [30, 64, 175],   // Deep Blue #1e40af
            },
          },
        ]);
      }

      for (const field of secFields) {
        const val = testResults[field.key];
        const displayVal = val !== undefined && val !== null && val !== "" ? String(val) : "-";
        const unit = field.unit || "-";
        const refRange = field.referenceRange || "-";

        tableRows.push([
          field.label,
          displayVal,
          unit,
          refRange,
        ]);
      }
    }

    autoTable(doc, {
      startY: yPos,
      margin: { left: 12, right: 12 },
      head: [["Test Parameter", "Observed Result", "Unit", "Biological Reference Range"]],
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 8.5,
        cellPadding: 2.2,
        textColor: [15, 23, 42],
        lineColor: [226, 232, 240], // Clean Slate-200
        lineWidth: 0.15,
        fillColor: false,           // TRANSPARENT so watermark is 100% visible beneath!
      },
      headStyles: {
        fillColor: [30, 58, 138],   // Deep Royal Navy Blue #1e3a8a
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { fontStyle: "bold", halign: "left", cellWidth: 65 },
        1: { halign: "center", cellWidth: 45 },
        2: { halign: "center", cellWidth: 30 },
        3: { halign: "center", cellWidth: 46 },
      },
      alternateRowStyles: {
        fillColor: false,           // Transparent alternate rows to keep watermark crystal clear
      },
      didParseCell: (data) => {
        // Highlight abnormal / positive findings in bold RED, and normal in bold BLUE
        if (data.column.index === 1 && data.row.raw && Array.isArray(data.row.raw)) {
          const cellText = String(data.cell.text?.[0] || "").trim();
          if (
            cellText === "Positive" || 
            cellText === "Reactive" || 
            cellText.includes("1+") || 
            cellText.includes("2+") || 
            cellText.includes("3+") ||
            cellText.includes("4+") ||
            cellText === "Present"
          ) {
            data.cell.styles.textColor = [220, 38, 38]; // Red
            data.cell.styles.fontStyle = "bold";
          } else if (cellText === "Negative" || cellText === "Non-Reactive" || cellText === "Normal" || cellText === "Nil") {
            data.cell.styles.textColor = [29, 78, 216]; // Royal Blue
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
      didDrawPage: (data) => {
        // Redraw outer borders and watermark if content spans onto multiple pages
        if (data.pageNumber > 1) {
          drawPageDecorations(doc, extDoc, logoBase64);
        }
      },
    });

    yPos = (extDoc.lastAutoTable ? extDoc.lastAutoTable.finalY : yPos + 40) + 6;
  }

  // 4. Clinical Notes / Interpretation Box
  const notesText = report.notes || template?.blocks.find((b) => b.type === "doctor-notes")?.config.customText;
  if (notesText) {
    if (yPos > pageHeight - 45) {
      doc.addPage();
      drawPageDecorations(doc, extDoc, logoBase64);
      yPos = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(191, 219, 254);
    doc.setLineWidth(0.3);
    doc.roundedRect(12, yPos, pageWidth - 24, 14, 1.5, 1.5, "FD");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("Clinical Notes / Interpretation:", 16, yPos + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(notesText, 16, yPos + 9.5, { maxWidth: pageWidth - 32 });
    yPos += 18;
  }

  // 5. Digital Verification & Sign-off Footer
  const footerY = Math.max(yPos + 4, pageHeight - 25);
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.setLineWidth(0.2);
  doc.line(12, footerY, pageWidth - 12, footerY);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138); // Royal Navy
  doc.text(`Laboratory Technician: ${report.technicianName || "Staff"}`, 14, footerY + 5);
  doc.text(`Verified By: ${report.verifiedBy || "Dr. Aamir (Consultant Pathologist)"}`, pageWidth - 14, footerY + 5, { align: "right" });

  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This report is digitally signed and electronically verified under ISO 15189 protocols. No physical signature is required.",
    pageWidth / 2,
    footerY + 10,
    { align: "center" }
  );

  return doc;
}

/**
 * Triggers instant browser download with strictly [Patient_Name].pdf naming.
 */
export async function downloadReportAsPdf(options: GeneratePdfOptions): Promise<void> {
  const doc = await generateDynamicReportPDF(options);
  const rawName = options.report.patient.name.trim();
  const cleanName = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_");
  const fileName = `${cleanName || "Patient"}.pdf`;
  doc.save(fileName);
}

/**
 * Triggers instant native print dialog of the exact generated PDF via hidden iframe.
 */
export async function printReportAsPdf(options: GeneratePdfOptions): Promise<void> {
  const doc = await generateDynamicReportPDF(options);
  const blob = doc.output("blob");
  const blobUrl = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.src = blobUrl;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(blobUrl);
      }, 60000);
    }, 250);
  };
}

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    return format(new Date(dateStr), "dd-MMM-yyyy HH:mm");
  } catch {
    return dateStr;
  }
}
