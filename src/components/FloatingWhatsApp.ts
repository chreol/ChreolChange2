// ❌ Supprime l'import inutilisé
// import { WhatsAppService } from '@/services/whatsapp'; 

export class FloatingWhatsApp {
  private button: HTMLAnchorElement; // ✅ Préciser le type (pas HTMLElement)
  private phone: string;
  private defaultText: string;

  constructor({
    phone,
    defaultText = 'Bonjour, j\'ai une question concernant le change EUR/CFA.',
  }: {
    phone: string;
    defaultText?: string;
  }) {
    this.phone = phone;
    this.defaultText = defaultText;
    this.button = this.createButton();
    this.bindEvents();
  }

  private createButton(): HTMLAnchorElement { // ✅ Retourner le bon type
    const btn = document.createElement('a');
    btn.href = `https://wa.me/${this.phone}?text=${encodeURIComponent(this.defaultText)}`;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.className = 'whatsapp-float';
    btn.setAttribute('aria-label', 'Nous contacter sur WhatsApp');
    btn.innerHTML = `
      <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004c-1.775 0-3.548-.534-5.058-1.597l-.22-.155-2.33.61.62-2.27-.148-.236c-.99-1.577-1.514-3.397-1.514-5.268 0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span class="hidden md:inline font-semibold">Besoin d'aide ?</span>
    `;
    return btn;
  }

  private bindEvents(): void {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 300) {
        this.button.classList.remove('opacity-0', 'translate-y-4');
        this.button.classList.add('opacity-100', 'translate-y-0');
      } else if (currentScroll < 100 && currentScroll < lastScroll) {
        this.button.classList.add('opacity-0', 'translate-y-4');
        this.button.classList.remove('opacity-100', 'translate-y-0');
      }
      lastScroll = currentScroll;
    }, { passive: true });

    // ✅ Google Analytics : vérifier le type globalement
    this.button.addEventListener('click', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (window as any).gtag !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('event', 'click', {
          'event_category': 'engagement',
          'event_label': 'whatsapp_floating',
        });
      }
    });
  }

  public updateMessage(text: string): void {
    this.defaultText = text;
    // ✅ this.button est HTMLAnchorElement, donc .href existe
    this.button.href = `https://wa.me/${this.phone}?text=${encodeURIComponent(text)}`;
  }

  public mount(): void {
    document.body.appendChild(this.button);
  }

  public unmount(): void {
    this.button.remove();
  }
}