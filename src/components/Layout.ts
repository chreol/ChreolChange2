// src/components/Layout.ts
import logoImg from '@/../assets/Logo_Chreol_Empire_revue-removebg-preview.png';

export type ActivePage = 'home' | 'africa' | 'services';

const WA_PATH = `M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z`;

const waSvg = (cls: string) =>
  `<svg class="${cls}" fill="currentColor" viewBox="0 0 24 24"><path d="${WA_PATH}"/></svg>`;

export class Layout {
  static getHeader(active: ActivePage = 'home'): string {
    const link = (href: string, label: string, page: ActivePage) =>
      `<a href="${href}" class="font-medium transition-colors ${
        active === page
          ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5'
          : 'text-gray-300 hover:text-amber-400'
      }">${label}</a>`;

    const mlink = (href: string, label: string, page: ActivePage) =>
      `<a href="${href}" class="px-3 py-2 rounded transition-colors ${
        active === page
          ? 'text-amber-400 font-bold bg-white/10'
          : 'text-gray-300 hover:bg-white/10 hover:text-white'
      }">${label}</a>`;

    return `
      <header class="bg-gradient-to-r from-gray-900 via-[#0b1437] to-gray-900 shadow-lg shadow-black/40 sticky top-0 z-50 border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 py-3">
          <div class="flex justify-between items-center">

            <a href="index.html" class="flex items-center gap-2.5 group">
              <img src="${logoImg}" alt="CHREOL EMPIRE"
                   class="w-10 h-10 object-contain"
                   onerror="this.outerHTML='<span class=\'text-2xl\'>🔄</span>'"/>
              <span class="text-xl md:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight">
                CHREOL <span class="text-amber-400 group-hover:text-white transition-colors">EMPIRE</span>
              </span>
            </a>

            <nav class="hidden md:flex items-center space-x-7">
              ${link('index.html', 'Accueil', 'home')}
              ${link('africa.html', '🌍 Africa', 'africa')}
              ${link('services.html', '🛎 Services', 'services')}
            </nav>

            <div class="flex items-center gap-3">
              <a href="https://wa.me/306973598677" target="_blank"
                 class="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all shadow">
                ${waSvg('w-4 h-4')} Contactez-nous
              </a>
              <a href="https://wa.me/306973598677" target="_blank" class="md:hidden text-green-400 p-1.5">
                ${waSvg('w-6 h-6')}
              </a>
              <button id="mobile-menu-btn" class="md:hidden p-1.5 text-gray-300 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>

          <div id="mobile-menu" class="hidden md:hidden mt-3 pb-3 border-t border-white/10">
            <nav class="flex flex-col space-y-1 pt-3">
              ${mlink('index.html', 'Accueil', 'home')}
              ${mlink('africa.html', '🌍 Africa', 'africa')}
              ${mlink('services.html', '🛎 Services', 'services')}
              <a href="https://wa.me/306973598677" target="_blank"
                 class="px-3 py-2 text-green-400 font-bold hover:bg-white/10 rounded transition-colors">
                📞 WhatsApp
              </a>
            </nav>
          </div>
        </div>
      </header>`;
  }

  static getMarquee(): string {
    const content = () => `
      <div class="flex items-center gap-8 mx-8">
        <span class="flex items-center gap-2 font-bold"><span class="text-blue-400">💶</span> EUR→CFA: <span class="text-amber-400">650 F</span></span>
        <span class="flex items-center gap-2 font-bold"><span class="text-cyan-400">🌍</span> CFA→EUR: <span class="text-amber-400">660 F</span></span>
        <span class="flex items-center gap-2"><span class="text-yellow-400">🟡</span> MTN: <code class="bg-yellow-900/50 px-2 py-1 rounded text-xs">*126*14*672416141*montant#</code></span>
        <span class="flex items-center gap-2"><span class="text-orange-400">🟠</span> Orange: <code class="bg-orange-900/50 px-2 py-1 rounded text-xs">#150*14*518554*692251299*montant#</code></span>
        <span class="flex items-center gap-2"><span class="text-green-400">✓</span> Traitement ≥ 5 min</span>
        <span class="flex items-center gap-2"><span class="text-blue-400">📱</span> Disponible 24/7</span>
      </div>`;
    return `
      <div class="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-3 overflow-hidden border-y border-blue-700">
        <div class="flex whitespace-nowrap" style="animation:marquee 30s linear infinite">
          ${content()}${content()}
        </div>
      </div>
      <style>
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        [style*="animation:marquee"]:hover{animation-play-state:paused}
      </style>`;
  }

  static getCountriesBar(): string {
    return `
      <div class="bg-blue-800 text-white py-2 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 flex justify-center items-center gap-3 md:gap-6 text-xs md:text-sm font-medium whitespace-nowrap overflow-x-auto">
          <span>🇨🇲 Cameroun</span>
          <span>🇨🇮 Côte d'Ivoire</span>
          <span>🇸🇳 Sénégal</span>
          <span>🇲🇱 Mali</span>
          <span>🇧🇫 Burkina Faso</span>
          <span>🇧🇯 Bénin</span>
          <span>🇳🇪 Niger</span>
          <span>🇬🇶 Guinée Éq.</span>
          <span>🇬🇼 Guinée-Bissau</span>
          <span>🇨🇬 Congo-Brazza</span>
          <span>🇨🇩 Kinshasa</span>
          <span>🇫🇷 France</span>
          <span>🇬🇷 Grèce</span>
        </div>
      </div>`;
  }

  static getFooter(): string {
    return `
      <footer class="bg-gray-900 text-gray-300 py-14">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

            <!-- À propos -->
            <div>
              <div class="flex items-center gap-3 mb-3">
                <img src="${logoImg}" alt="CHREOL EMPIRE"
                     class="w-12 h-12 object-contain rounded-full bg-gray-800 p-1"
                     onerror="this.style.display='none'"/>
                <h3 class="text-white font-bold text-lg">CHREOL EMPIRE</h3>
              </div>
              <p class="text-sm text-gray-400 leading-relaxed mb-4">
                Service de change EUR/FCFA rapide, sécurisé et fiable.<br/>
                Transferts Grèce ↔ Afrique — 7j/7.
              </p>
              <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <a href="index.html" class="hover:text-white transition-colors">🏠 Accueil</a>
                <span class="text-gray-700">·</span>
                <a href="africa.html" class="hover:text-white transition-colors">🌍 Africa</a>
                <span class="text-gray-700">·</span>
                <a href="services.html" class="hover:text-white transition-colors">🛎 Services</a>
              </div>
            </div>

            <!-- Horaires -->
            <div>
              <h3 class="text-white font-bold text-lg mb-4">⏰ Disponibilité</h3>
              <ul class="space-y-2 text-sm text-gray-400">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  7j/7 — 8h à 22h
                </li>
                <li class="text-xs text-gray-500 mt-2">Traitement ≥ 5 min<br/>après confirmation de paiement</li>
                <li class="mt-3">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Taux du moment</span>
                </li>
                <li class="bg-gray-800 rounded-lg px-3 py-2 text-xs space-y-1 mt-1">
                  <div class="flex justify-between"><span class="text-gray-400">EUR → FCFA</span><span class="text-amber-400 font-bold">650 FCFA/€</span></div>
                  <div class="flex justify-between"><span class="text-gray-400">FCFA → EUR</span><span class="text-green-400 font-bold">660 FCFA/€</span></div>
                </li>
              </ul>
            </div>

            <!-- Agence Grèce -->
            <div>
              <h3 class="text-white font-bold text-lg mb-4">🇬🇷 CHREOL EMPIRE ATHNES</h3>
              <div class="text-sm text-gray-400 space-y-2">
                <p class="text-gray-300 font-medium">Point de change — Athènes</p>
                <p class="flex items-start gap-2">
                  <span class="text-lg flex-shrink-0">📍</span>
                  <span>Restaurant Pakistanais – Tenedou 4,<br/>Platia Amerikis, 11252,<br/>Athènes, GRÈCE</span>
                </p>
                <a href="https://wa.me/306973598677" target="_blank"
                   class="flex items-center gap-2 hover:text-white transition-colors">
                  ${waSvg('w-4 h-4 text-green-400 flex-shrink-0')}
                  <span>+30 697 359 8677</span>
                </a>
                <p class="flex items-start gap-2 text-xs text-gray-500">
                  <span>💬</span>
                  <span>Merci de privilégier les messages écrits.</span>
                </p>
              </div>
            </div>

            <!-- Agence Douala -->
            <div>
              <h3 class="text-white font-bold text-lg mb-4">🇨🇲 CHREOL EMPIRE DOUALA</h3>
              <div class="text-sm text-gray-400 space-y-2">
                <p class="text-gray-300 font-medium">Bureau — Douala, Cameroun</p>
                <p class="flex items-start gap-2">
                  <span class="text-lg flex-shrink-0">📍</span>
                  <span>Vallée 3 Boutiques – Deido,<br/>Douala, Cameroun</span>
                </p>
                <a href="https://wa.me/237694360978" target="_blank"
                   class="flex items-center gap-2 hover:text-white transition-colors">
                  ${waSvg('w-4 h-4 text-green-400 flex-shrink-0')}
                  <span>+237 694 360 978</span>
                </a>
                <p class="flex items-start gap-2 text-xs text-gray-500">
                  <span>⚠️</span>
                  <span>Merci de prendre RDV avant de vous déplacer.</span>
                </p>
              </div>
            </div>

          </div>

          <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-sm text-gray-500">© 2026 CHREOL EMPIRE — Tous droits réservés</p>
            <div class="flex gap-6 text-sm text-gray-500">
              <span>Mentions légales</span>
              <span>Confidentialité</span>
            </div>
          </div>
        </div>
      </footer>`;
  }

  static bindMobileMenu(): void {
    const btn = document.querySelector('#mobile-menu-btn');
    const menu = document.querySelector('#mobile-menu');
    if (btn && menu) {
      btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    }
  }
}
