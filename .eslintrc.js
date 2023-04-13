module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      files: ["tests/**/*.js"],
      rules: {
        "node/no-unpublished-require": "off",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
  root: true,
};
