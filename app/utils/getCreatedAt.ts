export default function getCreatedAt(date: string) {
  // return in format March 2025
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString("default", { month: "long" });
  const year = dateObj.getFullYear();
  return `${month} ${year}`;
}
