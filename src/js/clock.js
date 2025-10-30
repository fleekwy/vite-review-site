const clockElement = document.querySelector('.real-time-clock');
const ruButton = document.getElementById('lang-btn-ru');
const zhButton = document.getElementById('lang-btn-zh');

const LANG_STORAGE_KEY = 'ClockLanguage';

if (clockElement && ruButton && zhButton) {
    const locales = {
        ru: new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            day: '2-digit', month: '2-digit', weekday: 'long'
        }),
        zh: new Intl.DateTimeFormat('zh-CN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            day: '2-digit', month: '2-digit', weekday: 'long'
        })
    };

    let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'ru';
    let lastDisplayedDate = new Date();

    function formatClockString(date) {
        return locales[currentLang].format(date);
    }

    function updateClock() {
        lastDisplayedDate = new Date();
        clockElement.textContent = formatClockString(lastDisplayedDate);
    }

    function startSmartInterval() {

        const now = new Date();
        const milliseconds = now.getMilliseconds() + now.getSeconds() * 1000;

        const msecondsToTen = 10000 - (milliseconds % 10000);

        setTimeout(() => {
            updateClock();
            startSmartInterval();
        }, msecondsToTen);
    }

    ruButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (currentLang !== 'ru') {
            currentLang = 'ru';
            localStorage.setItem(LANG_STORAGE_KEY, currentLang);
            clockElement.textContent = formatClockString(lastDisplayedDate);
        }
    });

    zhButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (currentLang !== 'zh') {
            currentLang = 'zh';
            localStorage.setItem(LANG_STORAGE_KEY, currentLang);
            clockElement.textContent = formatClockString(lastDisplayedDate);
        }
    });

    window.addEventListener('storage', (event) => {

        if (event.key === LANG_STORAGE_KEY) {
            console.log('Получено событие синхронизации языка из другой вкладки!');
            const newLang = event.newValue;

            if (newLang && newLang !== currentLang) {
                currentLang = newLang;
                clockElement.textContent = formatClockString(lastDisplayedDate);
            }
        }
    });

    updateClock();
    startSmartInterval();
}