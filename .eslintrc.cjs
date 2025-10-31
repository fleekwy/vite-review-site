module.exports = {
    // Говорим ESlint, что это корневой файл конфигурации
    root: true,

    // Указываем парсер для TypeScript
    parser: '@typescript-eslint/parser',

    // Указываем плагины, которые мы будем использовать
    plugins: [
        '@typescript-eslint',
    ],

    // Расширяем (extends) базовые конфигурации. Порядок важен!
    extends: [
        // Базовый набор рекомендованных правил ESlint
        'eslint:recommended',

        // Рекомендованные правила для TypeScript
        'plugin:@typescript-eslint/recommended',

        // Включает интеграцию с Prettier.
        // ВАЖНО: Этот пункт должен быть ПОСЛЕДНИМ в массиве,
        // чтобы он мог правильно переопределить правила из других конфигураций.
        'plugin:prettier/recommended',
    ],

    // Здесь можно добавлять или переопределять свои собственные правила
    rules: {
        // Пример: можно отключить правило, если оно не нужно
        // '@typescript-eslint/no-explicit-any': 'off',
    },
};