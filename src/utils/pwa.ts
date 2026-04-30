export const PWAService = {
  isInstallable: false,
  deferredPrompt: null as BeforeInstallPromptEvent | null,

  init(): void {
    // Écouter l'événement beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.isInstallable = true;
      // Déclencher un événement personnalisé pour afficher un bouton d'installation
      window.dispatchEvent(new CustomEvent('pwa:installable'));
    });

    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) {
      window.dispatchEvent(new CustomEvent('pwa:installed'));
    }
  },

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) return false;
    
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ Utilisateur a accepté l\'installation PWA');
      window.dispatchEvent(new CustomEvent('pwa:installed'));
    }
    this.deferredPrompt = null;
    return outcome === 'accepted';
  },

  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (navigator as any).standalone === true;
  },

  // Enregistrer le service worker
  async registerSW(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.ts', {
          type: 'module',
          scope: '/'
        });
        console.log('✅ Service Worker enregistré:', registration.scope);
        return registration;
      } catch (error) {
        console.error('❌ Échec enregistrement SW:', error);
        return null;
      }
    }
    return null;
  }
};

// Type pour l'événement beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}