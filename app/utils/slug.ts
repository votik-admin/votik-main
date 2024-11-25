export function slugify(str: string): string {
  // Replace spaces with hyphens
  str = str.replace(/\s+/g, "-");

  // Remove characters that aren't allowed (keeping letters, numbers, and hyphens)
  // Allow capital letters and common special characters like underscores
  str = str.replace(/[^a-zA-Z0-9\-_\.\@]/g, "");

  // Remove consecutive hyphens
  str = str.replace(/-{2,}/g, "-");

  // Trim hyphens from start and end
  str = str.replace(/^-+|-+$/g, "");

  return str;
}

export function isValidSlug(str: string): boolean {
  return str === slugify(str);
}
