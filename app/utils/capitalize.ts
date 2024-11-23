export const capitalize = (text?: string | null) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};
