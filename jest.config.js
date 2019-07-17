module.exports = {
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
