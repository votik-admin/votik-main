// Slugs are url friendly strings that are used to identify a resource. For example, a blog post with the title "Hello World" might have the slug "hello-world". This file contains utility functions to convert a string to a slug and to check if a string is a valid slug.

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(str: string): boolean {
  return str === slugify(str);
}
