const favicon = document.getElementById('favicon');
const change_lang_ru = document.getElementById('lang-btn-ru');
const change_lang_zh = document.getElementById('lang-btn-zh');

if (favicon && change_lang_ru && change_lang_zh) {

    const originalFavicon = favicon.href;
    const originalTitle = document.title;

    const inactiveFavicon = '/src/images/icons/favicon_inactive.ico';
    const inactiveTitle = 'Хочешь печеньку? 🍪';

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