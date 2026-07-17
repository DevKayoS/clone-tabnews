const js = require("@eslint/js");
const nextConfig = require("eslint-config-next/core-web-vitals");
const jestPlugin = require("eslint-plugin-jest");
const prettierConfig = require("eslint-config-prettier");

// eslint-config-next bundles a Babel parser and some eslint-plugin-react@7.x
// rules that are incompatible with ESLint v9 flat config when used directly.
// We strip the custom parser (use espree with JSX enabled instead) and disable
// the react/* rules that rely on removed legacy APIs, keeping the plugin
// registered so safe rules like react/jsx-uses-vars can be enabled below.
function fixNextConfig(config) {
  const result = { ...config };

  if (result.languageOptions?.parser) {
    const { parser: _parser, ...rest } = result.languageOptions;
    result.languageOptions = rest;
  }

  if (result.plugins?.react && result.rules) {
    result.rules = Object.fromEntries(
      Object.entries(result.rules).filter(([key]) => !key.startsWith("react/")),
    );
  }

  return result;
}

module.exports = [
  js.configs.recommended,
  ...nextConfig.map(fixNextConfig),
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
      // Marca componentes usados em JSX como "usados" para o no-unused-vars
      "react/jsx-uses-vars": "error",
    },
  },
  jestPlugin.configs["flat/recommended"],
  prettierConfig,
];
