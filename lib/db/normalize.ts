// Normalize MongoDB documents to plain JSON-safe values
export const normalizeValue = (value: unknown): unknown => {
  if (value == null) return value;

  if (typeof value === "object") {
    // Check array first to preserve structure
    if (Array.isArray(value)) {
      return value.map((item) => normalizeValue(item));
    }

    const maybeHex = value as { toHexString?: () => string };
    if (typeof maybeHex.toHexString === "function") {
      return maybeHex.toHexString();
    }

    const maybeString = value as { toString: () => string };
    if (
      typeof maybeString.toString === "function" &&
      maybeString.toString !== Object.prototype.toString
    ) {
      return maybeString.toString();
    }

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        normalizeValue(v),
      ])
    );
  }

  return value;
};
