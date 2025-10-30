const main_header: HTMLElement | null = document.querySelector(".main-header");

if (main_header) {

    let scrollTimeout: ReturnType<typeof setTimeout>;

    document.addEventListener('click', (event: MouseEvent): void => {
        if (event.target instanceof Element && !event.target.closest("button, textarea, a")) {
            main_header.classList.add('main-header-clicked');

            setTimeout(() => {
                main_header.classList.remove('main-header-clicked');
            }, 1000);
        }
    });

    window.addEventListener('scroll', (): void => {

        main_header.classList.add('main-header-scrolled');

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(function () {
            main_header.classList.remove('main-header-scrolled');
        }, 1000);
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.target instanceof Element && !event.target.closest("textarea")) {
            if (event.key === ' ') {
                main_header.classList.add('main-header-spaced');

                setTimeout(() => {
                    main_header.classList.remove('main-header-spaced');
                }, 1000);
            }
        }
    });
}