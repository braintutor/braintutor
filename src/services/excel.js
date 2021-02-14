import * as XLSX from "xlsx";

export function exportExcel(rows, filename) {
    var data = XLSX.utils.json_to_sheet(rows);

    var wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, data, "Hoja 1");

    XLSX.writeFile(wb, `${filename}.xlsx`);
}