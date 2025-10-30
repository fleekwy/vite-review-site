const main_header = document.querySelector(".main-header");

if (main_header) {

    let scrollTimeout;

    document.addEventListener('click', (event) => {
        if (!event.target.closest("button, textarea, a")) {
            main_header.classList.add('main-header-clicked');

            setTimeout(() => {
                main_header.classList.remove('main-header-clicked');
            }, 1000);
        }
    });

    window.addEventListener('scroll', () => {

        main_header.classList.add('main-header-scrolled');

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(function () {
            main_header.classList.remove('main-header-scrolled');
        }, 1000);
    });

    document.addEventListener('keydown', (event) => {
        if (!event.target.closest("textarea")) {
            if (event.key === ' ') {
                main_header.classList.add('main-header-spaced');

                setTimeout(() => {
                    main_header.classList.remove('main-header-spaced');
                }, 1000);
            }
        }
    });
}