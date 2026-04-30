import type { WhatsAppMessage } from '@/types';

export const WhatsAppService = {
  PHONE: '306973598677', // Format international sans +

  createMessage({
    direction,
    amountSent,
    currencySent,
    amountReceived,
    currencyReceived,
    totalToPay,
  }: {
    direction: string;
    amountSent: number;
    currencySent: string;
    amountReceived: number;
    currencyReceived: string;
    totalToPay: number;
  }): WhatsAppMessage {
    const arrow = direction === 'EUR_TO_CFA' ? '→' : '→';
    const text = encodeURIComponent(
      `🔄 Bonjour, je souhaite effectuer un change :\n` +
      `💰 Montant : ${amountSent} ${currencySent}\n` +
      `📥 Bénéficiaire reçoit : ${amountReceived} ${currencyReceived}\n` +
      `💵 Total à payer : ${totalToPay} EUR\n` +
      `✅ Merci de confirmer ma transaction.`
    );
    
    return {
      phone: this.PHONE,
      text,
    };
  },

  getLink(msg: WhatsAppMessage): string {
    return `https://wa.me/${msg.phone}?text=${msg.text}`;
  },

  open(msg: WhatsAppMessage): void {
    window.open(this.getLink(msg), '_blank', 'noopener,noreferrer');
  }
};