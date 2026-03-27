/* 
  INSTRUCTIONS :
  1. Créez un nouveau Google Sheet.
  2. Allez dans Extensions > Apps Script.
  3. Effacez tout et collez ce code.
  4. Cliquez sur "Déployer" > "Nouvel envoi" > "Application Web".
  5. Exécuter en tant que : "Moi". Qui a accès : "Tout le monde".
  6. Copiez l'URL générée et mettez-la dans votre .env (VITE_GOOGLE_SHEETS_WEBHOOK_URL).
*/

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Ajout de la ligne dans le sheet
    sheet.appendRow([
      new Date(), 
      data.nom, 
      data.email, 
      data.tel, 
      data.service, 
      data.destination, 
      data.message,
      data.files || 'Aucun'
    ]);
    
    // Email automatique vers l'admin (VOUS)
    MailApp.sendEmail({
      to: "traveldoxantu@gmail.com",
      subject: "Nouveau Lead : " + data.nom + " (" + data.service + ")",
      body: "Un nouveau dossier a été déposé.\n\nNom: " + data.nom + "\nService: " + data.service + "\nFichiers: " + (data.files || 'Aucun')
    });

    // Email de confirmation au client
    MailApp.sendEmail({
      to: data.email,
      subject: "Confirmation de réception - Doxantu Travel",
      body: "Bonjour " + data.nom + ",\n\nNous avons bien reçu votre demande pour " + data.service + ".\nUn conseiller va traiter votre dossier dans les plus brefs délais.\n\nMerci de votre confiance.\nL'équipe Doxantu Travel"
    });

    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err).setMimeType(ContentService.MimeType.TEXT);
  }
}
