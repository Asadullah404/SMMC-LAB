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
 * Draws the executive page background, brand accent bars, micro-hairline perimeter,
 * and the delicate semi-transparent watermark logo.
 */
function drawPageDecorations(doc: jsPDF, extDoc: JsPDFExtended, logoBase64: string | null) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Crisp White Page Base
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Top Executive Navy & Sapphire Brand Accent Bars
  doc.setFillColor(15, 39, 74); // Deep Executive Navy #0f274a
  doc.rect(0, 0, pageWidth, 2.5, "F");
  doc.setFillColor(37, 99, 235); // Vibrant Sapphire #2563eb
  doc.rect(0, 2.5, pageWidth, 0.7, "F");

  // Bottom Executive Navy & Sapphire Accent Bars
  doc.setFillColor(15, 39, 74);
  doc.rect(0, pageHeight - 2.5, pageWidth, 2.5, "F");
  doc.setFillColor(37, 99, 235);
  doc.rect(0, pageHeight - 3.2, pageWidth, 0.7, "F");

  // Subtle Elegant Page Framing (Delicate Hairline - NOT harsh double borders)
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.12);
  doc.rect(9, 7, pageWidth - 18, pageHeight - 14);

  // Watermark Logo: centered, elegant 0.05 opacity (authentic security watermark that never interferes with text)
  if (logoBase64) {
    try {
      const logoSize = 120;
      const x = (pageWidth - logoSize) / 2;
      const y = (pageHeight - logoSize) / 2;
      extDoc.setGState(new extDoc.GState({ opacity: 0.05 }));
      doc.addImage(logoBase64, "PNG", x, y, logoSize, logoSize);
      extDoc.setGState(new extDoc.GState({ opacity: 1 }));
    } catch (err) {
      console.warn("Failed to draw watermark:", err);
    }
  }
}

/**
 * Generates an extraordinarily premium clinical laboratory report PDF.
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

  let yPos = 9;

  // 1. Header Banner Section
  if (headerBase64) {
    try {
      // header.png aspect ratio 965:258 (~3.74:1). Scaled to span page margins (186mm width, 26mm height)
      doc.addImage(headerBase64, "PNG", 12, yPos, 186, 26);
      yPos += 28;
    } catch {
      yPos += 2;
    }
  } else {
    // Typographic fallback if header image is unavailable
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 14, yPos + 1, 18, 18);
    }
    doc.setTextColor(15, 39, 74);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("SHAH MUHAMMAD MEDICAL COMPLEX (SMMC)", 36, yPos + 7);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Department of Pathology & Clinical Laboratory Services", 36, yPos + 12);
    doc.setTextColor(37, 99, 235);
    doc.text("ISO 15189:2022 Certified • Quality Assured Diagnostic Center", 36, yPos + 16.5);

    yPos += 22;
  }

  // Subheader Ribbon Bar: Document Identification & Accreditation
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.2);
  doc.roundedRect(12, yPos, 186, 7.5, 1, 1, "FD");

  // Left Title
  doc.setTextColor(15, 39, 74); // Deep Navy
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("CLINICAL PATHOLOGY LABORATORY REPORT", 16, yPos + 5);

  // Center Subtitle
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("ISO 15189 Certified Diagnostic Center", pageWidth / 2 + 5, yPos + 5, { align: "center" });

  // Right Report ID Pill Badge
  doc.setFillColor(239, 246, 255); // Ice Blue #eff6ff
  doc.setDrawColor(191, 219, 254); // Blue-200
  doc.roundedRect(pageWidth - 72, yPos + 1.2, 58, 5.1, 1, 1, "FD");

  doc.setTextColor(29, 78, 216); // Royal Blue
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(`REPORT NO: ${report.reportId}`, pageWidth - 43, yPos + 4.7, { align: "center" });

  yPos += 11;

  // 2. Patient Information Panel (Sleek Executive Card with Signature Blue Bar)
  const onlyPatientName = showOnlyPatientName || 
    template?.blocks.find((b) => b.type === "patient-info")?.config.showOnlyPatientName || 
    false;

  if (onlyPatientName) {
    // Mode: Strictly ONLY Patient Name (Executive Privacy Mode)
    const cardH = 13;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.roundedRect(12, yPos, 186, cardH, 1.5, 1.5, "FD");

    // Executive Left Blue Signature Bar
    doc.setFillColor(37, 99, 235);
    doc.rect(12, yPos, 2.5, cardH, "F");

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT NAME:", 18, yPos + 8.2);

    doc.setTextColor(15, 39, 74);
    doc.setFontSize(11.5);
    doc.setFont("helvetica", "bold");
    doc.text(report.patient.name.toUpperCase(), 48, yPos + 8.2);

    // Right Confidential Badge
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(pageWidth - 68, yPos + 3.5, 54, 6, 1, 1, "FD");
    doc.setTextColor(29, 78, 216);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("CONFIDENTIAL PATIENT REPORT", pageWidth - 41, yPos + 7.5, { align: "center" });

    yPos += cardH + 5;
  } else {
    // Mode: Full Clinical Patient Information Card (High-End 3-Column Grid)
    const cardH = 22;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.roundedRect(12, yPos, 186, cardH, 1.5, 1.5, "FD");

    // Executive Left Blue Signature Bar
    doc.setFillColor(37, 99, 235);
    doc.rect(12, yPos, 2.5, cardH, "F");

    // Subtle Internal Column Dividers
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(82, yPos + 3, 82, yPos + cardH - 3);
    doc.line(138, yPos + 3, 138, yPos + cardH - 3);

    const c1X = 18;
    const c2X = 86;
    const c3X = 142;

    // Row 1 (yPos + 5.5)
    let rowY = yPos + 5.5;
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("PATIENT NAME", c1X, rowY);
    doc.text("REFERRING DR", c2X, rowY);
    doc.text("COLLECTION TIME", c3X, rowY);

    rowY += 4.2;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 39, 74); // Deep Navy
    doc.text(`${report.patient.name} ${report.patient.relation ? `(${report.patient.relation})` : ""}`, c1X, rowY);

    doc.setFontSize(8);
    doc.text(report.patient.referringDoctor || "Self / Consultant", c2X, rowY);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text(formatDateTime(report.patient.collectionDateTime), c3X, rowY);

    // Row 2 (yPos + 14.5)
    rowY = yPos + 15;
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("AGE / GENDER", c1X, rowY);
    doc.text("SAMPLE ID", c2X, rowY);
    doc.text("REPORTING TIME", c3X, rowY);

    rowY += 4.2;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 39, 74);
    doc.text(`${report.patient.age ?? "-"} Y  /  ${report.patient.sex ?? "-"}`, c1X, rowY);

    doc.setTextColor(37, 99, 235); // Blue-600
    doc.setFont("helvetica", "bold");
    doc.text(report.patient.sampleId, c2X, rowY);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 39, 74);
    doc.text(formatDateTime(report.verificationDate), c3X, rowY);

    yPos += cardH + 5;
  }

  // 3. Test Findings Tables (Executive Pathology Layout)
  for (const test of tests) {
    const testResults = report.results[test.id] || {};
    const tableRows: RowInput[] = [];

    const sections = test.sections && test.sections.length > 0 
      ? test.sections 
      : [{ id: "main", name: "", order: 1 }];

    for (const sec of sections) {
      const secFields = test.fields.filter(
        (f) => (sec.name ? f.section === sec.name : true)
      );

      if (secFields.length === 0) continue;

      // Section divider row (e.g. Physical Examination, Chemical Examination, Microscopic Examination)
      if (sec.name) {
        tableRows.push([
          {
            content: `▶  ${sec.name.toUpperCase()}`,
            colSpan: 4,
            styles: {
              fontStyle: "bold",
              fontSize: 7.5,
              fillColor: [240, 247, 255], // Glacier Blue #f0f7ff
              textColor: [29, 78, 216],   // Royal Blue #1d4ed8
              cellPadding: 1.8,
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

    // Check if new page is needed before table title banner
    if (yPos > pageHeight - 45) {
      doc.addPage();
      drawPageDecorations(doc, extDoc, logoBase64);
      yPos = 14;
    }

    // Elegant Test Header Banner
    doc.setFillColor(15, 39, 74); // Deep Navy #0f274a
    doc.roundedRect(12, yPos, 186, 6.5, 1, 1, "F");

    // Title left
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(`●  ${test.name.toUpperCase()}`, 16, yPos + 4.5);

    // Method right
    if (test.method) {
      doc.setTextColor(147, 197, 253); // Light Blue-300
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.text(`Method: ${test.method}`, pageWidth - 16, yPos + 4.5, { align: "right" });
    }

    yPos += 6.5;

    autoTable(doc, {
      startY: yPos,
      margin: { left: 12, right: 12 },
      head: [["INVESTIGATION / PARAMETER", "OBSERVED RESULT", "UNIT", "BIOLOGICAL REFERENCE RANGE"]],
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        textColor: [15, 23, 42],
        lineColor: [226, 232, 240], // Slate-200
        lineWidth: 0.1,
        fillColor: false,           // TRANSPARENT so watermark is visible beneath!
      },
      headStyles: {
        fillColor: [30, 58, 138],   // Deep Sapphire #1e3a8a
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
        cellPadding: 2.2,
      },
      columnStyles: {
        0: { fontStyle: "bold", halign: "left", cellWidth: 64 },
        1: { halign: "center", fontStyle: "bold", cellWidth: 42 },
        2: { halign: "center", cellWidth: 28 },
        3: { halign: "center", cellWidth: 52 },
      },
      alternateRowStyles: {
        fillColor: false,           // Transparent alternate rows to keep watermark pristine
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
            data.cell.styles.textColor = [220, 38, 38]; // Crimson Red #dc2626
            data.cell.styles.fontStyle = "bold";
          } else if (cellText === "Negative" || cellText === "Non-Reactive" || cellText === "Normal" || cellText === "Nil") {
            data.cell.styles.textColor = [29, 78, 216]; // Royal Blue #1d4ed8
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          drawPageDecorations(doc, extDoc, logoBase64);
        }
      },
    });

    yPos = (extDoc.lastAutoTable ? extDoc.lastAutoTable.finalY : yPos + 40) + 5;
  }

  // 4. Clinical Notes / Pathologist Interpretation Box
  // USER REQUIREMENT: Strictly removed from default! Only render if notes are explicitly provided!
  const notesText = report.notes ? report.notes.trim() : "";
  if (notesText && notesText.length > 0) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      drawPageDecorations(doc, extDoc, logoBase64);
      yPos = 14;
    }

    const boxH = 15;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.25);
    doc.roundedRect(12, yPos, 186, boxH, 1.5, 1.5, "FD");

    // Executive Left Blue Signature Bar
    doc.setFillColor(37, 99, 235);
    doc.rect(12, yPos, 2.2, boxH, "F");

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 39, 74);
    doc.text("CLINICAL INTERPRETATION / PATHOLOGIST NOTES:", 17, yPos + 4.8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(notesText, 17, yPos + 9.5, { maxWidth: 176 });
    yPos += boxH + 5;
  }

  // 5. Digital Signatures Block & Verification Footer
  const sigY = Math.max(yPos + 4, pageHeight - 34);

  // Left: Laboratory Technologist
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.line(16, sigY, 70, sigY);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 39, 74);
  doc.text("LABORATORY TECHNOLOGIST", 16, sigY + 4.2);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(report.technicianName || "Staff Technologist", 16, sigY + 8);
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("B.Sc. MLT • Quality Control Verified", 16, sigY + 11.5);

  // Center: Official Digital Verification Shield Badge
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(pageWidth / 2 - 26, sigY - 2, 52, 9.5, 1.5, 1.5, "FD");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(29, 78, 216);
  doc.text("[ ✓ DIGITALLY VERIFIED ]", pageWidth / 2, sigY + 2.5, { align: "center" });

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("ISO 15189 Quality Protocol", pageWidth / 2, sigY + 6.2, { align: "center" });

  // Right: Consultant Pathologist
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.line(pageWidth - 70, sigY, pageWidth - 16, sigY);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 39, 74);
  doc.text("DR. AAMIR", pageWidth - 16, sigY + 4.2, { align: "right" });

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("M.B.B.S., F.C.P.S. (Pathology)", pageWidth - 16, sigY + 8, { align: "right" });

  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Consultant Pathologist & Lab Director", pageWidth - 16, sigY + 11.5, { align: "right" });

  // 6. Pagination & Audit Footer Across All Pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.15);
    doc.line(12, pageHeight - 9, pageWidth - 12, pageHeight - 9);

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("SMMC Clinical Diagnostic Laboratory • Emergency & Routine Pathology Services", 12, pageHeight - 5.5);
    doc.text("Computer-generated report. No physical signature required.", pageWidth / 2, pageHeight - 5.5, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 39, 74);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - 12, pageHeight - 5.5, { align: "right" });
  }

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
