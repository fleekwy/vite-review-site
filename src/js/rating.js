const starsContainer = document.querySelector('.stars-container');
const feedbackForm = document.querySelector('.feedback-interaction-area');
const submitButton = document.getElementById('submit-btn');
const feedbackText = document.querySelector('.feedback-text');

const RATING_STORAGE_KEY = 'StarRating';
const TEXT_STORAGE_KEY = 'FeedbackText';
const CLOSE_TABS_KEY = 'CloseAllTabsSignal';

if (starsContainer && feedbackForm && submitButton && feedbackText) {

    const firstStar = starsContainer.firstElementChild;
    const lastStar = starsContainer.lastElementChild;
    const allStars = Array.from(starsContainer.children);

    let currentRating = 0;

    const resetStars = () => {
        allStars.forEach(star => {
            star.className = 'star';
        });
    };

    const setActiveState = (rating) => {
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
                allStars[i].classList.add('active-feedback-normal');
            }
        }
    };

    const updateRatingState = (rating) => {
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
        const rating = index + 1;

        star.addEventListener('mouseenter', () => {
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

        star.addEventListener('click', () => {

            updateRatingState(rating);

            setTimeout(() => {
                localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(rating));
                console.log(`Рейтинг ${rating} сохранен для синхронизации.`);
            }, 1000);
        });
    });


    let textSyncTimeout;
    feedbackText.addEventListener('input', () => {
        feedbackText.style.height = 'auto';
        feedbackText.style.height = `${feedbackText.scrollHeight}px`;

        updateRatingState(currentRating);

        clearTimeout(textSyncTimeout);

        textSyncTimeout = setTimeout(() => {
            localStorage.setItem(TEXT_STORAGE_KEY, feedbackText.value);
            console.log(`Текст отзыва сохранен для синхронизации.`);
        }, 2000);
    });

    window.addEventListener('storage', (event) => {

        if (event.key === RATING_STORAGE_KEY) {
            console.log('Получено событие синхронизации из другой вкладки!');

            if (event.newValue === null) {
                console.log('Рейтинг был сброшен в другой вкладке.');
                feedbackText.value = '';
                updateRatingState(0);
            } else {
                updateRatingState(JSON.parse(event.newValue));
            }
        }
        if (event.key === TEXT_STORAGE_KEY) {
            console.log('Получено событие синхронизации текста!');

            if (event.newValue === null) {
                feedbackText.value = '';
            }
            else {
                feedbackText.value = event.newValue;
                updateRatingState(currentRating);
            }
        }
        if (event.key === CLOSE_TABS_KEY) {
            if (event.newValue === 'Y') {
                console.log('Получен сигнал на закрытие вкладки!');
                window.close();
            }
        }
    });

    starsContainer.addEventListener('mouseleave', () => {
        setActiveState(currentRating);
    });

    feedbackForm.addEventListener('submit', (event) => {
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

    const savedRating = localStorage.getItem(RATING_STORAGE_KEY);
    const savedText = localStorage.getItem(TEXT_STORAGE_KEY);

    if (savedText) {
        feedbackText.value = savedText;
    }


    if (savedRating) {
        updateRatingState(JSON.parse(savedRating));
    }
    else {
        updateRatingState(0);
    }

    // ===========================================================
}