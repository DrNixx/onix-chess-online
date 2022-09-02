/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    "node_modules/nanoid/.+\.(j|t)sx?$": "ts-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!nanoid/.*)"
  ],

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    }
  }
};