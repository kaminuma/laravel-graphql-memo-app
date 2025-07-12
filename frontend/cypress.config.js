const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 20000,
    // セッション情報を保持するための設定
    chromeWebSecurity: false,
    // リトライ設定
    retries: {
      runMode: 1,
      openMode: 0
    },
    // 安定性向上のための設定
    watchForFileChanges: false,
    experimentalRunAllSpecs: false,
    // メモリ管理設定
    experimentalMemoryManagement: true,
    // ブラウザ設定
    chromeWebSecurity: false,
    // 追加の安定性設定
    experimentalModifyObstructiveThirdPartyCode: false,
    experimentalSourceRewriting: false,
  },
}) 