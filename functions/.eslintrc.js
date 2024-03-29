module.exports = {
  env: {
    browser: true,
    es6: true,
    "jest/globals": true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "google",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    ".eslintrc.js", // Ignore this file.
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import", "jest"],
  root: true,
  rules: {
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/prefer-for-of": "warn",
    "@typescript-eslint/triple-slash-reference": "error",
    "@typescript-eslint/unified-signatures": "warn",

    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",

    "comma-dangle": ["error", "always-multiline"],
    "constructor-super": "error",
    eqeqeq: ["warn", "always"],
    "import/no-unresolved": 0,
    indent: ["error", 2],
    "no-cond-assign": "error",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "error",
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-invalid-this": "error",
    "no-new-wrappers": "error",
    "no-redeclare": "error",
    "no-sequences": "error",
    "no-shadow": ["error", { hoist: "all" }],
    "no-throw-literal": "error",
    "no-unsafe-finally": "error",
    "no-unused-labels": "error",
    "no-var": "warn",
    "no-void": "error",
    "prefer-const": "warn",

    // Deprecated: https://eslint.org/blog/2018/11/jsdoc-end-of-life/
    "require-jsdoc": "off",
  },
};
