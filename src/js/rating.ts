const starsContainer: Element | null = document.querySelector('.stars-container');
const feedbackForm: Element | null = document.querySelector('.feedback-interaction-area');
const submitButton: Element | null = document.getElementById('submit-btn');
const feedbackText: Element | null = document.querySelector('.feedback-text');

const RATING_STORAGE_KEY = 'StarRating';
const TEXT_STORAGE_KEY = 'FeedbackText';
const CLOSE_TABS_KEY = 'CloseAllTabsSignal';

if (starsContainer instanceof HTMLElement &&
    feedbackForm instanceof HTMLFormElement &&
    submitButton instanceof HTMLButtonElement &&
    feedbackText instanceof HTMLTextAreaElement) {

    const allStars: HTMLElement[] = Array.from(starsContainer.children).filter(
        (child) => child instanceof HTMLElement
    );

    if (allStars.length > 0) {

        const firstStar = allStars[0];
        const lastStar = allStars[allStars.length - 1];

        let currentRating: number = 0;

        const resetStars = (): void => {
            allStars.forEach(star => {
                star.className = 'star';
            });
        };

        const setActiveState = (rating: number): void => {
            resetStars();
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
                for (let i = 0; i < rating; i++) {
                    allStars[i]?.classList.add('active-feedback-normal');
                }
            }
        };

        const updateRatingState = (rating: number): void => {
            currentRating = rating;
            setActiveState(rating);

            if (rating > 0 && rating <= 3) {
                feedbackForm.classList.add('is-text-active');
            } else {
                feedbackForm.classList.remove('is-text-active');
            }

            const isTextEntered = feedbackText.value.trim() !== '';
            if ((rating >= 4) || isTextEntered) {
                submitButton.disabled = false;
                if (rating >= 4) {
                    localStorage.removeItem(TEXT_STORAGE_KEY);
                    feedbackText.value = '';
                }
            } else {
                submitButton.disabled = true;
            }
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
                    console.error("Ошибка синхронизации рейтинга:", e);
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

        starsContainer.addEventListener('mouseleave', () => {
            setActiveState(currentRating);
        });

        feedbackForm.addEventListener('submit', (event: SubmitEvent) => {
            event.preventDefault();

            localStorage.removeItem(TEXT_STORAGE_KEY);
            feedbackText.value = '';
            localStorage.removeItem(RATING_STORAGE_KEY);
            updateRatingState(0);

            console.log('Рейтинг и текст сброшены и удалены из хранилища.');

            localStorage.setItem(CLOSE_TABS_KEY, 'Y');
            setTimeout(() => {
                localStorage.removeItem(CLOSE_TABS_KEY);
                window.close();
            }, 200);
        });


        // ================ИНИЦИАЛИЗАЦИЯ==============================

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
                console.error("Failed to parse initial rating:", e);
                updateRatingState(0);
            }
        } else {
            updateRatingState(0);
        }

        // ===========================================================
    }
}