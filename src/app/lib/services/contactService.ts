import { supabase } from "../supabase";

export interface ContactSubmission {
  nom: string;
  tel: string;
  service: string;
  message?: string;
}

export const submitContactForm = async (data: ContactSubmission) => {
  if (!supabase) {
    console.warn('Supabase non configuré — formulaire de contact non enregistré en base.');
    return { success: true, data: null }; // On laisse quand même WhatsApp se déclencher
  }

  try {
    const { data: result, error } = await supabase
      .from('submissions')
      .insert([{ ...data, status: 'new' }]);

    if (error) throw error;

    console.log("Data inserted successfully:", result);
    return { success: true, data: result };
  } catch (e) {
    console.error("Error adding document to Supabase: ", e);
    return { success: false, error: e };
  }
};
