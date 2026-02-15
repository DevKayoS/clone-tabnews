const dotenv = require("dotenv")

dotenv.config({
    path: '.env.development'
})

const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: ".",
})

const jestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/'],
    setupFilesAfterEnv: ['<rootDir>/jest.config.js'],
}

module.exports = createJestConfig(jestConfig)
