
import { GoogleGenAI } from "@google/genai";
import { 
  DLA_CONFIG,
  PVC_SYSTEM_INSTRUCTION, PVC_CONFIG, 
  SCOPE_SYSTEM_INSTRUCTION, SCOPE_CONFIG,
  EAVP_CONFIG, PRICE_CONFIG, VECTOR_CONFIG,
  ACCOLADES
} from "../constants";
import { 
  ValuationRequest, ValuationReport, PVCReport, PVCRawScores,
  ValuationMethod, SCOREReport, SCOPEVariables, EAVPReport, EAVPRequestData,
  PRICEReport, PRICERequestData, VECTORReport, VECTORRequestData,
  DLAReport, DLARequestData, Badge, BadgeTier, AIProvider, APIKeys,
  PromptStructureAnalysis
} from "../types";

const CHARS_PER_TOKEN = 4;
const ANALYSIS_MODEL = 'gemini-3-flash-preview';

/**
 * Award badges based on cross-protocol engineering thresholds.
 */
const awardAccolades = (report: ValuationReport): Badge[] => {
  const earned: Badge[] = [];
  
  if (report.method === 'PVC') {
    if (report.calculations.finalScore >= 98) earned.push(ACCOLADES.NEURAL_ALCHEMIST);
    if (report.rawScores.G_r === 4) earned.push(ACCOLADES.PRECISION_ENGINEER);
    if (report.rawScores.D_r === 4) earned.push(ACCOLADES.STRUCTURED_PRO);
    if (report.rawScores.R_r === 0) earned.push(ACCOLADES.SAFE_HARBOR);
    if (report.rawScores.F_r === 4) earned.push(ACCOLADES.FEASIBILITY_VERIFIED);
  }

  if (report.method === 'SCOPE') {
    if (report.calculations.pvi > 2.5) earned.push(ACCOLADES.SEMANTIC_LEGEND);
    if (report.variables.Teff > 0.9) earned.push(ACCOLADES.SIGNAL_MAESTRO);
    if (report.variables.E < 0.1) earned.push(ACCOLADES.CLEAN_SIGNAL);
  }

  if (report.method === 'DLA') {
    if (report.calculations.trueNetValue > 50) earned.push(ACCOLADES.ROI_TITAN);
  }

  if (report.method === 'VECTOR') {
    if (report.calculations.Q > 0.95) earned.push(ACCOLADES.BULLETPROOF_LOGIC);
  }

  if (report.method === 'PRICE') {
    if (report.calculations.totalAssetValue > 50000) earned.push(ACCOLADES.MARKET_DISRUPTOR);
  }

  if (report.method === 'EAVP') {
      const efficiency = (report.calculations.netMinutesSaved / report.calculations.manualCreationMinutes);
      if (efficiency > 0.5) earned.push(ACCOLADES.EFFICIENCY_BOOST);
  }

  return earned.sort((a, b) => {
    const tierOrder: Record<string, number> = { Gold: 0, Silver: 1, Bronze: 2 };
    return tierOrder[a.tier] - tierOrder[b.tier];
  });
};

const callGeminiAudit = async (systemInstruction: string, prompt: string, model: string = ANALYSIS_MODEL): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const response = await ai.models.generateContent({
    model: model, 
    contents: prompt,
    config: { 
      systemInstruction, 
      temperature: 0.1, 
      responseMimeType: "application/json" 
    },
  });
  return response.text || "{}";
};

export const analyzePromptStructure = async (prompt: string): Promise<PromptStructureAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const response = await ai.models.generateContent({
    model: ANALYSIS_MODEL,
    contents: prompt,
    config: {
      systemInstruction: `You are a prompt structural engineer. Analyze the provided prompt and extract its characteristics. 
      Return ONLY a JSON object with this structure:
      {
        "charCount": number,
        "wordCount": number,
        "hasHardConstraints": boolean,
        "hardConstraintCount": number,
        "hasSoftConstraints": boolean,
        "hasOutputFormat": boolean,
        "hasExamples": boolean,
        "hasContext": boolean,
        "complexityLevel": "simple" | "moderate" | "complex",
        "estimatedOutputLength": "short" | "medium" | "long",
        "taskType": "creative" | "analytical" | "technical" | "conversational",
        "isRepeatable": boolean
      }`,
      responseMimeType: "application/json"
    },
  });
  
  try {
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (e) {
    console.error("Neural analysis parse error", e);
    return {
        charCount: prompt.length,
        wordCount: prompt.split(/\s+/).length,
        hasHardConstraints: false,
        hardConstraintCount: 0,
        hasSoftConstraints: false,
        hasOutputFormat: false,
        hasExamples: false,
        hasContext: false,
        complexityLevel: 'simple',
        estimatedOutputLength: 'medium',
        taskType: 'analytical',
        isRepeatable: false
    };
  }
};

const analyzeWithPVC = async (data: ValuationRequest): Promise<PVCReport> => {
  const jsonString = await callGeminiAudit(PVC_SYSTEM_INSTRUCTION, data.inputPrompt, 'gemini-2.5-flash');
  let rawScores: PVCRawScores = JSON.parse(jsonString);

  const { G_r, C_r, S_r, D_r, F_r, A_r, R_r } = rawScores;
  const normalizedScores = {
    G: G_r / 4, C: C_r / 4, S: S_r / 4, D: D_r / 4, F: F_r / 4,
    A: A_r / 4, R: R_r / 4
  };
  
  const { weights, penalties, length } = PVC_CONFIG;
  const { G, C, S, D, F, A, R } = normalizedScores;

  const baseQ = 100 * (G * weights.G + C * weights.C + S * weights.S + D * weights.D + F * weights.F);
  const qPen = baseQ * Math.pow(1 - (penalties.A * A), 1.2) * (1 - (penalties.R * R));

  const tokenCount = Math.floor(data.inputPrompt.length / CHARS_PER_TOKEN);
  let lNorm = 0;
  if (tokenCount < length.T_min) {
    lNorm = (length.T_min - tokenCount) / length.T_min;
  } else if (tokenCount > length.T_opt) {
    lNorm = Math.min((tokenCount - length.T_opt) / (length.T_max - length.T_opt), 1);
  }

  const finalScore = Math.max(0, Math.min(qPen * (1 - penalties.L * lNorm), 100));

  const finalReport: PVCReport = {
    method: 'PVC',
    inputPrompt: data.inputPrompt,
    promptTitle: data.promptTitle,
    rawScores,
    normalizedScores,
    calculations: { baseQ, qPen, lNorm, finalScore },
    tokenCount,
    timestamp: new Date().toISOString(),
    watermark: `K-PVC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    accolades: []
  };

  finalReport.accolades = awardAccolades(finalReport);
  return finalReport;
};

const analyzeWithSCOPE = async (data: ValuationRequest): Promise<SCOREReport> => {
  const jsonString = await callGeminiAudit(SCOPE_SYSTEM_INSTRUCTION, data.inputPrompt);
  let variables: SCOPEVariables = JSON.parse(jsonString);
  const { S, H, D, E, Teff } = variables;
  
  const pvi = (((S * SCOPE_CONFIG.weights.S) + (H * SCOPE_CONFIG.weights.H) + (D * SCOPE_CONFIG.weights.D)) / Math.pow((1 + E), 2)) * Teff;
  
  const finalReport: SCOREReport = {
    method: 'SCOPE',
    inputPrompt: data.inputPrompt,
    promptTitle: data.promptTitle,
    variables,
    calculations: { pvi },
    timestamp: new Date().toISOString(),
    watermark: `K-SCOPE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    accolades: []
  };
  finalReport.accolades = awardAccolades(finalReport);
  return finalReport;
};

const analyzeWithDLA = async (data: ValuationRequest): Promise<DLAReport> => {
    const { outputCharCount = 5000, apiLatencySeconds = 10, editSessionSeconds = 120, apiCostUsd = 0.01, humanWpm = 40, humanReadingWpm = 250, hourlyWage = 60 } = data as DLARequestData;
    const minuteRate = hourlyWage / 60;
    const totalWords = outputCharCount / DLA_CONFIG.CHARS_PER_WORD;
    const manualMinutes = totalWords / humanWpm;
    const grossLaborValue = manualMinutes * minuteRate;
    const waitCost = (apiLatencySeconds / 60) * minuteRate;
    const readingCost = (totalWords / humanReadingWpm) * minuteRate;
    const fixingCost = (editSessionSeconds / 60) * minuteRate;
    const hiddenFrictionCost = waitCost + readingCost + fixingCost + apiCostUsd;
    const trueNetValue = grossLaborValue - hiddenFrictionCost;
    const arbitrageEfficiency = grossLaborValue > 0 ? (trueNetValue / grossLaborValue) : 0;
    
    const finalReport: DLAReport = {
        method: 'DLA',
        inputPrompt: data.inputPrompt,
        promptTitle: data.promptTitle,
        inputRequest: { outputCharCount, apiLatencySeconds, editSessionSeconds, apiCostUsd, humanWpm, humanReadingWpm, hourlyWage },
        calculations: { 
            grossLaborValue, 
            hiddenFrictionCost, 
            trueNetValue, 
            isProfitable: trueNetValue > 0, 
            manualMinutes, 
            waitCost, 
            readingCost, 
            fixingCost,
            arbitrageEfficiency
        },
        timestamp: new Date().toISOString(),
        watermark: `K-DLA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
    
    // Financial badges check
    (finalReport as any).accolades = awardAccolades(finalReport);
    return finalReport;
};

const analyzeWithEAVP = async (data: ValuationRequest): Promise<EAVPReport> => {
  const { outputChars = 4000, userWPM = 50, editTime = 5, regenerations = 1, marketRate = 100 } = data as EAVPRequestData;
  const words = outputChars / EAVP_CONFIG.CHARS_PER_WORD;
  const manualCreationMinutes = words / userWPM;
  const correctionTaxMinutes = editTime + (regenerations * EAVP_CONFIG.REGENERATION_PENALTY_MINUTES);
  const netMinutesSaved = manualCreationMinutes - correctionTaxMinutes;
  const auditedValue = (netMinutesSaved / 60) * marketRate;
  
  const finalReport: EAVPReport = {
    method: 'EAVP',
    inputPrompt: data.inputPrompt,
    promptTitle: data.promptTitle,
    inputRequest: { outputChars, userWPM, editTime, regenerations, marketRate },
    calculations: { 
        manualCreationMinutes, 
        correctionTaxMinutes, 
        netMinutesSaved, 
        auditedValue, 
        grossLaborValue: (manualCreationMinutes/60)*marketRate, 
        correctionCost: (correctionTaxMinutes/60)*marketRate 
    },
    timestamp: new Date().toISOString(),
    watermark: `K-EAVP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  };
  (finalReport as any).accolades = awardAccolades(finalReport);
  return finalReport;
};

const analyzeWithPRICE = async (data: ValuationRequest): Promise<PRICEReport> => {
  const { 
    humanTimeMinutes = 60, 
    humanHourlyRate = 80, 
    reviewTimeMinutes = 5, 
    tokenCost = 0.05, 
    reliability = 0.9, 
    yearlyVolume = 250,
    valuedParameter = 'Core Logic',
    parameterWeight = 1.0
  } = data as PRICERequestData;
  const humanCost = humanTimeMinutes * (humanHourlyRate / 60);
  const aiCost = tokenCost + (reviewTimeMinutes * (humanHourlyRate / 60));
  const netRunSavings = (humanCost - aiCost) * reliability;
  const totalAssetValue = netRunSavings * yearlyVolume * parameterWeight;
  
  const finalReport: PRICEReport = {
    method: 'PRICE',
    inputPrompt: data.inputPrompt,
    promptTitle: data.promptTitle,
    inputRequest: { 
        humanTimeMinutes, 
        humanHourlyRate, 
        reviewTimeMinutes, 
        tokenCost, 
        reliability, 
        yearlyVolume, 
        useCase: data.useCase || 'Ad-hoc',
        valuedParameter,
        parameterWeight
    },
    calculations: { 
        humanCost, 
        aiCost: tokenCost, 
        reviewCost: reviewTimeMinutes*(humanHourlyRate/60), 
        operationalCost: aiCost, 
        netRunSavings, 
        totalAssetValue, 
        freelancePrice: totalAssetValue*PRICE_CONFIG.FREELANCE_FEE_PERCENTAGE, 
        marketplacePrice: totalAssetValue*PRICE_CONFIG.MARKETPLACE_FEE_PERCENTAGE 
    },
    timestamp: new Date().toISOString(),
    watermark: `K-PRICE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  };
  (finalReport as any).accolades = awardAccolades(finalReport);
  return finalReport;
};

const analyzeWithVECTOR = async (data: ValuationRequest): Promise<VECTORReport> => {
    const { score_constraints = 4, score_context = 3, score_feasibility = 4, score_safety = 0, human_hourly_rate = 100, time_saved_minutes = 45, annual_volume = 200, api_cost_per_run = 0.5 } = data as VECTORRequestData;
    const Q = Math.pow((score_constraints/5)*(score_context/5)*(score_feasibility/5), 1/3) * (1 - (score_safety/5));
    const gross_total_value = time_saved_minutes * (human_hourly_rate/60);
    const correction_cost = (time_saved_minutes * VECTOR_CONFIG.CORRECTION_TIME_MULTIPLIER) * (1-Q) * (human_hourly_rate/60);
    const net_utility = gross_total_value - correction_cost - api_cost_per_run;
    const total_annual_value = net_utility * annual_volume;
    
    const finalReport: VECTORReport = {
        method: 'VECTOR',
        inputPrompt: data.inputPrompt,
        promptTitle: data.promptTitle,
        status: net_utility > 0 ? "VIABLE ASSET" : "SCRAP ASSET",
        calculations: { Q, gross_labor_value: gross_total_value, gross_total_value, correction_cost, net_utility, total_annual_value, freelance_price: total_annual_value*VECTOR_CONFIG.FREELANCE_PRICE_PERCENTAGE, marketplace_price: total_annual_value*VECTOR_CONFIG.MARKETPLACE_PRICE_PERCENTAGE },
        inputRequest: { score_constraints, score_context, score_feasibility, score_safety, human_hourly_rate, time_saved_minutes, annual_volume, revenue_lift_per_run: 0, api_cost_per_run },
        timestamp: new Date().toISOString(),
        watermark: `K-VECTOR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
    (finalReport as any).accolades = awardAccolades(finalReport);
    return finalReport;
};

export const orchestrateAnalysis = async (
  data: ValuationRequest, 
  method: ValuationMethod,
  apiKeys?: APIKeys,
  activeProvider?: AIProvider
): Promise<ValuationReport | ValuationReport[]> => {
  if (method === 'ALL') {
    const results = await Promise.all([
      analyzeWithDLA(data),
      analyzeWithPVC(data),
      analyzeWithSCOPE(data),
      analyzeWithEAVP(data),
      analyzeWithPRICE(data),
      analyzeWithVECTOR(data)
    ]);
    return results;
  }

  if (method === 'CORE') {
    const results = await Promise.all([
      analyzeWithDLA(data),
      analyzeWithPVC(data),
      analyzeWithSCOPE(data)
    ]);
    return results;
  }
  
  switch (method) {
    case 'DLA': return analyzeWithDLA(data);
    case 'PVC': return analyzeWithPVC(data);
    case 'SCOPE': return analyzeWithSCOPE(data);
    case 'EAVP': return analyzeWithEAVP(data);
    case 'PRICE': return analyzeWithPRICE(data);
    case 'VECTOR': return analyzeWithVECTOR(data);
    default: throw new Error("Invalid Methodology Selected");
  }
};
