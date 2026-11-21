import * as XLSX from 'xlsx';

/**
 * Exports data to an Excel file.
 * 
 * @param {Array} data - Array of objects to export.
 * @param {string} fileName - Name of the file (without extension).
 * @param {string} sheetName - Name of the worksheet.
 */
export const exportToExcel = (data, fileName = 'export', sheetName = 'Sheet1') => {
  try {
    // 1. Create a new worksheet from the JSON data
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Create a new workbook
    const workbook = XLSX.utils.book_new();

    // 3. Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 4. Trigger the download
    const fullFileName = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fullFileName);
    
    return true;
  } catch (error) {
    console.error('Excel export failed:', error);
    throw new Error('Failed to export data to Excel');
  }
};
