const HIGH_RISK_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  {
    pattern:
      /(?:API_KEY|SECRET_TOKEN|ACCESS_TOKEN|PRIVATE_KEY)\s*=\s*["'][^"']{8,}["']/i,
    label: "hardcoded API/secret assignment",
  },
  {
    pattern: /password\s*[:=]\s*["'][^"']{6,}["']/i,
    label: "hardcoded password assignment",
  },
  {
    pattern: /privateKey\s*[:=]\s*["'][^"']+/i,
    label: "private key assignment",
  },
  {
    pattern: /Authorization\s*:\s*Bearer\s+\S+/i,
    label: "Bearer authorization header",
  },
  {
    pattern: /\bsk-[a-zA-Z0-9]{20,}\b/,
    label: "OpenAI-style API key",
  },
  {
    pattern: /-----BEGIN (?:RSA )?PRIVATE KEY-----/,
    label: "PEM private key block",
  },
  {
    pattern:
      /(?:secret|api_?key|auth_?token)\s*[:=]\s*["'][a-zA-Z0-9_\-/+]{24,}["']/i,
    label: "long secret-like assignment",
  },
];

export type SecretScanResult = {
  blocked: boolean;
  reasons: string[];
};

export function scanForSecrets(code: string): SecretScanResult {
  const reasons: string[] = [];

  for (const { pattern, label } of HIGH_RISK_PATTERNS) {
    if (pattern.test(code)) {
      reasons.push(label);
    }
  }

  return {
    blocked: reasons.length > 0,
    reasons,
  };
}

export function isCodeBlockedForAi(code: string | undefined): SecretScanResult {
  if (!code) {
    return { blocked: false, reasons: [] };
  }
  return scanForSecrets(code);
}
