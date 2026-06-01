// src/africa.ts
import './styles/main.css';
import { AfricaPage } from '@/pages/Africa';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import logoImg from '@/../assets/Logo_Chreol_Empire_revue-removebg-preview.png';

const _fav = Object.assign(document.createElement('link'), { rel: 'icon', type: 'image/png', href: logoImg });
document.head.appendChild(_fav);

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app') as HTMLElement;
  if (app) new AfricaPage(app);

  const whatsappFloat = new FloatingWhatsApp({
    phone: '306973598677',
    defaultText: '🌍 Bonjour, je souhaite envoyer de l\'argent EUR→CFA vers un pays africain. Pouvez-vous m\'aider ?',
  });
  whatsappFloat.mount();
});
