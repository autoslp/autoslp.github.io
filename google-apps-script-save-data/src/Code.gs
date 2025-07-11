function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script is running!");
}

function doPost(e) {
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('Tonghop');
  
  const data = JSON.parse(e.postData.contents);
  
  const row = [
    data.field1, // Replace with actual field names
    data.field2,
    data.field3,
    // Add more fields as necessary
  ];
  
  sheet.appendRow(row);
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }));
}