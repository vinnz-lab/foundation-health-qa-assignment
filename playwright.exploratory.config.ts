import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';

export default defineConfig(base, {
  testDir: './tests/exploratory',
  testIgnore: [],
  retries: 0,
  outputDir: 'exploratory-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'exploratory-report', open: 'never' }],
    ['json', { outputFile: 'exploratory-results/results.json' }],
  ],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
