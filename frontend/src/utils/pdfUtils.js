import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exports data to a PDF file using jsPDF and autoTable.
 * 
 * @param {Object} options - Configuration for the PDF.
 * @param {string} options.title - Document title.
 * @param {string} options.subtitle - Document subtitle (optional).
 * @param {string} options.fileName - Output filename.
 * @param {Object} options.table - Table configuration (headers and rows).
 * @param {Array} options.details - Additional key-value pairs to show above the table (optional).
 * @param {Array} options.totals - Key-value pairs to show below the table (optional).
 */
export const exportToPDF = ({ title, subtitle, fileName = "export", table, details = [], totals = [] }) => {
  return new Promise((resolve, reject) => {
    try {
      // 0. Helper to sanitize text for PDF (replaces symbols that jsPDF's basic fonts can't handle)
      const sanitize = (val) => {
        if (typeof val !== "string") return val;
        // Replace Cedi symbol with GHS
        return val.replace(/\u20B5/g, "GHS ").replace(/₵/g, "GHS ");
      };

      // 1. Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // 2. Add Header
      doc.setFontSize(22);
      doc.setTextColor(17, 24, 39); // Gray 900
      doc.text(sanitize(title), 15, 20);

      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128); // Gray 500
      doc.text(`Generated on ${new Date().toLocaleString()}`, 15, 27);

      if (subtitle) {
        doc.setFontSize(12);
        doc.setTextColor(55, 65, 81); // Gray 700
        doc.text(sanitize(subtitle), 15, 35);
      }

      let currentY = subtitle ? 45 : 35;

      // 3. Add Details (e.g., Supplier/Order Info)
      if (details.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81);
        
        details.forEach((detail) => {
          doc.setFont("helvetica", "bold");
          doc.text(`${sanitize(detail.label)}:`, 15, currentY);
          doc.setFont("helvetica", "normal");
          doc.text(`${sanitize(detail.value)}`, 50, currentY);
          currentY += 6;
        });
        currentY += 4;
      }

      // 4. Draw the Table
      autoTable(doc, {
        startY: currentY,
        head: [table.headers.map(sanitize)],
        body: table.rows.map(row => row.map(sanitize)),
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
        didDrawPage: (data) => {
            currentY = data.cursor.y;
        }
      });

      // 5. Add Totals (e.g., Subtotal, Tax, Total)
      if (totals.length > 0) {
        currentY += 10;
        const rightAlignX = pageWidth - 15;
        
        totals.forEach((total) => {
          doc.setFontSize(10);
          doc.setFont("helvetica", total.bold ? "bold" : "normal");
          
          if (total.color === 'emerald') {
            doc.setTextColor(5, 150, 105);
          } else {
            doc.setTextColor(17, 24, 39);
          }
          
          doc.text(`${sanitize(total.label)}:`, rightAlignX - 40, currentY, { align: "right" });
          doc.text(`${sanitize(total.value)}`, rightAlignX, currentY, { align: "right" });
          currentY += 7;
        });
      }

      // 6. Trigger the download
      const fullFileName = `${fileName}_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fullFileName);
      
      resolve(true);
    } catch (error) {
      console.error("PDF export failed:", error);
      reject(new Error("Failed to generate PDF"));
    }
  });
};
