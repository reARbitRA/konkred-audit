
import React, { useState } from 'react';
import { INDUSTRIES, USER_TIERS, PRICE_USE_CASES, PRICE_USE_CASE_DATA, INDUSTRY_VOLUME_MULTIPLIERS } from '../constants';
import { ValuationRequest, ValuationMethod, PRICEUseCase, APIKeys, AIProvider } from '../types';
import ValuationMethodSelector from './ValuationMethodSelector';
import { 
  Play, Terminal, Database, Activity, Zap, Sparkles, Loader2, 
  AlertCircle, Cpu, FileText, Clock, RefreshCw, DollarSign, 
  Keyboard, Tag, Repeat, Percent, Shield, Code, BookOpen, 
  Zap as FeasibilityIcon, TrendingUp, Timer, MessageSquare, 
  Briefcase, Scale, ChevronRight, PenTool, Building
} from 'lucide-react';

interface AnalysisFormProps {
  formData: ValuationRequest;
  setFormData: React.Dispatch<React.SetStateAction<ValuationRequest>>;
  onSubmit: () => void;
  isLoading: boolean;
  valuationMethod: ValuationMethod;
  setValuationMethod: (method: ValuationMethod) => void;
  apiKeys: APIKeys;
  activeProvider: AIProvider;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ 
  formData, setFormData, onSubmit, isLoading, 
  valuationMethod, setValuationMethod,
}) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({});
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Other');

  const requiredFields: Record<ValuationMethod, (keyof ValuationRequest)[]> = {
    DLA: ['outputCharCount', 'apiLatencySeconds', 'editSessionSeconds', 'apiCostUsd', 'humanWpm', 'humanReadingWpm', 'hourlyWage'],
    PVC: ['inputPrompt'],
    SCOPE: ['inputPrompt'],
    EAVP: ['outputChars', 'userWPM', 'editTime', 'regenerations', 'marketRate'],
    PRICE: ['humanTimeMinutes', 'humanHourlyRate', 'reviewTimeMinutes', 'tokenCost', 'reliability', 'yearlyVolume', 'valuedParameter', 'parameterWeight'],
    VECTOR: ['score_constraints', 'score_context', 'score_feasibility', 'score_safety', 'human_hourly_rate', 'time_saved_minutes', 'annual_volume', 'api_cost_per_run'],
    CORE: ['inputPrompt'],
    ALL: ['inputPrompt'],
  };

  const validateForm = () => {
    const errors: Record<string, string | null> = {};
    let isValid = true;
    const fieldsToValidate = requiredFields[valuationMethod];

    fieldsToValidate.forEach(field => {
      const value = formData[field as keyof ValuationRequest] as number | string;
      if (value === undefined || value === null || String(value).trim() === '') {
         errors[field] = 'FIELD_REQUIRED';
         isValid = false;
      } else if (typeof value === 'number' && value < 0) {
         errors[field] = 'MUST_BE_POSITIVE';
         isValid = false;
      } else {
        errors[field] = null;
      }
    });
    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleChange = (field: keyof ValuationRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (String(value).trim() !== '') {
        setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const calculateVolume = (useCase: PRICEUseCase, industry: string) => {
    const baseVolume = PRICE_USE_CASE_DATA[useCase].benchmark;
    const multiplier = INDUSTRY_VOLUME_MULTIPLIERS[industry] || 1.0;
    return Math.round(baseVolume * multiplier);
  };

  const handleUseCaseChange = (useCase: PRICEUseCase) => {
    const newVolume = calculateVolume(useCase, selectedIndustry);
    setFormData(prev => ({
      ...prev,
      useCase,
      yearlyVolume: newVolume
    }));
  };

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    if (formData.useCase) {
        const newVolume = calculateVolume(formData.useCase, industry);
        setFormData(prev => ({ ...prev, yearlyVolume: newVolume }));
    }
  };

  const isDLA = valuationMethod === 'DLA';
  const isEAVP = valuationMethod === 'EAVP';
  const isPRICE = valuationMethod === 'PRICE';
  const isVECTOR = valuationMethod === 'VECTOR';
  const isProjection = ['PVC', 'SCOPE', 'CORE', 'ALL'].includes(valuationMethod);

  const dlaFields = [
    { id: 'outputCharCount', label: 'Output Characters', icon: <MessageSquare size={14} />, placeholder: '5000' },
    { id: 'apiLatencySeconds', label: 'API Latency (sec)', icon: <Timer size={14} />, placeholder: '12.5' },
    { id: 'editSessionSeconds', label: 'Edit Time (sec)', icon: <Clock size={14} />, placeholder: '180' },
    { id: 'apiCostUsd', label: 'API Unit Cost ($)', icon: <Cpu size={14} />, placeholder: '0.04' },
    { id: 'humanWpm', label: 'Human WPM (Write)', icon: <Keyboard size={14} />, placeholder: '40' },
    { id: 'humanReadingWpm', label: 'Human WPM (Read)', icon: <BookOpen size={14} />, placeholder: '250' },
    { id: 'hourlyWage', label: 'Hourly Wage ($)', icon: <Briefcase size={14} />, placeholder: '50' },
  ];

  const eavpFields = [
    { id: 'outputChars', label: 'Total Output Chars', icon: <FileText size={14} />, placeholder: '4000' },
    { id: 'userWPM', label: 'User WPM (Typing)', icon: <Keyboard size={14} />, placeholder: '50' },
    { id: 'editTime', label: 'Edit Time (Minutes)', icon: <Clock size={14} />, placeholder: '3' },
    { id: 'regenerations', label: 'Regenerations', icon: <RefreshCw size={14} />, placeholder: '1' },
    { id: 'marketRate', label: 'Market Rate ($/hr)', icon: <DollarSign size={14} />, placeholder: '90' }
  ];

  const priceFields = [
    { id: 'humanTimeMinutes', label: 'Human Time (Minutes)', icon: <Clock size={14} />, placeholder: '60' },
    { id: 'humanHourlyRate', label: 'Human Rate ($/hr)', icon: <DollarSign size={14} />, placeholder: '50' },
    { id: 'reviewTimeMinutes', label: 'Review Time (Minutes)', icon: <Clock size={14} />, placeholder: '10' },
    { id: 'tokenCost', label: 'Token Cost ($)', icon: <Cpu size={14} />, placeholder: '0.10' },
    { id: 'reliability', label: 'Reliability (0.0-1.0)', icon: <Percent size={14} />, placeholder: '0.9' },
    { id: 'yearlyVolume', label: 'Yearly Volume (Est.)', icon: <Repeat size={14} />, placeholder: '250' },
    { id: 'valuedParameter', label: 'Valued Parameter', icon: <Tag size={14} />, placeholder: 'Strategic Logic', type: 'text' },
    { id: 'parameterWeight', label: 'Impact Weight (x.x)', icon: <Scale size={14} />, placeholder: '1.0' }
  ];
  
  const vectorQualityFields = [
    { id: 'score_constraints', label: 'Constraint Hardness', icon: <Code size={14} /> },
    { id: 'score_context', label: 'Context Density', icon: <BookOpen size={14} /> },
    { id: 'score_feasibility', label: 'Feasibility', icon: <FeasibilityIcon size={14} /> },
    { id: 'score_safety', label: 'Safety/Risk', icon: <Shield size={14} />, isNegative: true },
  ];

  const vectorFinancialFields = [
    { id: 'human_hourly_rate', label: 'Human Rate ($/hr)', icon: <DollarSign size={14} />, placeholder: '100' },
    { id: 'time_saved_minutes', label: 'Time Saved (Min/Run)', icon: <Clock size={14} />, placeholder: '45' },
    { id: 'annual_volume', label: 'Annual Volume', icon: <Repeat size={14} />, placeholder: '200' },
    { id: 'api_cost_per_run', label: 'API Cost ($/Run)', icon: <Cpu size={14} />, placeholder: '0.50' },
  ];

  const renderInputField = (field: any) => (
    <div key={field.id} className="space-y-2 group/input relative">
        <label className={`block text-[10px] font-mono uppercase tracking-widest transition-colors duration-300 ${activeField === field.id ? 'text-cyber-cyan text-glow-cyan' : 'text-slate-500 group-hover/input:text-slate-300'}`}>
            {field.label} {!field.optional && <span className="text-cyber-red ml-1">*</span>}
        </label>
        <div className="relative transform transition-transform duration-300">
            <div className={`absolute bottom-0 left-0 h-[2px] bg-cyber-cyan transition-all duration-300 z-20 shadow-neon-cyan ${activeField === field.id ? 'w-full' : 'w-0'}`}></div>
            <input 
                type={field.type || "number"}
                value={(formData as any)[field.id] || ''}
                onChange={(e) => handleChange(field.id as keyof ValuationRequest, field.type === 'text' ? e.target.value : e.target.value === '' ? '' : parseFloat(e.target.value))}
                onFocus={() => setActiveField(field.id)}
                onBlur={() => setActiveField(null)}
                className={`w-full bg-black/60 border ${validationErrors[field.id] ? 'border-cyber-red animate-pulse' : 'border-cyber-gray'} rounded-sm p-3 pl-10 text-xs text-white font-mono uppercase focus:border-cyber-cyan focus:outline-none transition-all relative z-10 backdrop-blur-sm`}
                placeholder={field.placeholder}
            />
            <div className={`absolute left-3 top-3.5 pointer-events-none transition-colors duration-300 z-20 ${activeField === field.id || (formData as any)[field.id] ? 'text-cyber-cyan' : 'text-slate-600'}`}>
                {field.icon}
            </div>
            {validationErrors[field.id] && (
                <div className="absolute right-3 top-3.5 text-cyber-red animate-pulse pointer-events-none z-20" title={validationErrors[field.id] === 'MUST_BE_POSITIVE' ? 'Must be positive' : 'Required'}>
                    <AlertCircle size={14} />
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-cyber-dark/80 backdrop-blur-xl border border-cyber-gray rounded-sm shadow-2xl relative overflow-visible group animate-in fade-in duration-700">
      
      <div className="relative z-10">
        <div className="bg-cyber-black/90 border-b border-cyber-gray p-3 flex items-center justify-between">
           <div className="flex items-center space-x-2 text-cyber-cyan">
             <Terminal size={14} />
             <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-glow-cyan font-bold">Valuation Data Entry</span>
           </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          <ValuationMethodSelector selectedMethod={valuationMethod} setMethod={setValuationMethod} />

          {/* GLOBAL FIELD: PROMPT TITLE */}
          <div className="space-y-2 group/input relative">
            <label className={`block text-[10px] font-mono uppercase tracking-widest transition-colors duration-300 ${activeField === 'promptTitle' ? 'text-cyber-cyan text-glow-cyan' : 'text-slate-500'}`}>
                Asset Title (Optional)
            </label>
            <div className="relative">
                <div className={`absolute bottom-0 left-0 h-[2px] bg-cyber-cyan transition-all duration-300 z-20 shadow-neon-cyan ${activeField === 'promptTitle' ? 'w-full' : 'w-0'}`}></div>
                <input 
                    type="text"
                    value={formData.promptTitle || ''}
                    onChange={(e) => handleChange('promptTitle', e.target.value)}
                    onFocus={() => setActiveField('promptTitle')}
                    onBlur={() => setActiveField(null)}
                    className="w-full bg-black/60 border border-cyber-gray rounded-sm p-3 pl-10 text-xs text-white font-mono focus:border-cyber-cyan focus:outline-none transition-all relative z-10 backdrop-blur-sm placeholder:text-slate-700"
                    placeholder="e.g. Enterprise Contract Analyzer v1"
                />
                <div className={`absolute left-3 top-3.5 pointer-events-none transition-colors duration-300 z-20 ${activeField === 'promptTitle' || formData.promptTitle ? 'text-cyber-cyan' : 'text-slate-600'}`}>
                    <PenTool size={14} />
                </div>
            </div>
          </div>

          {(valuationMethod === 'ALL' || valuationMethod === 'CORE') && (
            <div className="text-center p-4 border border-dashed border-cyber-red/50 bg-cyber-red/10 rounded-sm">
                <p className="text-xs text-slate-300 font-mono">
                    <span className="font-bold text-cyber-red uppercase tracking-widest mr-2">Multi-Protocol Active:</span>
                    Neural analysis requires the Prompt Payload. Financial protocols will use default enterprise benchmarks if fields are empty.
                </p>
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 transition-all duration-500 ${isDLA ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
             {dlaFields.map(renderInputField)}
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 transition-all duration-500 ${isEAVP ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {eavpFields.map(renderInputField)}
          </div>

          <div className={`space-y-8 transition-all duration-500 ${isPRICE ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              
              {/* Industry Selector */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">Target Industry</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {INDUSTRIES.map(ind => (
                        <button
                            key={ind}
                            onClick={() => handleIndustryChange(ind)}
                            className={`p-2 border rounded-sm text-left transition-all duration-300 text-[10px] uppercase tracking-wider ${selectedIndustry === ind ? 'bg-cyber-cyan/10 border-cyber-cyan/50 text-cyber-cyan' : 'bg-black/40 border-cyber-gray hover:border-cyber-gray/50 text-slate-400'}`}
                        >
                            {ind}
                        </button>
                    ))}
                </div>
              </div>

              {/* Use Case Selector */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">Operational Use Case</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PRICE_USE_CASES.map(useCase => (
                        <button
                            key={useCase}
                            onClick={() => handleUseCaseChange(useCase)}
                            className={`p-4 border rounded-sm text-left transition-all duration-300 ${formData.useCase === useCase ? 'bg-cyber-cyan/10 border-cyber-cyan/50' : 'bg-black/40 border-cyber-gray hover:border-cyber-gray/50'}`}
                        >
                            <div className={`font-bold text-sm uppercase tracking-wider mb-1 ${formData.useCase === useCase ? 'text-cyber-cyan' : 'text-white'}`}>{useCase}</div>
                            <div className="text-[10px] text-slate-500 mb-2 truncate">{PRICE_USE_CASE_DATA[useCase].description}</div>
                        </button>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
                  {priceFields.map(renderInputField)}
              </div>
          </div>

          <div className={`space-y-8 transition-all duration-500 ${isVECTOR ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
              {vectorQualityFields.map(field => renderInputField(field))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
              {vectorFinancialFields.map(field => renderInputField(field))}
            </div>
          </div>

          <div className={`space-y-2 group/input relative transition-all duration-500 ${isProjection ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <label className={`text-[10px] font-mono uppercase tracking-widest block transition-colors duration-300 ${activeField === 'inputPrompt' ? 'text-cyber-red text-glow-red' : 'text-slate-500'}`}>
               Prompt Asset Content <span className="text-cyber-red ml-1">*</span>
            </label>
            <div className="relative">
              <textarea 
                value={formData.inputPrompt}
                onChange={(e) => handleChange('inputPrompt', e.target.value)}
                onFocus={() => setActiveField('inputPrompt')}
                onBlur={() => setActiveField(null)}
                className={`w-full h-48 bg-black/60 border ${validationErrors['inputPrompt'] ? 'border-cyber-red' : 'border-cyber-gray'} text-sm text-cyber-cyan p-4 font-mono focus:border-cyber-red focus:shadow-neon-red focus:outline-none transition-all placeholder:text-slate-800 rounded-sm relative z-10 backdrop-blur-sm`}
                placeholder="// PASTE PROMPT PAYLOAD HERE..."
              />
            </div>
            {validationErrors['inputPrompt'] && (
              <p className="text-[10px] text-cyber-red font-mono mt-1 animate-pulse flex items-center gap-1">
                <AlertCircle size={10} /> REQUIRED_PAYLOAD_MISSING
              </p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-cyber-gray bg-black/50">
          <button
            onClick={handleSubmit} 
            disabled={isLoading}
            className={`w-full group relative flex items-center justify-center space-x-3 py-5 px-8 font-mono font-bold uppercase tracking-[0.2em] transition-all overflow-hidden
              ${isLoading 
                ? 'bg-cyber-gray/20 text-slate-600 cursor-not-allowed border border-cyber-gray/30' 
                : 'bg-cyber-red text-black border border-cyber-red hover:text-black hover:shadow-neon-red hover:scale-[1.01]'}
            `}
          >
             <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>SYSTEM_BUSY <Loader2 size={16} className="animate-spin"/></>
                ) : (
                  <>
                    {valuationMethod === 'ALL' || valuationMethod === 'CORE' ? 'Execute Multi-Protocol Audit' : 'Initialize Valuation'}
                    <Play size={14} className="group-hover:translate-x-1 transition-transform" fill="currentColor" />
                  </>
                )}
             </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisForm;
