// Service pour envoyer les données vers Google Sheets via un Webhook Apps Script
export const sheetsService = {
  sendDemande: async (data: any) => {
    // Utiliser l'URL de l'environnement ou la nouvelle URL stable
    const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || 
                        "https://script.google.com/macros/s/AKfycbxx2f5ZVtfszq98GuahrYlJstZ9QtFl8qtBieYfOzaNTir3XTkyfD0j2AdYZGDuywFHVQ/exec";
    
    if (!WEBHOOK_URL) {
      console.warn("[SheetsService] VITE_GOOGLE_SHEETS_WEBHOOK_URL non configuré. Envoi vers Sheets annulé.");
      return;
    }

    // Normalisation des données pour le Google Sheet
    // On s'adapte à la structure reçue (Visa, Contact, Billetterie, Inscription)
    const payload = {
      nom: data.nom || data.fullName || 'Inconnu',
      email: data.email || 'Non renseigné',
      tel: data.tel || data.phone || 'Non renseigné',
      service: data.service || 'Demande générale',
      destination: data.destination || data.to || 'Sénégal (Dakar)',
      message: data.message || 'Aucun message particulier',
      files: Array.isArray(data.files) ? data.files.join(", ") : 
             Array.isArray(data.fileUrls) ? data.fileUrls.join(", ") :
             (data.files || data.fileUrls || 'Aucun'),
      timestamp: new Date().toLocaleString('fr-FR'),
      source: data.source || 'Site Web Doxantu',
      meta: JSON.stringify(data.extra || {}) // Données supplémentaires au besoin
    };

    console.log(`[SheetsService] 📤 Envoi CRM (${payload.service}) pour ${payload.nom}...`);

    try {
      // Utilisation du mode 'no-cors' pour éviter les erreurs CORS avec Google Apps Script
      // Note: Avec 'no-cors', on ne peut pas lire le corps de la réponse mais l'exécution fonctionne.
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      });
      console.log("[SheetsService] ✅ Données transmises avec succès au CRM Google Sheets.");
      return { success: true };
    } catch (err) {
      console.error("[SheetsService] ❌ Échec de la synchronisation Google Sheets:", err);
      return { success: false, error: err };
    }
  }
};

