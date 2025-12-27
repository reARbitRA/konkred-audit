export type PRICEUseCase = 'Ad-hoc' | 'SOP' | 'Pipeline';

export interface DLARequestData {
    outputCharCount: number;
    apiLatencySeconds: number;
    editSessionSeconds: number;
    apiCostUsd: number;
    humanWpm: number;
    humanReadingWpm: number;
    hourlyWage: number;
}


export interface EAVPRequestData {
  outputChars: number;
  userWPM: number;
  editTime: number;
  regenerations: number;
  marketRate: number;
}

export interface PRICERequestData {
  humanTimeMinutes: number;
  humanHourlyRate: number;
  reviewTimeMinutes: number;
  tokenCost: number;
  reliability: number;
  yearlyVolume: number;
  useCase: PRICEUseCase;
  // Fix: Synchronized valuedParameter and parameterWeight into PRICERequestData definition.
  valuedParameter: string;
  parameterWeight: number;
}

export interface VECTORRequestData {
  score_constraints: number;
  score_context: number;
  score_feasibility: number;
  score_safety: number;
  human_hourly_rate: number;
  time_saved_minutes: number;
  annual_volume: number;
  revenue_lift_per_run: number;
  api_cost_per_run: number;
}

export interface ValuationRequest extends Partial<DLARequestData>, Partial<EAVPRequestData>, Partial<PRICERequestData>, Partial<VECTORRequestData> {
  inputPrompt: string;
}

// ===============================================
// NEW TYPES FOR ACCOLADES
// ===============================================

export type BadgeTier = 'Gold' | 'Silver' | 'Bronze';
export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: BadgeTier;
  icon: string; // Icon name from lucide-react
}

// ===============================================
// NEW TYPES FOR MULTI-METHOD VALUATION
// ===============================================

export type ValuationMethod = 'DLA' | 'PVC' | 'SCOPE' | 'EAVP' | 'PRICE' | 'VECTOR' | 'ALL';

// ===============================================
// PROVIDER TYPES
// ===============================================
export type AIProvider = 'GEMINI' | 'GROQ' | 'CEREBRAS' | 'SAMBANOVA' | 'OPENROUTER' | 'HUGGINGFACE';

export interface ProviderConfig {
  id: AIProvider;
  name: string;
  model: string;
  baseUrl?: string;
  icon: string;
  color?: string;
}

export interface APIKeys {
  GEMINI?: string;
  GROQ?: string;
  CEREBRAS?: string;
  SAMBANOVA?: string;
  OPENROUTER?: string;
  HUGGINGFACE?: string;
}


// --- Interfaces for DLA Method (Differential Labor Arbitrage) ---
export interface DLACalculations {
    grossLaborValue: number;
    hiddenFrictionCost: number;
    trueNetValue: number;
    isProfitable: boolean;
    manualMinutes: number;
    waitCost: number;
    readingCost: number;
    fixingCost: number;
}
export interface DLAReport {
    method: 'DLA';
    inputPrompt: string;
    inputRequest: DLARequestData;
    calculations: DLACalculations;
    timestamp: string;
    watermark: string;
}


// --- Interfaces for PVC Method (Prompt Value Calculator) ---

export interface PVCRawScores {
  G_r: number; // Goal clarity
  C_r: number; // Context sufficiency
  S_r: number; // Instructional specificity
  D_r: number; // Structure / decomposition
  F_r: number; // Feasibility
  A_r: number; // Ambiguity / underspecification (higher is worse)
  R_r: number; // Safety / compliance risk (higher is worse)
  reasoning: string; 
}

export interface PVCNormalizedScores {
  G: number;
  C: number;
  S: number;
  D: number;
  F: number;
  A: number;
  R: number;
}

export interface PVCCalculations {
  baseQ: number;
  qPen: number;
  lNorm: number;
  finalScore: number;
}

export interface PVCReport {
  method: 'PVC';
  inputPrompt: string;
  rawScores: PVCRawScores;
  normalizedScores: PVCNormalizedScores;
  calculations: PVCCalculations;
  tokenCount: number;
  timestamp: string;
  watermark: string;
  accolades: Badge[];
}

// --- Interfaces for SCOPE Method (S.C.O.P.E. Valuation Standard) ---

export interface SCOPEVariables {
  S: number;  // Structure (0-1)
  H: number;  // Constraint Hardness (0-1)
  D: number;  // Contextual Density (0-1)
  E: number;  // Ambiguity Entropy (0-1, higher is worse)
  Teff: number; // Token Efficiency (0-1)
}

export interface SCOPECalculations {
  pvi: number;
}

export interface SCOREReport {
  method: 'SCOPE';
  inputPrompt: string;
  variables: SCOPEVariables;
  calculations: SCOPECalculations;
  timestamp: string;
  watermark: string;
  accolades: Badge[];
}

// --- Interfaces for EAVP Method (Empirical Asset Verification Protocol) ---
export interface EAVPCalculations {
  manualCreationMinutes: number;
  correctionTaxMinutes: number;
  netMinutesSaved: number;
  auditedValue: number;
  grossLaborValue: number;
  correctionCost: number;
}
export interface EAVPReport {
  method: 'EAVP';
  inputPrompt: string;
  inputRequest: EAVPRequestData;
  calculations: EAVPCalculations;
  timestamp: string;
  watermark: string;
}

// --- Interfaces for PRICE Method (P.R.I.C.E. Protocol) ---
export interface PRICECalculations {
    humanCost: number;
    aiCost: number;
    reviewCost: number;
    operationalCost: number;
    netRunSavings: number;
    totalAssetValue: number;
    freelancePrice: number;
    marketplacePrice: number;
}
export interface PRICEReport {
    method: 'PRICE';
    inputPrompt: string;
    inputRequest: PRICERequestData;
    calculations: PRICECalculations;
    timestamp: string;
    watermark: string;
}

// --- Interfaces for VECTOR Method (V.E.C.T.O.R. Valuation System) ---
export interface VECTORCalculations {
  Q: number;
  gross_labor_value: number;
  gross_total_value: number;
  correction_cost: number;
  net_utility: number;
  total_annual_value: number;
  freelance_price: number;
  marketplace_price: number;
}
export interface VECTORReport {
  method: 'VECTOR';
  inputPrompt: string;
  inputRequest: VECTORRequestData;
  calculations: VECTORCalculations;
  status: "VIABLE ASSET" | "SCRAP ASSET";
  reason?: string;
  timestamp: string;
  watermark: string;
}

// --- Smart Analysis Types ---
export interface PromptStructureAnalysis {
  charCount: number;
  wordCount: number;
  hasHardConstraints: boolean;
  hardConstraintCount: number;
  hasSoftConstraints: boolean;
  hasOutputFormat: boolean;
  hasExamples: boolean;
  hasContext: boolean;
  complexityLevel: 'simple' | 'moderate' | 'complex';
  estimatedOutputLength: 'short' | 'medium' | 'long';
  taskType: 'creative' | 'analytical' | 'technical' | 'conversational';
  isRepeatable: boolean;
}

// --- Union type for the main report state ---
export type ValuationReport = DLAReport | PVCReport | SCOREReport | EAVPReport | PRICEReport | VECTORReport;