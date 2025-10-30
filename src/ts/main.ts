import '/src/css/styles/main.scss'

import './header.ts'
import './rating.ts'
import './clock.ts'

const favicon: HTMLElement | null = document.getElementById('favicon');
const change_lang_ru: HTMLElement | null = document.getElementById('lang-btn-ru');
const change_lang_zh: HTMLElement | null = document.getElementById('lang-btn-zh');

if (favicon instanceof HTMLLinkElement && change_lang_ru && change_lang_zh) {

    const originalFavicon: string = favicon.href;
    const originalTitle: string = document.title;

    const inactiveFavicon: string = '/public/images/icons/favicon_inactive.ico';
    const inactiveTitle: string = 'Хочешь печеньку? 🍪';

    document.addEventListener('visibilitychange', () => {

        if (document.visibilityState === 'hidden') {
            document.title = inactiveTitle;
            favicon.href = inactiveFavicon;

        } else {
            document.title = originalTitle;
            favicon.href = originalFavicon;
        }
    });
}