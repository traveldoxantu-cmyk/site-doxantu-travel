// ============================================================
// Google Apps Script — Doxantu Travel CRM v2.0
// Adapté pour la feuille "Feuille 1" existante
// Colonnes: Date | Nom | Email | Téléphone | Service | Destination | Message | Fichiers | ID | Statut | Source
// ============================================================

// ⚠️ REMPLACEZ par l'ID de votre Google Sheets (entre /d/ et /edit dans l'URL)
const SPREADSHEET_ID = "1bsBxOir-JhSPzjTdFBYU1QCerUMdjyGUJiX9sqE7Vko";

// Noms des feuilles
const SHEET_LEADS = "Feuille 1";   // Feuille existante
const SHEET_LOG   = "Logs";        // Feuille de logs (créée automatiquement)

// En-têtes cibles (correspond à votre sheet + nouvelles colonnes pour le suivi)
const LEAD_HEADERS = [
  "Date", "Nom", "Email", "Téléphone", "Service",
  "Destination", "Message", "Fichiers",
  "ID Supabase", "Statut", "Source", "Action"
];

// ─── Point d'entrée POST (formulaires web + Supabase webhook) ───────────────
function doPost(e) {
  try {
    const raw = e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(raw);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    ensureSheet(ss);

    const action = data.action || "INSERT";

    if (action === "DELETE") {
      const deleted = deleteRowById(ss, data.id);
      logEvent(ss, "DELETE", data.id || "?", deleted ? "Supprimé" : "Non trouvé");
      return ok({ action: "DELETE", deleted });
    }

    if (action === "UPDATE") {
      const updated = updateRowById(ss, data);
      if (!updated) appendLead(ss, data, "UPDATE");
      logEvent(ss, "UPDATE", data.id || "?", updated ? "Mis à jour" : "Inséré");
      return ok({ action: "UPDATE" });
    }

    // INSERT (depuis formulaire web ou Supabase)
    appendLead(ss, data, "INSERT");
    logEvent(ss, "INSERT", data.id || "?", "Nouveau lead");
    return ok({ action: "INSERT" });

  } catch (err) {
    console.error("Erreur:", err);
    return ok({ success: false, error: err.toString() });
  }
}

// ─── GET — test de santé ─────────────────────────────────────────────────────
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: "Doxantu Travel CRM", version: "2.0" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Initialiser la feuille si nécessaire ────────────────────────────────────
function ensureSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_LEADS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_LEADS);
  }

  // Vérifier que les colonnes sont bien là, sinon ajouter celles manquantes
  if (sheet.getLastRow() === 0) {
    // Feuille vide : créer les en-têtes
    sheet.appendRow(LEAD_HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, LEAD_HEADERS.length);
    headerRange.setBackground("#072a50").setFontColor("white").setFontWeight("bold");
    sheet.setFrozenRows(1);
  } else {
    // Feuille existante : vérifier si on a les nouvelles colonnes (ID Supabase, Statut, etc.)
    const lastCol = sheet.getLastColumn();
    const existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    // Ajouter les nouvelles colonnes si absentes
    const newCols = ["ID Supabase", "Statut", "Source", "Action"];
    newCols.forEach(col => {
      if (!existingHeaders.includes(col)) {
        const nextCol = sheet.getLastColumn() + 1;
        sheet.getRange(1, nextCol).setValue(col)
          .setBackground("#072a50").setFontColor("white").setFontWeight("bold");
      }
    });
  }

  // Créer la feuille Logs si absente
  if (!ss.getSheetByName(SHEET_LOG)) {
    const logSheet = ss.insertSheet(SHEET_LOG);
    logSheet.appendRow(["Date", "Action", "ID", "Résultat"]);
    logSheet.getRange(1, 1, 1, 4).setBackground("#1a2b40").setFontColor("white").setFontWeight("bold");
  }
}

// ─── Ajouter une ligne ────────────────────────────────────────────────────────
function appendLead(ss, data, action) {
  const sheet = ss.getSheetByName(SHEET_LEADS);
  if (!sheet) return;

  const now = data.timestamp || new Date().toLocaleString("fr-FR", { timeZone: "Africa/Dakar" });

  sheet.appendRow([
    now,                                          // Date
    data.nom         || "Non renseigné",          // Nom
    data.email       || "Non renseigné",          // Email
    data.tel         || "Non renseigné",          // Téléphone
    data.service     || data.type || "",          // Service
    data.destination || "",                       // Destination
    data.message     || "",                       // Message
    data.files       || data.fichiers || "Aucun", // Fichiers
    data.id          || "",                       // ID Supabase
    data.status      || "nouveau",               // Statut
    data.source      || "Site Web Doxantu",      // Source
    action,                                       // Action
  ]);

  // Couleur selon le statut
  const lastRow = sheet.getLastRow();
  const col = findColByName(sheet, "Statut");
  if (col > 0) sheet.getRange(lastRow, col).setBackground(getStatusColor(data.status));
}

// ─── Mettre à jour une ligne par ID Supabase ─────────────────────────────────
function updateRowById(ss, data) {
  const sheet = ss.getSheetByName(SHEET_LEADS);
  if (!sheet || !data.id) return false;

  const idCol = findColByName(sheet, "ID Supabase");
  if (idCol === 0) return false;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(data.id)) {
      const row = i + 2;
      const now = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Dakar" });

      // Mettre à jour chaque colonne individuellement
      setCell(sheet, row, "Date",       now);
      setCell(sheet, row, "Nom",        data.nom || null);
      setCell(sheet, row, "Email",      data.email || null);
      setCell(sheet, row, "Téléphone",  data.tel || null);
      setCell(sheet, row, "Service",    data.service || null);
      setCell(sheet, row, "Destination", data.destination || null);
      setCell(sheet, row, "Message",    data.message || null);
      setCell(sheet, row, "Statut",     data.status || null);
      setCell(sheet, row, "Source",     data.source || null);
      setCell(sheet, row, "Action",     "UPDATE");

      const statCol = findColByName(sheet, "Statut");
      if (statCol > 0) sheet.getRange(row, statCol).setBackground(getStatusColor(data.status));
      return true;
    }
  }
  return false;
}

// ─── Supprimer une ligne par ID Supabase ─────────────────────────────────────
function deleteRowById(ss, id) {
  const sheet = ss.getSheetByName(SHEET_LEADS);
  if (!sheet || !id) return false;

  const idCol = findColByName(sheet, "ID Supabase");
  if (idCol === 0) return false;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(id)) {
      sheet.deleteRow(i + 2);
      return true;
    }
  }
  return false;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function findColByName(sheet, name) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idx = headers.indexOf(name);
  return idx >= 0 ? idx + 1 : 0;
}

function setCell(sheet, row, colName, value) {
  if (value === null || value === undefined) return;
  const col = findColByName(sheet, colName);
  if (col > 0) sheet.getRange(row, col).setValue(value);
}

function logEvent(ss, action, id, result) {
  const logSheet = ss.getSheetByName(SHEET_LOG);
  if (!logSheet) return;
  logSheet.appendRow([new Date().toLocaleString("fr-FR"), action, id, result]);
}

function getStatusColor(status) {
  const colors = {
    "nouveau":   "#DBEAFE",
    "en_cours":  "#FEF9C3",
    "validated": "#DCFCE7",
    "rejected":  "#FEE2E2",
    "pending":   "#F3F4F6",
  };
  return colors[status] || "#F8FAFC";
}

function ok(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, ...data }))
    .setMimeType(ContentService.MimeType.JSON);
}
