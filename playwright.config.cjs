// Playwright tests are an independent QA layer; this config does not alter Vercel.
const { defineConfig } = require('@playwright/test');
module.exports=defineConfig({
  testDir:'./qa',
  testMatch:['**/illyrian-v17.spec.cjs','**/illyrian-v17-flows.spec.cjs','**/illyrian-v17-lab.spec.cjs'],
  timeout:30000,
  expect:{timeout:10000},
  workers:1,
  retries:0,
  reporter:[['list'],['html',{open:'never',outputFolder:'qa-results/report'}]],
  use:{
    baseURL:'http://127.0.0.1:4173',
    browserName:'chromium',
    headless:true,
    trace:'retain-on-failure',
    screenshot:'only-on-failure'
  },
  outputDir:'qa-results/artifacts',
  webServer:{
    command:'python3 -m http.server 4173 --bind 127.0.0.1 --directory demo',
    url:'http://127.0.0.1:4173/ILLYRIAN_DEMO_v1.7.html',
    reuseExistingServer:!process.env.CI,
    timeout:20000
  }
});
