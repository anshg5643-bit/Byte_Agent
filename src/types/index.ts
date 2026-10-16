export interface ColumnSchema {
  name: string;
  type: "string" | "number" | "boolean" | "date";
  rawType: string;
  nullCount: number;
  nullPercentage: number;
  uniqueCount: number;
  sampleValues: (string | number | boolean)[];
  isNumeric: boolean;
  min?: number;
  max?: number;
  avg?: number;
}

export interface DataRow {
  [key: string]: string | number | boolean | null;
}

export interface Dataset {
  id: string;
  name: string;
  filename: string;
  description: string;
  rowsCount: number;
  columnsCount: number;
  activeMemorySize: string;
  benchmarkType: string;
  columns: ColumnSchema[];
  rows: DataRow[];
}

export interface DomainRule {
  id: string;
  ruleCode: string;
  name: string;
  description: string;
  category: "User Correction" | "User Preference" | "Domain Logic" | "Agent Learning";
  confidence: number;
  appliedCount: number;
  enabled: boolean;
  createdAt: string;
  sqlConstraint?: string;
}

export interface AgentExecutionStep {
  stepNumber: number;
  id: string;
  toolName: string;
  status: "idle" | "running" | "completed" | "error";
  durationMs: number;
  summary: string;
  inputParams: Record<string, unknown>;
  outputResult: Record<string, unknown>;
  generatedCodeOrSql?: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: "Academic Evaluator" | "Student Contributor" | "Guest Scholar";
  clearanceLevel: "Full Clearance" | "Sandbox Mode" | "Restricted";
  affiliation: string;
  avatarUrl: string;
  apiKeySet: boolean;
  llmProvider: string;
}

export interface MemoryNode {
  id: string;
  label: string;
  group: "rule" | "column" | "insight" | "constraint";
  val: number;
  color: string;
  description: string;
}

export interface MemoryLink {
  source: string;
  target: string;
  relation: string;
}
