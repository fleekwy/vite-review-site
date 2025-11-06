const starsContainer: HTMLElement | null = document.getElementById('stars-container');
const feedbackForm: HTMLElement | null = document.getElementById('feedback-interaction-area');
const submitButton: HTMLElement | null = document.getElementById('submit-btn');
const feedbackText: HTMLElement | null = document.getElementById('feedback-text');

const RATING_STORAGE_KEY = 'StarRating';
const TEXT_STORAGE_KEY = 'FeedbackText';
const CLOSE_TABS_KEY = 'CloseAllTabsSignal';
let currentRating: number = 0;

function isHTMLElement(value: unknown): value is HTMLElement {
    return value instanceof HTMLElement;
}

function isHTMLFormElement(value: unknown): value is HTMLFormElement {
    return value instanceof HTMLFormElement;
}

function isHTMLButtonElement(value: unknown): value is HTMLButtonElement {
    return value instanceof HTMLButtonElement;
}

function isHTMLTextAreaElement(value: unknown): value is HTMLTextAreaElement {
    return value instanceof HTMLTextAreaElement;
}

function resetStars(allStars: HTMLElement[]): void {
    allStars.forEach((star) => {
        star.className = 'star';
    });
}

function setActiveState(rating: number): void {
    if (!isHTMLElement(starsContainer)) return; // Звезды не существуют, ничего не делаем

    const allStars: HTMLElement[] = Array.from(starsContainer.children).filter(
        (child) => child instanceof HTMLElement
    );

    if (allStars.length === 0) return;

    const firstStar = allStars[0];
    const lastStar = allStars[allStars.length - 1];

    resetStars(allStars);
    if (rating === 0) return;

    if (rating === 1) {
        firstStar.classList.add('active-feedback-low');
    } else if (rating === allStars.length) {
        allStars.forEach((star, index) => {
            if (index < rating - 1) {
                star.classList.add('active-feedback-normal');
            } else {
                lastStar.classList.add('active-feedback-high');
            }
        });
    } else {
        if (allStars.length >= rating) {
            for (let i = 0; i < rating; i++) {
                allStars[i].classList.add('active-feedback-normal');
            }
        }
    }
}

function updateRatingState(rating: number): void {
    currentRating = rating;
    setActiveState(rating);

    if (isHTMLFormElement(feedbackForm)) {
        if (rating > 0 && rating <= 3) {
            feedbackForm.classList.add('is-text-active');
        } else {
            feedbackForm.classList.remove('is-text-active');
        }
    }

    let isTextEntered = false;
    if (isHTMLTextAreaElement(feedbackText)) {
        isTextEntered = feedbackText.value.trim() !== '';
    }
    if (isHTMLButtonElement(submitButton)) {
        if (rating >= 4 || isTextEntered) {
            submitButton.disabled = false;
            if (rating >= 4 && isHTMLTextAreaElement(feedbackText)) {
                localStorage.removeItem(TEXT_STORAGE_KEY);
                feedbackText.value = '';
            }
        } else {
            submitButton.disabled = true;
        }
    }
}

if (isHTMLElement(starsContainer)) {
    const allStars: HTMLElement[] = Array.from(starsContainer.children).filter(
        (child) => child instanceof HTMLElement
    );

    if (allStars.length > 0) {
        const firstStar = allStars[0];
        const lastStar = allStars[allStars.length - 1];

        const resetStars = (): void => {
            allStars.forEach((star) => {
                star.className = 'star';
            });
        };

        allStars.forEach((star, index) => {
            const rating: number = index + 1;

            star.addEventListener('mouseenter', (): void => {
                resetStars();

                if (rating === 1) {
                    firstStar.classList.add('hover-feedback-low');
                } else if (rating === allStars.length) {
                    allStars.forEach((s, i) => {
                        if (i < rating - 1) {
                            s.classList.add('hover-feedback-normal');
                        } else {
                            lastStar.classList.add('hover-feedback-high');
                        }
                    });
                } else {
                    for (let i = 0; i < rating; i++) {
                        allStars[i].classList.add('hover-feedback-normal');
                    }
                }
            });

            star.addEventListener('click', (): void => {
                updateRatingState(rating);

                setTimeout(() => {
                    localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(rating));
                    console.log(`Рейтинг ${rating} сохранен для синхронизации.`);
                }, 1000);
            });
        });

        starsContainer.addEventListener('mouseleave', () => {
            setActiveState(currentRating);
        });
    }
}

if (isHTMLTextAreaElement(feedbackText)) {
    let textSyncTimeout: ReturnType<typeof setTimeout>;
    feedbackText.addEventListener('input', (): void => {
        feedbackText.style.height = 'auto';
        feedbackText.style.height = `${feedbackText.scrollHeight}px`;

        updateRatingState(currentRating);

        clearTimeout(textSyncTimeout);

        textSyncTimeout = setTimeout(() => {
            localStorage.setItem(TEXT_STORAGE_KEY, feedbackText.value);
            console.log(`Текст отзыва сохранен для синхронизации.`);
        }, 2000);
    });

    window.addEventListener('storage', (event: StorageEvent): void => {
        if (event.key === RATING_STORAGE_KEY && event.newValue) {
            try {
                const newRating = JSON.parse(event.newValue);
                if (typeof newRating === 'number') {
                    updateRatingState(newRating);
                }
            } catch (e) {
                console.error('Ошибка синхронизации рейтинга:', e);
            }
        }
        if (event.key === TEXT_STORAGE_KEY && event.newValue) {
            console.log('Получено событие синхронизации текста!');

            feedbackText.value = event.newValue;
            updateRatingState(currentRating);
        }
        if (event.key === CLOSE_TABS_KEY && event.newValue === 'Y') {
            window.close();
        }
    });
}

if (isHTMLFormElement(feedbackForm)) {
    feedbackForm.addEventListener('submit', (event: SubmitEvent) => {
        event.preventDefault();

        localStorage.removeItem(TEXT_STORAGE_KEY);
        if (isHTMLTextAreaElement(feedbackText)) {
            // Доп. проверка
            feedbackText.value = '';
        }
        localStorage.removeItem(RATING_STORAGE_KEY);
        updateRatingState(0);

        console.log('Рейтинг и текст сброшены и удалены из хранилища.');

        localStorage.setItem(CLOSE_TABS_KEY, 'Y');
        setTimeout(() => {
            localStorage.removeItem(CLOSE_TABS_KEY);
            window.close();
        }, 200);
    });
}

// ================ИНИЦИАЛИЗАЦИЯ==============================
if (isHTMLTextAreaElement(feedbackText)) {
    const savedText = localStorage.getItem(TEXT_STORAGE_KEY);
    if (savedText) {
        feedbackText.value = savedText;
    }

    const savedRatingRaw = localStorage.getItem(RATING_STORAGE_KEY);
    if (savedRatingRaw) {
        try {
            const savedRating = JSON.parse(savedRatingRaw);
            if (typeof savedRating === 'number') {
                updateRatingState(savedRating);
            }
        } catch (e) {
            console.error('Failed to parse initial rating:', e);
            updateRatingState(0);
        }
    } else {
        updateRatingState(0);
    }

    // ===========================================================
}
