const js = require("@eslint/js");
const nextConfig = require("eslint-config-next/core-web-vitals");
const jestPlugin = require("eslint-plugin-jest");
const prettierConfig = require("eslint-config-prettier");

// eslint-config-next bundles a Babel parser and eslint-plugin-react@7.x that
// are both incompatible with ESLint v9 flat config when used directly.
// We strip the custom parser (use espree with JSX enabled instead) and remove
// the react plugin so rules relying on removed legacy APIs don't fire.
function fixNextConfig(config) {
  const result = { ...config };

  if (result.languageOptions?.parser) {
    const { parser: _parser, ...rest } = result.languageOptions;
    result.languageOptions = rest;
  }

  if (result.plugins?.react) {
    const { react: _react, ...plugins } = result.plugins;
    result.plugins = plugins;

    if (result.rules) {
      result.rules = Object.fromEntries(
        Object.entries(result.rules).filter(
          ([key]) => !key.startsWith("react/"),
        ),
      );
    }
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
    },
  },
  jestPlugin.configs["flat/recommended"],
  prettierConfig,
];
