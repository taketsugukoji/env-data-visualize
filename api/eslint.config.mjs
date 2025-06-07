import js from '@eslint/js'
import * as tseslint from 'typescript-eslint'

export default tseslint.config({
    extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
    ],
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
        'no-console': 'warn',
        'semi': ['error', 'always'],
    },
});
