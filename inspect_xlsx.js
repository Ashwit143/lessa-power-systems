const XLSX = require('xlsx');

const workbook = XLSX.readFile('public/UPS & BATTERY COMBO.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

console.log("Columns:", Object.keys(data[0] || {}));
console.log("First 3 rows:", data.slice(0, 3));
