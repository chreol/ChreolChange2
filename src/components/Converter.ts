// src/components/Converter.ts
import { Calculator, getCommission } from '@/services/calculator';
import { WhatsAppService } from '@/services/whatsapp';
import { generateUSSDCodes, copyUSSD } from '@/services/ussd';
import type { Direction } from '@/types';
import paypalImg  from '@/../assets/paypal.webp';
import mtnLogo    from '@/../assets/Mtn_Money.webp';
import orangeLogo from '@/../assets/oange_Money.webp';

const NET_LOGO: Record<string, string> = { MTN: mtnLogo, Orange: orangeLogo };
import irisImg from '@/../assets/iris_payment.webp';
import alphaImg from '@/../assets/alpha_bank.webp';
import piraeuImg from '@/../assets/pireaus_bank.webp';
import zenImg from '@/../assets/Zen_bank.webp';

type PaymentMethod = 'cash' | 'iris' | 'bank' | 'paypal' | 'zen' | null;

export interface ConverterOptions {
  networks?: string[];   // Available networks (default: ['Orange', 'MTN'])
  countryName?: string;  // Country label for WhatsApp message
}

export class Converter {
  private container: HTMLElement;
  private direction: Direction = 'EUR_TO_CFA';
  private result: ReturnType<typeof Calculator.calculate> | null = null;
  private isSyncing = false;
  private selectedPayment: PaymentMethod = null;
  private selectedNetwork: string | null = null;
  private opts: ConverterOptions;

  constructor(container: HTMLElement, opts: ConverterOptions = {}) {
    this.container = container;
    this.opts = { networks: opts.networks ?? ['Orange', 'MTN'], countryName: opts.countryName };
    this.render();
    this.bindEvents();
  }

  private render(): void {
    const isEURToCFA = this.direction === 'EUR_TO_CFA';
    const nets = this.opts.networks!;

    this.container.innerHTML = `
      <div class="space-y-5">

        <!-- Toggle Direction -->
        <div class="flex justify-center">
          <div class="bg-gray-200 p-1 rounded-2xl inline-flex shadow-inner w-full max-w-md">
            <button data-dir="EUR_TO_CFA"
                    class="flex-1 px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
                      isEURToCFA ? 'bg-amber-500 text-gray-900 shadow-lg scale-105' : 'text-gray-600 hover:text-gray-900'
                    }">
              <div class="flex flex-col items-center"><span>💶 EUR → CFA</span><span class="text-xs font-normal mt-1">Envoi Afrique</span></div>
            </button>
            <button data-dir="CFA_TO_EUR"
                    class="flex-1 px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
                      this.direction === 'CFA_TO_EUR' ? 'bg-amber-500 text-gray-900 shadow-lg scale-105' : 'text-gray-600 hover:text-gray-900'
                    }">
              <div class="flex flex-col items-center"><span>🌍 CFA → EUR</span><span class="text-xs font-normal mt-1">Reçu Europe</span></div>
            </button>
          </div>
        </div>

        <!-- ÉTAPE 1 — Montant -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Étape 1 — Entrez le montant
          </p>
          <div class="space-y-3">
            <div class="space-y-1">
              <label class="block text-sm font-bold text-gray-700">
                ${isEURToCFA ? 'Montant en EUROS à envoyer' : 'Montant reçu en EUR (après commission)'}
              </label>
              <div class="relative">
                <input type="number" id="eur-input" min="0" step="0.01" placeholder="0"
                       class="input-field w-full pr-16 text-lg font-semibold bg-white focus:ring-4 focus:ring-blue-100 transition-all"/>
                <span class="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 px-3 py-1 rounded-lg text-sm font-bold text-gray-700 select-none">€</span>
              </div>
            </div>
            <div class="text-center">
              <span class="inline-block bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm font-bold">OU / SINON</span>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-bold text-gray-700">
                ${isEURToCFA ? 'Montant reçu en CFA' : 'Montant en CFA à déposer'}
              </label>
              <div class="relative">
                <input type="number" id="cfa-input" min="0" step="100" placeholder="0"
                       class="input-field w-full pr-20 text-lg font-semibold bg-white focus:ring-4 focus:ring-amber-100 transition-all"/>
                <span class="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-100 px-3 py-1 rounded-lg text-sm font-bold text-amber-800 select-none">FCFA</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Résultat -->
        <div id="result-display" class="hidden space-y-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 shadow">
          <h4 class="font-bold text-gray-800 flex items-center gap-2 border-b border-blue-200 pb-2">
            <span class="bg-blue-600 text-white px-2 py-1 rounded-lg text-sm">📊</span> Détails de la transaction
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span class="text-gray-600 font-medium text-sm">${isEURToCFA ? '💰 Vous envoyez :' : '📥 Vous déposez :'}</span>
              <span class="font-bold text-gray-900" id="res-sent"></span>
            </div>
            <div class="flex justify-between items-center bg-amber-50 rounded-lg p-3 border border-amber-200">
              <span class="text-amber-800 font-medium text-sm">📊 Commission :</span>
              <span class="font-bold text-amber-700 text-sm" id="res-commission"></span>
            </div>
            ${isEURToCFA ? `
            <div class="flex justify-between items-center bg-blue-100 rounded-lg p-3 border border-blue-300">
              <span class="text-blue-900 font-bold text-sm">💵 Total à payer :</span>
              <span class="font-bold text-blue-700 text-lg" id="res-total"></span>
            </div>` : ''}
            <div class="flex justify-between items-center bg-green-100 rounded-lg p-4 border-2 border-green-300">
              <span class="text-green-800 font-bold">🎁 ${isEURToCFA ? 'Il reçoit :' : 'Vous recevez :'}</span>
              <span class="font-bold text-green-700 text-2xl" id="res-received"></span>
            </div>
          </div>
          ${!isEURToCFA ? `<p class="text-xs text-gray-500 text-center italic">* Montant arrondi à l'unité inférieure</p>` : ''}
        </div>

        ${isEURToCFA ? `
        <!-- ÉTAPE 2 — Bénéficiaire -->
        <div id="benef-section" class="hidden bg-blue-50 rounded-xl p-4 border-2 border-blue-200 space-y-3">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Étape 2 — Informations du bénéficiaire
          </p>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">👤 Nom et Prénom</label>
              <input id="benef-name" type="text" placeholder="Ex: Jean DUPONT"
                     class="input-field w-full bg-white focus:ring-4 focus:ring-blue-100"/>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">📱 Numéro de téléphone</label>
              <div class="relative">
                <input id="benef-phone" type="tel" maxlength="9" placeholder="Ex: 655123456"
                       class="input-field w-full bg-white focus:ring-4 focus:ring-blue-100 pr-20"/>
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 select-none">max 9</span>
              </div>
              <p id="phone-error" class="text-xs text-red-500 mt-1 hidden">Le numéro doit comporter 9 chiffres</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">📶 Réseau Mobile</label>
              <div class="flex gap-3 flex-wrap">
                ${nets.map(net => {
              const logo = NET_LOGO[net];
              const imgOrEmoji = logo
                ? `<img src="${logo}" alt="${net}" class="w-8 h-8 object-contain flex-shrink-0" onerror="this.outerHTML='<span class=&quot;text-xl&quot;>📶</span>'"/>`
                : `<span class="text-xl">📶</span>`;
              return `
                  <button data-network="${net}"
                          class="net-btn flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-200
                                 hover:border-amber-500 hover:bg-amber-50 transition-all font-semibold text-sm text-gray-700">
                    ${imgOrEmoji}
                    <span>${net === 'MTN' ? 'MTN MoMo' : net === 'Orange' ? 'Orange Money' : net}</span>
                  </button>`;
            }).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- ÉTAPE 3 — Mode de paiement -->
        <div id="payment-section" class="hidden">
          <div class="bg-green-50 rounded-xl p-4 border-2 border-green-200 space-y-3">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Étape 3 — Mode de paiement
            </p>
            <p class="text-xs text-gray-500">Comment nous envoyez-vous l'argent depuis la Grèce/Europe ?</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <button data-payment="cash"
                      class="pay-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-center">
                <span class="text-2xl">💵</span>
                <span class="text-xs font-bold text-gray-700">Cash</span>
                <span class="text-xs text-gray-400">Athènes</span>
              </button>
              <button data-payment="iris"
                      class="pay-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                <span class="text-2xl">📲</span>
                <span class="text-xs font-bold text-gray-700">IRIS</span>
                <span class="text-xs text-gray-400">Grèce</span>
              </button>
              <button data-payment="bank"
                      class="pay-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center">
                <span class="text-2xl">🏦</span>
                <span class="text-xs font-bold text-gray-700">Banque</span>
                <span class="text-xs text-gray-400">IBAN</span>
              </button>
              <button data-payment="paypal"
                      class="pay-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all text-center">
                <span class="text-2xl">🅿️</span>
                <span class="text-xs font-bold text-gray-700">PayPal</span>
                <span class="text-xs text-gray-400">Intl.</span>
              </button>
              <button data-payment="zen"
                      class="pay-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-center col-span-2 sm:col-span-1">
                <span class="text-2xl">🌐</span>
                <span class="text-xs font-bold text-gray-700">ZEN</span>
                <span class="text-xs text-gray-400">SEPA</span>
              </button>
            </div>
            <div id="payment-details" class="hidden"></div>
          </div>
        </div>

        <!-- ÉTAPE 4 — Envoyez la preuve -->
        <div id="proof-section" class="hidden bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Étape 4 — Envoyez la preuve</p>
          <p class="text-sm text-amber-800">
            Après votre paiement, <strong>envoyez la preuve (capture d'écran ou photo)</strong>
            sur WhatsApp : <strong>+30 697 359 8677</strong>
          </p>
        </div>` : ''}

        <!-- USSD (CFA → EUR uniquement) -->
        ${!isEURToCFA ? `
        <div id="ussd-section" class="hidden space-y-4">
          <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-300">
            <h5 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              💳 Paiement Mobile Money
            </h5>
            <p class="text-sm text-gray-600 mb-4">Cliquez sur le code pour copier et effectuez le dépôt :</p>
            <div class="mb-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-yellow-700 flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-yellow-500"></span> MTN
                </span>
                <button id="copy-mtn" class="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition-colors font-semibold">📋 Copier</button>
              </div>
              <div class="bg-white rounded-lg p-3 border-2 border-yellow-300 shadow-sm">
                <code id="mtn-code" class="text-sm font-mono text-gray-800 break-all"></code>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-orange-700 flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-orange-500"></span> Orange
                </span>
                <button id="copy-orange" class="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg transition-colors font-semibold">📋 Copier</button>
              </div>
              <div class="bg-white rounded-lg p-3 border-2 border-orange-300 shadow-sm">
                <code id="orange-code" class="text-sm font-mono text-gray-800 break-all"></code>
              </div>
            </div>
            <div class="mt-4 bg-blue-50 rounded-lg p-3 text-xs text-gray-600">
              <p class="font-semibold mb-1">💡 Comment faire :</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>Copiez le code de votre opérateur</li>
                <li>Ouvrez l'application Mobile Money</li>
                <li>Collez le code et validez le dépôt</li>
                <li>Envoyez la preuve sur WhatsApp</li>
              </ol>
            </div>
          </div>
        </div>` : ''}

        <!-- Étape 5 — WhatsApp -->
        <button id="whatsapp-btn"
                class="btn-primary w-full hidden bg-[#25D366] hover:bg-[#20bd5a] border-none text-white shadow-xl hover:shadow-2xl transform transition-all active:scale-95 py-4 text-lg">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span>${isEURToCFA ? 'Étape 5 — Soumettre sur WhatsApp' : 'Valider sur WhatsApp'}</span>
        </button>

      </div>
    `;

    setTimeout(() => this.bindEvents(), 0);
  }

  private bindEvents(): void {
    this.container.querySelectorAll('[data-dir]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dir = (e.currentTarget as HTMLElement).dataset.dir as Direction;
        if (dir && dir !== this.direction) {
          this.direction = dir;
          this.selectedPayment = null;
          this.selectedNetwork = null;
          this.render();
        }
      });
    });

    const eurInput = this.container.querySelector('#eur-input') as HTMLInputElement;
    if (eurInput) {
      eurInput.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        if (!isNaN(val) && val > 0) this.calculateFromEUR(val);
        else this.hideResults();
      });
    }

    const cfaInput = this.container.querySelector('#cfa-input') as HTMLInputElement;
    if (cfaInput) {
      cfaInput.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        if (!isNaN(val) && val > 0) this.calculateFromCFA(val);
        else this.hideResults();
      });
    }

    const copyMtn = this.container.querySelector('#copy-mtn');
    if (copyMtn) {
      copyMtn.addEventListener('click', async () => {
        const code = this.container.querySelector('#mtn-code')?.textContent;
        if (code) await this.copyWithFeedback(copyMtn as HTMLElement, code);
      });
    }

    const copyOrange = this.container.querySelector('#copy-orange');
    if (copyOrange) {
      copyOrange.addEventListener('click', async () => {
        const code = this.container.querySelector('#orange-code')?.textContent;
        if (code) await this.copyWithFeedback(copyOrange as HTMLElement, code);
      });
    }

    this.container.querySelectorAll('.pay-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const method = (e.currentTarget as HTMLElement).dataset.payment as PaymentMethod;
        if (method) this.selectPayment(method);
      });
    });

    this.container.querySelectorAll('.net-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const net = (e.currentTarget as HTMLElement).dataset.network!;
        this.selectedNetwork = net;
        this.container.querySelectorAll('.net-btn').forEach(b => {
          const el = b as HTMLElement;
          const active = el.dataset.network === net;
          el.classList.toggle('border-amber-500', active);
          el.classList.toggle('bg-amber-50', active);
          el.classList.toggle('border-gray-200', !active);
        });
      });
    });

    const phoneInput = this.container.querySelector('#benef-phone') as HTMLInputElement;
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const err = this.container.querySelector('#phone-error') as HTMLElement;
        const val = phoneInput.value.replace(/\D/g, '');
        phoneInput.value = val;
        if (err) err.classList.toggle('hidden', val.length === 0 || val.length === 9);
      });
    }

    this.container.querySelector('#whatsapp-btn')?.addEventListener('click', () => this.sendToWhatsApp());
  }

  private selectPayment(method: PaymentMethod): void {
    this.selectedPayment = method;

    this.container.querySelectorAll('.pay-btn').forEach(btn => {
      const el = btn as HTMLElement;
      const active = el.dataset.payment === method;
      el.classList.toggle('ring-2', active);
      el.classList.toggle('ring-offset-1', active);
      el.classList.toggle('scale-105', active);
      const colors: Record<string, string> = { cash: 'ring-green-500', iris: 'ring-blue-500', bank: 'ring-indigo-500', paypal: 'ring-sky-500', zen: 'ring-purple-500' };
      Object.values(colors).forEach(c => el.classList.remove(c));
      if (active && method) el.classList.add(colors[method] || 'ring-blue-500');
    });

    const detailsEl = this.container.querySelector('#payment-details') as HTMLElement;
    if (!detailsEl) return;
    detailsEl.classList.remove('hidden');
    detailsEl.innerHTML = this.getPaymentHTML(method!);

    detailsEl.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const text = (e.currentTarget as HTMLElement).dataset.copy!;
        await this.copyWithFeedback(e.currentTarget as HTMLElement, text);
      });
    });
  }

  private getPaymentHTML(method: string): string {
    switch (method) {
      case 'cash':
        return `<div class="bg-white rounded-xl p-4 border border-green-200 space-y-3 mt-2">
          <div class="flex items-center gap-3"><span class="text-3xl">💵</span><div><h5 class="font-bold text-gray-800">Dépôt en Espèces — Athènes</h5></div></div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
            <p class="font-semibold text-gray-800">📍 Tenedou 4 — Restaurant Pakistanais</p>
            <p class="text-gray-500 text-xs mt-0.5">Platia Amerikiss, Athènes, Grèce</p>
          </div>
          <div class="bg-amber-50 border border-amber-300 rounded-lg p-3 text-sm text-amber-800">
            <p class="font-bold">📸 Obligatoire</p>
            <p class="text-xs mt-1">Prenez une <strong>photo du dépôt</strong> sur le comptoir et envoyez-la en <strong>privé sur WhatsApp</strong></p>
          </div>
        </div>`;

      case 'iris':
        return `<div class="bg-white rounded-xl p-4 border border-blue-200 space-y-3 mt-2">
          <div class="flex items-center gap-3">
            <img src="${irisImg}" alt="IRIS" class="w-12 h-12 object-contain rounded-lg border border-gray-100 shadow-sm flex-shrink-0"
                 onerror="this.outerHTML='<span class=\'text-3xl\'>📲</span>'"/>
            <h5 class="font-bold text-gray-800">IRIS — Virement Instantané Grèce</h5>
          </div>
          <div class="space-y-2">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
              <div><p class="text-xs text-gray-500 uppercase">TSAYEM</p><p class="font-mono font-bold text-gray-800 text-lg">694 407 4660</p></div>
              <button data-copy="694 407 4660" class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold">📋 Copier</button>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
              <div><p class="text-xs text-gray-500 uppercase">MBARGA</p><p class="font-mono font-bold text-gray-800 text-lg">694 358 1891</p></div>
              <button data-copy="694 358 1891" class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold">📋 Copier</button>
            </div>
          </div>
        </div>`;

      case 'bank':
        return `<div class="bg-white rounded-xl p-4 border border-indigo-200 space-y-3 mt-2">
          <div class="flex items-center gap-3"><span class="text-3xl">🏦</span><h5 class="font-bold text-gray-800">Virement Bancaire — 2 options</h5></div>

          <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-2">
            <div class="flex items-center gap-2 mb-1">
              <img src="${alphaImg}" alt="Alphabank" class="w-8 h-8 object-contain rounded flex-shrink-0"
                   onerror="this.style.display='none'"/>
              <p class="text-xs font-bold text-indigo-700 uppercase">A — Alphabank</p>
            </div>
            <div class="flex justify-between items-start gap-2">
              <div class="min-w-0"><p class="text-xs text-gray-500">IBAN</p><p class="font-mono text-xs font-bold text-gray-800 break-all">GR22 0140 1040 1040 0231 0027 911</p></div>
              <button data-copy="GR2201401040104002310027911" class="flex-shrink-0 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1.5 rounded-lg font-semibold">📋</button>
            </div>
            <p class="text-xs text-gray-700"><span class="text-gray-500">Nom :</span> Mathieu Mathilde Mbarga • <span class="text-gray-500">BIC :</span> CRBAGRAAXXX</p>
          </div>

          <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-2">
            <div class="flex items-center gap-2 mb-1">
              <img src="${piraeuImg}" alt="Piraeus Bank" class="w-8 h-8 object-contain rounded flex-shrink-0"
                   onerror="this.style.display='none'"/>
              <p class="text-xs font-bold text-indigo-700 uppercase">B — Piraeus Bank SA</p>
            </div>
            <div class="flex justify-between items-start gap-2">
              <div class="min-w-0"><p class="text-xs text-gray-500">IBAN</p><p class="font-mono text-xs font-bold text-gray-800 break-all">GR25 0172 0980 0050 9811 4578 833</p></div>
              <button data-copy="GR2501720980005098114578833" class="flex-shrink-0 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1.5 rounded-lg font-semibold">📋</button>
            </div>
            <p class="text-xs text-gray-700"><span class="text-gray-500">Nom :</span> Tsayem Tchinda Blondel • <span class="text-gray-500">BIC :</span> PIRBGRAAXXX</p>
          </div>
        </div>`;

      case 'paypal':
        return `<div class="bg-white rounded-xl p-4 border border-sky-200 space-y-3 mt-2">
          <div class="flex items-center gap-3">
            <img src="${paypalImg}" alt="PayPal" class="w-12 h-12 object-contain rounded-lg border border-gray-100 shadow-sm flex-shrink-0"
                 onerror="this.outerHTML='<span class=\'text-3xl\'>🅿️</span>'"/>
            <h5 class="font-bold text-gray-800">PayPal — Paiement International</h5>
          </div>
          <div class="bg-sky-50 border border-sky-200 rounded-lg p-3 flex justify-between items-center">
            <div><p class="text-xs text-gray-500">Adresse PayPal</p><p class="font-mono font-bold text-gray-800">larambambo@gmail.com</p></div>
            <button data-copy="larambambo@gmail.com" class="text-xs bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg font-semibold">📋 Copier</button>
          </div>
          <p class="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">⚠️ Envoyez comme <strong>"Famille et amis"</strong></p>
        </div>`;

      case 'zen':
        return `<div class="bg-white rounded-xl p-4 border border-purple-200 space-y-3 mt-2">
          <div class="flex items-center gap-3">
            <img src="${zenImg}" alt="ZEN Bank" class="w-12 h-12 object-contain rounded-lg border border-gray-100 shadow-sm flex-shrink-0"
                 onerror="this.outerHTML='<span class=\'text-3xl\'>🌐</span>'"/>
            <h5 class="font-bold text-gray-800">ZEN — Virement International SEPA</h5>
          </div>
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-2">
            <div class="flex justify-between items-start gap-2">
              <div class="min-w-0"><p class="text-xs text-gray-500">IBAN</p><p class="font-mono text-xs font-bold text-gray-800 break-all">LT08 3130 0101 2199 6568</p></div>
              <button data-copy="LT083130010121996568" class="flex-shrink-0 text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1.5 rounded-lg font-semibold">📋</button>
            </div>
            <p class="text-xs text-gray-700"><span class="text-gray-500">BIC :</span> <strong>BZENLT22</strong> • <span class="text-gray-500">Titulaire :</span> BLONDEL TSAYEM TCHINDA</p>
            <p class="text-xs text-gray-500">Lefkosias 15, 11252 Athènes, GREECE — ZEN (Lituanie)</p>
          </div>
        </div>`;

      default: return '';
    }
  }

  private async copyWithFeedback(btn: HTMLElement, text: string): Promise<void> {
    const ok = await copyUSSD(text);
    const orig = btn.textContent;
    btn.textContent = ok ? '✅ Copié !' : '❌ Échec';
    btn.classList.add(ok ? 'bg-green-600' : 'bg-red-600');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('bg-green-600', 'bg-red-600'); }, 2000);
  }

  private calculateFromEUR(amountEUR: number): void {
    if (this.isSyncing) return;
    this.isSyncing = true;
    const cfaInput = this.container.querySelector('#cfa-input') as HTMLInputElement;
    const isEURToCFA = this.direction === 'EUR_TO_CFA';
    try {
      if (isEURToCFA) {
        const commission = getCommission(amountEUR);
        const totalToPay = amountEUR + commission;
        const amountReceived = Math.round(amountEUR * 650);
        this.result = { direction: 'EUR_TO_CFA', amountSent: amountEUR, currencySent: 'EUR', amountReceived, currencyReceived: 'CFA', commission, totalToPay };
        if (cfaInput) cfaInput.value = amountReceived.toString();
      } else {
        const commission = getCommission(amountEUR);
        const grossEUR = amountEUR + commission;
        const amountToDeposit = Math.round(grossEUR * 660);
        this.result = { direction: 'CFA_TO_EUR', amountSent: amountToDeposit, currencySent: 'CFA', amountReceived: amountEUR, currencyReceived: 'EUR', commission, totalToPay: amountToDeposit };
        if (cfaInput) cfaInput.value = amountToDeposit.toString();
        this.generateUSSDDisplay(amountToDeposit);
      }
      this.updateDisplay();
    } catch { this.hideResults(); }
    this.isSyncing = false;
  }

  private calculateFromCFA(amountCFA: number): void {
    if (this.isSyncing) return;
    this.isSyncing = true;
    const eurInput = this.container.querySelector('#eur-input') as HTMLInputElement;
    const isEURToCFA = this.direction === 'EUR_TO_CFA';
    try {
      if (isEURToCFA) {
        const amountReceived = amountCFA;
        const amountSent = amountCFA / 650;
        const commission = getCommission(amountSent);
        const totalToPay = amountSent + commission;
        this.result = { direction: 'EUR_TO_CFA', amountSent, currencySent: 'EUR', amountReceived, currencyReceived: 'CFA', commission, totalToPay };
        if (eurInput) eurInput.value = amountSent.toFixed(2);
      } else {
        const grossEUR = amountCFA / 660;
        const commission = getCommission(grossEUR);
        const amountReceived = Math.max(0, Math.floor(grossEUR - commission));
        this.result = { direction: 'CFA_TO_EUR', amountSent: amountCFA, currencySent: 'CFA', amountReceived, currencyReceived: 'EUR', commission, totalToPay: amountCFA };
        if (eurInput) eurInput.value = amountReceived.toString();
        this.generateUSSDDisplay(amountCFA);
      }
      this.updateDisplay();
    } catch { this.hideResults(); }
    this.isSyncing = false;
  }

  private generateUSSDDisplay(amountCFA: number): void {
    const ussdSection = this.container.querySelector('#ussd-section');
    if (!ussdSection) return;
    const codes = generateUSSDCodes(amountCFA);
    const mtnEl = this.container.querySelector('#mtn-code');
    const orangeEl = this.container.querySelector('#orange-code');
    if (mtnEl) mtnEl.textContent = codes.mtn;
    if (orangeEl) orangeEl.textContent = codes.orange;
    ussdSection.classList.remove('hidden');
  }

  private updateDisplay(): void {
    if (!this.result) return;
    const isEURToCFA = this.direction === 'EUR_TO_CFA';
    const commLabel = Calculator.getCommissionLabel(this.result.amountSent, this.direction);

    const resultDisplay = this.container.querySelector('#result-display') as HTMLElement;
    const benef = this.container.querySelector('#benef-section') as HTMLElement;
    const payment = this.container.querySelector('#payment-section') as HTMLElement;
    const proof = this.container.querySelector('#proof-section') as HTMLElement;
    const whatsappBtn = this.container.querySelector('#whatsapp-btn') as HTMLElement;

    const resSent = resultDisplay?.querySelector('#res-sent');
    const resComm = resultDisplay?.querySelector('#res-commission');
    const resTotal = resultDisplay?.querySelector('#res-total');
    const resReceived = resultDisplay?.querySelector('#res-received');

    if (resSent) resSent.textContent = isEURToCFA ? this.fmt(this.result.amountSent, 'EUR') : this.fmt(this.result.amountSent, 'CFA');
    if (resComm) resComm.textContent = `-${commLabel}`;
    if (isEURToCFA && resTotal) resTotal.textContent = this.fmt(this.result.totalToPay, 'EUR');
    if (resReceived) resReceived.textContent = isEURToCFA ? this.fmt(this.result.amountReceived, 'CFA') : this.fmt(this.result.amountReceived, 'EUR');

    if (resultDisplay) resultDisplay.classList.remove('hidden');
    if (isEURToCFA) {
      if (benef) benef.classList.remove('hidden');
      if (payment) payment.classList.remove('hidden');
      if (proof) proof.classList.remove('hidden');
      if (this.selectedPayment) this.selectPayment(this.selectedPayment);
    }
    if (whatsappBtn) whatsappBtn.classList.remove('hidden');
  }

  private hideResults(): void {
    ['#result-display', '#benef-section', '#payment-section', '#proof-section', '#ussd-section', '#whatsapp-btn'].forEach(sel => {
      this.container.querySelector(sel)?.classList.add('hidden');
    });
  }

  private fmt(amount: number, currency: string): string {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    }
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount).replace('XOF', 'FCFA');
  }

  private sendToWhatsApp(): void {
    if (!this.result) return;
    const isEURToCFA = this.direction === 'EUR_TO_CFA';
    const commLabel = Calculator.getCommissionLabel(this.result.amountSent, this.direction);

    if (isEURToCFA) {
      const name = (this.container.querySelector('#benef-name') as HTMLInputElement)?.value?.trim();
      const phone = (this.container.querySelector('#benef-phone') as HTMLInputElement)?.value?.trim();
      if (!name || !phone || phone.length !== 9) {
        const benef = this.container.querySelector('#benef-section') as HTMLElement;
        benef?.scrollIntoView({ behavior: 'smooth' });
        const err = this.container.querySelector('#phone-error') as HTMLElement;
        if (err && phone && phone.length !== 9) err.classList.remove('hidden');
        return;
      }
    }

    const name = (this.container.querySelector('#benef-name') as HTMLInputElement)?.value?.trim() || '';
    const phone = (this.container.querySelector('#benef-phone') as HTMLInputElement)?.value?.trim() || '';
    const network = this.selectedNetwork || '';
    const country = this.opts.countryName ? `📍 Pays: ${this.opts.countryName}\n` : '';

    const payLabels: Record<string, string> = { cash: 'Espèces (Pakistanais)', iris: 'IRIS', bank: 'Virement Bancaire', paypal: 'PayPal', zen: 'ZEN International' };
    const payLine = isEURToCFA && this.selectedPayment ? `\n💳 Paiement: ${payLabels[this.selectedPayment]}` : '';
    const benefLine = isEURToCFA && name ? `\n👤 Bénéficiaire: ${name}\n📱 Téléphone: ${phone}\n📶 Réseau: ${network || 'non précisé'}` : '';

    const message = `🔄 *DEMANDE DE CHANGE CHREOL EMPIRE*\n\n` +
      `📊 Type: ${isEURToCFA ? 'EUR → CFA' : 'CFA → EUR'}\n` +
      country +
      `${isEURToCFA ? '💰 J\'envoie' : '📥 Je dépose'}: ${this.fmt(this.result.amountSent, isEURToCFA ? 'EUR' : 'CFA')}\n` +
      `📊 Commission: ${commLabel}\n` +
      `${isEURToCFA ? `💵 Total à payer: ${this.fmt(this.result.totalToPay, 'EUR')}\n` : ''}` +
      `🎁 *Reçu: ${this.fmt(this.result.amountReceived, isEURToCFA ? 'CFA' : 'EUR')}*` +
      benefLine +
      payLine +
      `\n\n✅ Je confirme.`;

    WhatsAppService.open({ phone: WhatsAppService.PHONE, text: encodeURIComponent(message) });
  }
}
