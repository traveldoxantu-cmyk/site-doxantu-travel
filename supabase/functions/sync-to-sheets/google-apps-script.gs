// ============================================================
// Google Apps Script — Doxantu Travel CRM v2.1 (Performance & Robustesse)
// Colonnes: Date | Nom | Email | Téléphone | Service | Destination | Message | Fichiers | ID | Statut | Source | Action
// ============================================================

const SPREADSHEET_ID = "1bsBxOir-JhSPzjTdFBYU1QCerUMdjyGUJiX9sqE7Vko";
const SHEET_LEADS = "Feuille 1";
const SHEET_LOG   = "Logs";

const LEAD_HEADERS = [
  "Date", "Nom", "Email", "Téléphone", "Service",
  "Destination", "Message", "Fichiers",
  "ID Supabase", "Statut", "Source", "Action"
];

const COLORS = {
  "nouveau":   "#DBEAFE",
  "en_cours":  "#FEF9C3",
  "validated": "#DCFCE7",
  "rejected":  "#FEE2E2",
  "pending":   "#F3F4F6"
};

// ─── Point d'entrée POST ─────────────────────────────────────────────────────
function doPost(e) {
  // Utiliser un verrou pour éviter les collisions lors d'envois simultanés
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Attendre max 10 secondes
    
    const raw = e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(raw);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ensureSheet(ss);

    const action = data.action || "INSERT";
    const status = (data.status || "nouveau").toLowerCase();

    if (action === "DELETE") {
      const deleted = deleteRowById(sheet, data.id);
      logEvent(ss, "DELETE", data.id || "?", deleted ? "Supprimé" : "Non trouvé");
      return ok({ action: "DELETE", deleted });
    }

    if (action === "UPDATE") {
      const updated = updateRowById(sheet, data);
      if (!updated) appendLead(sheet, data, "UPDATE"); // Failover : insérer si non trouvé
      logEvent(ss, "UPDATE", data.id || "?", updated ? "Mis à jour" : "Failover Insert");
      return ok({ action: "UPDATE", updated });
    }

    // INSERT (Défaut)
    appendLead(sheet, data, "INSERT");
    logEvent(ss, "INSERT", data.id || "?", "Nouveau lead");
    return ok({ action: "INSERT" });

  } catch (err) {
    console.error("Erreur critique:", err);
    return ok({ success: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ok({ status: "online", version: "2.1", info: "Optimized for speed & concurrency" });
}

// ─── Initialisation & Cache Structure ────────────────────────────────────────
function ensureSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_LEADS);
  if (!sheet) sheet = ss.insertSheet(SHEET_LEADS);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(LEAD_HEADERS);
    sheet.getRange(1, 1, 1, LEAD_HEADERS.length)
         .setBackground("#072a50").setFontColor("white").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  
  // S'assurer que les logs existent
  if (!ss.getSheetByName(SHEET_LOG)) {
    const logSheet = ss.insertSheet(SHEET_LOG);
    logSheet.appendRow(["Date", "Action", "ID", "Résultat"]);
    logSheet.getRange(1, 1, 1, 4).setBackground("#1a2b40").setFontColor("white").setFontWeight("bold");
  }
  
  return sheet;
}

// Récupérer le mapping des colonnes pour éviter de scanner la feuille à chaque cellule
function getHeaderMap(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headers.forEach((h, i) => map[h] = i + 1);
  return map;
}

// ─── Formatage des fichiers ──────────────────────────────────────────────────
function formatFiles(fileString) {
  if (!fileString || fileString === "Aucun") return "Aucun";
  const urls = fileString.split(",").map(u => u.trim());
  if (urls.length === 1) {
    return `=HYPERLINK("${urls[0]}"; "Voir le document")`;
  }
  // Pour plusieurs fichiers, on met une formule qui pointe vers le premier mais liste le nombre
  return `=HYPERLINK("${urls[0]}"; "Ouvrir (${urls.length} fichiers)")`;
}

// ─── Opérations de base (Optimisées) ─────────────────────────────────────────
function appendLead(sheet, data, action) {
  const now = data.timestamp || new Date().toLocaleString("fr-FR", { timeZone: "Africa/Dakar" });
  const status = (data.status || "nouveau").toLowerCase();
  
  const rowData = [
    now,
    data.nom || "Non renseigné",
    data.email || "Non renseigné",
    data.tel || "Non renseigné",
    data.service || data.type || "",
    data.destination || "",
    data.message || "",
    formatFiles(data.files),
    data.id || "",
    status,
    data.source || "Supabase",
    action
  ];

  sheet.appendRow(rowData);
  
  // Appliquer la couleur de statut sur la dernière ligne
  const lastRow = sheet.getLastRow();
  const headerMap = getHeaderMap(sheet);
  const statCol = headerMap["Statut"];
  if (statCol) {
    sheet.getRange(lastRow, statCol).setBackground(COLORS[status] || "#F8FAFC");
  }
}

function updateRowById(sheet, data) {
  if (!data.id) return false;
  const headerMap = getHeaderMap(sheet);
  const idCol = headerMap["ID Supabase"];
  if (!idCol) return false;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(data.id)) {
      const row = i + 2;
      const status = (data.status || "nouveau").toLowerCase();
      
      // Mise à jour groupée pour la performance
      const updateMap = {
        "Nom": data.nom,
        "Email": data.email,
        "Téléphone": data.tel,
        "Service": data.service || data.type,
        "Destination": data.destination,
        "Message": data.message,
        "Statut": status,
        "Action": "UPDATE"
      };

      for (const [colName, val] of Object.entries(updateMap)) {
        if (val !== undefined && headerMap[colName]) {
          sheet.getRange(row, headerMap[colName]).setValue(val);
        }
      }
      
      // Couleur
      if (headerMap["Statut"]) {
        sheet.getRange(row, headerMap["Statut"]).setBackground(COLORS[status] || "#F8FAFC");
      }
      return true;
    }
  }
  return false;
}

function deleteRowById(sheet, id) {
  if (!id) return false;
  const headerMap = getHeaderMap(sheet);
  const idCol = headerMap["ID Supabase"];
  if (!idCol) return false;

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

// ─── Utilitaires ─────────────────────────────────────────────────────────────
function logEvent(ss, action, id, result) {
  const logSheet = ss.getSheetByName(SHEET_LOG);
  if (logSheet) logSheet.appendRow([new Date().toLocaleString("fr-FR"), action, id, result]);
}

function ok(data) {
  return ContentService.createTextOutput(JSON.stringify({ success: true, ...data }))
                       .setMimeType(ContentService.MimeType.JSON);
}
