// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('assertLoggedIn', () => {
  cy.window().its('localStorage.uber-token').should('be.a', 'string');
});

Cypress.Commands.add('assertLoggedOut', () => {
  cy.window().its('localStorage.uber-token').should('be.undefined');
});

Cypress.Commands.add('login', () => {
  cy.visit('/');
  // @ts-ignore
  cy.assertLoggedOut();
  cy.title().should('eq', 'Login | Uber Eats');
  cy.findByPlaceholderText(/email/i).type('test1@test.com');
  cy.findByPlaceholderText(/password/i).type('test');
  cy.findByRole('button')
    .should('not.have.class', 'pointer-events-none')
    .click();
});
