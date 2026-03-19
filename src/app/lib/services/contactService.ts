import { apiFetch } from "../api";

export interface ContactSubmission {
  nom: string;
  tel: string;
  service: string;
  message?: string;
}

export const submitContactForm = async (data: ContactSubmission) => {
  try {
    const result = await apiFetch<any>('/submissions', {
      method: 'POST',
      body: JSON.stringify({ ...data, status: 'new' })
    });

    console.log("Data inserted successfully:", result);
    return { success: true, data: result };
  } catch (e) {
    console.error("Error adding document to Supabase: ", e);
    return { success: false, error: e };
  }
};
