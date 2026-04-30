// src/components/Converter.ts
import { Calculator, getCommission } from '@/services/calculator';
import { WhatsAppService } from '@/services/whatsapp';
import { generateUSSDCodes, copyUSSD } from '@/services/ussd';
import type { Direction } from '@/types';

export class Converter {
  private container: HTMLElement;
  private direction: Direction = 'EUR_TO_CFA';
  private result: ReturnType<typeof Calculator.calculate> | null = null;
  private isSyncing = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.bindEvents();
  }

  private render(): void {
    const isEURToCFA = this.direction === 'EUR_TO_CFA';
    
    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- Toggle Direction -->
        <div class="flex justify-center">
          <div class="bg-gray-200 p-1 rounded-2xl inline-flex shadow-inner w-full max-w-md">
            <button data-dir="EUR_TO_CFA" class="flex-1 px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
              this.direction === 'EUR_TO_CFA' ? 'bg-amber-500 text-gray-900 shadow-lg scale-105' : 'text-gray-600 hover:text-gray-900'
            }">
              <div class="flex flex-col items-center"><span>💶 EUR → CFA</span><span class="text-xs font-normal mt-1">Envoi Afrique</span></div>
            </button>
            <button data-dir="CFA_TO_EUR" class="flex-1 px-4 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
              this.direction === 'CFA_TO_EUR' ? 'bg-amber-500 text-gray-900 shadow-lg scale-105' : 'text-gray-600 hover:text-gray-900'
            }">
              <div class="flex flex-col items-center"><span>🌍 CFA → EUR</span><span class="text-xs font-normal mt-1">Reçu Europe</span></div>
            </button>
          </div>
        </div>

        <!-- Champ EUR -->
        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700 ml-1">
            ${isEURToCFA ? 'Entrez le Montant en EUROS' : 'Montant reçu en EUR (après commission)'}
          </label>
          <div class="relative">
            <input type="number" id="eur-input" min="0" step="0.01" placeholder="0" 
                   class="input-field w-full pr-16 text-lg font-semibold bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all" />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 px-3 py-1 rounded-lg text-sm font-bold text-gray-700 select-none">€</span>
          </div>
        </div>

        <!-- Séparateur -->
        <div class="text-center">
          <span class="inline-block bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm font-bold">OU / SINON</span>
        </div>

        <!-- Champ CFA -->
        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700 ml-1">
            ${isEURToCFA ? 'Montant reçu en CFA' : 'Entrez le Montant en CFA (à déposer)'}
          </label>
          <div class="relative">
            <input type="number" id="cfa-input" min="0" step="100" placeholder="0" 
                   class="input-field w-full pr-20 text-lg font-semibold bg-gray-50 focus:bg-white focus:ring-4 focus:ring-amber-100 transition-all" />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-100 px-3 py-1 rounded-lg text-sm font-bold text-amber-800 select-none">FCFA</span>
          </div>
        </div>

        <!-- Résultat -->
        <div id="result-display" class="hidden space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
          <h4 class="font-bold text-gray-800 text-lg flex items-center gap-2 border-b border-blue-200 pb-3">
            <span class="bg-blue-600 text-white p-1.5 rounded-lg">📊</span> Détails de la transaction
          </h4>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
              <span class="text-gray-600 font-medium">
                ${isEURToCFA ? '💰 Vous envoyez :' : '📥 Vous déposez :'}
              </span>
              <span class="font-bold text-gray-900 text-lg" id="res-sent"></span>
            </div>
            
            <div class="flex justify-between items-center bg-amber-50 rounded-lg p-3 border border-amber-200">
              <span class="text-amber-800 font-medium">📊 Commission :</span>
              <span class="font-bold text-amber-700 text-sm md:text-base" id="res-commission"></span>
            </div>
            
            ${isEURToCFA ? `
            <div class="flex justify-between items-center bg-blue-100 rounded-lg p-3 border border-blue-300">
              <span class="text-blue-900 font-bold">💵 Total à payer :</span>
              <span class="font-bold text-blue-700 text-xl" id="res-total"></span>
            </div>
            ` : ''}
            
            <div class="flex justify-between items-center bg-green-100 rounded-lg p-4 border-2 border-green-300">
              <span class="text-green-800 font-bold text-lg">🎁 ${isEURToCFA ? 'Il reçoit' : 'Vous recevez'} :</span>
              <span class="font-bold text-green-700 text-2xl" id="res-received"></span>
            </div>
          </div>

          ${!isEURToCFA ? `<p class="text-xs text-gray-500 text-center bg-white rounded p-2 italic">* Le montant reçu est arrondi à l'unité inférieure</p>` : ''}
        </div>

        <!-- 📱 Section USSD (Uniquement pour CFA → EUR) -->
        ${!isEURToCFA ? `
        <div id="ussd-section" class="hidden space-y-4">
          <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-300">
            <h5 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              💳 Paiement Mobile Money
            </h5>
            <p class="text-sm text-gray-600 mb-4">Cliquez sur le code pour copier et effectuez le dépôt :</p>
            
            <!-- MTN -->
            <div class="mb-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-yellow-700 flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-yellow-500"></span> MTN
                </span>
                <button id="copy-mtn" class="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition-colors font-semibold">
                  📋 Copier
                </button>
              </div>
              <div class="bg-white rounded-lg p-3 border-2 border-yellow-300 shadow-sm">
                <code id="mtn-code" class="text-sm font-mono text-gray-800 break-all"></code>
              </div>
            </div>

            <!-- Orange -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-orange-700 flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-orange-500"></span> Orange
                </span>
                <button id="copy-orange" class="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg transition-colors font-semibold">
                  📋 Copier
                </button>
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
        </div>
        ` : ''}

        <!-- WhatsApp -->
        <button id="whatsapp-btn" class="btn-primary w-full hidden bg-[#25D366] hover:bg-[#20bd5a] border-none text-white shadow-xl hover:shadow-2xl transform transition-all active:scale-95 py-4 text-lg">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span>Valider sur WhatsApp</span>
        </button>
      </div>
    `;
    
    setTimeout(() => this.bindEvents(), 0);
  }

  private bindEvents(): void {
    this.container.querySelectorAll('[data-dir]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const dir = target.dataset.dir as Direction;
        if (dir && dir !== this.direction) {
          this.direction = dir;
          this.render();
        }
      });
    });

    const eurInput = this.container.querySelector('#eur-input') as HTMLInputElement;
    if (eurInput) {
      eurInput.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        if (!isNaN(val) && val > 0) {
          this.calculateFromEUR(val);
        } else {
          this.hideResults();
        }
      });
    }

    const cfaInput = this.container.querySelector('#cfa-input') as HTMLInputElement;
    if (cfaInput) {
      cfaInput.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        if (!isNaN(val) && val > 0) {
          this.calculateFromCFA(val);
        } else {
          this.hideResults();
        }
      });
    }

    const copyMtnBtn = this.container.querySelector('#copy-mtn');
    if (copyMtnBtn) {
      copyMtnBtn.addEventListener('click', async () => {
        const code = this.container.querySelector('#mtn-code')?.textContent;
        if (code) {
          const success = await copyUSSD(code);
          const btn = copyMtnBtn as HTMLElement;
          const originalText = btn.textContent;
          btn.textContent = success ? '✅ Copié !' : '❌ Échec';
          btn.classList.add(success ? 'bg-green-600' : 'bg-red-600');
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('bg-green-600', 'bg-red-600');
          }, 2000);
        }
      });
    }

    const copyOrangeBtn = this.container.querySelector('#copy-orange');
    if (copyOrangeBtn) {
      copyOrangeBtn.addEventListener('click', async () => {
        const code = this.container.querySelector('#orange-code')?.textContent;
        if (code) {
          const success = await copyUSSD(code);
          const btn = copyOrangeBtn as HTMLElement;
          const originalText = btn.textContent;
          btn.textContent = success ? '✅ Copié !' : '❌ Échec';
          btn.classList.add(success ? 'bg-green-600' : 'bg-red-600');
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('bg-green-600', 'bg-red-600');
          }, 2000);
        }
      });
    }

    const whatsappBtn = this.container.querySelector('#whatsapp-btn');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', () => this.sendToWhatsApp());
    }
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
        
        this.result = {
          direction: 'EUR_TO_CFA',
          amountSent: amountEUR,
          currencySent: 'EUR',
          amountReceived,
          currencyReceived: 'CFA',
          commission,
          totalToPay,
        };
        
        if (cfaInput) cfaInput.value = amountReceived.toString();
      } else {
        const commission = getCommission(amountEUR);
        const grossEUR = amountEUR + commission;
        const amountToDeposit = Math.round(grossEUR * 660);
        
        this.result = {
          direction: 'CFA_TO_EUR',
          amountSent: amountToDeposit,
          currencySent: 'CFA',
          amountReceived: amountEUR,
          currencyReceived: 'EUR',
          commission,
          totalToPay: amountToDeposit,
        };
        
        if (cfaInput) cfaInput.value = amountToDeposit.toString();
        this.generateUSSDDisplay(amountToDeposit);
      }
      
      this.updateDisplay();
    } catch (error) {
      console.error('Erreur calculateFromEUR:', error);
      this.hideResults();
    }
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
        
        this.result = {
          direction: 'EUR_TO_CFA',
          amountSent,
          currencySent: 'EUR',
          amountReceived,
          currencyReceived: 'CFA',
          commission,
          totalToPay,
        };
        
        if (eurInput) eurInput.value = amountSent.toFixed(2);
      } else {
        const grossEUR = amountCFA / 660;
        const commission = getCommission(grossEUR);
        const amountReceived = Math.max(0, Math.floor(grossEUR - commission));
        
        this.result = {
          direction: 'CFA_TO_EUR',
          amountSent: amountCFA,
          currencySent: 'CFA',
          amountReceived,
          currencyReceived: 'EUR',
          commission,
          totalToPay: amountCFA,
        };
        
        if (eurInput) eurInput.value = amountReceived.toString();
        this.generateUSSDDisplay(amountCFA);
      }
      
      this.updateDisplay();
    } catch (error) {
      console.error('Erreur calculateFromCFA:', error);
      this.hideResults();
    }
    this.isSyncing = false;
  }

  private generateUSSDDisplay(amountCFA: number): void {
    const ussdSection = this.container.querySelector('#ussd-section');
    if (!ussdSection) return;

    const codes = generateUSSDCodes(amountCFA);
    
    const mtnCodeEl = this.container.querySelector('#mtn-code');
    const orangeCodeEl = this.container.querySelector('#orange-code');
    
    if (mtnCodeEl) mtnCodeEl.textContent = codes.mtn;
    if (orangeCodeEl) orangeCodeEl.textContent = codes.orange;
    
    ussdSection.classList.remove('hidden');
  }

  private updateDisplay(): void {
    if (!this.result) return;
    
    const resultDisplay = this.container.querySelector('#result-display') as HTMLElement;
    const whatsappBtn = this.container.querySelector('#whatsapp-btn') as HTMLElement;
    const isEURToCFA = this.direction === 'EUR_TO_CFA';

    const commLabel = Calculator.getCommissionLabel(this.result.amountSent, this.direction);

    const resSent = resultDisplay?.querySelector('#res-sent');
    const resCommission = resultDisplay?.querySelector('#res-commission');
    const resTotal = resultDisplay?.querySelector('#res-total');
    const resReceived = resultDisplay?.querySelector('#res-received');

    if (resSent) {
      resSent.textContent = isEURToCFA 
        ? this.formatAmount(this.result.amountSent, 'EUR') 
        : this.formatAmount(this.result.amountSent, 'CFA');
    }
    
    if (resCommission) {
      resCommission.textContent = `-${commLabel}`;
    }
    
    if (isEURToCFA && resTotal) {
      resTotal.textContent = this.formatAmount(this.result.totalToPay, 'EUR');
    }
    
    if (resReceived) {
      resReceived.textContent = isEURToCFA 
        ? this.formatAmount(this.result.amountReceived, 'CFA') 
        : this.formatAmount(this.result.amountReceived, 'EUR');
    }

    if (resultDisplay) resultDisplay.classList.remove('hidden');
    if (whatsappBtn) whatsappBtn.classList.remove('hidden');
  }

  private hideResults(): void {
    const resultDisplay = this.container.querySelector('#result-display');
    const ussdSection = this.container.querySelector('#ussd-section');
    const whatsappBtn = this.container.querySelector('#whatsapp-btn');
    
    if (resultDisplay) resultDisplay.classList.add('hidden');
    if (ussdSection) ussdSection.classList.add('hidden');
    if (whatsappBtn) whatsappBtn.classList.add('hidden');
  }

  private formatAmount(amount: number, currency: string): string {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }).format(amount);
    }
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount).replace('XOF', 'FCFA');
  }

  private sendToWhatsApp(): void {
    if (!this.result) return;
    
    const isEURToCFA = this.direction === 'EUR_TO_CFA';
    const commLabel = Calculator.getCommissionLabel(this.result.amountSent, this.direction);
    
    const message = `🔄 *DEMANDE DE CHANGE*\n\n` +
      `📊 Type: ${isEURToCFA ? 'EUR → CFA' : 'CFA → EUR'}\n` +
      `${isEURToCFA ? '💰 J\'envoie' : '📥 Je dépose'}: ${this.formatAmount(this.result.amountSent, isEURToCFA ? 'EUR' : 'CFA')}\n` +
      `📊 Commission: ${commLabel}\n` +
      `${isEURToCFA ? `💵 Total à payer: ${this.formatAmount(this.result.totalToPay, 'EUR')}\n` : ''}` +
      `🎁 *Reçu: ${this.formatAmount(this.result.amountReceived, isEURToCFA ? 'CFA' : 'EUR')}*\n\n` +
      `✅ Je confirme.`;
    
    WhatsAppService.open({ 
      phone: WhatsAppService.PHONE, 
      text: encodeURIComponent(message) 
    });
  }
}