export type Currency = 'EUR' | 'CFA';

export type Direction = 'EUR_TO_CFA' | 'CFA_TO_EUR';

export interface ExchangeRate {
  EUR_TO_CFA: number;  // ex: 650
  CFA_TO_EUR: number;  // ex: 660
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  direction: Direction;
  amountSent: number;
  currencySent: Currency;
  amountReceived: number;
  currencyReceived: Currency;
  commission: number;
  totalToPay: number;
  timestamp: Date;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'mobile_money' | 'bank_transfer' | 'card' | 'paypal';
  instructions: string[];
  code?: string;        // Pour les codes USSD
  operator?: 'MTN' | 'Orange' | 'Wave';
  feesNote?: string;
}

export interface WhatsAppMessage {
  phone: string;        // Format international sans +
  text: string;
}