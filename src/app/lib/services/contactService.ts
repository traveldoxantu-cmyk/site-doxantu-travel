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

    // Insertion dans la table `demandes` avec la bonne structure JSONB
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

    // Sync CRM Google Sheets (fire-and-forget, non bloquant)
    sheetsService.sendDemande({
      ...data,
      source: 'Formulaire Contact'
    }).catch(console.warn);

    return { success: true };
  } catch (e) {
    console.error("Erreur soumission formulaire contact:", e);
    return { success: false, error: e };
  }
};
