export default function getInitials(text: string, length = 2) {
  return text
    .split(" ")
    .filter((word) => Boolean)
    .slice(0, length)
    .map((word) => word[0])
    .reduce((char, prev) => char + prev, "")
    .toUpperCase();
}
