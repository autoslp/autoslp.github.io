function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const stt = data.stt;
    const column = data.column; // 'U' hoặc 'V'
    const value = data.value;
    
    // Mở spreadsheet
    const ss = SpreadsheetApp.openById('18ZLZbC8RjCvSyk_sLBvh3obi-_4TzgIlrDX09LkBXyo');
    const sheet = ss.getSheetByName('Tonghop');
    
    // Tìm dòng có STT tương ứng
    const dataRange = sheet.getRange('A4:A100');
    const values = dataRange.getValues();
    
    let rowIndex = -1;
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] === stt) {
        rowIndex = i + 4; // +4 vì bắt đầu từ dòng 4
        break;
      }
    }
    
    if (rowIndex === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({status: 'error', message: 'Không tìm thấy STT'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Xác định cột cần cập nhật
    let columnIndex;
    if (column === 'U') {
      columnIndex = 21; // Cột U (A=1, B=2, ..., U=21)
    } else if (column === 'V') {
      columnIndex = 22; // Cột V
    } else if (column === 'W') {
      columnIndex = 23; // Cột W
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({status: 'error', message: 'Cột không hợp lệ'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Cập nhật giá trị
    sheet.getRange(rowIndex, columnIndex).setValue(value);
    
    // Thêm timestamp vào cột ghi chú nếu cần
    const timestamp = new Date().toLocaleString('vi-VN');
    const noteColumn = 24; // Cột X cho ghi chú
    const currentNote = sheet.getRange(rowIndex, noteColumn).getValue() || '';
    const newNote = currentNote + `\n${timestamp}: ${value} nhận ${column === 'U' ? 'làm chính' : 'hỗ trợ'}`;
    sheet.getRange(rowIndex, noteColumn).setValue(newNote.trim());
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success', message: 'Cập nhật thành công'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm xử lý duyệt công việc (giữ nguyên từ script cũ)
function duyetCongViec(stt, value) {
  try {
    const ss = SpreadsheetApp.openById('18ZLZbC8RjCvSyk_sLBvh3obi-_4TzgIlrDX09LkBXyo');
    const sheet = ss.getSheetByName('Tonghop');
    
    const dataRange = sheet.getRange('A4:A100');
    const values = dataRange.getValues();
    
    let rowIndex = -1;
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] === stt) {
        rowIndex = i + 4;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return {status: 'error', message: 'Không tìm thấy STT'};
    }
    
    // Cập nhật cột H (index 8)
    sheet.getRange(rowIndex, 8).setValue(value);
    
    return {status: 'success', message: 'Cập nhật thành công'};
    
  } catch (error) {
    return {status: 'error', message: error.toString()};
  }
}
