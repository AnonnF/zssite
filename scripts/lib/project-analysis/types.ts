export type ScannerConfig = {
  projectId: string;
  title?: string;
  include: string[];
  exclude: string[];
  maxFileSizeKb: number;
  readCode: boolean;
};

export const DEFAULT_SCANNER_CONFIG: Omit<ScannerConfig, "projectId"> = {
  include: [],
  exclude: [],
  maxFileSizeKb: 100,
  readCode: true,
};
