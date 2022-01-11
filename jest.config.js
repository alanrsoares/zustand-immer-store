module.exports = {
  preset: "vite-jest",
  testMatch: [
    "<rootDir>/src/**/*.{spec,test}.{ts,tsx}",
  ],
  testEnvironment: "jsdom",
};
