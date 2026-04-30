import type { Currency } from '@/types';

export const formatCurrency = (amount: number, currency: Currency): string => {
  if (currency === 'EUR') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  // CFA
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('XOF', 'FCFA');
};

export const formatUSSDCode = (code: string): string => {
  return code.replace(/\*/g, '<wbr>*').replace(/#/g, '<wbr>#');
};