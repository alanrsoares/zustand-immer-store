module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es2021': true,
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    'prettier'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
  ],
  'rules': {
  },
};
