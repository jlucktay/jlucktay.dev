// This config includes TypeScript-specific settings.
// If you're not using TypeScript, you should remove the `transform` property.
module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/lib/", "<rootDir>/node_modules/"],
  transform: { "^.+\\.tsx?$": "ts-jest" },
};
