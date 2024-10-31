export function GET(
  request: Request,
  { params }: { params: Promise<{ text: string }> }
) {
  const { text } = await params;
}
