/** Parse the displayed USD value exactly, without binary floating-point arithmetic. */
export function cents(text: string): number {
  const match = text.match(/\$(\d+)\.(\d{2})\b/);
  if (!match)
    throw new Error(`Expected a dollar amount with two decimal places, received: ${text}`);
  return Number(match[1]) * 100 + Number(match[2]);
}
