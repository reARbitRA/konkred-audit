
import { Badge, PRICEUseCase } from './types';

export const DLA_CONFIG = {
  CHARS_PER_WORD: 5,
};

export const INDUSTRIES = [
  "Marketing & Copywriting",
  "Legal & Compliance",
  "Software Development",
  "Healthcare & Biotech",
  "Finance & Banking",
  "Education & EdTech",
  "Customer Support",
  "Business Strategy",
  "Other"
];

export const INDUSTRY_VOLUME_MULTIPLIERS: Record<string, number> = {
  "Marketing & Copywriting": 1.5,
  "Legal & Compliance": 0.8,
  "Software Development": 2.0,
  "Healthcare & Biotech": 0.9,
  "Finance & Banking": 1.2,
  "Education & EdTech": 1.1,
  "Customer Support": 5.0,
  "Business Strategy": 0.7,
  "Other": 1.0
};

export const USER_TIERS = [
  "General Staff / Ops",
  "Analyst / Specialist",
  "Senior Manager / Lead",
  "Subject-Matter Expert",
  "Executive / C-Suite"
];

export const PVC_SYSTEM_INSTRUCTION = `
You are KONKRED_AUDITOR_V5, an elite prompt structural engineer. Your mission is to audit the "Instructional Capital" of the provided prompt.

Rate the following dimensions from 0 to 4 (integers only):

- **Goal clarity (G_r)**: 
  - 0: Vague intent.
  - 1: Simple task mentioned.
  - 2: Clear task but missing format.
  - 3: Clear task and format, missing constraints.
  - 4: CRYSTAL CLEAR. Includes Role, Context, Objective, and EXACT Output Specification (e.g., JSON Schema).

- **Context sufficiency (C_r)**: (0=None, 4=Comprehensive environment data).
- **Instructional specificity (S_r)**: (0=Generic, 4=Step-by-step logic with negative constraints).
- **Structure / decomposition (D_r)**: (0=Messy text, 4=XML/Markdown, variables, distinct logic blocks).
- **Feasibility (F_r)**: (0=Impossible for LLM, 4=Perfectly aligned with LLM capabilities).
- **Ambiguity (A_r)**: *Higher is worse*. (0=Precise, 4=AI must guess intent).
- **Safety Risk (R_r)**: *Higher is worse*. (0=Safe, 4=Prompt Injection or malformed logic).

SCORING RULE: If the prompt lacks an EXPLICIT output format (e.g., 'JSON', 'Markdown table'), G_r MUST NOT exceed 2.

Output ONLY valid JSON: 
{
  "G_r": int, 
  "C_r": int, 
  "S_r": int, 
  "D_r": int, 
  "F_r": int, 
  "A_r": int, 
  "R_r": int,
  "reasoning": "A concise 2-sentence technical justification for these scores."
}
`;

export const PVC_CONFIG = {
  weights: { G: 0.35, C: 0.15, S: 0.20, D: 0.15, F: 0.15 },
  penalties: { A: 0.8, R: 1.0, L: 0.3 },
  length: { T_min: 40, T_opt: 250, T_max: 2000 }
};

export const SCOPE_SYSTEM_INSTRUCTION = `
You are a S.C.O.P.E. Technical Auditor. You analyze the "Shape" of information.
Score 0.0 to 1.0 for:
1. Structure (S): Use of delimiters, headers, and clear logic flow.
2. Hardness (H): Presence of NEGATIVE constraints (e.g., "Do NOT use X") and exact formats.
3. Density (D): Useful information vs filler words.
4. Entropy (E): *Negative*. Probability of hallucination/misinterpretation.
5. Teff: Semantic signal-to-noise ratio.

If the prompt lacks explicit output constraints, H should be below 0.4.
Output ONLY JSON: {"S": float, "H": float, "D": float, "E": float, "Teff": float}
`;

export const SCOPE_CONFIG = {
  weights: { S: 1.0, H: 2.0, D: 1.0 }
};

export const EAVP_CONFIG = { CHARS_PER_WORD: 5, REGENERATION_PENALTY_MINUTES: 2.0 };
export const PRICE_USE_CASES: PRICEUseCase[] = ['Ad-hoc', 'SOP', 'Pipeline'];
export const PRICE_USE_CASE_DATA: Record<PRICEUseCase, { benchmark: number; description: string; }> = {
  'Ad-hoc': { benchmark: 1, description: 'One-off creative/analytical tasks.' },
  'SOP': { benchmark: 200, description: 'Standard Operating Procedure used weekly.' },
  'Pipeline': { benchmark: 5000, description: 'Automated API-driven workflow.' },
};
export const PRICE_CONFIG = { FREELANCE_FEE_PERCENTAGE: 0.15, MARKETPLACE_FEE_PERCENTAGE: 0.02 };
export const VECTOR_CONFIG = { CORRECTION_TIME_MULTIPLIER: 0.6, FREELANCE_PRICE_PERCENTAGE: 0.15, MARKETPLACE_PRICE_PERCENTAGE: 0.01 };

export const ACCOLADES: Record<string, Badge> = {
  // GOLD TIER
  NEURAL_ALCHEMIST: { id: 'NEURAL_ALCHEMIST', name: 'Neural Alchemist', description: 'PVC Score > 98. Absolute mastery of neural logic and instruction transmutation.', tier: 'Gold', icon: 'Sparkles' },
  BULLETPROOF_LOGIC: { id: 'BULLETPROOF_LOGIC', name: 'Bulletproof Logic', description: 'VECTOR Q-Score > 0.95. Verified for high-stakes mission-critical production.', tier: 'Gold', icon: 'ShieldAlert' },
  ROI_TITAN: { id: 'ROI_TITAN', name: 'ROI Titan', description: 'DLA Net Profit > $50/run. Significant economic displacement verified.', tier: 'Gold', icon: 'TrendingUp' },
  SEMANTIC_LEGEND: { id: 'SEMANTIC_LEGEND', name: 'Semantic Legend', description: 'SCOPE PVI > 2.5. Extreme information density and architectural perfection.', tier: 'Gold', icon: 'Crown' },
  
  // SILVER TIER
  PRECISION_ENGINEER: { id: 'PRECISION_ENGINEER', name: 'Precision Engineer', description: 'PVC Goal Clarity = 4. Zero ambiguity in objective definition.', tier: 'Silver', icon: 'Target' },
  SIGNAL_MAESTRO: { id: 'SIGNAL_MAESTRO', name: 'Signal Maestro', description: 'SCOPE Token Efficiency > 0.9. Extreme semantic density with near-zero filler.', tier: 'Silver', icon: 'Radio' },
  MARKET_DISRUPTOR: { id: 'MARKET_DISRUPTOR', name: 'Market Disruptor', description: 'PRICE TAV > $50,000. High-value IP asset for enterprise workflows.', tier: 'Silver', icon: 'Zap' },
  STRUCTURED_PRO: { id: 'STRUCTURED_PRO', name: 'Structured Pro', description: 'PVC Structure Score = 4. Perfect use of semantic delimiters.', tier: 'Silver', icon: 'Layers' },

  // BRONZE TIER
  SAFE_HARBOR: { id: 'SAFE_HARBOR', name: 'Safe Harbor', description: 'Risk Score = 0. Asset is clean, compliant, and verified safe.', tier: 'Bronze', icon: 'ShieldCheck' },
  FEASIBILITY_VERIFIED: { id: 'FEASIBILITY_VERIFIED', name: 'Feasibility Verified', description: 'Feasibility Score = 4. Perfectly aligned with LLM capabilities.', tier: 'Bronze', icon: 'CheckCircle' },
  EFFICIENCY_BOOST: { id: 'EFFICIENCY_BOOST', name: 'Efficiency Boost', description: 'EAVP Efficiency > 50%. Massive verified time-savings.', tier: 'Bronze', icon: 'Zap' },
  CLEAN_SIGNAL: { id: 'CLEAN_SIGNAL', name: 'Clean Signal', description: 'SCOPE Entropy < 0.1. Extremely low risk of interpretative drift.', tier: 'Bronze', icon: 'Activity' },
};

// IMPROVED DOCUMENTATION TEMPLATE
export const DOCUMENTATION_TEMPLATE = `
# {{PROMPT_TITLE}}

### ⚡ Executive Summary
| Metric | Assessment |
| :--- | :--- |
| **Use Case** | {{USE_CASE}} |
| **Target User** | {{BEST_FOR}} |
| **Complexity** | {{DIFFICULTY}} |
| **Est. Efficiency** | {{TIME_SAVED}} |

---

### 🎯 Functional Objectives
{{PROMPT_DOES}}

---

### 🧱 Technical Specifications

#### Input Variables
{{INPUTS_TABLE}}

#### Output Format
{{OUTPUT_SPECS}}

#### Industry Application
{{INDUSTRIES_TABLE}}

---

### 🧪 Gold Standard Simulation
*The following output was generated using the Refined V2.0 Protocol:*

\`\`\`text
{{SIMULATION}}
\`\`\`

---

### 🚀 The Asset Pack

#### 1. Refined V2.0 Protocol (Optimized)
> **Architect's Note:** Enhanced with Chain-of-Thought, Delimiters, and Persona reinforcement.

\`\`\`xml
{{REFINED_PROMPT}}
\`\`\`

#### 2. Original Source (Raw)
\`\`\`text
{{THE_PROMPT}}
\`\`\`

---

### ⚠️ Operational Constraints
{{LIMITATIONS_LIST}}

© {{BRAND_NAME}} 2025 | Verified Asset
`;

export function populateTemplate(template: string, data: Record<string, any>, originalPrompt: string): string {
  let populated = template;
  const today = new Date().toISOString().slice(0, 10);
  populated = populated.replace(/{{BRAND_NAME}}/g, 'KONKRED');
  populated = populated.replace(/{{VERSION_DATE}}/g, today);
  
  // Basic Fields
  for (const key in data) {
    if (typeof data[key] === 'string') populated = populated.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
  }
  
  populated = populated.replace(/{{THE_PROMPT}}/g, originalPrompt);

  // Table Builders
  const industriesTable = (data.INDUSTRIES || []).map((item: any) => `| ${item.name} | ${item.use} |`).join('\n');
  populated = populated.replace('{{INDUSTRIES_TABLE}}', 
    `| Industry | Application |\n| :--- | :--- |\n${industriesTable}` || '| - | - |');

  const inputsTable = (data.INPUTS || []).map((item: any) => `| \`${item.name}\` | ${item.desc} | *${item.ex}* |`).join('\n');
  populated = populated.replace('{{INPUTS_TABLE}}', 
    `| Variable | Description | Example |\n| :--- | :--- | :--- |\n${inputsTable}` || '_No explicit variables detected._');

  // Lists
  const limitationsList = (data.LIMITATIONS || []).map((item: string) => `- ${item}`).join('\n');
  populated = populated.replace('{{LIMITATIONS_LIST}}', limitationsList || '- None');

  // Specs
  const outputSpecs = Array.isArray(data.OUTPUT_ELEMENTS) ? data.OUTPUT_ELEMENTS.map((i:string) => `- ${i}`).join('\n') : data.OUTPUT_FORMAT;
  populated = populated.replace('{{OUTPUT_SPECS}}', outputSpecs || 'Standard Text');

  // Advanced Fields
  populated = populated.replace('{{REFINED_PROMPT}}', data.REFINED_PROMPT || 'Optimization not available.');
  populated = populated.replace('{{SIMULATION}}', data.SIMULATION || 'Simulation data not generated.');

  return populated;
}
