// src/services.ts
import './styles/main.css';
import { ServicesPage } from '@/pages/Services';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import logoImg from '@/../assets/Logo_Chreol_Empire_revue-removebg-preview.png';

const _fav = Object.assign(document.createElement('link'), { rel: 'icon', type: 'image/png', href: logoImg });
document.head.appendChild(_fav);

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app') as HTMLElement;
  if (app) new ServicesPage(app);

  const whatsappFloat = new FloatingWhatsApp({
    phone: '306973598677',
    defaultText: '🛎 Bonjour, je souhaite en savoir plus sur vos services de change. Pouvez-vous m\'aider ?',
  });
  whatsappFloat.mount();
});
