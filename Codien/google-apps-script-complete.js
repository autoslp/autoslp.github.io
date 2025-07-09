// Google Apps Script hoàn chỉnh - Sao chép toàn bộ code này vào Google Apps Script Editor

// Thay thế bằng ID Google Sheets của bạn
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Sheet1'; // Thay đổi tên sheet nếu cần

// Hàm doGet - bắt buộc phải có
function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Hàm doPost - xử lý dữ liệu từ form
function doPost(e) {
  try {
    // Kiểm tra xem có dữ liệu không
    if (!e.postData || !e.postData.contents) {
      throw new Error('Không có dữ liệu được gửi');
    }
    
    // Mở Google Sheets
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Parse dữ liệu JSON từ form
    const data = JSON.parse(e.postData.contents);
    
    // Tạo timestamp
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
    
    // Chuẩn bị dữ liệu để thêm vào sheet
    // Thứ tự cột khớp với bảng Google Sheets của bạn
    const rowData = [
      data.tencongviec || '',           // Việc cần làm
      '',                               // Cấp độ (để trống)
      data.vitrilam || '',              // Vị trí làm
      data.may || '',                   // Máy
      data.nguoithuchienchinh || '',    // Người thực hiện chính
      data.nguoithuchienph1 || '',      // Người thực hiện phụ 1
      data.trangthai || 'Chưa bắt đầu', // Trạng thái
      data.ngaybatdau || '',            // Ngày bắt đầu
      data.ngayketthuc || '',           // Ngày kết thúc
      data.ghichu || '',                // Ghi chú
      timestamp                         // Thời gian tạo
    ];
    
    // Thêm dữ liệu vào sheet
    sheet.appendRow(rowData);
    
    // Log để debug
    console.log('Dữ liệu đã được thêm:', rowData);
    
    // Trả về kết quả thành công
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Dữ liệu đã được lưu thành công!',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log lỗi
    console.error('Lỗi trong doPost:', error);
    
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
    console.log('✅ Kết nối thành công với Google Sheets!');
    console.log('📊 Tên sheet:', sheet.getName());
    console.log('📝 Số hàng hiện tại:', sheet.getLastRow());
    console.log('📋 Số cột hiện tại:', sheet.getLastColumn());
    return true;
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.toString());
    return false;
  }
}

// Hàm test thêm dữ liệu mẫu
function testAddSampleData() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
    
    const sampleData = [
      'Test công việc',
      'Cấp độ 1',
      'Khu vực test',
      'Máy test',
      'Mr Test',
      'Mr Helper',
      'Đang thực hiện',
      '01/01/2024',
      '02/01/2024',
      'Đây là test',
      timestamp
    ];
    
    sheet.appendRow(sampleData);
    console.log('✅ Đã thêm dữ liệu test thành công!');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu test:', error.toString());
    return false;
  }
}
