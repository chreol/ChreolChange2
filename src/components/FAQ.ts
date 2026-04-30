export class FAQPage {
  render(): string {
    const faqs = [
      {
        question: "Comment fonctionne le service de change ?",
        answer: "Le processus est simple : 1) Entrez le montant à convertir, 2) Choisissez votre méthode de paiement (Mobile Money, espèces, virement), 3) Effectuez le dépôt, 4) Envoyez la preuve sur WhatsApp, 5) Recevez l'argent en quelques minutes."
      },
      {
        question: "Quels sont les frais de commission ?",
        answer: "Notre commission est de 3 EUR par tranche de 100 EUR. Exemples : 50 EUR = 3 EUR de commission | 150 EUR = 6 EUR de commission | 500 EUR = 15 EUR de commission. Aucun frais caché."
      },
      {
        question: "Quel est le délai de traitement ?",
        answer: "En moyenne 2 à 5 minutes après réception de votre preuve de paiement. Les traitements sont effectués 7j/7 de 8h à 22h (heure de Paris)."
      },
      {
        question: "Quels sont les montants minimum et maximum ?",
        answer: "Minimum : 10 EUR (ou équivalent CFA). Maximum : 5 000 EUR par transaction. Pour des montants supérieurs, contactez-nous directement sur WhatsApp."
      },
      {
        question: "Puis-je annuler une transaction ?",
        answer: "Une fois le dépôt effectué, la transaction ne peut être annulée. Veuillez vérifier soigneusement les informations avant de valider votre paiement."
      },
      {
        question: "Que faire en cas d'erreur de code USSD ?",
        answer: "Ne validez pas la transaction. Retournez sur notre site, copiez à nouveau le code (bouton 📋 Copier), et réessayez. Si le problème persiste, contactez-nous avant d'envoyer l'argent."
      },
      {
        question: "Comment suivre ma transaction ?",
        answer: "Après envoi de votre preuve de paiement sur WhatsApp, vous recevrez un numéro de suivi. Utilisez-le pour demander l'état de votre transaction à tout moment."
      },
      {
        question: "Le service est-il disponible le week-end ?",
        answer: "Oui ! CHREOL EMPIRE est disponible 7 jours sur 7, de 8h à 22h (heure de Paris). En dehors de ces horaires, laissez un message, nous vous répondrons dès l'ouverture."
      },
      {
        question: "Quelles méthodes de paiement acceptez-vous ?",
        answer: "Nous acceptons : Mobile Money (MTN, Orange), dépôt en espèces à Athènes, virement bancaire, carte PIREAUS, et PayPal. Les frais Mobile Money sont à votre charge."
      },
      {
        question: "Comment garantir la sécurité de ma transaction ?",
        answer: "Nous vous recommandons de : 1) Filmer votre dépôt en espèces, 2) Conserver les reçus de transaction Mobile Money, 3) Toujours envoyer la preuve sur WhatsApp avant validation, 4) Vérifier le numéro de destination."
      }
    ];

    return `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Questions <span class="text-blue-700">Fréquentes</span>
            </h1>
            <p class="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <!-- FAQ Items -->
          <div class="space-y-4 mb-8">
            ${faqs.map((faq, index) => `
              <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <button 
                  class="faq-toggle w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onclick="document.getElementById('faq-answer-${index}').classList.toggle('hidden'); this.querySelector('.faq-icon').classList.toggle('rotate-180')">
                  <span class="font-semibold text-lg text-gray-900 pr-4">${faq.question}</span>
                  <svg class="faq-icon w-6 h-6 text-blue-600 transform transition-transform duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div id="faq-answer-${index}" class="faq-answer hidden px-6 pb-4">
                  <div class="bg-blue-50 rounded-lg p-4 text-gray-700 leading-relaxed">
                    ${faq.answer}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Contact CTA -->
          <div class="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-xl p-8 text-center text-white">
            <h2 class="text-2xl font-bold mb-4">Vous avez d'autres questions ?</h2>
            <p class="mb-6">Notre équipe est disponible pour vous répondre</p>
            <a href="https://wa.me/306973598677" 
               target="_blank"
               class="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-8 rounded-xl transition-all hover:scale-105">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contacter sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
  }
}