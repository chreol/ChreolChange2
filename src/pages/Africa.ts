// src/pages/Africa.ts
import { Layout } from '@/components/Layout';
import { getCommission } from '@/services/calculator';
import { WhatsAppService } from '@/services/whatsapp';
import { copyUSSD } from '@/services/ussd';

// Logos Mobile Money operators
import mtnImg    from '@/../assets/Mtn_Money.webp';
import orangeImg from '@/../assets/oange_Money.webp';
import waveImg   from '@/../assets/wave.webp';
import moovImg   from '@/../assets/moov.webp';
import freeImg   from '@/../assets/free.webp';
import airtelImg from '@/../assets/airtel.webp';
import vodacomImg from '@/../assets/vodacom.webp';
import airtelTigoImg from '@/../assets/airtelTigo.webp';
import vodafoneImg from '@/../assets/vodafone.webp';
import gloImg    from '@/../assets/glo.webp';
import togocomImg from '@/../assets/togocom.webp';

// Bank / payment logos
import paypalImg  from '@/../assets/paypal.webp';
import envoiImg   from '@/../assets/envoi_d_argent.webp';
import irisImg   from '@/../assets/iris_payment.webp';
import alphaImg  from '@/../assets/alpha_bank.webp';
import piraeuImg from '@/../assets/pireaus_bank.webp';
import zenImg    from '@/../assets/Zen_bank.webp';

// Map operator name → logo URL
const OP_LOGO: Record<string, string> = {
  'MTN':        mtnImg,
  'Orange':     orangeImg,
  'Wave':       waveImg,
  'Moov':       moovImg,
  'Free':       freeImg,
  'Airtel':     airtelImg,
  'Vodacom':    vodacomImg,
  'AirtelTigo': airtelTigoImg,
  'Vodafone':   vodafoneImg,
  'Glo':        gloImg,
  'Togocom':    togocomImg,
};

// ─────────────────────────────────────────────
// Country data
// ─────────────────────────────────────────────
interface Country {
  code: string;
  flag: string;
  name: string;
  currency: string;       // ISO code
  currencyLabel: string;  // Display label shown to user
  rateFromEUR: number;    // Local currency per 1 EUR
  isCFA: boolean;         // Is CFA franc (XOF or XAF)
  dual?: {                // Nigeria: show dual line (FCFA + local)
    cfaLabel: string;
    cfaRate: number;
  };
  operators: string[];
}

const COUNTRIES: Country[] = [
  // ── XOF — Afrique de l'Ouest (UEMOA) ──────────────────
  { code: 'CI', flag: '🇨🇮', name: "Côte d'Ivoire",    currency: 'XOF', currencyLabel: 'FCFA (XOF)', rateFromEUR: 650, isCFA: true,  operators: ['MTN', 'Orange', 'Wave', 'Moov'] },
  { code: 'SN', flag: '🇸🇳', name: 'Sénégal',          currency: 'XOF', currencyLabel: 'FCFA (XOF)', rateFromEUR: 650, isCFA: true,  operators: ['Orange', 'Wave', 'Free'] },
  { code: 'ML', flag: '🇲🇱', name: 'Mali',             currency: 'XOF', currencyLabel: 'FCFA (XOF)', rateFromEUR: 650, isCFA: true,  operators: ['Orange', 'Moov', 'Wave'] },
  { code: 'BF', flag: '🇧🇫', name: 'Burkina Faso',     currency: 'XOF', currencyLabel: 'FCFA (XOF)', rateFromEUR: 650, isCFA: true,  operators: ['Orange', 'Moov', 'Wave'] },
  { code: 'BJ', flag: '🇧🇯', name: 'Bénin',            currency: 'XOF', currencyLabel: 'FCFA (XOF)', rateFromEUR: 650, isCFA: true,  operators: ['MTN', 'Moov'] },
  { code: 'NE', flag: '🇳🇪', name: 'Niger',            currency: 'XOF', currencyLabel: 'FCFA (XOF)', rateFromEUR: 650, isCFA: true,  operators: ['Orange', 'Moov'] },
  { code: 'GW', flag: '🇬🇼', name: 'Guinée-Bissau',    currency: 'XOF', currencyLabel: 'FCFA (XOF)', rateFromEUR: 650, isCFA: true,  operators: ['Orange', 'MTN'] },
  { code: 'TG', flag: '🇹🇬', name: 'Togo',             currency: 'XOF', currencyLabel: 'FCFA (XOF)', rateFromEUR: 650, isCFA: true,  operators: ['Moov', 'Togocom'] },
  // ── XAF — Afrique Centrale (CEMAC) ────────────────────
  { code: 'GQ', flag: '🇬🇶', name: 'Guinée Équatoriale', currency: 'XAF', currencyLabel: 'FCFA (XAF)', rateFromEUR: 650, isCFA: true, operators: ['Orange', 'Moov'] },
  { code: 'CG', flag: '🇨🇬', name: 'Congo-Brazzaville', currency: 'XAF', currencyLabel: 'FCFA (XAF)', rateFromEUR: 650, isCFA: true,  operators: ['MTN', 'Airtel'] },
  { code: 'GA', flag: '🇬🇦', name: 'Gabon',            currency: 'XAF', currencyLabel: 'FCFA (XAF)', rateFromEUR: 650, isCFA: true,  operators: ['Airtel', 'Moov'] },
  // ── Autres devises ────────────────────────────────────
  { code: 'CD', flag: '🇨🇩', name: 'Congo-Kinshasa',   currency: 'CDF', currencyLabel: 'Franc Congolais (CDF)', rateFromEUR: 2900, isCFA: false, operators: ['Airtel', 'Orange', 'Vodacom'] },
  {
    code: 'NG', flag: '🇳🇬', name: 'Nigeria',
    currency: 'NGN', currencyLabel: 'Naira (NGN)', rateFromEUR: 1700, isCFA: false,
    dual: { cfaLabel: 'FCFA équivalent', cfaRate: 650 },
    operators: ['MTN', 'Airtel', 'Glo'],
  },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana',            currency: 'GHS', currencyLabel: 'Cedi (GHS)',            rateFromEUR: 16,   isCFA: false, operators: ['MTN', 'Vodafone', 'AirtelTigo'] },
];

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Espèces (Pakistanais)', iris: 'IRIS', bank: 'Virement Bancaire', paypal: 'PayPal', zen: 'ZEN International',
};

// ─────────────────────────────────────────────
export class AfricaPage {
  private container: HTMLElement;
  private selectedCountry: Country | null = null;
  private amountEUR = 0;
  private commission = 0;
  private totalToPay = 0;
  private selectedNetwork: string | null = null;
  private selectedPayment: string | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    Layout.bindMobileMenu();
  }

  private render(): void {
    this.container.innerHTML = `
      ${Layout.getHeader('africa')}
      ${Layout.getMarquee()}
      ${Layout.getCountriesBar()}

      <main>
        <!-- Hero -->
        <section class="bg-gradient-to-br from-green-800/95 via-emerald-800/95 to-teal-900/95 text-white py-12 md:py-14">
          <div class="max-w-3xl mx-auto px-4 text-center">
            <h1 class="text-3xl md:text-5xl font-bold mb-3">🌍 Transfert EUR → FCFA<br/><span class="text-amber-400">Toute l'Afrique</span></h1>
            <p class="text-green-100 text-sm mb-4">Complétez les 5 étapes ci-dessous pour soumettre votre demande</p>
            <div class="flex flex-wrap justify-center gap-3 text-sm">
              <span class="bg-white/10 px-3 py-1.5 rounded-lg">💶 1 EUR = 650 FCFA</span>
              <span class="bg-white/10 px-3 py-1.5 rounded-lg">⚡ ≥ 5 min</span>
              <span class="bg-white/10 px-3 py-1.5 rounded-lg">🔒 Sécurisé</span>
            </div>
          </div>
        </section>

        <!-- Formulaire multi-étapes -->
        <section class="py-10 bg-white/95">
          <div class="max-w-2xl mx-auto px-4 space-y-4">

            <!-- ÉTAPE 1 — Pays -->
            <div class="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-green-600 to-teal-600 px-5 py-4 flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <span class="bg-white text-green-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0">1</span>
                  <h3 class="text-white font-bold">Pays de destination</h3>
                </div>
                <span id="country-badge" class="text-white/80 text-sm font-medium hidden"></span>
              </div>
              <div id="step1-content" class="p-4">
                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  ${COUNTRIES.map(c => `
                    <button data-country="${c.code}"
                            class="country-btn flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-gray-200
                                   hover:border-green-500 hover:bg-green-50 transition-all text-center">
                      <span class="text-2xl">${c.flag}</span>
                      <span class="text-xs font-medium text-gray-700 leading-tight">${c.name}</span>
                      <span class="text-xs text-gray-400">${c.currencyLabel.replace(' (XOF)', '').replace(' (XAF)', '')}</span>
                    </button>`).join('')}
                </div>
              </div>
            </div>

            <!-- ÉTAPE 2 — Montant -->
            <div id="step2" class="hidden bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center gap-3">
                <span class="bg-white text-blue-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0">2</span>
                <h3 class="text-white font-bold">Montant à envoyer</h3>
              </div>
              <div class="p-5 space-y-3">
                <div class="space-y-1">
                  <label class="block text-sm font-semibold text-gray-700">Montant en EUR</label>
                  <div class="relative">
                    <input type="number" id="eur-input" min="10" max="5000" step="0.01" placeholder="Ex: 100"
                           class="input-field w-full pr-16 text-lg font-semibold bg-gray-50 focus:ring-4 focus:ring-blue-100"/>
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 px-3 py-1 rounded-lg text-sm font-bold text-gray-700">€</span>
                  </div>
                </div>
                <!-- Résumé calcul -->
                <div id="calc-result" class="hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-gray-600">💰 Vous envoyez :</span><span class="font-bold" id="r-sent"></span></div>
                  <div class="flex justify-between text-sm"><span class="text-amber-700">📊 Commission :</span><span class="font-bold text-amber-700" id="r-comm"></span></div>
                  <div class="flex justify-between text-sm"><span class="text-blue-800 font-bold">💵 Total à payer :</span><span class="font-bold text-blue-700 text-base" id="r-total"></span></div>
                  <div class="flex justify-between border-t border-blue-200 pt-2">
                    <span class="text-green-800 font-bold">🎁 Bénéficiaire reçoit :</span>
                    <span class="font-bold text-green-700 text-lg" id="r-received"></span>
                  </div>
                  <!-- Ligne devise locale (Nigeria etc.) -->
                  <div id="r-local-wrap" class="hidden flex justify-between text-sm pt-1 border-t border-blue-100">
                    <span class="text-gray-600" id="r-local-label"></span>
                    <span class="font-bold text-gray-800" id="r-local-value"></span>
                  </div>
                  <!-- Note taux indicatif -->
                  <p id="r-indicative-note" class="hidden text-xs text-gray-400 italic">* Taux indicatif, peut varier</p>
                </div>
              </div>
            </div>

            <!-- ÉTAPE 3 — Bénéficiaire -->
            <div id="step3" class="hidden bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-4 flex items-center gap-3">
                <span class="bg-white text-purple-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0">3</span>
                <h3 class="text-white font-bold">Informations du bénéficiaire</h3>
              </div>
              <div class="p-5 space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">👤 Nom et Prénom</label>
                  <input id="benef-name" type="text" placeholder="Ex: Jean DUPONT"
                         class="input-field w-full bg-gray-50 focus:ring-4 focus:ring-purple-100"/>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">📱 Numéro de téléphone</label>
                  <div class="relative">
                    <input id="benef-phone" type="tel" maxlength="9" placeholder="Ex: 655123456"
                           class="input-field w-full bg-gray-50 focus:ring-4 focus:ring-purple-100 pr-20"/>
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">max 9</span>
                  </div>
                  <p id="phone-err" class="text-xs text-red-500 mt-1 hidden">Le numéro doit comporter exactement 9 chiffres</p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">📶 Réseau Mobile</label>
                  <div id="network-btns" class="flex flex-wrap gap-2"></div>
                </div>
              </div>
            </div>

            <!-- ÉTAPE 4 — Mode de paiement -->
            <div id="step4" class="hidden bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 flex items-center gap-3">
                <span class="bg-white text-amber-700 font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0">4</span>
                <h3 class="text-white font-bold">Mode de paiement</h3>
              </div>
              <div class="p-5 space-y-3">
                <p class="text-xs text-gray-500">Comment nous envoyez-vous l'argent depuis la Grèce / Europe ?</p>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  <button data-payment="cash" class="pay-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-center">
                    <span class="text-2xl">💵</span><span class="text-xs font-bold text-gray-700">Cash</span><span class="text-xs text-gray-400">Athènes</span>
                  </button>
                  <button data-payment="iris" class="pay-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                    <img src="${irisImg}" alt="IRIS" class="w-8 h-8 object-contain mx-auto" onerror="this.outerHTML='<span class=&quot;text-2xl&quot;>📲</span>'"/>
                    <span class="text-xs font-bold text-gray-700">IRIS</span><span class="text-xs text-gray-400">Grèce</span>
                  </button>
                  <button data-payment="bank" class="pay-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center">
                    <span class="text-2xl">🏦</span><span class="text-xs font-bold text-gray-700">Banque</span><span class="text-xs text-gray-400">IBAN</span>
                  </button>
                  <button data-payment="paypal" class="pay-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all text-center">
                    <img src="${paypalImg}" alt="PayPal" class="w-8 h-8 object-contain mx-auto" onerror="this.outerHTML='<span class=&quot;text-2xl&quot;>🅿️</span>'"/>
                    <span class="text-xs font-bold text-gray-700">PayPal</span><span class="text-xs text-gray-400">Intl.</span>
                  </button>
                  <button data-payment="zen" class="pay-btn flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-center col-span-2 sm:col-span-1">
                    <img src="${zenImg}" alt="ZEN" class="w-8 h-8 object-contain mx-auto" onerror="this.outerHTML='<span class=&quot;text-2xl&quot;>🌐</span>'"/>
                    <span class="text-xs font-bold text-gray-700">ZEN</span><span class="text-xs text-gray-400">SEPA</span>
                  </button>
                </div>
                <div id="payment-details" class="hidden"></div>
              </div>
            </div>

            <!-- ÉTAPE 5 — Soumettre -->
            <div id="step5" class="hidden">
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3 text-sm text-amber-800">
                📸 <strong>Étape 5 :</strong> Après paiement, envoyez la <strong>preuve</strong> sur WhatsApp : <strong>+30 697 359 8677</strong>
              </div>
              <button id="whatsapp-btn"
                      class="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 text-lg">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Soumettre sur WhatsApp
              </button>
            </div>

          </div>
        </section>
      </main>

      ${Layout.getFooter()}
      <style>details>summary{outline:none}details>summary::-webkit-details-marker{display:none}</style>
    `;

    this.bindEvents();
  }

  // ─────────────────────────────────────────────
  private bindEvents(): void {
    this.container.querySelectorAll('.country-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const code = (e.currentTarget as HTMLElement).dataset.country;
        const country = COUNTRIES.find(c => c.code === code);
        if (!country) return;
        this.selectedCountry = country;
        this.selectedNetwork = null;

        this.container.querySelectorAll('.country-btn').forEach(b =>
          b.classList.remove('border-green-500', 'bg-green-50', 'scale-105'));
        (e.currentTarget as HTMLElement).classList.add('border-green-500', 'bg-green-50', 'scale-105');

        const badge = this.container.querySelector('#country-badge') as HTMLElement;
        if (badge) { badge.textContent = `${country.flag} ${country.name}`; badge.classList.remove('hidden'); }

        const step2 = this.container.querySelector('#step2') as HTMLElement;
        step2?.classList.remove('hidden');
        step2?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Reset steps below
        ['#step3', '#step4', '#step5'].forEach(s =>
          this.container.querySelector(s)?.classList.add('hidden'));
        this.container.querySelector('#calc-result')?.classList.add('hidden');
        (this.container.querySelector('#eur-input') as HTMLInputElement).value = '';

        this.buildNetworkButtons(country.operators);
      });
    });

    const eurInput = this.container.querySelector('#eur-input') as HTMLInputElement;
    eurInput?.addEventListener('input', () => {
      const val = parseFloat(eurInput.value);
      if (!isNaN(val) && val >= 10) {
        this.amountEUR = val;
        this.commission = getCommission(val);
        this.totalToPay = val + this.commission;
        this.showCalcResult(val);
      } else {
        this.container.querySelector('#calc-result')?.classList.add('hidden');
        ['#step3', '#step4', '#step5'].forEach(s =>
          this.container.querySelector(s)?.classList.add('hidden'));
      }
    });

    this.container.querySelectorAll('.pay-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const method = (e.currentTarget as HTMLElement).dataset.payment!;
        this.selectedPayment = method;
        this.container.querySelectorAll('.pay-btn').forEach(b => {
          const el = b as HTMLElement;
          el.classList.toggle('ring-2', el.dataset.payment === method);
          el.classList.toggle('scale-105', el.dataset.payment === method);
        });
        const det = this.container.querySelector('#payment-details') as HTMLElement;
        if (det) { det.classList.remove('hidden'); det.innerHTML = this.getPaymentHTML(method); }
        det?.querySelectorAll('[data-copy]').forEach(b => {
          b.addEventListener('click', async (ev) => {
            const t = (ev.currentTarget as HTMLElement).dataset.copy!;
            const ok = await copyUSSD(t);
            const el = ev.currentTarget as HTMLElement;
            const orig = el.textContent;
            el.textContent = ok ? '✅' : '❌';
            setTimeout(() => { el.textContent = orig; }, 2000);
          });
        });
      });
    });

    this.container.querySelector('#whatsapp-btn')?.addEventListener('click', () => this.submitWhatsApp());

    // Lightbox — delegation on container
    this.container.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t.closest('#africa-cash-img-btn')) {
        const lb = document.querySelector('#africa-cash-lightbox') as HTMLElement;
        if (lb) { lb.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
      }
      if (t.closest('#africa-lb-close') || t.id === 'africa-cash-lightbox') {
        const lb = document.querySelector('#africa-cash-lightbox') as HTMLElement;
        if (lb) { lb.classList.add('hidden'); document.body.style.overflow = ''; }
      }
      if (t.closest('#africa-lb-minimize')) {
        const lb = document.querySelector('#africa-cash-lightbox') as HTMLElement;
        if (lb) { lb.classList.add('hidden'); document.body.style.overflow = ''; }
        document.querySelector('#africa-cash-img-btn')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const lb = document.querySelector('#africa-cash-lightbox') as HTMLElement;
        if (lb) { lb.classList.add('hidden'); document.body.style.overflow = ''; }
      }
    });
  }

  // ─────────────────────────────────────────────
  private buildNetworkButtons(operators: string[]): void {
    const wrap = this.container.querySelector('#network-btns') as HTMLElement;
    if (!wrap) return;

    wrap.innerHTML = operators.map(op => {
      const logo = OP_LOGO[op];
      const imgOrEmoji = logo
        ? `<img src="${logo}" alt="${op}" class="w-8 h-8 object-contain flex-shrink-0" onerror="this.outerHTML='<span class=&quot;text-xl&quot;>📶</span>'"/>`
        : `<span class="text-xl">📶</span>`;
      return `
        <button data-network="${op}"
                class="net-btn flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-gray-200
                       hover:border-amber-500 hover:bg-amber-50 transition-all font-semibold text-sm text-gray-700">
          ${imgOrEmoji}
          <span>${op === 'MTN' ? 'MTN MoMo' : op === 'Orange' ? 'Orange Money' : op}</span>
        </button>`;
    }).join('');

    wrap.querySelectorAll('.net-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const net = (e.currentTarget as HTMLElement).dataset.network!;
        this.selectedNetwork = net;
        wrap.querySelectorAll('.net-btn').forEach(b => {
          const el = b as HTMLElement;
          el.classList.toggle('border-amber-500', el.dataset.network === net);
          el.classList.toggle('bg-amber-50', el.dataset.network === net);
          el.classList.toggle('border-gray-200', el.dataset.network !== net);
        });
        ['#step4', '#step5'].forEach(s => {
          const el = this.container.querySelector(s) as HTMLElement;
          el?.classList.remove('hidden');
        });
        (this.container.querySelector('#step4') as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  // ─────────────────────────────────────────────
  private showCalcResult(amountEUR: number): void {
    const country = this.selectedCountry!;
    const el = this.container.querySelector('#calc-result') as HTMLElement;
    if (!el) return;

    const brackets = Math.ceil(amountEUR / 100);
    const localAmount = Math.round(amountEUR * country.rateFromEUR);

    const fmtEUR = (n: number) =>
      new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(n);
    const fmtLocal = (n: number) =>
      new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);

    (el.querySelector('#r-sent') as HTMLElement).textContent = fmtEUR(amountEUR);
    (el.querySelector('#r-comm') as HTMLElement).textContent = `-${this.commission} EUR (${brackets} × 3€)`;
    (el.querySelector('#r-total') as HTMLElement).textContent = fmtEUR(this.totalToPay);
    (el.querySelector('#r-received') as HTMLElement).textContent =
      `${fmtLocal(localAmount)} ${country.currencyLabel}`;

    // Dual currency line (Nigeria: FCFA + Naira)
    const localWrap = el.querySelector('#r-local-wrap') as HTMLElement;
    const localLabel = el.querySelector('#r-local-label') as HTMLElement;
    const localVal = el.querySelector('#r-local-value') as HTMLElement;
    const note = el.querySelector('#r-indicative-note') as HTMLElement;

    if (country.dual) {
      const cfaAmount = Math.round(amountEUR * country.dual.cfaRate);
      localLabel.textContent = `≈ ${country.dual.cfaLabel} :`;
      localVal.textContent = `${fmtLocal(cfaAmount)} FCFA`;
      localWrap.classList.remove('hidden');
      note.classList.remove('hidden');
    } else if (!country.isCFA) {
      localWrap.classList.add('hidden');
      note.classList.remove('hidden');
    } else {
      localWrap.classList.add('hidden');
      note.classList.add('hidden');
    }

    el.classList.remove('hidden');

    // Show step 3
    const step3 = this.container.querySelector('#step3') as HTMLElement;
    step3?.classList.remove('hidden');
    step3?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ─────────────────────────────────────────────
  private getPaymentHTML(method: string): string {
    switch (method) {
      case 'cash':
        return `<div class="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-sm space-y-2">
          <p class="font-semibold text-gray-800">📍 Tenedou 4 — Restaurant Pakistanais</p>
          <p class="text-gray-500 text-xs">Platia Amerikiss, Athènes, Grèce</p>
          <p class="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-2">📸 Photo du dépôt obligatoire à envoyer sur WhatsApp</p>

          <!-- Image illustrative -->
          <div class="rounded-xl border-2 border-dashed border-green-300 bg-white p-2">
            <p class="text-xs font-semibold text-green-800 mb-1.5 flex items-center gap-1">
              🖼️ Suivre l'exemple
              <span class="text-gray-400 font-normal">(cliquer pour agrandir)</span>
            </p>
            <button id="africa-cash-img-btn" class="w-full group relative rounded-lg overflow-hidden cursor-zoom-in focus:outline-none">
              <img src="${envoiImg}" alt="Exemple dépôt espèces"
                   class="w-full max-h-40 object-cover rounded-lg shadow transition-all group-hover:brightness-90"
                   onerror="this.closest('.rounded-xl').style.display='none'"/>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full">🔍 Agrandir</span>
              </div>
            </button>
          </div>

          <!-- Lightbox -->
          <div id="africa-cash-lightbox"
               class="hidden fixed inset-0 z-[9999] flex items-center justify-center p-4"
               style="background:rgba(0,0,0,0.9)">
            <div class="relative max-w-3xl w-full">
              <div class="flex justify-end gap-2 mb-3">
                <button id="africa-lb-minimize"
                        class="bg-white/20 hover:bg-white/40 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold transition-all"
                        title="Réduire">−</button>
                <button id="africa-lb-close"
                        class="bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold transition-all"
                        title="Fermer">×</button>
              </div>
              <img src="${envoiImg}" alt="Exemple dépôt espèces agrandie"
                   class="w-full rounded-2xl shadow-2xl object-contain max-h-[75vh]"/>
              <p class="text-center text-white/70 text-xs mt-3">Suivre l'exemple — prenez votre photo de la même façon</p>
            </div>
          </div>
        </div>`;
      case 'iris':
        return `<div class="mt-3 space-y-2">
          <div class="flex items-center gap-2 mb-1"><img src="${irisImg}" alt="IRIS" class="w-7 h-7 object-contain"/><span class="text-xs font-bold text-blue-700">IRIS — Virement instantané Grèce</span></div>
          ${[['TSAYEM','694 407 4660'],['MBARGA','694 358 1891']].map(([n,p])=>`
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex justify-between items-center">
            <div><p class="text-xs text-gray-500">${n}</p><p class="font-mono font-bold text-gray-800">${p}</p></div>
            <button data-copy="${p}" class="text-xs bg-blue-600 text-white px-2 py-1 rounded font-semibold">📋</button>
          </div>`).join('')}
        </div>`;
      case 'bank':
        return `<div class="mt-3 space-y-2">
          <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-1.5">
            <div class="flex items-center gap-2"><img src="${alphaImg}" alt="Alpha" class="w-6 h-6 object-contain" onerror="this.style.display='none'"/><p class="text-xs font-bold text-indigo-700 uppercase">Alphabank</p></div>
            <div class="flex justify-between items-start gap-2"><p class="font-mono text-xs font-bold text-gray-800 break-all">GR22 0140 1040 1040 0231 0027 911</p><button data-copy="GR2201401040104002310027911" class="flex-shrink-0 text-xs bg-indigo-600 text-white px-2 py-1 rounded">📋</button></div>
            <p class="text-xs text-gray-600">Mathieu Mathilde Mbarga · BIC: CRBAGRAAXXX</p>
          </div>
          <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-1.5">
            <div class="flex items-center gap-2"><img src="${piraeuImg}" alt="Piraeus" class="w-6 h-6 object-contain" onerror="this.style.display='none'"/><p class="text-xs font-bold text-indigo-700 uppercase">Piraeus Bank SA</p></div>
            <div class="flex justify-between items-start gap-2"><p class="font-mono text-xs font-bold text-gray-800 break-all">GR25 0172 0980 0050 9811 4578 833</p><button data-copy="GR2501720980005098114578833" class="flex-shrink-0 text-xs bg-indigo-600 text-white px-2 py-1 rounded">📋</button></div>
            <p class="text-xs text-gray-600">Tsayem Tchinda Blondel · BIC: PIRBGRAAXXX</p>
          </div>
        </div>`;
      case 'paypal':
        return `<div class="mt-3 bg-sky-50 border border-sky-200 rounded-xl p-3 flex justify-between items-center">
          <div class="flex items-center gap-2"><img src="${paypalImg}" alt="PayPal" class="w-7 h-7 object-contain"/><div><p class="text-xs text-gray-500">PayPal</p><p class="font-mono font-bold text-sm">larambambo@gmail.com</p></div></div>
          <button data-copy="larambambo@gmail.com" class="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-lg">📋 Copier</button>
        </div>`;
      case 'zen':
        return `<div class="mt-3 bg-purple-50 border border-purple-200 rounded-xl p-3 space-y-2">
          <div class="flex items-center gap-2"><img src="${zenImg}" alt="ZEN" class="w-7 h-7 object-contain"/><span class="text-xs font-bold text-purple-700">ZEN — SEPA International</span></div>
          <div class="flex justify-between items-start gap-2"><div><p class="text-xs text-gray-500">IBAN</p><p class="font-mono text-xs font-bold break-all">LT08 3130 0101 2199 6568</p></div><button data-copy="LT083130010121996568" class="flex-shrink-0 text-xs bg-purple-600 text-white px-2 py-1.5 rounded">📋</button></div>
          <p class="text-xs text-gray-600">BIC: BZENLT22 · BLONDEL TSAYEM TCHINDA</p>
        </div>`;
      default: return '';
    }
  }

  // ─────────────────────────────────────────────
  private submitWhatsApp(): void {
    const name = (this.container.querySelector('#benef-name') as HTMLInputElement)?.value?.trim();
    const phone = (this.container.querySelector('#benef-phone') as HTMLInputElement)?.value?.trim();
    const phoneErr = this.container.querySelector('#phone-err') as HTMLElement;

    if (!name) { this.container.querySelector('#benef-name')?.scrollIntoView({ behavior: 'smooth' }); return; }
    if (!phone || phone.length !== 9) {
      phoneErr?.classList.remove('hidden');
      this.container.querySelector('#benef-phone')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const country = this.selectedCountry!;
    const fmtEUR = (n: number) =>
      new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(n);
    const fmtLocal = (n: number) =>
      new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);

    const localAmount = Math.round(this.amountEUR * country.rateFromEUR);
    let receivedLine = `🎁 Bénéficiaire reçoit: ${fmtLocal(localAmount)} ${country.currencyLabel}`;
    if (country.dual) {
      const cfaAmount = Math.round(this.amountEUR * country.dual.cfaRate);
      receivedLine += `\n   ≈ ${country.dual.cfaLabel}: ${fmtLocal(cfaAmount)} FCFA`;
    }

    const message =
      `🔄 *DEMANDE CHREOL EMPIRE — AFRICA*\n\n` +
      `📍 Pays: ${country.flag} ${country.name} (${country.currencyLabel})\n` +
      `💰 Montant envoyé: ${fmtEUR(this.amountEUR)}\n` +
      `📊 Commission: -${this.commission} EUR\n` +
      `💵 Total à payer: ${fmtEUR(this.totalToPay)}\n` +
      `${receivedLine}\n\n` +
      `👤 Bénéficiaire: ${name}\n` +
      `📱 Téléphone: ${phone}\n` +
      `📶 Réseau: ${this.selectedNetwork ?? 'non précisé'}\n` +
      `💳 Paiement: ${this.selectedPayment ? PAYMENT_LABELS[this.selectedPayment] : 'non précisé'}\n\n` +
      `✅ Je confirme cette demande.`;

    WhatsAppService.open({ phone: WhatsAppService.PHONE, text: encodeURIComponent(message) });
  }
}
