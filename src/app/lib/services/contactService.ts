import { apiFetch } from "../api";

export interface ContactSubmission {
  nom: string;
  email: string;
  tel: string;
  service: string;
  message?: string;
}

export const submitContactForm = async (data: ContactSubmission) => {
  try {
    const result = await apiFetch<any>('/demandes', {
      method: 'POST',
      body: JSON.stringify({ 
        type: 'contact',
        nom: data.nom,
        email: data.email,
        tel: data.tel,
        service: data.service,
        message: data.message,
        status: 'nouveau',
        data: {
          recipient: 'traveldoxantu@gmail.com',
          submittedAt: new Date().toISOString()
        }
      })
    });

    console.log("Data inserted successfully:", result);
    return { success: true, data: result };
  } catch (e) {
    console.error("Error adding document to Supabase: ", e);
    return { success: false, error: e };
  }
};
