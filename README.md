"# Cypress Plaid API Automation" 

## Project Overview
This project automates API testing using Cypress for the Plaid API, covering:
- Token generation (`link_token`, `public_token`, `access_token`)
- Transaction retrieval
- Error handling tests

## How to Run the Tests
1. Install dependencies:
   ```sh
   npm install

2. Run Cypress tests:
   ```sh
   npx cypress run --spec "cypress/tests/apiTests/*.js" --browser <browser_name>

3. Run Cypress UI:
   ```sh
   npx cypress open

## Project Structure
```
cypress/
  ├── tests/apiTests/        # Test cases for Plaid API
  ├── fixtures/*.json        # Stores tokens & account IDs
  ├── reports/               # Stores Generated report in index.html format
  ├── cypress.config.js      # Cypress configuration
  ├── cypress.env.json       # API credentials (Ignored in Git)
```
