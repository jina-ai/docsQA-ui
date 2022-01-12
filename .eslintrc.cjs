/* eslint-disable */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', '@open-wc'],
    rules: {
        'arrow-spacing': 'off',
        'arrow-parens': ['error', 'always'],
        'class-methods-use-this': 'off',
        'consistent-return': 'off',
        'dot-notation': 'warn',
        'indent': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/order': 'warn',
        'padded-blocks': 'off',
        'no-undef': 'warn',
        'semi': 'off',
        'semi-style': ['error', 'last'],
        'no-useless-catch': 'off',
        'prefer-rest-params': 'off',
        'prefer-template': 'warn',
        'prefer-destructuring': 'off',
        'no-await-in-loop': 'off',
        'no-useless-escape': 'warn',
        'no-prototype-builtins': 'off',
        'no-extra-boolean-cast': 'off',
        'no-param-reassign': ['warn', { props: false }],
        'no-restricted-globals': 'off',
        'no-return-assign': ['warn', 'except-parens'],
        'no-plusplus': 'off',
        'no-redeclare': 'off',
        'no-nested-ternary': 'off',
        'no-useless-return': 'off',
        'no-continue': 'off',
        'no-labels': 'off',
        'operator-linebreak': ['warn', 'after'],
        'object-curly-newline': ['warn', { consistent: true }],
        'no-useless-constructor': 'off',
        'no-multiple-empty-lines': 'off',
        'max-len': [
            'warn',
            {
                code: 120,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
        'max-classes-per-file': 'off',
        'quotes': 'off',
        'quote-props': 'warn',
        'no-constant-condition': [
            'error',
            { checkLoops: false }
        ],
        'lines-between-class-members': 'off',
        'comma-dangle': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-redeclare': 'error',
        '@typescript-eslint/no-magic-numbers': [
            'warn',
            {
                ignore: [-1, 0, 0.1, 0.2, 0.3, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 32, 64, 128, 256, 512, 1024, 100, 1000, 60, 300, 1800, 3600],
                ignoreArrayIndexes: true,
                ignoreDefaultValues: true,
                ignoreNumericLiteralTypes: true,
                ignoreReadonlyClassProperties: true,
                ignoreEnums: true,
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                'ignoreRestSiblings': true,
                'varsIgnorePattern': '^_',
                'caughtErrorsIgnorePattern': '^_',
                'argsIgnorePattern': '^_',
                'args': 'after-used'
            },
        ],
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/quotes': ['error', 'single', {
            avoidEscape: true,
            allowTemplateLiterals: true,
        }],
        '@typescript-eslint/no-empty-interface': 'off'
    },
    env: {
        node: true,
        jest: true,
    },
    overrides: [
        {
            files: ['*.ts'],
            rules: {
                'no-undef': 'off',
            },
        },
        {
            files: ['*.ts', '*.tsx'], // Your TypeScript files extension
            parserOptions: {
                project: ['./tsconfig.json'], // Specify it only for TypeScript files
            },
        },
        {
            files: ['test/**/*'],
            rules: {
                '@typescript-eslint/no-magic-numbers': 'off'
            }
        }
    ],
    ignorePatterns: ["dist/**/*"],
};
