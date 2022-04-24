module.exports = {
  "extensionsToTreatAsEsm": [".js"],
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  "transform": { "\\.js$": ['babel-jest', { rootMode: "upward" }] }
}