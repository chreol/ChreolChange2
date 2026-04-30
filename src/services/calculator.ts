// src/services/calculator.ts
import type { Direction, Transaction } from '@/types';

const RATES = {
  EUR_TO_CFA: 650,  // 1 EUR = 650 FCFA
  CFA_TO_EUR: 660,  // 660 FCFA = 1 EUR
} as const;

const COMMISSION_BASE = 3; // 3 EUR par tranche
const BRACKET_SIZE = 100;  // Tranche de 100 EUR

/**
 * Calcule la commission selon la règle :
 * 3€ pour 1-100€ | 6€ pour 101-200€ | 9€ pour 201-300€ ...
 */
export function getCommission(amountInEUR: number): number {
  if (amountInEUR <= 0) return 0;
  const brackets = Math.ceil(amountInEUR / BRACKET_SIZE);
  return brackets * COMMISSION_BASE;
}

export class Calculator {
  static calculate({
    amount,
    direction,
  }: {
    amount: number;
    direction: Direction;
  }): Omit<Transaction, 'id' | 'timestamp'> {
    if (amount <= 0) throw new Error('Montant invalide');

    const isEURToCFA = direction === 'EUR_TO_CFA';

    if (isEURToCFA) {
      // 💶 EUR → CFA
      const amountSent = amount; // EUR
      const commission = getCommission(amountSent);
      const totalToPay = amountSent + commission;
      const amountReceived = Math.round(amountSent * RATES.EUR_TO_CFA); // FCFA

      return {
        direction,
        amountSent,
        currencySent: 'EUR',
        amountReceived,
        currencyReceived: 'CFA',
        commission,
        totalToPay,
      };
    } else {
      // 🌍 CFA → EUR
      const amountSent = amount; // CFA
      const grossEUR = amountSent / RATES.CFA_TO_EUR;
      const commission = getCommission(grossEUR);
      const netEUR = grossEUR - commission;
      const amountReceived = Math.max(0, Math.floor(netEUR)); // ✅ Arrondi inférieur strict, minimum 0

      return {
        direction,
        amountSent,
        currencySent: 'CFA',
        amountReceived,
        currencyReceived: 'EUR',
        commission,
        totalToPay: amountSent, // Le client dépose exactement ce montant CFA
      };
    }
  }

  /** Affiche le détail de la commission */
  static getCommissionLabel(amount: number, direction: Direction): string {
    const amountInEUR = direction === 'EUR_TO_CFA' ? amount : amount / RATES.CFA_TO_EUR;
    const commission = getCommission(amountInEUR);
    const brackets = Math.ceil(amountInEUR / BRACKET_SIZE);
    return `${commission} EUR (Tranche ${brackets} × ${COMMISSION_BASE} EUR)`;
  }

  static getRates() {
    return { ...RATES, lastUpdated: new Date() };
  }
}