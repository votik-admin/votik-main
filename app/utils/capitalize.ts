export const capitalize = (text?: string | null) => {
  if (!text || text.length === 0 || typeof text !== "string") return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
