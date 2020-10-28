module.exports = {
    rootDir: "../../",
    preset: 'jest-puppeteer',
    clearMocks: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.ts"],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "types\\.ts",
        "index\\.ts",
        ".+\\.d\\.ts"
    ],
    globals: {
        "ts-jest": {
            tsConfig: "<rootDir>/test/tsconfig.test.json"
        }
    },
    testPathIgnorePatterns: ["/node_modules/", "/fixtures/", "/utils/"],
    moduleFileExtensions: ["ts", "tsx", "js"],
    setupFilesAfterEnv: ["<rootDir>/test/config/jest.setup.ts"],
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
};
