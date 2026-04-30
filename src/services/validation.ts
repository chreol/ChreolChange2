export type ValidationRule = 
  | { type: 'required'; message: string }
  | { type: 'min'; value: number; message: string }
  | { type: 'max'; value: number; message: string }
  | { type: 'pattern'; regex: RegExp; message: string }
  | { type: 'custom'; validator: (value: string) => boolean; message: string };

export interface ValidationConfig {
  [field: string]: ValidationRule[];
}

export class Validator {
  static validate(value: string, rules: ValidationRule[]): { valid: boolean; error?: string } {
    for (const rule of rules) {
      switch (rule.type) {
        case 'required':
          if (!value || value.trim() === '') {
            return { valid: false, error: rule.message };
          }
          break;
        case 'min':
          const numMin = parseFloat(value);
          if (!isNaN(numMin) && numMin < rule.value) {
            return { valid: false, error: rule.message };
          }
          break;
        case 'max':
          const numMax = parseFloat(value);
          if (!isNaN(numMax) && numMax > rule.value) {
            return { valid: false, error: rule.message };
          }
          break;
        case 'pattern':
          if (!rule.regex.test(value)) {
            return { valid: false, error: rule.message };
          }
          break;
        case 'custom':
          if (!rule.validator(value)) {
            return { valid: false, error: rule.message };
          }
          break;
      }
    }
    return { valid: true };
  }

  static validateForm(formData: Record<string, string>, config: ValidationConfig): 
    { valid: boolean; errors: Record<string, string> } {
    
    const errors: Record<string, string> = {};
    
    for (const [field, rules] of Object.entries(config)) {
      const result = this.validate(formData[field] || '', rules);
      if (!result.valid && result.error) {
        errors[field] = result.error;
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// 🎯 Configurations prédéfinies pour le projet
export const VALIDATION_CONFIGS = {
  converter: {
    amount: [
      { type: 'required' as const, message: 'Veuillez entrer un montant' },
      { type: 'min' as const, value: 1, message: 'Minimum 1 EUR' },
      { type: 'max' as const, value: 1000, message: 'Maximum 1,000 EUR par transaction' },
    ]
  },
  contact: {
    name: [
      { type: 'required' as const, message: 'Votre nom est requis' },
      { type: 'pattern' as const, regex: /^[\p{L}\s'-]+$/u, message: 'Nom invalide' }
    ],
    phone: [
      { type: 'required' as const, message: 'Numéro requis' },
      { type: 'pattern' as const, regex: /^\+?[\d\s\-()]{8,}$/, message: 'Format de téléphone invalide' }
    ],
    message: [
      { type: 'required' as const, message: 'Message requis' },
      { type: 'min' as const, value: 10, message: 'Message trop court' }
    ]
  }
} as const;