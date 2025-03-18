const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/tests/apiTests/*.js",
    baseUrl: "https://sandbox.plaid.com", 
    reporter: "cypress-mochawesome-reporter",
    

    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on)
      
    },
  },
});
