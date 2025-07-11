const SHEET_ID = '18ZLZbC8RjCvSyk_sLBvh3obi-_4TzgIlrDX09LkBXyo';
const SHEET_NAME = 'Tonghop';

// Hàm doGet - kiểm tra kết nối
function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Hàm doPost - nhận dữ liệu từ form và ghi vào sheet
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error('Không có dữ liệu được gửi');
    }
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    // Ghi đúng thứ tự cột: STT | Khu vực | Máy | Thời gian yêu cầu | Hiện trạng lỗi | Người yêu cầu | Quản lý xác nhận
    const rowData = [
      data.stt || '',              // STT
      data.khuvuc || '',           // Khu vực
      data.may || '',              // Máy
      data.thoigianyeucau || '',   // Thời gian yêu cầu
      data.hientrangloi || '',     // Hiện trạng lỗi
      data.nguoiyeucau || '',      // Người yêu cầu
      data.quanlyxacnhan || ''     // Quản lý xác nhận
    ];

    sheet.appendRow(rowData);

    // Trả về kết quả thành công
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Dữ liệu đã được lưu thành công!'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Trả về lỗi
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Lỗi: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm test để kiểm tra kết nối với Google Sheets
function testConnection() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    Logger.log('✅ Kết nối thành công với Google Sheets!');
    Logger.log('📊 Tên sheet:', sheet.getName());
    Logger.log('📝 Số hàng hiện tại:', sheet.getLastRow());
    Logger.log('📋 Số cột hiện tại:', sheet.getLastColumn());
    return true;
  } catch (error) {
    Logger.log('❌ Lỗi kết nối:', error.toString());
    return false;
  }
} 