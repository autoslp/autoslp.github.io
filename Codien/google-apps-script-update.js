// Google Apps Script cập nhật nhiều trường cùng lúc vào Sheet 'Tonghop'

const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // <-- Thay bằng ID Google Sheet thực tế
const SHEET_NAME = 'Tonghop';

function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const stt = e.parameter.stt;
    let fields = e.parameter.fields;
    // Nếu fields là chuỗi JSON, parse ra mảng
    if (fields && typeof fields === 'string') {
      try { fields = JSON.parse(fields); } catch (err) { fields = null; }
    }
    // Nếu không có fields, fallback về cập nhật 1 trường như cũ
    if (!fields || !Array.isArray(fields)) {
      const value = e.parameter.value;
      let column = e.parameter.column || 8;
      if (!stt || value === undefined) throw new Error('Thiếu STT hoặc giá trị cập nhật');
      if (typeof column === 'string' && isNaN(Number(column))) {
        column = columnToNumber(column);
      } else {
        column = Number(column);
      }
      if (!column || column < 1) throw new Error('Cột không hợp lệ');
      const lastRow = sheet.getLastRow();
      const sttValues = sheet.getRange(4, 1, lastRow - 3, 1).getValues();
      let foundRow = -1;
      for (let i = 0; i < sttValues.length; i++) {
        if ((sttValues[i][0] + '').trim() === stt.trim()) {
          foundRow = i + 4;
          break;
        }
      }
      if (foundRow === -1) throw new Error('Không tìm thấy STT phù hợp');
      sheet.getRange(foundRow, column).setValue(value);
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Cập nhật dữ liệu thành công!'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    // Nếu có fields là mảng, cập nhật nhiều trường
    if (!stt) throw new Error('Thiếu STT');
    const lastRow = sheet.getLastRow();
    const sttValues = sheet.getRange(4, 1, lastRow - 3, 1).getValues();
    let foundRow = -1;
    for (let i = 0; i < sttValues.length; i++) {
      if ((sttValues[i][0] + '').trim() === stt.trim()) {
        foundRow = i + 4;
        break;
      }
    }
    if (foundRow === -1) throw new Error('Không tìm thấy STT phù hợp');
    for (let i = 0; i < fields.length; i++) {
      let column = fields[i].column;
      let value = fields[i].value;
      if (!column || value === undefined) continue;
      if (typeof column === 'string' && isNaN(Number(column))) {
        column = columnToNumber(column);
      } else {
        column = Number(column);
      }
      if (!column || column < 1) continue;
      sheet.getRange(foundRow, column).setValue(value);
    }
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Cập nhật nhiều trường thành công!'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Lỗi: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm chuyển ký tự cột sang số (A=1, B=2, ... AA=27, ...)
function columnToNumber(col) {
  let num = 0;
  col = col.toUpperCase();
  for (let i = 0; i < col.length; i++) {
    num = num * 26 + (col.charCodeAt(i) - 64);
  }
  return num;
} 