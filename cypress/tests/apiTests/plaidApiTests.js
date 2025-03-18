describe('Plaid API Tests', () => {
  //Performance- All test executions are completed within 0.6 seconds

  // To save public token and write it to reuse
  it('Should retrieve and save a public token', () => {
    cy.request({
      method: 'POST',
      url: '/sandbox/public_token/create',
      body: {
        client_id: Cypress.env('PLAID_CLIENT_ID'),
        secret: Cypress.env('PLAID_SECRET'),
        institution_id: 'ins_20',
        initial_products: ['transactions']
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.writeFile('cypress/fixtures/publicToken.json', { public_token: response.body.public_token });
    });
  });

  // To save access token using public token and write it to reuse
  it('Should retrieve and save an access token', () => {
    cy.readFile('cypress/fixtures/publicToken.json').then((data) => {
      cy.request({
        method: 'POST',
        url: '/item/public_token/exchange',
        body: {
          client_id: Cypress.env('PLAID_CLIENT_ID'),
          secret: Cypress.env('PLAID_SECRET'),
          public_token: data.public_token
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.writeFile('cypress/fixtures/accessToken.json', { access_token: response.body.access_token });

        // Security test - To ensure access_token is not exposed in response headers
        expect(response.headers).to.not.have.property('access_token');
      });
    });
  });


  // To fetch transactions until they are ready and validate the same
  it('Should use stored access token for transaction API', () => {
    cy.readFile('cypress/fixtures/accessToken.json').then((data) => {

      cy.request({
        method: 'POST',
        url: '/transactions/get',
        failOnStatusCode: false, // need to prevent Cypress from failing immediately
        body: {
          client_id: Cypress.env('PLAID_CLIENT_ID'),
          secret: Cypress.env('PLAID_SECRET'),
          access_token: data.access_token,
          start_date: "2024-01-01",
          end_date: "2024-03-01"
        }
      }).then((response) => {
        if (response.status === 200) {
          //To validate total number of transactions is greater than zero
          expect(response.body.total_transactions).to.be.greaterThan(0);

          //To validate transactions array is not empty
          expect(response.body.transactions).to.be.an('array').that.is.not.empty;

        } else if (response.body.error_code === "PRODUCT_NOT_READY") {
          cy.wait(2000); // Wait 2 seconds to get product ready
        } else {
          throw new Error(`Failed to fetch transactions after multiple attempts: ${response.body.error_message}`);
        }
      });
    });
  });

  // Error handling with invalid data and validate the same
  it('Should return error for invalid account number', () => {
    cy.request({
      method: 'POST',
      url: '/accounts/get',
      failOnStatusCode: false,
      body: {
        client_id: Cypress.env('PLAID_CLIENT_ID'),
        secret: Cypress.env('PLAID_SECRET'),
        access_token: "invalid-token"
      }
    }).then((response) => {
      // Invalid response 
      expect(response.status).to.eq(400);

      // Validate error message
      expect(response.body.error_code).to.eq('INVALID_ACCESS_TOKEN');
    });
  });

});
