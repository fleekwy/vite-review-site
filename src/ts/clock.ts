type Language = 'ru' | 'zh';

const clockElement: HTMLElement | null = document.querySelector('.real-time-clock');
const ruButton: HTMLElement | null = document.getElementById('lang-btn-ru');
const zhButton: HTMLElement | null = document.getElementById('lang-btn-zh');

const LANG_STORAGE_KEY = 'ClockLanguage';

function isLanguage(value: unknown): value is Language {
    return value === 'ru' || value === 'zh';
}

function getSavedLanguage(): Language {
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLanguage(savedLang)) {
        return savedLang;
    }
    return 'ru';
}

if (clockElement && ruButton && zhButton) {
    const locales = {
        ru: new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            weekday: 'long',
        }),
        zh: new Intl.DateTimeFormat('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            weekday: 'long',
        }),
    };

    let currentLang: Language = getSavedLanguage();
    let lastDisplayedDate: Date = new Date();

    const formatClockString = (date: Date): string => {
        return locales[currentLang].format(date);
    };

    const updateClock = (): void => {
        lastDisplayedDate = new Date();
        clockElement!.textContent = formatClockString(lastDisplayedDate);
    };

    const startSmartInterval = (): void => {
        const now: Date = new Date();
        const milliseconds: number = now.getMilliseconds() + now.getSeconds() * 1000;

        const msecondsToTen: number = 10000 - (milliseconds % 10000);

        setTimeout(() => {
            updateClock();
            startSmartInterval();
        }, msecondsToTen);
    };

    ruButton.addEventListener('click', (event: MouseEvent) => {
        event.stopPropagation();
        if (currentLang !== 'ru') {
            currentLang = 'ru';
            localStorage.setItem(LANG_STORAGE_KEY, currentLang);
            clockElement.textContent = formatClockString(lastDisplayedDate);
        }
    });

    zhButton.addEventListener('click', (event: MouseEvent) => {
        event.stopPropagation();
        if (currentLang !== 'zh') {
            currentLang = 'zh';
            localStorage.setItem(LANG_STORAGE_KEY, currentLang);
            clockElement.textContent = formatClockString(lastDisplayedDate);
        }
    });

    window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === LANG_STORAGE_KEY) {
            console.log('Получено событие синхронизации языка из другой вкладки!');
            const newLang = event.newValue;

            if (isLanguage(newLang) && newLang !== currentLang) {
                currentLang = newLang;
                clockElement.textContent = formatClockString(lastDisplayedDate);
            }
        }
    });

    updateClock();
    startSmartInterval();
}
