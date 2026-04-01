// Service pour envoyer les données vers Google Sheets via un Webhook Apps Script
export const sheetsService = {
  sendDemande: async (data: any) => {
    // Utiliser l'URL de l'environnement ou la nouvelle URL stable
    const WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || 
                        "https://script.google.com/macros/s/AKfycbyI8HO8yMUOpXJrTQ92WqI8ApASkJgimWtPJk7lZdAamCVy8LzSeKWfeW3tWDUG9e_U_Q/exec";
    
    if (!WEBHOOK_URL) {
      console.warn("VITE_GOOGLE_SHEETS_WEBHOOK_URL non configuré. Envoi vers Sheets annulé.");
      return;
    }

    // Normalisation des données pour le Google Sheet
    const payload = {
      nom: data.nom || 'Inconnu',
      email: data.email || 'Non renseigné',
      tel: data.tel || 'Non renseigné',
      service: data.service || 'Demande générale',
      destination: data.destination || data.to || 'Non spécifiée',
      message: data.message || 'Aucun message particulier',
      files: data.files || 'Aucun',
      timestamp: new Date().toLocaleString('fr-FR'),
      source: data.source || 'Site Web Doxantu'
    };

    try {
      // Utilisation du mode 'no-cors' pour éviter les erreurs CORS avec Google Apps Script
      // Note: Avec 'no-cors', on ne peut pas lire la réponse, mais l'envoi fonctionne.
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      });
      console.log("Données transmises au CRM Google Sheets");
    } catch (err) {
      console.error("Échec de la synchronisation Google Sheets:", err);
    }
  }
};

