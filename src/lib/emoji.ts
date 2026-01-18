import { emojify } from "node-emoji";

/**
 * Convert GitHub emoji shortcodes to unicode emoji
 * e.g. ":rocket:" → "🚀"
 */
export function parseEmoji(text: string | null | undefined): string {
  if (!text) return "";
  return emojify(text);
}
