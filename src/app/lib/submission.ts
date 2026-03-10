const WHATSAPP_NUMBER = "221780000000";

type SubmissionPayload = Record<string, string | number | boolean | null | undefined>;

function formatValue(value: SubmissionPayload[string]) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  return String(value);
}

export function buildWhatsAppMessage(
  title: string,
  payload: SubmissionPayload,
  footer = "Envoyé depuis le site Doxantu Travel."
) {
  const lines = Object.entries(payload).map(([key, value]) => `• ${key}: ${formatValue(value)}`);
  return [title, "", ...lines, "", footer].join("\n");
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppSubmission(message: string) {
  window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
}

