// src/main.ts
import './styles/main.css';
import { Converter } from '@/components/Converter';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { SEOHead } from '@/components/SEOHead';
import { Layout } from '@/components/Layout';
import mtnImg from '@/../assets/Mtn_Money.webp';
import orangeImg from '@/../assets/oange_Money.webp';
import logoImg from '@/../assets/Logo_Chreol_Empire_revue-removebg-preview.png';

// Favicon dynamique via Vite
const _fav = Object.assign(document.createElement('link'), { rel: 'icon', type: 'image/png', href: logoImg });
document.head.appendChild(_fav);

// Files with spaces in name — use new URL() to avoid Vite static analysis issues
const carteImg = new URL("../assets/Votre Carte bancaire fait defaut.webp", import.meta.url).href;
const carteQImg = new URL("../assets/Une photo d'une carte bancaire a.webp", import.meta.url).href;
const paysImg = new URL("../assets/Differents pays et Tarifs de transactions.webp", import.meta.url).href;

document.addEventListener('DOMContentLoaded', () => {
  SEOHead.inject();

  // Dark background with logo watermark
  const bgStyle = document.createElement('style');
  bgStyle.textContent = `
    html { background-color: #050d1f; }
    body {
      background-image: url("${logoImg}");
      background-size: 35%;
      background-repeat: no-repeat;
      background-position: center center;
      background-attachment: fixed;
      background-color: transparent;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: rgba(3, 8, 22, 0.87);
      z-index: -1;
      pointer-events: none;
    }
  `;
  document.head.appendChild(bgStyle);

  const app = document.querySelector('#app') as HTMLElement;
  if (!app) return;

  app.innerHTML = `
    ${Layout.getHeader('home')}
    ${Layout.getMarquee()}
    ${Layout.getCountriesBar()}

    <main>
      <!-- Hero -->
      <section class="bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-indigo-900/95 text-white py-12 md:py-16 backdrop-blur">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <h1 class="text-3xl md:text-5xl font-bold mb-4">
            Change EUR ↔ CFA<br/><span class="text-amber-400">Rapide &amp; Sécurisé</span>
          </h1>
          <p class="text-lg text-blue-100 mb-6">Recevez votre argent en ≥ 5 minutes • Frais transparents • 24/7</p>
          <div class="flex flex-wrap justify-center gap-4">
            <span class="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">💶 1 EUR = 650 FCFA</span>
            <span class="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">🌍 660 FCFA = 1 EUR</span>
          </div>
        </div>
      </section>

      <!-- Carousel -->
      <section class="py-8 bg-white/95">
        <div class="max-w-5xl mx-auto px-4">
          <div class="relative overflow-hidden rounded-2xl shadow-xl" id="carousel-root">
            <div id="carousel-track"
                 style="display:grid;grid-auto-flow:column;grid-auto-columns:100%;transition:transform 0.5s ease">
              ${[
                { src: orangeImg,  caption: 'Orange Money — Disponible dans 8+ pays africains' },
                { src: mtnImg,     caption: 'MTN MoMo — Recommandé ⚡ Le plus rapide' },
                { src: paysImg,    caption: 'Différents pays & tarifs de transaction' },
                { src: carteImg,   caption: 'Votre carte bancaire fait défaut ? CHREOL EMPIRE, la solution !' },
                { src: carteQImg,  caption: 'Besoin de liquidités ? Nous vous aidons à convertir' },
              ].map(s => `
                <div class="relative" style="width:100%">
                  <img src="${s.src}" alt="${s.caption}"
                       class="w-full h-56 md:h-80 object-contain bg-gradient-to-br from-gray-100 to-gray-200"
                       onerror="this.closest('div').style.display='none'"/>
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4">
                    <p class="text-white text-sm md:text-base font-semibold drop-shadow">${s.caption}</p>
                  </div>
                </div>`).join('')}
            </div>
            <button id="carousel-prev"
                    class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl leading-none transition-all z-10">‹</button>
            <button id="carousel-next"
                    class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl leading-none transition-all z-10">›</button>
            <div id="carousel-dots" class="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              ${[0,1,2,3,4].map(i =>
                `<button data-dot="${i}" class="dot-btn w-2.5 h-2.5 rounded-full transition-all ${i===0?'bg-white scale-125':'bg-white/50'}"></button>`
              ).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Convertisseur -->
      <section id="converter" class="py-10 bg-white/95">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-2xl font-bold text-center mb-6">🔄 Convertir EUR ↔ CFA</h2>
          <div id="converter-container" class="bg-white rounded-2xl shadow-xl p-6 md:p-8"></div>
        </div>
      </section>

      <!-- Comment ça marche — accordion -->
      <details class="bg-white/95" id="how-it-works">
        <summary class="cursor-pointer max-w-4xl mx-auto px-4 py-5 flex justify-between items-center list-none">
          <h2 class="text-2xl font-bold">📋 Comment ça marche</h2>
          <span class="text-gray-400 text-2xl select-none details-arrow">▼</span>
        </summary>
        <div class="pb-10 bg-gray-50">
          <div class="max-w-4xl mx-auto px-4 pt-4">
            <div class="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
              ${[
                ['🔢', '1. Montant', 'Entrez le montant EUR ou CFA dans le convertisseur'],
                ['👤', '2. Bénéficiaire', 'Renseignez nom, prénom, numéro et réseau (Orange/MTN)'],
                ['💳', '3. Paiement', 'Choisissez votre mode : Cash, IRIS, Banque, PayPal ou ZEN'],
                ['📸', '4. Preuve', 'Envoyez la capture de votre paiement sur WhatsApp'],
                ['✅', '5. Validation', 'Soumettez via WhatsApp — réception en ≥ 5 minutes'],
              ].map(([icon, title, desc]) => `
                <div class="bg-white rounded-xl p-4 shadow text-center border-t-4 border-blue-500">
                  <div class="text-3xl mb-2">${icon}</div>
                  <h3 class="font-bold text-sm mb-1">${title}</h3>
                  <p class="text-gray-500 text-xs">${desc}</p>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </details>

      <!-- Méthodes de dépôt — accordion -->
      <details class="bg-white/95">
        <summary class="cursor-pointer max-w-6xl mx-auto px-4 py-5 flex justify-between items-center list-none">
          <h2 class="text-2xl font-bold">📥 Comment déposer l'argent ?</h2>
          <span class="text-gray-400 text-2xl select-none details-arrow">▼</span>
        </summary>
        <div class="pb-10 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div class="max-w-6xl mx-auto px-4 pt-4">
            <div class="grid md:grid-cols-3 gap-6 mb-8">

              <!-- Espèces -->
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-500">
                <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-center">
                  <div class="text-5xl mb-2">💵</div>
                  <h3 class="text-xl font-bold text-white">En Espèces</h3>
                  <span class="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-2">Athènes</span>
                </div>
                <div class="p-5">
                  <div class="bg-green-50 border-2 border-green-300 rounded-lg p-3 mb-3">
                    <p class="font-semibold text-gray-800 text-sm">📍 Tenedou 4 — Restaurant Pakistanais</p>
                    <p class="text-gray-500 text-xs mt-1">Platia Amerikiss, Athènes</p>
                  </div>
                  <ul class="text-sm space-y-1.5 text-gray-700">
                    <li class="flex gap-2"><span class="text-green-600">✓</span> Sans frais de transaction</li>
                    <li class="flex gap-2"><span class="text-green-600">✓</span> Sur rendez-vous</li>
                    <li class="flex gap-2"><span class="text-amber-600">⚠</span> Filmez votre dépôt sur le comptoir</li>
                  </ul>
                </div>
              </div>

              <!-- Orange Money -->
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-500">
                <div class="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex items-center gap-3">
                  <img src="${orangeImg}" alt="Orange Money"
                       class="w-14 h-14 object-contain rounded-xl bg-white p-1 shadow flex-shrink-0"
                       onerror="this.outerHTML='<div class=\'text-5xl flex-shrink-0\'>🟠</div>'"/>
                  <div>
                    <h3 class="text-xl font-bold text-white">Orange Money</h3>
                    <span class="inline-block bg-white/20 text-white text-xs px-2 py-0.5 rounded-full mt-1">Populaire</span>
                  </div>
                </div>
                <div class="p-5">
                  <div class="bg-orange-50 border-2 border-orange-300 rounded-lg p-3 mb-3">
                    <code class="text-sm font-mono text-gray-800 break-all">#150*14*518554*692251299*MONTANT#</code>
                  </div>
                  <ul class="text-sm space-y-1.5 text-gray-700">
                    <li class="flex gap-2"><span class="text-green-600">✓</span> Traitement instantané</li>
                    <li class="flex gap-2"><span class="text-green-600">✓</span> Disponible 24h/24</li>
                    <li class="flex gap-2"><span class="text-green-600">✓</span> Frais Orange à votre charge</li>
                  </ul>
                </div>
              </div>

              <!-- MTN -->
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-yellow-400">
                <div class="bg-gradient-to-r from-yellow-400 to-amber-500 p-4 flex items-center gap-3">
                  <img src="${mtnImg}" alt="MTN MoMo"
                       class="w-14 h-14 object-contain rounded-xl bg-white p-1 shadow flex-shrink-0"
                       onerror="this.outerHTML='<div class=\'text-5xl flex-shrink-0\'>🟡</div>'"/>
                  <div>
                    <h3 class="text-xl font-bold text-white">MTN MoMo</h3>
                    <span class="inline-block bg-white/20 text-white text-xs px-2 py-0.5 rounded-full mt-1">Recommandé ⚡</span>
                  </div>
                </div>
                <div class="p-5">
                  <div class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mb-3">
                    <code class="text-sm font-mono text-gray-800 break-all">*126*14*672416141*MONTANT#</code>
                  </div>
                  <ul class="text-sm space-y-1.5 text-gray-700">
                    <li class="flex gap-2"><span class="text-green-600">✓</span> Traitement instantané</li>
                    <li class="flex gap-2"><span class="text-green-600">✓</span> Disponible 24h/24</li>
                    <li class="flex gap-2"><span class="text-green-600">✓</span> Frais MTN à votre charge</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg p-5">
              <h3 class="text-lg font-bold mb-4 text-center">🏦 Autres méthodes</h3>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="bg-blue-100 p-2 rounded text-xl">📲</div>
                  <div><p class="font-semibold text-gray-800 text-sm">IRIS / Virement Bancaire</p><p class="text-xs text-gray-500">Disponible via le convertisseur</p></div>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="bg-sky-100 p-2 rounded text-xl">🅿️</div>
                  <div><p class="font-semibold text-gray-800 text-sm">PayPal</p><p class="text-xs text-gray-500">larambambo@gmail.com</p></div>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="bg-purple-100 p-2 rounded text-xl">🌐</div>
                  <div><p class="font-semibold text-gray-800 text-sm">ZEN International</p><p class="text-xs text-gray-500">IBAN LT08 — SEPA Europe</p></div>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg">
              <h4 class="font-bold text-amber-900 mb-2">⚠️ Conseils de sécurité</h4>
              <ul class="text-sm text-amber-800 space-y-1">
                <li>• Dépôt espèces : <strong>filmez toujours votre dépôt</strong></li>
                <li>• Mobile Money : <strong>conservez le reçu</strong> jusqu'à confirmation</li>
                <li>• Envoyez la preuve sur WhatsApp : <strong>+30 697 359 8677</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </details>

      <!-- FAQ — accordion -->
      <details class="bg-white/95" id="faq">
        <summary class="cursor-pointer max-w-3xl mx-auto px-4 py-5 flex justify-between items-center list-none">
          <h2 class="text-2xl font-bold">❓ Questions Fréquentes</h2>
          <span class="text-gray-400 text-2xl select-none details-arrow">▼</span>
        </summary>
        <div class="pb-10">
          <div class="max-w-3xl mx-auto px-4 pt-2 space-y-3">
            ${[
              ['Quels sont les frais ?', '3 EUR par tranche de 100 EUR. Exemples : 50€→3€, 150€→6€, 500€→15€.'],
              ['Quel est le délai de réception ?', '2 à ≥ 5 minutes après réception et vérification de votre preuve de paiement.'],
              ['Quels montants acceptez-vous ?', 'Minimum 10 EUR, maximum 5 000 EUR par transaction. Contactez-nous pour des montants plus élevés.'],
              ['Vers quels pays puis-je envoyer ?', 'Cameroun sur cette page + toute l\'Afrique FCFA via la page 🌍 Africa. Consultez la liste des opérateurs disponibles.'],
              ['Comment payer depuis l\'Europe ?', '5 modes : Espèces (Athènes), IRIS (Grèce), Virement IBAN, PayPal, ZEN International.'],
              ['Que se passe-t-il si j\'envoie au mauvais numéro ?', 'Vérifiez toujours le numéro avant soumission. Une erreur de numéro ne peut être remboursée une fois le transfert effectué.'],
            ].map(([q, a]) => `
              <details class="bg-white rounded-xl shadow border border-gray-100 p-4">
                <summary class="font-semibold cursor-pointer text-gray-800 list-none flex justify-between items-center">
                  ${q} <span class="text-gray-400 text-lg ml-2">+</span>
                </summary>
                <p class="mt-3 text-gray-600 text-sm leading-relaxed">${a}</p>
              </details>`).join('')}
          </div>
        </div>
      </details>
    </main>

    ${Layout.getFooter()}

    <style>
      details[open] > summary .details-arrow { transform: rotate(180deg); }
      details > summary .details-arrow { transition: transform 0.3s; }
      details > summary { outline: none; }
      details > summary::-webkit-details-marker { display: none; }
    </style>
  `;

  const converterEl = document.querySelector('#converter-container');
  if (converterEl) new Converter(converterEl as HTMLElement);

  Layout.bindMobileMenu();
  initCarousel();

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector((anchor as HTMLAnchorElement).hash);
      target?.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('#mobile-menu')?.classList.add('hidden');
    });
  });

  new FloatingWhatsApp({
    phone: '306973598677',
    defaultText: '🔄 Bonjour, je souhaite effectuer un change EUR/CFA. Pouvez-vous m\'aider ?',
  }).mount();
});

function initCarousel(): void {
  const track = document.querySelector('#carousel-track') as HTMLElement;
  const dots = document.querySelectorAll('.dot-btn');
  if (!track) return;

  const slides = Array.from(track.children) as HTMLElement[];
  const total = slides.length;
  if (total === 0) return;

  let current = 0;
  let timer: ReturnType<typeof setInterval>;

  const goTo = (idx: number) => {
    current = ((idx % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('bg-white', i === current);
      d.classList.toggle('scale-125', i === current);
      d.classList.toggle('bg-white/50', i !== current);
    });
  };

  const next = () => goTo(current + 1);
  const reset = () => { clearInterval(timer); timer = setInterval(next, 4500); };

  document.querySelector('#carousel-prev')?.addEventListener('click', () => { goTo(current - 1); reset(); });
  document.querySelector('#carousel-next')?.addEventListener('click', () => { next(); reset(); });
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt((e.currentTarget as HTMLElement).dataset.dot || '0');
      goTo(idx); reset();
    });
  });

  timer = setInterval(next, 4500);
}
