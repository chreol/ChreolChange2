// src/pages/Services.ts
import { Layout } from '@/components/Layout';
import mtnImg from '@/../assets/Mtn_Money.webp';
import orangeImg from '@/../assets/oange_Money.webp';
import paypalImg from '@/../assets/paypal.webp';
import irisImg from '@/../assets/iris_payment.webp';
import alphaImg from '@/../assets/alpha_bank.webp';
import piraeuImg from '@/../assets/pireaus_bank.webp';
import zenImg from '@/../assets/Zen_bank.webp';

const WA = 'https://wa.me/306973598677';
const waMsg = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;

export class ServicesPage {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    Layout.bindMobileMenu();
  }

  private render(): void {
    this.container.innerHTML = `
      ${Layout.getHeader('services')}
      ${Layout.getMarquee()}
      ${Layout.getCountriesBar()}

      <main>
        <!-- Hero -->
        <section class="bg-gradient-to-br from-indigo-800/95 via-blue-800/95 to-purple-900/95 text-white py-12 md:py-16">
          <div class="max-w-5xl mx-auto px-4 text-center">
            <h1 class="text-3xl md:text-5xl font-bold mb-4">🛎 Nos Services</h1>
            <p class="text-indigo-100 mb-4">Tout ce que CHREOL EMPIRE peut faire pour vous</p>
          </div>
        </section>

        <!-- ✨ Nos autres services -->
        <details class="bg-white/95" open>
          <summary class="cursor-pointer max-w-5xl mx-auto px-4 py-5 flex justify-between items-center list-none">
            <h2 class="text-2xl font-bold flex items-center gap-2">✨ Nos autres services</h2>
            <span class="text-gray-400 text-2xl details-arrow">▼</span>
          </summary>
          <div class="pb-10 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div class="max-w-5xl mx-auto px-4 pt-4">
              <div class="grid md:grid-cols-3 gap-6">

                <!-- Flyers -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow">
                  <div class="bg-gradient-to-br from-pink-500 to-rose-600 p-6 text-center text-white">
                    <div class="text-5xl mb-3">🎨</div>
                    <h3 class="text-xl font-bold">Flyers</h3>
                  </div>
                  <div class="p-5 space-y-4">
                    <p class="text-gray-600 text-sm leading-relaxed">
                      Design moderne et impactant pour maximiser votre visibilité.
                    </p>
                    <div class="flex justify-between items-center bg-pink-50 rounded-xl px-4 py-3 border border-pink-200">
                      <span class="text-pink-700 font-bold text-lg">À partir de 10€</span>
                    </div>
                    <a href="${waMsg('🎨 Bonjour, je souhaite commander un flyer. Pouvez-vous m\'aider ?')}"
                       target="_blank"
                       class="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-xl transition-all shadow hover:shadow-md">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Commander sur WhatsApp
                    </a>
                  </div>
                </div>

                <!-- CV -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow">
                  <div class="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-center text-white">
                    <div class="text-5xl mb-3">📄</div>
                    <h3 class="text-xl font-bold">CV (FR / ENG)</h3>
                  </div>
                  <div class="p-5 space-y-4">
                    <p class="text-gray-600 text-sm leading-relaxed">
                      Rédaction et design de CV professionnels bilingues.
                    </p>
                    <div class="flex justify-between items-center bg-blue-50 rounded-xl px-4 py-3 border border-blue-200">
                      <span class="text-blue-700 font-bold text-lg">À partir de 10€</span>
                    </div>
                    <a href="${waMsg('📄 Bonjour, je souhaite commander la rédaction d\'un CV professionnel. Pouvez-vous m\'aider ?')}"
                       target="_blank"
                       class="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-xl transition-all shadow hover:shadow-md">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Commander sur WhatsApp
                    </a>
                  </div>
                </div>

                <!-- Réservation Vol -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow">
                  <div class="bg-gradient-to-br from-sky-500 to-teal-600 p-6 text-center text-white">
                    <div class="text-5xl mb-3">✈️</div>
                    <h3 class="text-xl font-bold">Réservation Vol</h3>
                  </div>
                  <div class="p-5 space-y-4">
                    <p class="text-gray-600 text-sm leading-relaxed">
                      Billets aller-retour et multi-destinations aux meilleurs prix.
                    </p>
                    <div class="flex justify-between items-center bg-sky-50 rounded-xl px-4 py-3 border border-sky-200">
                      <span class="text-sky-700 font-bold text-lg">À partir de 20€</span>
                    </div>
                    <a href="${waMsg('✈️ Bonjour, je souhaite réserver un vol. Pouvez-vous m\'aider ?')}"
                       target="_blank"
                       class="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-xl transition-all shadow hover:shadow-md">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Réserver sur WhatsApp
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </details>

        <!-- Change de Devises -->
        <details class="bg-white/95">
          <summary class="cursor-pointer max-w-5xl mx-auto px-4 py-5 flex justify-between items-center list-none">
            <h2 class="text-2xl font-bold">💱 Change de Devises EUR ↔ CFA</h2>
            <span class="text-gray-400 text-2xl details-arrow">▼</span>
          </summary>
          <div class="pb-10 bg-white">
            <div class="max-w-5xl mx-auto px-4 pt-4 grid md:grid-cols-2 gap-8">
              <div class="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-300 p-6 shadow-lg">
                <div class="flex items-center gap-3 mb-4">
                  <div class="bg-amber-500 text-white rounded-xl p-3 text-2xl shadow">💶</div>
                  <div><h3 class="text-xl font-bold">EUR → CFA</h3><p class="text-sm text-gray-500">Envoi vers l'Afrique</p></div>
                  <span class="ml-auto bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">Populaire</span>
                </div>
                <div class="bg-white rounded-xl p-4 mb-4 border border-amber-200 space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Taux</span><span class="font-bold text-amber-700">1 EUR = 650 FCFA</span></div>
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Commission</span><span class="font-bold">3 EUR / 100 EUR</span></div>
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Délai</span><span class="font-bold text-green-600">≥ 5 minutes</span></div>
                </div>
                <a href="index.html#converter"
                   class="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow">
                  Calculer mon envoi →
                </a>
              </div>
              <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-300 p-6 shadow-lg">
                <div class="flex items-center gap-3 mb-4">
                  <div class="bg-blue-600 text-white rounded-xl p-3 text-2xl shadow">🌍</div>
                  <div><h3 class="text-xl font-bold">CFA → EUR</h3><p class="text-sm text-gray-500">Réception en Europe</p></div>
                  <span class="ml-auto bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">24/7</span>
                </div>
                <div class="bg-white rounded-xl p-4 mb-4 border border-blue-200 space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Taux</span><span class="font-bold text-blue-700">660 FCFA = 1 EUR</span></div>
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Commission</span><span class="font-bold">3 EUR / 100 EUR</span></div>
                  <div class="flex justify-between text-sm"><span class="text-gray-500">Code USSD</span><span class="font-bold text-green-600">Généré auto</span></div>
                </div>
                <a href="index.html#converter"
                   class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow">
                  Calculer ma réception →
                </a>
              </div>
            </div>
          </div>
        </details>

        <!-- Mobile Money -->
        <details class="bg-white/95">
          <summary class="cursor-pointer max-w-5xl mx-auto px-4 py-5 flex justify-between items-center list-none">
            <h2 class="text-2xl font-bold">📱 Mobile Money Acceptés</h2>
            <span class="text-gray-400 text-2xl details-arrow">▼</span>
          </summary>
          <div class="pb-10 bg-gray-50">
            <div class="max-w-5xl mx-auto px-4 pt-4 grid md:grid-cols-2 gap-6">
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-400">
                <div class="bg-gradient-to-r from-orange-500 to-red-500 p-5 flex items-center gap-4">
                  <img src="${orangeImg}" alt="Orange Money" class="w-16 h-16 object-contain rounded-xl bg-white p-1 shadow flex-shrink-0"
                       onerror="this.outerHTML='<div class=\'text-4xl flex-shrink-0\'>🟠</div>'"/>
                  <div><h3 class="text-xl font-bold text-white">Orange Money</h3><p class="text-orange-100 text-sm">CI • SN • ML • BF • NE • CM…</p></div>
                </div>
                <div class="p-5">
                  <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                    <p class="text-xs text-gray-500 mb-1">Code Marchand Cameroun</p>
                    <code class="text-sm font-mono text-gray-800 break-all">#150*14*518554*692251299*MONTANT#</code>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-yellow-400">
                <div class="bg-gradient-to-r from-yellow-400 to-amber-500 p-5 flex items-center gap-4">
                  <img src="${mtnImg}" alt="MTN MoMo" class="w-16 h-16 object-contain rounded-xl bg-white p-1 shadow flex-shrink-0"
                       onerror="this.outerHTML='<div class=\'text-4xl flex-shrink-0\'>🟡</div>'"/>
                  <div><h3 class="text-xl font-bold text-white">MTN MoMo</h3><p class="text-yellow-100 text-sm">CM • CI • BJ • GH • NG…</p></div>
                </div>
                <div class="p-5">
                  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <p class="text-xs text-gray-500 mb-1">Code Marchand Cameroun</p>
                    <code class="text-sm font-mono text-gray-800 break-all">*126*14*672416141*MONTANT#</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>

        <!-- Modes de paiement EUR -->
        <details class="bg-white/95">
          <summary class="cursor-pointer max-w-5xl mx-auto px-4 py-5 flex justify-between items-center list-none">
            <h2 class="text-2xl font-bold">💳 Comment Payer en EUR</h2>
            <span class="text-gray-400 text-2xl details-arrow">▼</span>
          </summary>
          <div class="pb-10 bg-white">
            <div class="max-w-5xl mx-auto px-4 pt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-400 p-5 shadow">
                <div class="flex items-center gap-3 mb-3"><div class="text-4xl">💵</div><div><h3 class="font-bold">Espèces</h3><span class="text-xs text-green-700 font-semibold bg-green-100 px-2 py-0.5 rounded-full">Athènes</span></div></div>
                <p class="text-sm font-semibold text-gray-800">📍 Tenedou 4 — Restaurant Pakistanais</p>
                <p class="text-xs text-gray-500 mt-1">Platia Amerikiss, Athènes, Grèce</p>
                <p class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3">📸 Photo du dépôt obligatoire</p>
              </div>

              <div class="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border-2 border-blue-400 p-5 shadow">
                <div class="flex items-center gap-3 mb-3">
                  <img src="${irisImg}" alt="IRIS" class="w-10 h-10 object-contain flex-shrink-0" onerror="this.outerHTML='<span class=\'text-3xl\'>📲</span>'"/>
                  <div><h3 class="font-bold">IRIS</h3><span class="text-xs text-blue-700 font-semibold bg-blue-100 px-2 py-0.5 rounded-full">Grèce uniquement</span></div>
                </div>
                <div class="space-y-2">
                  <div class="bg-white rounded-lg p-2.5 border border-blue-200 text-sm"><p class="text-xs text-gray-500">TSAYEM</p><p class="font-mono font-bold">694 407 4660</p></div>
                  <div class="bg-white rounded-lg p-2.5 border border-blue-200 text-sm"><p class="text-xs text-gray-500">MBARGA</p><p class="font-mono font-bold">694 358 1891</p></div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border-2 border-indigo-400 p-5 shadow">
                <div class="flex items-center gap-3 mb-3"><div class="text-3xl">🏦</div><div><h3 class="font-bold">Virement IBAN</h3><span class="text-xs text-indigo-700 font-semibold bg-indigo-100 px-2 py-0.5 rounded-full">2 banques</span></div></div>
                <div class="space-y-2 text-xs">
                  <div class="bg-white rounded-lg p-2.5 border border-indigo-200">
                    <div class="flex items-center gap-1.5 mb-1">
                      <img src="${alphaImg}" alt="Alpha" class="w-5 h-5 object-contain" onerror="this.style.display='none'"/>
                      <p class="font-bold text-indigo-700">Alphabank</p>
                    </div>
                    <p class="font-mono text-gray-700 break-all">GR22 0140 1040 1040 0231 0027 911</p>
                    <p class="text-gray-500 mt-0.5">Mathieu Mathilde Mbarga • CRBAGRAAXXX</p>
                  </div>
                  <div class="bg-white rounded-lg p-2.5 border border-indigo-200">
                    <div class="flex items-center gap-1.5 mb-1">
                      <img src="${piraeuImg}" alt="Piraeus" class="w-5 h-5 object-contain" onerror="this.style.display='none'"/>
                      <p class="font-bold text-indigo-700">Piraeus Bank SA</p>
                    </div>
                    <p class="font-mono text-gray-700 break-all">GR25 0172 0980 0050 9811 4578 833</p>
                    <p class="text-gray-500 mt-0.5">Tsayem Tchinda Blondel • PIRBGRAAXXX</p>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-400 p-5 shadow">
                <div class="flex items-center gap-3 mb-3">
                  <img src="${paypalImg}" alt="PayPal" class="w-10 h-10 object-contain flex-shrink-0" onerror="this.outerHTML='<span class=\'text-3xl\'>🅿️</span>'"/>
                  <div><h3 class="font-bold">PayPal</h3><span class="text-xs text-sky-700 font-semibold bg-sky-100 px-2 py-0.5 rounded-full">International</span></div>
                </div>
                <p class="font-mono font-bold text-sm text-gray-800 mb-2">larambambo@gmail.com</p>
                <p class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">⚠️ <strong>"Famille et amis"</strong> uniquement</p>
              </div>

              <div class="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl border-2 border-purple-400 p-5 shadow md:col-span-2 lg:col-span-1">
                <div class="flex items-center gap-3 mb-3">
                  <img src="${zenImg}" alt="ZEN" class="w-10 h-10 object-contain flex-shrink-0" onerror="this.outerHTML='<span class=\'text-3xl\'>🌐</span>'"/>
                  <div><h3 class="font-bold">ZEN International</h3><span class="text-xs text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded-full">SEPA</span></div>
                </div>
                <div class="text-xs space-y-1.5">
                  <div><span class="text-gray-500">IBAN :</span> <span class="font-mono font-bold">LT08 3130 0101 2199 6568</span></div>
                  <div><span class="text-gray-500">BIC :</span> <span class="font-semibold">BZENLT22</span></div>
                  <div><span class="text-gray-500">Titulaire :</span> <span class="font-semibold">BLONDEL TSAYEM TCHINDA</span></div>
                </div>
              </div>
            </div>
          </div>
        </details>

        <!-- Tarifs -->
        <details class="bg-white/95">
          <summary class="cursor-pointer max-w-5xl mx-auto px-4 py-5 flex justify-between items-center list-none">
            <h2 class="text-2xl font-bold">💰 Nos Tarifs</h2>
            <span class="text-gray-400 text-2xl details-arrow">▼</span>
          </summary>
          <div class="pb-10 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div class="max-w-4xl mx-auto px-4 pt-4">
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                      <th class="py-4 px-4 text-left">Montant</th>
                      <th class="py-4 px-4 text-center">Commission</th>
                      <th class="py-4 px-4 text-center">Total EUR</th>
                      <th class="py-4 px-4 text-center">Reçu CFA</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${[[50,3,53,32500],[100,3,103,65000],[200,6,206,130000],[300,9,309,195000],[500,15,515,325000],[1000,30,1030,650000]]
                      .map(([s,c,t,f],i)=>`
                      <tr class="${i%2===0?'bg-gray-50':'bg-white'} hover:bg-blue-50 transition-colors">
                        <td class="py-3 px-4 font-semibold">${s} EUR</td>
                        <td class="py-3 px-4 text-center text-amber-700 font-medium">${c} EUR</td>
                        <td class="py-3 px-4 text-center font-bold text-blue-700">${t} EUR</td>
                        <td class="py-3 px-4 text-center font-bold text-green-700">${f.toLocaleString('fr-FR')} FCFA</td>
                      </tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </details>

        <!-- FAQ -->
        <details class="bg-white/95">
          <summary class="cursor-pointer max-w-4xl mx-auto px-4 py-5 flex justify-between items-center list-none">
            <h2 class="text-2xl font-bold">❓ Questions Fréquentes</h2>
            <span class="text-gray-400 text-2xl details-arrow">▼</span>
          </summary>
          <div class="pb-10 bg-white">
            <div class="max-w-3xl mx-auto px-4 pt-4 space-y-3">
              ${[
                ['Quels sont les délais ?','≥ 5 minutes après réception de votre preuve de paiement. Disponible 7j/7.'],
                ['Montants acceptés ?','Minimum 10 EUR, maximum 5 000 EUR. Contactez-nous pour des montants supérieurs.'],
                ['Puis-je payer depuis toute l\'Europe ?','Oui — IBAN SEPA, PayPal et ZEN fonctionnent depuis toute l\'Europe. Cash et IRIS sont en Grèce uniquement.'],
              ].map(([q,a])=>`
                <details class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <summary class="font-semibold cursor-pointer flex justify-between items-center list-none">${q}<span class="text-gray-400 ml-2">+</span></summary>
                  <p class="mt-3 text-gray-600 text-sm">${a}</p>
                </details>`).join('')}
            </div>
          </div>
        </details>

        <!-- CTA -->
        <section class="py-12 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-center">
          <div class="max-w-2xl mx-auto px-4">
            <h2 class="text-2xl font-bold mb-3">Prêt à faire un transfert ?</h2>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="${WA}" target="_blank"
                 class="flex items-center justify-center gap-2 bg-white text-green-700 font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-green-50">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Contacter sur WhatsApp
              </a>
              <a href="index.html" class="flex items-center justify-center gap-2 bg-green-800 hover:bg-green-900 text-white font-bold py-3 px-8 rounded-xl">
                🔄 Calculer mon échange
              </a>
            </div>
          </div>
        </section>
      </main>

      ${Layout.getFooter()}
      <style>
        details[open] > summary .details-arrow { transform: rotate(180deg); }
        details > summary .details-arrow { transition: transform 0.3s; display: inline-block; }
        details > summary { outline: none; }
        details > summary::-webkit-details-marker { display: none; }
      </style>
    `;
  }
}
