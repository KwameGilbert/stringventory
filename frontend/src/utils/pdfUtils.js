import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exports data to a PDF file using jsPDF and autoTable.
 * 
 * @param {Object} options - Configuration for the PDF.
 * @param {string} options.title - Document title.
 * @param {string} options.fileName - Output filename.
 * @param {Object} options.table - Table configuration (headers and rows).
 */
export const exportToPDF = ({ title, fileName = "export", table }) => {
  return new Promise((resolve, reject) => {
    try {
      // 1. Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 2. Add Header
      doc.setFontSize(20);
      doc.setTextColor(17, 24, 39); // Gray 900
      doc.text(title, 105, 15, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128); // Gray 500
      doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 22, { align: "center" });

      // 3. Draw the Table using the functional autoTable call
      autoTable(doc, {
        startY: 30,
        head: [table.headers],
        body: table.rows,
        theme: "striped",
        headStyles: {
            fillColor: [17, 24, 39], // Gray 900
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold",
            halign: "left",
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [55, 65, 81], // Gray 700
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251], // Gray 50
        },
        margin: { top: 30, right: 15, bottom: 20, left: 15 },
        styles: {
            overflow: "linebreak",
            cellPadding: 3,
        },
      });

      // 4. Trigger the download
      const fullFileName = `${fileName}_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fullFileName);
      
      resolve(true);
    } catch (error) {
      console.error("PDF export failed:", error);
      reject(new Error("Failed to generate PDF"));
    }
  });
};
