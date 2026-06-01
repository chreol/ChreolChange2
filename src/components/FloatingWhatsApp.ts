// src/components/FloatingWhatsApp.ts
export class FloatingWhatsApp {
  private button: HTMLAnchorElement;
  private bubble: HTMLDivElement;
  private phone: string;
  private defaultText: string;
  private bubbleTimer: ReturnType<typeof setTimeout> | null = null;

  constructor({ phone, defaultText = 'Bonjour, j\'ai une question concernant le change EUR/CFA.' }: {
    phone: string;
    defaultText?: string;
  }) {
    this.phone = phone;
    this.defaultText = defaultText;
    this.bubble = this.createBubble();
    this.button = this.createButton();
    this.bindEvents();
  }

  private createBubble(): HTMLDivElement {
    const el = document.createElement('div');
    el.id = 'wa-bubble';
    el.innerHTML = `
      <button id="wa-bubble-close" aria-label="Fermer"
              style="position:absolute;top:6px;right:10px;font-size:16px;line-height:1;
                     background:none;border:none;cursor:pointer;color:#6b7280;font-weight:bold">×</button>
      <p style="font-weight:700;margin:0 0 4px;font-size:14px">Besoin d'aide ? 🦁</p>
      <p style="margin:0;font-size:12px;color:#4b5563;line-height:1.5">Notre équipe répond<br/>en quelques minutes !</p>
      <!-- Arrow pointing right/down toward the button -->
      <div style="position:absolute;bottom:-8px;right:22px;width:0;height:0;
                  border-left:8px solid transparent;border-right:8px solid transparent;
                  border-top:8px solid white;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12))"></div>
    `;
    Object.assign(el.style, {
      position: 'fixed',
      bottom: '88px',
      right: '16px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,.18)',
      padding: '14px 18px 14px 14px',
      zIndex: '49',
      maxWidth: '210px',
      border: '1.5px solid #dcfce7',
      opacity: '0',
      transform: 'translateY(8px) scale(0.95)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      pointerEvents: 'none',
    });
    return el;
  }

  private showBubble(): void {
    Object.assign(this.bubble.style, {
      opacity: '1',
      transform: 'translateY(0) scale(1)',
      pointerEvents: 'auto',
    });
    // Auto-dismiss after 7 s
    this.bubbleTimer = setTimeout(() => this.hideBubble(), 7000);
  }

  private hideBubble(): void {
    Object.assign(this.bubble.style, {
      opacity: '0',
      transform: 'translateY(8px) scale(0.95)',
      pointerEvents: 'none',
    });
    if (this.bubbleTimer) { clearTimeout(this.bubbleTimer); this.bubbleTimer = null; }
  }

  private createButton(): HTMLAnchorElement {
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
    `;
    return btn;
  }

  private bindEvents(): void {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.pageYOffset;
      if (y > 300) {
        this.button.classList.remove('opacity-0', 'translate-y-4');
        this.button.classList.add('opacity-100', 'translate-y-0');
      } else if (y < 100 && y < lastScroll) {
        this.button.classList.add('opacity-0', 'translate-y-4');
        this.button.classList.remove('opacity-100', 'translate-y-0');
      }
      lastScroll = y;
    }, { passive: true });

    this.button.addEventListener('click', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (window as any).gtag !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('event', 'click', { event_category: 'engagement', event_label: 'whatsapp_floating' });
      }
    });

    // Show bubble after 2 s on first load
    setTimeout(() => this.showBubble(), 2000);

    // Close button (delegation after bubble is in DOM)
    document.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).id === 'wa-bubble-close') this.hideBubble();
    });
  }

  public updateMessage(text: string): void {
    this.defaultText = text;
    this.button.href = `https://wa.me/${this.phone}?text=${encodeURIComponent(text)}`;
  }

  public mount(): void {
    document.body.appendChild(this.bubble);
    document.body.appendChild(this.button);
  }

  public unmount(): void {
    this.bubble.remove();
    this.button.remove();
  }
}
