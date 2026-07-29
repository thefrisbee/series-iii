// Land Rover Series III — Restauración
// Google Apps Script · desplegá como web app:
//   "Ejecutar como: Yo"  /  "Acceso: Cualquier usuario"
// Pegá la URL del web app en GitHub → Settings → Secrets → VITE_SCRIPT_URL

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName('data') || ss.getSheets()[0];
}

function doGet() {
  const value = getSheet().getRange('A1').getValue();
  const output = ContentService.createTextOutput(value || '{}');
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function doPost(e) {
  getSheet().getRange('A1').setValue(e.postData.contents);
  const output = ContentService.createTextOutput('ok');
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}
