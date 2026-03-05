import jsPDF from "jspdf";

interface RequisitionItem {
  id: string;
  itemName: string;
  quantity: number;
  description?: string;
}

interface RequisitionData {
  recipientName: string;
  recipientPhone: string;
  items: RequisitionItem[];
  timeReceived: string;
  timeToReturn: string;
  totalAmount: number;
  purpose: string;
  comments?: string;
  assetTransfer?: {
    receivedByName: string;
    receivedBySignature: string;
    releasedByName: string;
    releasedBySignature: string;
  };
  submittedAt?: string;
}

export const generateRequisitionPDF = (data: RequisitionData, requisitionId: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 10;

  // Helper function to add text
  const addText = (
    text: string,
    x: number = 10,
    y: number = yPosition,
    fontSize: number = 12,
    isBold: boolean = false
  ) => {
    doc.setFontSize(fontSize);
    if (isBold) doc.setFont("helvetica", "bold");
    else doc.setFont("helvetica", "normal");
    doc.text(text, x, y);
    yPosition = y + fontSize / 2 + 2;
  };

  // Title
  addText("ASSET REQUISITION FORM", pageWidth / 2, yPosition, 16, true);
  yPosition += 8;

  // Requisition ID and Date
  const submitDate = data.submittedAt
    ? new Date(data.submittedAt).toLocaleDateString()
    : new Date().toLocaleDateString();
  addText(`Requisition ID: ${requisitionId}`, 10, yPosition);
  addText(`Date Submitted: ${submitDate}`, pageWidth / 2, yPosition);
  yPosition += 8;

  doc.setDrawColor(200);
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 8;

  // Section 1: Recipient Information
  addText("RECIPIENT INFORMATION", 10, yPosition, 12, true);
  yPosition += 6;
  addText(`Name: ${data.recipientName}`, 10, yPosition);
  yPosition += 6;
  addText(`Phone: ${data.recipientPhone}`, 10, yPosition);
  yPosition += 6;
  addText(`Purpose: ${data.purpose}`, 10, yPosition);
  yPosition += 8;

  // Section 2: Items
  addText("ITEMS REQUESTED", 10, yPosition, 12, true);
  yPosition += 6;

  // Table header
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Item Name", 12, yPosition);
  doc.text("Qty", 100, yPosition);
  doc.text("Description", 120, yPosition);
  yPosition += 6;

  doc.setDrawColor(180);
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 4;

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  data.items.forEach((item) => {
    if (item.itemName.trim()) {
      doc.text(item.itemName, 12, yPosition);
      doc.text(item.quantity.toString(), 100, yPosition);
      doc.text(item.description || "", 120, yPosition);
      yPosition += 5;
    }
  });

  yPosition += 4;
  doc.setDrawColor(180);
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 6;

  // Schedule
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  addText("SCHEDULE & COST", 10, yPosition, 11, true);
  yPosition += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const receivedDate = new Date(data.timeReceived).toLocaleString();
  const returnDate = new Date(data.timeToReturn).toLocaleString();
  addText(`Date Received: ${receivedDate}`, 10, yPosition);
  yPosition += 5;
  addText(`Date to Return: ${returnDate}`, 10, yPosition);
  yPosition += 5;
  addText(`Expected Amount: KES ${data.totalAmount.toFixed(2)}`, 10, yPosition);
  yPosition += 8;

  // Asset Transfer Section
  if (data.assetTransfer) {
    doc.setDrawColor(200);
    doc.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 8;

    addText("ASSET TRANSFER DOCUMENTATION", 10, yPosition, 12, true);
    yPosition += 8;

    // Two columns for signatures
    const colWidth = (pageWidth - 30) / 2;

    // Left side - Received By
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("ASSETS RECEIVED BY:", 12, yPosition);
    yPosition += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Name: ${data.assetTransfer.receivedByName || "___________________"}`, 12, yPosition);
    yPosition += 6;

    doc.text("Signature:", 12, yPosition);
    yPosition += 4;
    if (data.assetTransfer.receivedBySignature) {
      doc.addImage(
        data.assetTransfer.receivedBySignature,
        "PNG",
        12,
        yPosition,
        colWidth - 4,
        20
      );
    } else {
      doc.setDrawColor(100);
      doc.rect(12, yPosition, colWidth - 4, 20);
    }
    yPosition += 24;

    // Right side - Released By
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("ASSETS RELEASED BY:", 12 + colWidth + 6, yPosition - 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `Name: ${data.assetTransfer.releasedByName || "___________________"}`,
      12 + colWidth + 6,
      yPosition - 18
    );

    doc.text("Signature:", 12 + colWidth + 6, yPosition - 12);
    if (data.assetTransfer.releasedBySignature) {
      doc.addImage(
        data.assetTransfer.releasedBySignature,
        "PNG",
        12 + colWidth + 6,
        yPosition - 8,
        colWidth - 4,
        20
      );
    } else {
      doc.setDrawColor(100);
      doc.rect(12 + colWidth + 6, yPosition - 8, colWidth - 4, 20);
    }

    yPosition += 30;
  }

  // Footer with date
  yPosition += 5;
  addText("Date: ___________________", 10, yPosition);

  // Save PDF
  doc.save(`Requisition_${requisitionId}.pdf`);
};
