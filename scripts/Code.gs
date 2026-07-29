// Land Rover Series III — Restauración
// Google Apps Script · desplegá como web app:
//   "Ejecutar como: Yo"  /  "Acceso: Cualquier usuario"
// Pegá la URL del web app en GitHub → Settings → Secrets → VITE_SCRIPT_URL

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('data');
  const value = sheet.getRange('A1').getValue();
  const output = ContentService.createTextOutput(value || '{}');
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('data');
  sheet.getRange('A1').setValue(e.postData.contents);
  const output = ContentService.createTextOutput('ok');
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}
