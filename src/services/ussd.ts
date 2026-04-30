// src/services/ussd.ts

export interface USSDCodes {
  mtn: string;
  orange: string;
}

/**
 * Génère les codes USSD avec le montant en CFA
 */
export function generateUSSDCodes(amountCFA: number): USSDCodes {
  // MTN: *126*14*merchantCode*amount#
  const mtnCode = `*126*14*672416141*${Math.round(amountCFA)}#`;
  
  // Orange: #150*14*merchantCode*phoneNumber*amount#
  const orangeCode = `#150*14*518554*692251299*${Math.round(amountCFA)}#`;
  
  return { mtn: mtnCode, orange: orangeCode };
}

/**
 * Ouvre le composeur USSD (si supporté par le navigateur/mobile)
 */
export function openUSSD(code: string): void {
  // Sur mobile, on peut essayer d'ouvrir tel: pour lancer le composeur
  // Note: Les navigateurs bloquent souvent les codes USSD directs pour sécurité
  const ua = navigator.userAgent.toLowerCase();
  
  if (/android|iphone|ipad/.test(ua)) {
    // Tenter d'ouvrir le composeur (fonctionne sur certains appareils)
    window.location.href = `tel:${encodeURIComponent(code)}`;
  } else {
    // Sur desktop, copier dans le presse-papier
    navigator.clipboard.writeText(code).then(() => {
      alert(`Code USSD copié : ${code}\n\nOuvrez l'application Mobile Money sur votre téléphone pour coller le code.`);
    });
  }
}

/**
 * Copie le code USSD dans le presse-papier
 */
export async function copyUSSD(code: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch {
    // Fallback pour anciens navigateurs
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}