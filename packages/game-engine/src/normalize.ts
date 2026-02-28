export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase();
}

export function recognitionMatches(answer: string, title: string | undefined, aliases: string[]): boolean {
  const normalizedAnswer = normalizeAnswer(answer);
  if (!normalizedAnswer) return false;
  const accepted = [title ?? "", ...aliases]
    .map((item) => normalizeAnswer(item))
    .filter((item) => item.length > 0);
  return accepted.includes(normalizedAnswer);
}
