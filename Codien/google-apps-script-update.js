// Google Apps Script cập nhật dữ liệu vào Sheet 'Tonghop'

const SHEET_ID = 'YOUR_SHEET_ID_HERE';
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
    const value = e.parameter.value;
    let column = e.parameter.column || 8;

    if (!stt || value === undefined) throw new Error('Thiếu STT hoặc giá trị cập nhật');

    // Nếu column là ký tự (A, B, C...), chuyển sang số
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
  for (let i = 0; i < col.length; i++) {
    num = num * 26 + (col.charCodeAt(i) - 64);
  }
  return num;
} 