// src/main.ts
import './styles/main.css';
import { Converter } from '@/components/Converter';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { SEOHead } from '@/components/SEOHead';

// Initialisation principale
document.addEventListener('DOMContentLoaded', () => {
  // SEO
  SEOHead.inject();

  // Structure de la page d'accueil
  const app = document.querySelector('#app') as HTMLElement;
  if (app) {
    app.innerHTML = `
      <!-- Header -->
      <header class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex justify-between items-center">
            
            <!-- Logo -->
            <a href="/" class="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <span>🔄</span> CHREOL EMPIRE Change-Money
            </a>

            <!-- Navigation Desktop -->
            <nav class="hidden md:flex space-x-6">
              <a href="#converter" class="text-gray-700 hover:text-blue-700 font-medium">Convertir</a>
              <a href="#how-it-works" class="text-gray-700 hover:text-blue-700 font-medium">Comment ça marche</a>
              <a href="#faq" class="text-gray-700 hover:text-blue-700 font-medium">FAQ</a>
            </nav>

            <!-- Actions Droite : WhatsApp + Menu Mobile -->
            <div class="flex items-center gap-3">
              
              <!-- Bouton WhatsApp Header (Desktop) -->
              <a href="https://wa.me/306973598677" target="_blank" 
                 class="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all shadow hover:shadow-lg">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contactez-nous
              </a>

              <!-- Bouton WhatsApp Mobile (Icône seule) -->
              <a href="https://wa.me/306973598677" target="_blank" class="md:hidden text-green-600 p-2">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>

              <!-- Hamburger Menu Mobile -->
              <button id="mobile-menu-btn" class="md:hidden p-2 text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Mobile menu -->
          <div id="mobile-menu" class="hidden md:hidden mt-4 pb-2 border-t border-gray-100">
            <nav class="flex flex-col space-y-2 pt-4">
              <a href="#converter" class="px-3 py-2 text-gray-700 hover:bg-blue-50 rounded">Convertir</a>
              <a href="#how-it-works" class="px-3 py-2 text-gray-700 hover:bg-blue-50 rounded">Comment ça marche</a>
              <a href="#faq" class="px-3 py-2 text-gray-700 hover:bg-blue-50 rounded">FAQ</a>
              <a href="https://wa.me/306973598677" target="_blank" class="px-3 py-2 text-green-600 font-bold hover:bg-green-50 rounded">📞 Contactez-nous sur WhatsApp</a>
            </nav>
          </div>
        </div>
      </header>

            </header>

      <!-- Barre d'Information Défilante (Marquee) -->
      <div class="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-3 overflow-hidden border-y border-blue-700">
        <div class="flex whitespace-nowrap animate-marquee">
          <!-- Contenu dupliqué pour effet infini -->
          <div class="flex items-center gap-8 mx-8">
            <span class="flex items-center gap-2 font-bold">
              <span class="text-blue-400">💶</span> EUR→CFA: <span class="text-amber-400">650 F</span>
            </span>
            <span class="flex items-center gap-2 font-bold">
              <span class="text-cyan-400">🌍</span> CFA→EUR: <span class="text-amber-400">660 F</span>
            </span>
            <span class="flex items-center gap-2">
              <span class="text-yellow-400">🟡</span> MTN Code Marchand ETS Contant: <code class="bg-yellow-900/50 px-2 py-1 rounded text-xs">*126*14*672416141*montant#</code>
            </span>
            <span class="flex items-center gap-2">
              <span class="text-orange-400">🟠</span> Orange Code Marchand Ets Tagny: <code class="bg-orange-900/50 px-2 py-1 rounded text-xs">#150*14*518554*692251299*montant#</code>
            </span>
            <span class="flex items-center gap-2">
              <span class="text-green-400">✓</span> Traitement en ≥ 5 minutes
            </span>
            <span class="flex items-center gap-2">
              <span class="text-blue-400">📱</span> Disponible 24/7
            </span>
          </div>
          
          <!-- Duplication pour effet continu -->
          <div class="flex items-center gap-8 mx-8">
            <span class="flex items-center gap-2 font-bold">
              <span class="text-blue-400">💶</span> EUR→CFA: <span class="text-amber-400">650 F</span>
            </span>
            <span class="flex items-center gap-2 font-bold">
              <span class="text-cyan-400">🌍</span> CFA→EUR: <span class="text-amber-400">660 F</span>
            </span>
            <span class="flex items-center gap-2">
              <span class="text-yellow-400">🟡</span> MTN Code Marchand ETS Contant: <code class="bg-yellow-900/50 px-2 py-1 rounded text-xs">*126*14*672416141*montant#</code>
            </span>
            <span class="flex items-center gap-2">
              <span class="text-orange-400">🟠</span> Orange Code Marchand Ets Tagny: <code class="bg-orange-900/50 px-2 py-1 rounded text-xs">#150*14*518554*692251299*montant#</code>
            </span>
            <span class="flex items-center gap-2">
              <span class="text-green-400">✓</span> Traitement en ≥ 5 minutes
            </span>
            <span class="flex items-center gap-2">
              <span class="text-blue-400">📱</span> Disponible 24/7
            </span>
          </div>
        </div>
      </div>

      <!-- Barre des Pays Supportés -->
      <div class="bg-blue-800 text-white py-2 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 flex justify-center items-center gap-3 md:gap-6 text-xs md:text-sm font-medium whitespace-nowrap overflow-x-auto">
          <!-- Afrique -->
          <span class="flex items-center gap-1 md:gap-2">🇨🇮 Côte d'Ivoire</span>
          <span class="flex items-center gap-1 md:gap-2">🇸🇳 Sénégal</span>
          <span class="flex items-center gap-1 md:gap-2">🇲 Mali</span>
          <span class="flex items-center gap-1 md:gap-2">🇧 Burkina Faso</span>
          <span class="flex items-center gap-1 md:gap-2">🇧 Bénin</span>
          <span class="flex items-center gap-1 md:gap-2">🇳🇪 Niger</span>
          <span class="flex items-center gap-1 md:gap-2">🇬🇶 Guinée Équatoriale</span>
          <span class="flex items-center gap-1 md:gap-2">🇬🇼 Guinée-Bissau</span>
          <span class="flex items-center gap-1 md:gap-2">🇨🇨🇬- Congo-Brazzaville-Kinshasa</span>
          
                    
          <!-- Europe -->
          <span class="flex items-center gap-1 md:gap-2">🇫 France</span>
          <span class="flex items-center gap-1 md:gap-2">🇬🇷 Grèce</span>
        </div>
      </div>

      <!-- CSS pour l'animation -->
      <style>
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      </style>

      <!-- Main Content -->
      <main>

      <!-- Barre des Pays Supportés -->
      <div class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-2 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 flex justify-center items-center gap-4 md:gap-8 text-sm font-medium whitespace-nowrap overflow-x-auto">
          
        </div>
      </div>

      <!-- Main Content -->
      <main>
        <!-- Hero -->
        <section class="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-12 md:py-16">
          <div class="max-w-7xl mx-auto px-4 text-center">
            <h1 class="text-3xl md:text-5xl font-bold mb-4">Change EUR ↔ CFA<br/><span class="text-amber-400">Rapide & Sécurisé</span></h1>
            <p class="text-lg text-blue-100 mb-6">Recevez votre argent en ≥ 5 minutes • Frais transparents • 24/7j</p>
            <div class="flex flex-wrap justify-center gap-4">
              <span class="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">💶 1 EUR = 650 FCFA</span>
              <span class="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">🌍 660 FCFA = 1 EUR</span>
            </div>
          </div>
        </section>

        <!-- Converter -->
        <section id="converter" class="py-12 -mt-8">
          <div class="max-w-4xl mx-auto px-4">
            <div id="converter-container" class="bg-white rounded-2xl shadow-xl p-6 md:p-8"></div>
          </div>
        </section>

        <!-- How It Works -->
        <section id="how-it-works" class="py-12 bg-gray-50">
          <div class="max-w-4xl mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-8">📋 Comment ça marche</h2>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="bg-white rounded-xl p-6 shadow text-center">
                <div class="text-4xl mb-3">🔢</div>
                <h3 class="font-bold mb-2">1. Entrez le montant</h3>
                <p class="text-gray-600 text-sm">EUR ou CFA, le calculateur fait le reste</p>
              </div>
              <div class="bg-white rounded-xl p-6 shadow text-center">
                <div class="text-4xl mb-3">📱</div>
                <h3 class="font-bold mb-2">2. Copiez le code USSD</h3>
                <p class="text-gray-600 text-sm">MTN ou Orange, pré-rempli avec le montant</p>
              </div>
              <div class="bg-white rounded-xl p-6 shadow text-center">
                <div class="text-4xl mb-3">✅</div>
                <h3 class="font-bold mb-2">3. Envoyez la preuve</h3>
                <p class="text-gray-600 text-sm">WhatsApp + reçu = validation en ≥ 5 minutes</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Payment Methods -->
        <section id="payment-methods" class="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-4">📥 Comment déposer l'argent ?</h2>
            <p class="text-center text-gray-600 mb-12">Choisissez la méthode qui vous convient le mieux</p>
            
            <div class="grid md:grid-cols-3 gap-6 mb-8">

              <!-- Espèces -->
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-500">
                <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-center">
                  <div class="text-5xl mb-2">💵</div>
                  <h3 class="text-xl font-bold text-white">En Espèces</h3>
                  <span class="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-2">Athènes</span>
                </div>
                <div class="p-6">
                  <p class="text-sm text-gray-600 mb-4">Dépôt physique à Athènes</p>
                  <div class="bg-green-50 border-2 border-green-300 rounded-lg p-3 mb-4">
                    <div class="flex items-start gap-2 text-sm">
                      <span class="text-xl">📍</span>
                      <div>
                        <p class="font-semibold text-gray-800">Tenedou 4 au Restaurant Pakistanais</p>
                        <p class="text-gray-600 text-xs mt-1">Platia Amerikiss - Athènes, Grèce</p>
                      </div>
                    </div>
                  </div>
                  <ul class="text-sm space-y-2 text-gray-700">
                    <li class="flex items-center gap-2">
                      <span class="text-green-600">✓</span>
                      <span>Sans frais de transaction</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-green-600">✓</span>
                      <span>Sur rendez-vous</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-amber-600">⚠</span>
                      <span>Filmez votre dépôt sur le comptoir</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Orange Money -->
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-500">
                <div class="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-center">
                  <div class="text-5xl mb-2">🟠</div>
                  <h3 class="text-xl font-bold text-white">Orange Money</h3>
                  <span class="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-2">Populaire</span>
                </div>
                <div class="p-6">
                  <p class="text-sm text-gray-600 mb-4">Code USSD pré-rempli avec le montant</p>
                  <div class="bg-orange-50 border-2 border-orange-300 rounded-lg p-3 mb-4">
                    <code class="text-sm font-mono text-gray-800 break-all">
                      #150*14*518554*692251299*MONTANT#
                    </code>
                  </div>
                  <ul class="text-sm space-y-2 text-gray-700">
                    <li class="flex items-center gap-2">
                      <span class="text-green-600">✓</span>
                      <span>Traitement instantané</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-green-600">✓</span>
                      <span>Disponible 24h/24</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-green-600">✓</span>
                      <span>Frais Orange à votre charge</span>
                    </li>
                  </ul>
                </div>
              </div>

              
              <!-- MTN Mobile Money -->
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-yellow-400">
                <div class="bg-gradient-to-r from-yellow-400 to-amber-500 p-4 text-center">
                  <div class="text-5xl mb-2">🟡</div>
                  <h3 class="text-xl font-bold text-white">MTN Mobile Money</h3>
                  <span class="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-2">Recommandé ⚡</span>
                </div>
                <div class="p-6">
                  <p class="text-sm text-gray-600 mb-4">Code USSD pré-rempli avec le montant</p>
                  <div class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mb-4">
                    <code class="text-sm font-mono text-gray-800 break-all">
                      *126*14*672416141*MONTANT#
                    </code>
                  </div>
                  <ul class="text-sm space-y-2 text-gray-700">
                    <li class="flex items-center gap-2">
                      <span class="text-green-600">✓</span>
                      <span>Traitement instantané</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-green-600">✓</span>
                      <span>Disponible 24h/24</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-green-600">✓</span>
                      <span>Frais MTN à votre charge</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            <!-- Autres méthodes -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h3 class="text-xl font-bold mb-4 text-center">🏦 Autres méthodes de paiement</h3>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="bg-blue-100 p-2 rounded">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">Virement Bancaire ou IRIS</p>
                    <p class="text-xs text-gray-600">Sur demande Je vous communiquerai les coordonnées bancaires</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="bg-purple-100 p-2 rounded">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">Carte PIREAUS [Les 16 Chiffres]</p>
                    <p class="text-xs text-gray-600">Disponible en Grèce uniquement</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="bg-blue-100 p-2 rounded">
                    <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.633V4.95c0-.345.288-.633.633-.633h4.606c2.485 0 4.053 1.219 4.053 3.232 0 1.353-.739 2.419-1.953 2.953v.065c1.521.455 2.639 1.633 2.639 3.419 0 2.244-1.776 3.654-4.739 3.654H7.076v3.697zm4.138-13.193c0-.933-.666-1.505-1.853-1.505H7.076v3.339h2.285c1.187 0 1.853-.572 1.853-1.834zm.299 5.165c0-1.154-.799-1.834-2.119-1.834H7.076v3.697h2.285c1.32 0 2.152-.699 2.152-1.863zM21.807 14.45c0 .353-.064.666-.193.933a2.053 2.053 0 0 1-.53.701 2.34 2.34 0 0 1-.798.456c-.302.103-.633.154-.992.154h-1.926v2.667h-2.554V7.333h4.52c.353 0 .678.051.976.154.298.103.554.255.769.456.215.201.384.443.508.726.124.283.186.603.186.96v2.167h-4.519v1.727h1.926c.201 0 .353.038.456.114a.365.365 0 0 1 .154.302v.511h.017z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">PayPal EUROPE</p>
                    <p class="text-xs text-gray-600">Adresse PAYPAL sur demande</p>
                  </div>
                </div>
              </div>
              <p class="text-center text-sm text-gray-600 mt-4">
                💡 Contactez-nous sur WhatsApp pour les coordonnées bancaires
              </p>
            </div>

            <!-- Important -->
            <div class="mt-8 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 class="font-bold text-amber-900 mb-2">Important - Conseils de sécurité</h4>
                  <ul class="text-sm text-amber-800 space-y-1">
                    <li>• Pour les dépôts en espèces : <strong>filmez toujours votre dépôt</strong> pour validation</li>
                    <li>• Pour Mobile Money : <strong>conservez le reçu de transaction</strong> jusqu'à confirmation</li>
                    <li>• Envoyez toujours la preuve sur WhatsApp : <strong>+30 697 359 8677</strong></li>
                    <li>• Vérifiez le numéro de destinataire avant de les soumettre pour validation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section id="faq" class="py-12">
          <div class="max-w-3xl mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-8">❓ Questions Fréquentes</h2>
            <div class="space-y-3">
              <details class="bg-white rounded-lg shadow p-4">
                <summary class="font-semibold cursor-pointer">Quels sont les frais ?</summary>
                <p class="mt-2 text-gray-600">3 EUR par tranche de 100 EUR. Ex: 50€→3€, 150€→6€, 500€→15€.</p>
              </details>
              <details class="bg-white rounded-lg shadow p-4">
                <summary class="font-semibold cursor-pointer">Quel est le délai ?</summary>
                <p class="mt-2 text-gray-600">2 à ≥ 5 minutes après réception de votre preuve de paiement.</p>
              </details>
              <details class="bg-white rounded-lg shadow p-4">
                <summary class="font-semibold cursor-pointer">Quels montants ?</summary>
                <p class="mt-2 text-gray-600">Minimum 10 EUR, maximum 5 000 EUR par transaction.</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="bg-gray-900 text-gray-300 py-12">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid md:grid-cols-3 gap-8 mb-8">
            <!-- À propos -->
            <div>
              <h3 class="text-white font-bold text-lg mb-4">CHREOL EMPIRE</h3>
              <p class="text-sm text-gray-400 leading-relaxed">
                Service de change EUR/CFA rapide, sécurisé et fiable. Nous facilitons vos transferts d'argent vers l'Afrique et ou l'Europe.
              </p>
            </div>
            
            <!-- Liens Rapides -->
            <div>
              <h3 class="text-white font-bold text-lg mb-4">Liens Rapides</h3>
              <ul class="space-y-2 text-sm">
                <li><a href="#converter" class="hover:text-white transition-colors">Convertir</a></li>
                <li><a href="#how-it-works" class="hover:text-white transition-colors">Comment déposer</a></li>
                <li><a href="#faq" class="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <!-- Contact -->
            <div>
              <h3 class="text-white font-bold text-lg mb-4">Contact</h3>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <a href="https://wa.me/306973598677" class="hover:text-white transition-colors">+30 697 359 8677</a>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Disponible 7j/7 - 8h à 22h</span>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Bottom -->
          <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-sm text-gray-500">© 2026 CHREOL EMPIRE - Tous droits réservés</p>
            <div class="flex gap-6 text-sm text-gray-500">
              <a href="#legal" class="hover:text-white transition-colors">Mentions légales</a>
              <a href="#privacy" class="hover:text-white transition-colors">Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    `;

    // Initialiser le convertisseur
    const converterContainer = document.querySelector('#converter-container');
    if (converterContainer) {
      new Converter(converterContainer as HTMLElement);
    }

    // Menu mobile
    const menuBtn = document.querySelector('#mobile-menu-btn');
    const mobileMenu = document.querySelector('#mobile-menu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Smooth scroll pour ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector((anchor as HTMLAnchorElement).hash);
        target?.scrollIntoView({ behavior: 'smooth' });
        // Fermer menu mobile après clic
        mobileMenu?.classList.add('hidden');
      });
    });
  }

  // WhatsApp flottant
  const whatsappFloat = new FloatingWhatsApp({
    phone: '306973598677',
    defaultText: '🔄 Bonjour, je souhaite effectuer un change EUR/CFA. Pouvez-vous m\'aider ?'
  });
  whatsappFloat.mount();
});