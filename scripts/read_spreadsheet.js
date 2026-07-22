import * as xlsx from 'xlsx';

const filePath = 'public/UPS & BATTERY COMBO.xlsx';
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

console.log(JSON.stringify(data.slice(0, 5), null, 2));
