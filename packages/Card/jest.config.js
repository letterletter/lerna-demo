module.exports = {
  "extensionsToTreatAsEsm": [".jsx"],
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  "transform": {
    "^.+\\.(js|jsx|mjs)$": ['babel-jest', { rootMode: "upward" }],
    '^.+\\.(css|less)$': './cssTransformer.js',
  },

  "transformIgnorePatterns": [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$',
  ],
  "testEnvironment": "jsdom"
}