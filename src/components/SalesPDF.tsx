// SalesPDF.ts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type CartItem = {
  medicineName: string;
  dosage?: string;
  quantity: number;
  price: number;
  instructions?: string;
};

type Patient = {
  name?: string;
  phone?: string;
  age?: string | number;
  sex?: string;
  referringDoctor?: string;
  relation?: string;
};

type GenerateSalePDFParams = {
  cart: CartItem[];
  patient: Patient;
  precNumber: string | null;
  withHeader: boolean;
};

export const generateSalePDF = async ({
  cart,
  patient,
  precNumber,
  withHeader,
}: GenerateSalePDFParams): Promise<void> => {
  try {
    const doc = new jsPDF({ compress: true });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 🔹 STARTING Y POSITION
    let yPos = 20;

    // 🔹 ADD HEADER IMAGE AS OVERLAY (if withHeader is true)
    if (withHeader) {
      try {
        const response = await fetch("/header.png");
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        // Add header at the TOP of the page - spanning full width
        // Adjust headerHeight based on your actual header image aspect ratio
        const headerHeight = 40; // Adjust this value based on your header image
        doc.addImage(base64, "PNG", 0, 0, pageWidth, headerHeight);
        
        // Adjust starting position to be BELOW the header
        yPos = headerHeight + 10;
      } catch (err) {
        console.error("Failed to load header image:", err);
        // If header fails, continue without it
      }
    }

    // 🔹 ADD WATERMARK LOGO (centered, low opacity, behind content)
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
      const y = (pageHeight - logoSize) / 2;
      
      // Set low opacity for watermark
      (doc as any).setGState(new (doc as any).GState({ opacity: 0.06 }));
      doc.addImage(base64, "PNG", x, y, logoSize, logoSize);
      (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
    } catch (err) {
      console.error("Failed to load watermark logo:", err);
      // Continue without watermark if it fails
    }

    // 🔹 PRESCRIPTION HEADER
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Prescription", 14, yPos);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${precNumber || "N/A"}`, pageWidth - 18, yPos, { align: "right" });
    yPos += 10;

    // 🔹 PATIENT INFORMATION
    if (patient?.name || patient?.phone) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("PATIENT INFORMATION", 14, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 6;

      doc.text(`Name: ${patient.name || "-"}`, 14, yPos);
      doc.text(`Phone: ${patient.phone || "-"}`, pageWidth - 18, yPos, { align: "right" });
      yPos += 5;

      doc.text(`Doctor: ${patient.referringDoctor || "-"}`, 14, yPos);
      doc.text(
        `Age: ${patient.age ?? "-"} | Gender: ${patient.sex ?? "-"}`,
        pageWidth - 18,
        yPos,
        { align: "right" }
      );
      yPos += 10;
    }

    // 🔹 MEDICINES TABLE
    const tableBody = cart.map((item, i) => [
      (i + 1).toString(),
      item.medicineName,
      item.dosage || "-",
      item.quantity.toString(),
      `PKR ${item.price.toFixed(2)}`,
      `PKR ${(item.price * item.quantity).toFixed(2)}`,
      item.instructions || "-",
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

    // 🔹 TOTAL AMOUNT
    const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const finalY = (doc as any).lastAutoTable 
      ? (doc as any).lastAutoTable.finalY + 10 
      : yPos + 80;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TOTAL AMOUNT", pageWidth - 75, finalY + 6);
    doc.setFontSize(12);
    doc.text(`PKR ${totalAmount.toFixed(2)}`, pageWidth - 18, finalY + 14, {
      align: "right",
    });

    // 🔹 FOOTER
    const footerY = pageHeight - 20;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(
      "Thank you for choosing SMMC Laboratory",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    // 🔹 DOWNLOAD PDF
    const fileName = `Prescription_${precNumber || "Unknown"}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw err;
  }
};