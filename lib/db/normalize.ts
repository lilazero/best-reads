/**
 * Normalize MongoDB documents to plain JSON-safe values.
 * Recursively converts ObjectIds, Dates, and other MongoDB types to strings/primitives.
 */
export const normalizeValue = (value: unknown): unknown => {
  if (value == null) return value;

  if (typeof value === "object") {
    // Check array first to preserve structure
    if (Array.isArray(value)) {
      return value.map((item) => normalizeValue(item));
    }

    // Handle ObjectId (has toHexString method)
    const maybeHex = value as { toHexString?: () => string };
    if (typeof maybeHex.toHexString === "function") {
      return maybeHex.toHexString();
    }

    // Handle Date and other objects with custom toString
    const maybeString = value as { toString: () => string };
    if (
      typeof maybeString.toString === "function" &&
      maybeString.toString !== Object.prototype.toString
    ) {
      // Check if it's a Date
      if (value instanceof Date) {
        return value.toISOString();
      }
    }

    // Recursively normalize object properties
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        normalizeValue(v),
      ])
    );
  }

  return value;
};

/**
 * Normalize a MongoDB document, extracting _id as id string.
 */
export const normalizeDocument = <T>(doc: Record<string, unknown>): T => {
  const { _id, ...rest } = doc;
  const id = _id
    ? typeof (_id as { toString: () => string }).toString === "function"
      ? (_id as { toString: () => string }).toString()
      : String(_id)
    : (doc.id as string) ?? "";

  const normalized = normalizeValue(rest) as Record<string, unknown>;
  return { ...normalized, id } as T;
};
