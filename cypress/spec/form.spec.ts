import { BASE_URL, defaultUser, newUser, UerProps, UserFieldValues } from 'cypress/store/formData';
import fetchUser from '../../src/services/userService/fetchUser';

describe('Form Interaction Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', `${BASE_URL}`, { body: defaultUser }).as('fetchUser');

    cy.intercept('PUT', `${BASE_URL}`, {
      statusCode: 200,
      body: {
        message: 'Success',
        user: newUser,
      },
    }).as('updateUser');

    cy.visit(Cypress.env('WEBSITE_URL'));
  });

  it('should load the form with right user data', () => {
    const { street, suite, city } = defaultUser.address;
    const address = `${street}, ${suite}, ${city}`;
    cy.get('input[name="name"]').should('have.value', defaultUser.name);
    cy.get('input[name="email"]').should('have.value', defaultUser.email);
    cy.get('textarea[name="address"]').should('have.value', address);
    cy.get('input[name="phone"]').should('have.value', defaultUser.phone);
  });

  const fillForm = (userData: UserFieldValues) => {
    cy.get('input[name="name"]').clear().type(userData.name).should('have.value', userData.name);
    cy.get('input[name="email"]').clear().type(userData.email).should('have.value', userData.email);
    cy.get('textarea[name="address"]')
      .clear()
      .type(userData.address)
      .should('have.value', userData.address);
    cy.get('input[name="phone"]').clear().type(userData.phone).should('have.value', userData.phone);
  };
  it('should allow editing fields', () => {
    fillForm(newUser);
  });

  // it('should submit the form successfully', () => {
  //   fillForm(newUser);

  //   cy.get('[data-testid="submit-button"]').click();

  //   cy.wait('@updateUser').its('request.body').should('deep.equal', newUser);

  //   cy.contains('Success.').should('be.visible');
  // });
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

  it('fetches the user data', async () => {
    const result = await fetchUser(1);

    expect(result).to.deep.equal(defaultUser);
  });
});
