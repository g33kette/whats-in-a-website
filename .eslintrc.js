// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    amd: true,
  },
  extends: [
    'eslint:recommended',
    'google'
  ],
  // add your custom rules here
  rules: {
    // "spaced-comment": ["error"],
    // "object-curly-spacing": ["error", "always"],
    "max-len": ["warn", { "code": 120 }],
    "linebreak-style": ["off"],
    "no-unused-vars": ["warn", { "args": "none", varsIgnorePattern: "self" }],
    "no-console": ["off"],
  },
};
