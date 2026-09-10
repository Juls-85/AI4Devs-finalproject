Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button:contains("Iniciar sesión")').click();
  cy.wait(1000);
});

Cypress.Commands.add('logout', () => {
  cy.get('.btn-logout').click();
  cy.wait(500);
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
    }
  }
}

export {};
