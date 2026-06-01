// src/components/Layout.ts
import logoImg from '@/../assets/Logo_Chreol_Empire_revue-removebg-preview.png';

export type ActivePage = 'home' | 'africa' | 'services';

const WA_PATH = `M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z`;

const waSvg = (cls: string) =>
  `<svg class="${cls}" fill="currentColor" viewBox="0 0 24 24"><path d="${WA_PATH}"/></svg>`;

export class Layout {
  static getHeader(active: ActivePage = 'home'): string {
    const link = (href: string, label: string, page: ActivePage) =>
      `<a href="${href}" class="font-medium transition-colors ${active === page ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-700 hover:text-blue-700'}">${label}</a>`;

    const mlink = (href: string, label: string, page: ActivePage) =>
      `<a href="${href}" class="px-3 py-2 rounded transition-colors ${active === page ? 'text-blue-700 font-bold bg-blue-50' : 'text-gray-700 hover:bg-blue-50'}">${label}</a>`;

    return `
      <header class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            <a href="index.html" class="flex items-center gap-2 group">
              <img src="${logoImg}" alt="CHREOL EMPIRE"
                   class="w-10 h-10 object-contain rounded-full bg-blue-50 p-0.5 shadow"
                   onerror="this.outerHTML='<span class=\'text-2xl\'>🔄</span>'"/>
              <span class="text-xl md:text-2xl font-bold text-blue-700 group-hover:text-blue-800 transition-colors">CHREOL EMPIRE</span>
            </a>
            <nav class="hidden md:flex space-x-6">
              ${link('index.html', 'Accueil', 'home')}
              ${link('africa.html', '🌍 Africa', 'africa')}
              ${link('services.html', '🛎 Services', 'services')}
            </nav>
            <div class="flex items-center gap-3">
              <a href="https://wa.me/306973598677" target="_blank"
                 class="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all shadow hover:shadow-lg">
                ${waSvg('w-4 h-4')} Contactez-nous
              </a>
              <a href="https://wa.me/306973598677" target="_blank" class="md:hidden text-green-600 p-2">
                ${waSvg('w-7 h-7')}
              </a>
              <button id="mobile-menu-btn" class="md:hidden p-2 text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
          <div id="mobile-menu" class="hidden md:hidden mt-4 pb-2 border-t border-gray-100">
            <nav class="flex flex-col space-y-2 pt-4">
              ${mlink('index.html', 'Accueil', 'home')}
              ${mlink('africa.html', '🌍 Africa', 'africa')}
              ${mlink('services.html', '🛎 Services', 'services')}
              <a href="https://wa.me/306973598677" target="_blank"
                 class="px-3 py-2 text-green-600 font-bold hover:bg-green-50 rounded">📞 WhatsApp</a>
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
      <footer class="bg-gray-900 text-gray-300 py-12">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <img src="${logoImg}" alt="CHREOL EMPIRE"
                     class="w-12 h-12 object-contain rounded-full bg-gray-800 p-1"
                     onerror="this.style.display='none'"/>
                <h3 class="text-white font-bold text-lg">CHREOL EMPIRE</h3>
              </div>
              <p class="text-sm text-gray-400 leading-relaxed">
                Service de change EUR/CFA rapide, sécurisé et fiable.<br>Transferts vers l'Afrique et l'Europe — 7j/7.
              </p>
            </div>
            <div>
              <h3 class="text-white font-bold text-lg mb-4">Navigation</h3>
              <ul class="space-y-2 text-sm">
                <li><a href="index.html" class="hover:text-white transition-colors">🏠 Accueil</a></li>
                <li><a href="africa.html" class="hover:text-white transition-colors">🌍 Africa</a></li>
                <li><a href="services.html" class="hover:text-white transition-colors">🛎 Services</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-white font-bold text-lg mb-4">Contact</h3>
              <ul class="space-y-2 text-sm">
                <li>
                  <a href="https://wa.me/306973598677" target="_blank"
                     class="hover:text-white transition-colors flex items-center gap-2">
                    ${waSvg('w-4 h-4 text-green-500')} +30 697 359 8677
                  </a>
                </li>
                <li class="flex items-center gap-2 text-gray-400">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Disponible 7j/7 — 8h à 22h
                </li>
              </ul>
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
