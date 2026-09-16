const dotenv = require("dotenv");

dotenv.config({
  path: ".env.development",
  quiet: true,
});

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: ".",
});

const jestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  setupFilesAfterEnv: ["<rootDir>/jest.config.js"],
  testTimeout: 60000,
};

const asyncJestConfig = createJestConfig(jestConfig);

module.exports = async () => {
  const config = await asyncJestConfig();

  config.transformIgnorePatterns = config.transformIgnorePatterns.map(
    (pattern) =>
      pattern.includes("/node_modules/(?!.pnpm)")
        ? pattern.replace("(?!.pnpm)", "(?!.pnpm)(?!node-pg-migrate/)")
        : pattern,
  );

  return config;
};
