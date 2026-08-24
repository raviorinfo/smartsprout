import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BRAND_FOOTER = "Generated free on SmartSprout.com";

interface WorksheetQuestion {
  question: string;
  answer: string;
  options?: string[];
}

interface WorksheetData {
  title: string;
  subject: string;
  grade: string;
  difficulty: string;
  questions: WorksheetQuestion[];
}

export function generateWorksheetPDF(data: WorksheetData): jsPDF {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(data.title, pageWidth / 2, 12, { align: "center" });

  doc.setFontSize(10);
  doc.text(
    `${data.subject} • ${data.grade} • ${data.difficulty}`,
    pageWidth / 2,
    20,
    { align: "center" }
  );

  // Student info lines
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const y = 38;
  doc.text("Name: ___________________________", 15, y);
  doc.text("Date: _______________", pageWidth - 80, y);

  doc.setDrawColor(200, 200, 200);
  doc.line(15, y + 5, pageWidth - 15, y + 5);

  // Questions
  let currentY = y + 15;
  const questionMargin = 15;

  data.questions.forEach((q, index) => {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 34, 34);
    doc.text(`${index + 1}.`, questionMargin, currentY);

    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(q.question, pageWidth - 45);
    doc.text(lines, questionMargin + 10, currentY);
    currentY += lines.length * 6;

    if (q.options && q.options.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      q.options.forEach((opt, optIdx) => {
        const label = String.fromCharCode(65 + optIdx);
        doc.text(`  ${label}) ${opt}`, questionMargin + 12, currentY);
        currentY += 5;
      });
    }

    // Answer line
    doc.setDrawColor(220, 220, 220);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(questionMargin + 10, currentY + 2, pageWidth - questionMargin, currentY + 2);
    doc.setLineDashPattern([], 0);
    currentY += 12;
  });

  // Answer Key page
  doc.addPage();
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Answer Key", pageWidth / 2, 13, { align: "center" });

  const answerRows = data.questions.map((q, i) => [
    `${i + 1}`,
    q.answer,
  ]);

  autoTable(doc, {
    startY: 28,
    head: [["#", "Answer"]],
    body: answerRows,
    theme: "grid",
    headStyles: {
      fillColor: [34, 197, 94],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: "auto" },
    },
  });

  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.setFont("helvetica", "italic");
    doc.text(BRAND_FOOTER, pageWidth / 2, pageHeight - 8, { align: "center" });
  }

  return doc;
}

interface StoryChapter {
  pageNumber: number;
  text: string;
  illustrationPrompt: string;
}

interface StoryData {
  title: string;
  childName: string;
  chapters: StoryChapter[];
}

export function generateStoryPDF(data: StoryData): jsPDF {
  const doc = new jsPDF("l", "mm", "a5");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Cover page
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");

  const titleLines = doc.splitTextToSize(data.title, pageWidth - 40);
  doc.text(titleLines, pageWidth / 2, pageHeight / 2 - 10, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`A story for ${data.childName}`, pageWidth / 2, pageHeight / 2 + 15, {
    align: "center",
  });

  // Story pages
  data.chapters.forEach((chapter) => {
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Page number badge
    doc.setFillColor(34, 197, 94);
    doc.circle(pageWidth - 15, 15, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${chapter.pageNumber}`, pageWidth - 15, 17.5, { align: "center" });

    // Text
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    const textLines = doc.splitTextToSize(chapter.text, pageWidth - 30);
    doc.text(textLines, 15, 25);
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "italic");
    doc.text(BRAND_FOOTER, pageWidth / 2, pageHeight - 5, { align: "center" });
  }

  return doc;
}

export function generateColoringPagePDF(
  imageDataUrl: string,
  prompt: string
): jsPDF {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("My Coloring Page", pageWidth / 2, 15, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 160);
  doc.text(prompt, pageWidth / 2, 22, { align: "center", maxWidth: pageWidth - 40 });

  // Image centered
  const imgSize = Math.min(pageWidth - 30, pageHeight - 60);
  const imgX = (pageWidth - imgSize) / 2;
  doc.addImage(imageDataUrl, "PNG", imgX, 30, imgSize, imgSize);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.setFont("helvetica", "italic");
  doc.text(BRAND_FOOTER, pageWidth / 2, pageHeight - 8, { align: "center" });

  return doc;
}

export function generateColoringBookPDF(
  title: string,
  childName: string,
  pages: { image: string; prompt: string }[]
): jsPDF {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // COVER PAGE
  doc.setFillColor(168, 85, 247); // Purple for coloring book
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(title, pageWidth - 40);
  doc.text(titleLines, pageWidth / 2, pageHeight / 3, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(`A magical coloring book for ${childName}`, pageWidth / 2, pageHeight / 2, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Contains ${pages.length} pages to color!`, pageWidth / 2, pageHeight / 2 + 20, { align: "center" });

  // PAGES
  pages.forEach((page, index) => {
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(`Page ${index + 1}`, pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 160, 160);
    doc.text(page.prompt, pageWidth / 2, 22, { align: "center", maxWidth: pageWidth - 40 });

    const imgSize = Math.min(pageWidth - 30, pageHeight - 60);
    const imgX = (pageWidth - imgSize) / 2;
    doc.addImage(page.image, "PNG", imgX, 30, imgSize, imgSize);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "italic");
    doc.text(BRAND_FOOTER, pageWidth / 2, pageHeight - 8, { align: "center" });
  });

  return doc;
}

export function generateWorksheetBookPDF(
  title: string,
  childName: string,
  worksheets: WorksheetData[]
): jsPDF {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // COVER PAGE
  doc.setFillColor(14, 165, 233); // Sky blue
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(title, pageWidth - 40);
  doc.text(titleLines, pageWidth / 2, pageHeight / 3, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(`A learning workbook for ${childName}`, pageWidth / 2, pageHeight / 2, { align: "center" });
  
  doc.setFontSize(12);
  doc.text(`Contains ${worksheets.length} worksheets!`, pageWidth / 2, pageHeight / 2 + 20, { align: "center" });

  // WORKSHEET PAGES
  worksheets.forEach((ws, index) => {
    doc.addPage();
    // Header
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(ws.title, pageWidth / 2, 12, { align: "center" });

    doc.setFontSize(10);
    doc.text(`${ws.subject} • ${ws.grade} • ${ws.difficulty}`, pageWidth / 2, 20, { align: "center" });

    // Student info lines
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const y = 38;
    doc.text("Name: ___________________________", 15, y);
    doc.text("Date: _______________", pageWidth - 80, y);
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y + 5, pageWidth - 15, y + 5);

    // Questions
    let currentY = y + 15;
    const questionMargin = 15;

    ws.questions.forEach((q, qIndex) => {
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 34, 34);
      doc.text(`${qIndex + 1}.`, questionMargin, currentY);

      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(q.question, pageWidth - 45);
      doc.text(lines, questionMargin + 10, currentY);
      currentY += lines.length * 6;

      if (q.options && q.options.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        q.options.forEach((opt, optIdx) => {
          const label = String.fromCharCode(65 + optIdx);
          doc.text(`  ${label}) ${opt}`, questionMargin + 12, currentY);
          currentY += 5;
        });
      }

      doc.setDrawColor(220, 220, 220);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(questionMargin + 10, currentY + 2, pageWidth - questionMargin, currentY + 2);
      doc.setLineDashPattern([], 0);
      currentY += 12;
    });
  });

  // ANSWER KEYS
  doc.addPage();
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Workbook Answer Key", pageWidth / 2, 18, { align: "center" });

  let akY = 40;
  worksheets.forEach((ws, wsIdx) => {
    if (akY > pageHeight - 40) {
      doc.addPage();
      akY = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 34, 34);
    doc.text(`Worksheet ${wsIdx + 1}: ${ws.title}`, 15, akY);
    akY += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    ws.questions.forEach((q, qIdx) => {
      if (akY > pageHeight - 20) {
        doc.addPage();
        akY = 20;
      }
      doc.text(`${qIdx + 1}. ${q.answer}`, 15, akY);
      akY += 5;
    });
    akY += 10;
  });

  // Global Footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) { // Skip cover
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.setFont("helvetica", "italic");
    doc.text(BRAND_FOOTER, pageWidth / 2, pageHeight - 8, { align: "center" });
  }

  return doc;
}

export function forceDownloadPDF(pdf: jsPDF, filename: string) {
  try {
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Custom download failed, falling back to jsPDF.save:", error);
    pdf.save(filename);
  }
}
