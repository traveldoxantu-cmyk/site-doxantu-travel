import { supabase } from "../supabase";
import { sheetsService } from "./sheetsService";

export interface ContactSubmission {
  nom: string;
  email: string;
  tel: string;
  service: string;
  message?: string;
}

export const submitContactForm = async (data: ContactSubmission) => {
  try {
    if (!supabase) throw new Error("Supabase non initialisé");

    // 1. Insertion dans la table `demandes` (Supabase)
    const { error } = await supabase.from('demandes').insert({
      type: 'contact',
      status: 'nouveau',
      data: {
        nom: data.nom,
        email: data.email,
        tel: data.tel,
        service: data.service,
        message: data.message || '',
        source: 'Formulaire Contact',
        submittedAt: new Date().toISOString(),
      }
    });

    if (error) throw error;

    // 2. Synchronisation en arrière-plan avec Google Sheets (CRM)
    // On ne bloque pas l'utilisateur si Sheets est lent
    sheetsService.sendDemande({
      ...data,
      source: 'Site Web - Contact'
    }).catch(err => console.error("[ContactService] Erreur synchro Sheets secondaire:", err));

    return { success: true };
  } catch (e) {
    console.error("Erreur soumission formulaire contact:", e);
    return { success: false, error: e };
  }
};
