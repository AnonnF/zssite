export const HIGHLIGHT_LIMITS = {
  maxFileSizeKb: 80,
  maxFileLines: 1500,
} as const;

export function shouldSkipFullFileHighlight(
  code: string
): { skip: true; reason: string } | { skip: false } {
  const sizeKb = Buffer.byteLength(code, "utf8") / 1024;
  const lines = code.split("\n").length;

  if (sizeKb > HIGHLIGHT_LIMITS.maxFileSizeKb) {
    return {
      skip: true,
      reason: `tooLarge (${sizeKb.toFixed(1)}KB > ${HIGHLIGHT_LIMITS.maxFileSizeKb}KB)`,
    };
  }

  if (lines > HIGHLIGHT_LIMITS.maxFileLines) {
    return {
      skip: true,
      reason: `tooManyLines (${lines} > ${HIGHLIGHT_LIMITS.maxFileLines})`,
    };
  }

  return { skip: false };
}
