export function sanitizeRedirect(url: string): string {
  try {
    // Ensure the URL starts with '/' and doesn't contain any suspicious parts
    if (url && typeof url === "string") {
      // Decode URI components to handle encoded characters
      const decodedUrl = decodeURIComponent(url);

      // Check if the URL is a relative path and starts with a single slash
      if (
        decodedUrl.startsWith("/") &&
        !decodedUrl.startsWith("//") &&
        !decodedUrl.includes("://")
      ) {
        // Remove any double slashes or attempts to navigate up directories like '../'
        const sanitizedUrl = decodedUrl
          .replace(/\/{2,}/g, "/")
          .replace(/\.\.\//g, "");
        return sanitizedUrl;
      }
    }
  } catch (error) {
    console.error("Error sanitizing URL:", error);
  }
  // Return a safe default path if the URL is not valid
  return "/";
}
