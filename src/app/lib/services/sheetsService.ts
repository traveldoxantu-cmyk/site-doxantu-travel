// Service pour envoyer les données vers Google Sheets via un Webhook Apps Script
export const sheetsService = {
  sendDemande: async (data: any) => {
    // URL Hardcodée pour garantir le fonctionnement immédiat
    const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || 
                        "https://script.google.com/macros/s/AKfycbyI8HO8yMUOpXJrTQ92WqI8ApASkJgimWtPJk7lZdAamCVy8LzSeKWfeW3tWDUG9e_U_Q/exec";
    
    if (!WEBHOOK_URL) {
      console.warn("VITE_GOOGLE_SHEETS_WEBHOOK_URL non configuré. Envoi vers Sheets annulé.");
      return;
    }

    try {
      // Pour les Apps Script, si on utilise 'no-cors', il vaut mieux envoyer en text/plain
      // car application/json force un preflight OPTIONS qui échoue souvent sur Apps Script
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain', // Changé de application/json pour éviter CORS issues
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'Site Web Doxantu'
        }),
      });
      console.log("Données envoyées vers Google Sheets (mode no-cors)");
    } catch (err) {
      console.error("Erreur d'envoi vers Google Sheets:", err);
    }
  }
};
