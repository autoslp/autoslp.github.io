const SHEET_ID = '18ZLZbC8RjCvSyk_sLBvh3obi-_4TzgIlrDX09LkBXyo';
const SHEET_NAME = 'Tonghop';

function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error('Không có dữ liệu được gửi');
    }
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    // Log để debug
    Logger.log('=== NHẬN DỮ LIỆU ===');
    Logger.log('Data received:', JSON.stringify(data));

    // Case 1: Cập nhật cột U/V/W (người làm chính, hỗ trợ)
    if (data.stt && data.column && data.value && !data.action && data.column !== 'H') {
      Logger.log('=== CASE 1: CẬP NHẬT CỘT U/V/W ===');
      const stt = data.stt;
      const column = data.column; // 'U', 'V', 'W'
      const value = data.value;
      const values = sheet.getRange('A4:A1000').getValues();
      let rowIndex = -1;
      for (let i = 0; i < values.length; i++) {
        if ((values[i][0] + '').trim() === (stt + '').trim()) {
          rowIndex = i + 4;
          break;
        }
      }
      if (rowIndex === -1) {
        Logger.log('❌ Không tìm thấy STT: ' + stt);
        return ContentService
          .createTextOutput(JSON.stringify({status: 'error', message: 'Không tìm thấy STT'}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      let columnIndex;
      if (column === 'U') columnIndex = 21;
      else if (column === 'V') columnIndex = 22;
      else if (column === 'W') columnIndex = 23;
      else {
        Logger.log('❌ Cột không hợp lệ: ' + column);
        return ContentService
          .createTextOutput(JSON.stringify({status: 'error', message: 'Cột không hợp lệ'}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      sheet.getRange(rowIndex, columnIndex).setValue(value);
      Logger.log('✅ Cập nhật thành công: Row ' + rowIndex + ', Column ' + columnIndex + ', Value: ' + value);
      return ContentService
        .createTextOutput(JSON.stringify({status: 'success', message: 'Cập nhật thành công'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Case 2: Duyệt công việc (cập nhật cột H)
    if (data.stt && data.value && data.column === 'H') {
      Logger.log('=== CASE 2: DUYỆT CÔNG VIỆC ===');
      const stt = data.stt;
      const value = data.value;
      const values = sheet.getRange('A4:A1000').getValues();
      let rowIndex = -1;
      for (let i = 0; i < values.length; i++) {
        if ((values[i][0] + '').trim() === (stt + '').trim()) {
          rowIndex = i + 4;
          break;
        }
      }
      if (rowIndex === -1) {
        Logger.log('❌ Không tìm thấy STT: ' + stt);
        return ContentService
          .createTextOutput(JSON.stringify({status: 'error', message: 'Không tìm thấy STT'}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const oldValue = sheet.getRange(rowIndex, 8).getValue();
      sheet.getRange(rowIndex, 8).setValue(value);
      Logger.log('✅ Duyệt thành công: STT ' + stt + ', Row ' + rowIndex + ', Cột H: "' + oldValue + '" → "' + value + '"');
      return ContentService
        .createTextOutput(JSON.stringify({status: 'success', message: 'Cập nhật trạng thái thành công!'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Case 3: Cập nhật nhiều trường (updateRow)
    if (data.action === 'updateRow') {
      Logger.log('=== CASE 3: CẬP NHẬT NHIỀU TRƯỜNG ===');
      const stt = data.stt;
      const values = sheet.getRange('A4:A1000').getValues();
      let rowIndex = -1;
      for (let i = 0; i < values.length; i++) {
        if ((values[i][0] + '').trim() === (stt + '').trim()) {
          rowIndex = i + 4;
          break;
        }
      }
      if (rowIndex === -1) {
        Logger.log('❌ Không tìm thấy STT: ' + stt);
        return ContentService
          .createTextOutput(JSON.stringify({status: 'error', message: 'Không tìm thấy STT'}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      if ('hangmuc' in data) sheet.getRange('J' + rowIndex).setValue(data.hangmuc || '');
      if ('phanloai' in data) sheet.getRange('K' + rowIndex).setValue(data.phanloai || '');
      if ('vitri' in data) sheet.getRange('L' + rowIndex).setValue(data.vitri || '');
      if ('hientrang' in data) sheet.getRange('M' + rowIndex).setValue(data.hientrang || '');
      if ('nguyennhan' in data) sheet.getRange('N' + rowIndex).setValue(data.nguyennhan || '');
      if ('phuongan' in data) sheet.getRange('O' + rowIndex).setValue(data.phuongan || '');
      if ('vattu' in data) sheet.getRange('P' + rowIndex).setValue(data.vattu || '');
      if ('lamchinh' in data) sheet.getRange('U' + rowIndex).setValue(data.lamchinh || '');
      if ('lamphu1' in data) sheet.getRange('V' + rowIndex).setValue(data.lamphu1 || '');
      if ('lamphu2' in data) sheet.getRange('W' + rowIndex).setValue(data.lamphu2 || '');
      if ('thoigianbangiao' in data) sheet.getRange('Q' + rowIndex).setValue(data.thoigianbangiao || '');
      if ('xacnhan' in data) sheet.getRange('S' + rowIndex).setValue(data.xacnhan || '');
      if ('nguoiXacNhan' in data) sheet.getRange('T' + rowIndex).setValue(data.nguoiXacNhan || '');
      Logger.log('✅ Cập nhật nhiều trường thành công: STT ' + stt + ', Row ' + rowIndex);
      return ContentService
        .createTextOutput(JSON.stringify({status: 'success', message: 'Cập nhật thành công!'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Case 4: Thêm mới (appendRow) - chỉ khi có đủ dữ liệu cần thiết
    if (data.stt && (data.khuvuc || data.may || data.hientrangloi || data.nguoiyeucau)) {
      Logger.log('=== CASE 4: THÊM MỚI ===');
      const rowData = [
        data.stt || '',              // A
        data.khuvuc || '',           // B
        data.may || '',              // C
        data.thoigianyeucau || '',   // D
        data.hientrangloi || '',     // E
        data.nguoiyeucau || '',      // F
        data.quanlyxacnhan || '',    // G
        '',                          // H (bỏ trống nếu không có trường)
        data.hinhanh || ''           // I (link ảnh)
      ];
      sheet.appendRow(rowData);
      Logger.log('✅ Thêm mới thành công: STT ' + data.stt);
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Dữ liệu đã được lưu thành công!'
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*');
    }

    // Nếu không match case nào
    Logger.log('❌ Không match case nào, data:', JSON.stringify(data));
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Dữ liệu không hợp lệ hoặc không đủ thông tin'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');

  } catch (error) {
    Logger.log('❌ Lỗi:', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Lỗi: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

// Function test đơn giản
function testDuyetCongViec() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  
  // Test tìm STT CD-0001
  const values = sheet.getRange('A4:A1000').getValues();
  let rowIndex = -1;
  for (let i = 0; i < values.length; i++) {
    if ((values[i][0] + '').trim() === 'CD-0001') {
      rowIndex = i + 4;
      break;
    }
  }
  
  if (rowIndex === -1) {
    Logger.log('❌ Không tìm thấy STT CD-0001');
    return;
  }
  
  // Test cập nhật cột H
  const oldValue = sheet.getRange(rowIndex, 8).getValue();
  sheet.getRange(rowIndex, 8).setValue('Test Duyệt - ' + new Date().toLocaleString());
  
  Logger.log('✅ Test thành công!');
  Logger.log('STT: CD-0001');
  Logger.log('Row: ' + rowIndex);
  Logger.log('Cột H cũ: ' + oldValue);
  Logger.log('Cột H mới: Test Duyệt - ' + new Date().toLocaleString());
  
  // Khôi phục giá trị cũ
  sheet.getRange(rowIndex, 8).setValue(oldValue);
  Logger.log('🔄 Đã khôi phục giá trị cũ');
}

// Function test tìm STT
function testTimSTT() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const values = sheet.getRange('A4:A20').getValues();
  
  Logger.log('=== TEST TÌM STT ===');
  for (let i = 0; i < values.length; i++) {
    const stt = values[i][0];
    if (stt) {
      Logger.log(`Row ${i+4}: ${stt}`);
    }
  }
}

// Function test duyệt công việc với giá trị "Đã duyệt"
function testDuyetCongViecApprove() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  
  // Test tìm STT CD-0001
  const values = sheet.getRange('A4:A1000').getValues();
  let rowIndex = -1;
  for (let i = 0; i < values.length; i++) {
    if ((values[i][0] + '').trim() === 'CD-0001') {
      rowIndex = i + 4;
      break;
    }
  }
  
  if (rowIndex === -1) {
    Logger.log('❌ Không tìm thấy STT CD-0001');
    return;
  }
  
  // Test cập nhật cột H với "Đã duyệt"
  const oldValue = sheet.getRange(rowIndex, 8).getValue();
  sheet.getRange(rowIndex, 8).setValue('Đã duyệt');
  
  Logger.log('✅ Test duyệt thành công!');
  Logger.log('STT: CD-0001');
  Logger.log('Row: ' + rowIndex);
  Logger.log('Cột H cũ: ' + oldValue);
  Logger.log('Cột H mới: Đã duyệt');
  
  // Khôi phục giá trị cũ
  sheet.getRange(rowIndex, 8).setValue(oldValue);
  Logger.log('🔄 Đã khôi phục giá trị cũ');
}

// Function test từ chối công việc với giá trị "Không duyệt"
function testDuyetCongViecReject() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  
  // Test tìm STT CD-0001
  const values = sheet.getRange('A4:A1000').getValues();
  let rowIndex = -1;
  for (let i = 0; i < values.length; i++) {
    if ((values[i][0] + '').trim() === 'CD-0001') {
      rowIndex = i + 4;
      break;
    }
  }
  
  if (rowIndex === -1) {
    Logger.log('❌ Không tìm thấy STT CD-0001');
    return;
  }
  
  // Test cập nhật cột H với "Không duyệt"
  const oldValue = sheet.getRange(rowIndex, 8).getValue();
  sheet.getRange(rowIndex, 8).setValue('Không duyệt');
  
  Logger.log('✅ Test từ chối thành công!');
  Logger.log('STT: CD-0001');
  Logger.log('Row: ' + rowIndex);
  Logger.log('Cột H cũ: ' + oldValue);
  Logger.log('Cột H mới: Không duyệt');
  
  // Khôi phục giá trị cũ
  sheet.getRange(rowIndex, 8).setValue(oldValue);
  Logger.log('🔄 Đã khôi phục giá trị cũ');
} 