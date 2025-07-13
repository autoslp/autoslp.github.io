function doPost(e) {
    try {
      var data = JSON.parse(e.postData.contents);
  
      // Cập nhật nhiều cột theo action updateRow
      if (data.action === 'updateRow') {
        var stt = data.stt;
        var ss = SpreadsheetApp.openById('18ZLZbC8RjCvSyk_sLBvh3obi-_4TzgIlrDX09LkBXyo');
        var sheet = ss.getSheetByName('Tonghop');
        var values = sheet.getRange('A4:A1000').getValues();
        var rowIndex = -1;
        for (var i = 0; i < values.length; i++) {
          if (values[i][0] == stt) {
            rowIndex = i + 4; // vì bắt đầu từ dòng 4
            break;
          }
        }
        if (rowIndex > 0) {
          // Cập nhật các cột
          sheet.getRange('J' + rowIndex).setValue(data.hangmuc || '');
          sheet.getRange('K' + rowIndex).setValue(data.phanloai || '');
          sheet.getRange('L' + rowIndex).setValue(data.vitri || '');
          sheet.getRange('M' + rowIndex).setValue(data.hientrang || '');
          sheet.getRange('N' + rowIndex).setValue(data.nguyennhan || '');
          sheet.getRange('O' + rowIndex).setValue(data.phuongan || '');
          sheet.getRange('P' + rowIndex).setValue(data.vattu || '');
          sheet.getRange('U' + rowIndex).setValue(data.lamchinh || '');
          sheet.getRange('V' + rowIndex).setValue(data.lamphu1 || '');
          sheet.getRange('W' + rowIndex).setValue(data.lamphu2 || '');
          sheet.getRange('Q' + rowIndex).setValue(data.thoigianbangiao || '');
          sheet.getRange('S' + rowIndex).setValue(data.xacnhan || '');
          sheet.getRange('T' + rowIndex).setValue(data.nguoiXacNhan || '');
          return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
        } else {
          return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Không tìm thấy STT'})).setMimeType(ContentService.MimeType.JSON);
        }
      }
  
      // Các chức năng khác (ví dụ: gán người làm chính, hỗ trợ, ... nếu cần)
      // Ví dụ: gán 1 cột duy nhất
      if (data.stt && data.column && data.value && !data.action) {
        var ss = SpreadsheetApp.openById('18ZLZbC8RjCvSyk_sLBvh3obi-_4TzgIlrDX09LkBXyo');
        var sheet = ss.getSheetByName('Tonghop');
        var values = sheet.getRange('A4:A1000').getValues();
        var rowIndex = -1;
        for (var i = 0; i < values.length; i++) {
          if (values[i][0] == data.stt) {
            rowIndex = i + 4;
            break;
          }
        }
        if (rowIndex > 0) {
          var colMap = {U: 21, V: 22, W: 23};
          var col = colMap[data.column];
          if (col) {
            sheet.getRange(rowIndex, col).setValue(data.value);
            return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
          }
        }
        return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Không tìm thấy STT hoặc cột'})).setMimeType(ContentService.MimeType.JSON);
      }
  
      // Nếu không khớp action nào
      return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Sai action hoặc thiếu tham số'})).setMimeType(ContentService.MimeType.JSON);
  
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Nếu cần, có thể thêm doGet để test API
  function doGet(e) {
    return ContentService.createTextOutput('Google Apps Script is running!').setMimeType(ContentService.MimeType.TEXT);
  }