describe('Library platform', () => {
  it('loads the login page', () => {
    cy.visit('/auth/login');
    cy.contains('Sign in');
    cy.injectAxe();
    cy.checkA11y(undefined, {
      rules: {
        // Bootstrap modal backdrop can be flagged when not open; login page should be clean.
        'color-contrast': { enabled: true },
      },
    });
  });

  it('navigates between auth screens', () => {
    cy.visit('/auth/login');
    cy.contains('a', 'Create an account').click();
    cy.url().should('include', '/auth/register');
    cy.contains('Create account');
  });
});
