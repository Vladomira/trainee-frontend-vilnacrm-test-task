import { BASE_URL, defaultUser, newUser, UerProps } from 'cypress/store/formData';


describe('Form Interaction Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', `${BASE_URL}`, { body: defaultUser }).as('fetchUser');

    cy.intercept('PUT', `${BASE_URL}`, {
      statusCode: 200,
      body: {
        message: 'Success',
        name: newUser.name,
      },
    }).as('updateUser');

    cy.visit(Cypress.env('WEBSITE_URL'));
  });

  it('should load the form with fetched user data', () => {
    const userAddress = `${defaultUser.address.street}, ${defaultUser.address.suite}, ${defaultUser.address.city}`;

    cy.wait('@fetchUser');

    cy.get('input[name="name"]').should('have.value', defaultUser.name);
    cy.get('input[name="email"]').should('have.value', defaultUser.email);
    cy.get('textarea[name="address"]').should('have.value', userAddress);
    cy.get('input[name="phone"]').should('have.value', defaultUser.phone);
  });

  const fillForm = (userData: UerProps) => {
    const { street, suite, city } = userData.address;
    const address = `${street}, ${suite}, ${city}`;

    cy.get('input[name="name"]').clear().type(userData.name).should('have.value', userData.name);
    cy.get('input[name="email"]').clear().type(userData.email).should('have.value', userData.email);
    cy.get('textarea[name="address"]').clear().type(address).should('have.value', address);
    cy.get('input[name="phone"]').clear().type(userData.phone).should('have.value', userData.phone);
  };
  it('should allow editing fields', () => {
    fillForm(newUser);
  });

  it('should submit the form successfully', () => {
    fillForm(newUser);

    cy.get('[data-testid="save-button"]').click();

    cy.wait('@updateUser')
      .its('request.body')
      .should('deep.equal', newUser);

    cy.contains('Success.').should('be.visible');
  });

  it('should show an error for invalid input fields', () => {
    cy.get('input[name="name"]').clear().blur();
    cy.contains('Please type your name').should('be.visible');

    cy.get('input[name="email"]').clear().type('invalid-email').blur();
    cy.contains('Invalid email format').should('be.visible');

    cy.get('input[name="phone"]').clear().type('1234567890').blur();
    cy.contains('Wrong phone format').should('be.visible');

    cy.get('input[name="phone"]').clear().type('phone').blur();
    cy.contains('Please type numbers').should('be.visible');
  });

  it('should not show an error for valid inputs on blur', () => {
    cy.get('input[name="name"]').clear().type('Linda White').blur();
    cy.contains('Please type your name').should('not.exist');

    cy.get('input[name="email"]').clear().type('example@gmail.com').blur();
    cy.contains('Invalid email format').should('not.exist');

    cy.get('input[name="phone"]').clear().type('123-456-7890').blur();
    cy.contains('Wrong phone format').should('not.exist');
  });
});
