const config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.json'}],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testMatch: ['**/__tests__/**/*.(spec|test).(ts|tsx)'],
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts']
};

export default config;
