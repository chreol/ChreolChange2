export const ClipboardService = {
  async copy(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback pour anciens navigateurs
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  },

  async copyWithFeedback(text: string, button: HTMLElement): Promise<void> {
    const originalText = button.textContent;
    const success = await this.copy(text);
    
    button.textContent = success ? '✅ Copié !' : '❌ Échec';
    button.classList.add(success ? 'success' : 'error');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('success', 'error');
    }, 2000);
  }
};