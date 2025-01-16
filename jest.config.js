const config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testMatch: ['**/__tests__/**/*.(spec|test).(ts|tsx)'],
    setupFilesAfterEnv: ['./setupTests.ts']
};

export default config;
