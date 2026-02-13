const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

const jestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/'],
    setupFilesAfterEnv: ['<rootDir>/jest.confi.js'],
}

module.exports = createJestConfig(jestConfig)
