module.exports = {
    // это корневой файл конфигурации
    root: true,

    // парсер для TypeScript
    parser: '@typescript-eslint/parser',

    plugins: ['@typescript-eslint'],

    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
};
