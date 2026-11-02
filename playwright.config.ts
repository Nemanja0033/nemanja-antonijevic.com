import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

// End-to-end tests against a production build: routes, languages, SEO tags,
// accessibility and behavior in a real browser. Run with `npm run test:e2e`
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // One local production server serves every test; more workers only slow it down
  workers: 3,
  expect: { timeout: 10_000 },
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/sr`,
    timeout: 240_000,
    reuseExistingServer: false,
  },
});
