// Supabase Edge Function: sync-to-sheets
// Reçoit les Database Webhooks de Supabase et synchronise vers Google Sheets
// Déployer avec: supabase functions deploy sync-to-sheets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// URL du webhook Google Apps Script (depuis les variables d'env Supabase)
const SHEETS_WEBHOOK_URL = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL") || "";

// Clé secrète pour valider que les requêtes viennent bien de Supabase
const WEBHOOK_SECRET = Deno.env.get("SYNC_WEBHOOK_SECRET") || "";

interface SupabaseWebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Record<string, unknown> | null;
  old_record: Record<string, unknown> | null;
}

interface SheetsPayload {
  action: "INSERT" | "UPDATE" | "DELETE";
  timestamp: string;
  id: string;
  type: string;
  status: string;
  nom: string;
  email: string;
  tel: string;
  service: string;
  destination: string;
  message: string;
  files: string;
  source: string;
}

function extractSheetRow(
  record: Record<string, unknown>,
  action: "INSERT" | "UPDATE" | "DELETE"
): SheetsPayload {
  // Extraire les champs du JSONB `data`
  const data = (record.data as Record<string, unknown>) || {};

  // Gérer les fichiers joints (pour les dossiers visa/etudiant/devis)
  const rawFiles = data.files || data.fileUrls || data.documents || "Aucun";
  const files = Array.isArray(rawFiles)
    ? rawFiles.join(", ")
    : String(rawFiles);

  return {
    action,
    timestamp: new Date().toLocaleString("fr-FR", { timeZone: "Africa/Dakar" }),
    id: String(record.id || ""),
    type: String(record.type || data.type || ""),
    status: String(record.status || "nouveau"),
    nom: String(record.nom || data.nom || ""),
    email: String(record.email || data.email || "Non renseigné"),
    tel: String(record.tel || data.tel || "Non renseigné"),
    service: String(record.service || data.service || ""),
    destination: String(data.destination || data.to || record.destination || ""),
    message: String(data.message || ""),
    files: files,
    source: String(data.source || "Supabase Direct"),
  };
}

serve(async (req: Request) => {
  // Vérifier la méthode
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Vérifier le secret webhook (header x-webhook-secret)
  const secret = req.headers.get("x-webhook-secret");
  if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
    console.error("Secret invalide:", secret);
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: SupabaseWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  console.log(`[sync-to-sheets] Événement ${payload.type} sur ${payload.table}`);

  // Ne traiter que la table demandes
  if (payload.table !== "demandes") {
    return new Response(
      JSON.stringify({ skipped: true, reason: "table_not_tracked" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // Pour les DELETE, on n'a que old_record
  const record = payload.record || payload.old_record;
  if (!record) {
    return new Response(
      JSON.stringify({ skipped: true, reason: "no_record" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const sheetsPayload = extractSheetRow(record, payload.type);
  console.log("[sync-to-sheets] Payload préparé pour Sheets:", JSON.stringify(sheetsPayload));

  // Envoyer vers Google Sheets
  if (!SHEETS_WEBHOOK_URL) {
    console.error("[sync-to-sheets] ERREUR: GOOGLE_SHEETS_WEBHOOK_URL est vide !");
    return new Response(
      JSON.stringify({ success: false, error: "SHEETS_URL_NOT_SET" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    console.log("[sync-to-sheets] Envoi vers Google Sheets...");
    const sheetsResponse = await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(sheetsPayload),
    });

    const responseText = await sheetsResponse.text().catch(() => "no body");
    console.log(`[sync-to-sheets] Réponse Google (${sheetsResponse.status}): ${responseText}`);

    if (!sheetsResponse.ok) {
      throw new Error(`Google Apps Script a répondu avec le statut ${sheetsResponse.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, action: payload.type, id: sheetsPayload.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[sync-to-sheets] Erreur envoi vers Sheets:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
