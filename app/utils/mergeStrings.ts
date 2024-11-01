export default function mergeStrings(
  strings: (string | null | undefined)[],
  separator: string = " "
) {
  return strings.filter((s) => !!s).join(separator);
}
