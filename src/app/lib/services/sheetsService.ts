// Service pour envoyer les données vers Google Sheets via un Webhook Apps Script
export const sheetsService = {
  sendDemande: async (data: any) => {
    const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!WEBHOOK_URL) {
      console.warn("VITE_GOOGLE_SHEETS_WEBHOOK_URL non configuré. Envoi vers Sheets annulé.");
      return;
    }

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // Important pour Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'Site Web Doxantu'
        }),
      });
    } catch (err) {
      console.error("Erreur d'envoi vers Google Sheets:", err);
    }
  }
};
