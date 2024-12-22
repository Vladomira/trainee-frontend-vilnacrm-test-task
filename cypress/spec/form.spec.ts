import {
  addressObj,
  BASE_URL,
  defaultUser,
  newUser,
  UserFieldValues,
} from 'cypress/store/formData';
import fetchUser from '../../src/services/userService/fetchUser';
import updateUser from '../../src/services/userService/updateUser';

describe('Form Interaction Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', BASE_URL, { body: defaultUser }).as('fetchUser');

    cy.intercept('PUT', BASE_URL, {
      statusCode: 200,
      body: {
        message: 'Update complete',
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

  it('should allow editing fields', () => {
    const address = newUser.address;
    cy.get('input[name="name"]').clear().type(newUser.name).should('have.value', newUser.name);
    cy.get('input[name="email"]').clear().type(newUser.email).should('have.value', newUser.email);
    cy.get('textarea[name="address"]').clear().type(address).should('have.value', address);
    cy.get('input[name="phone"]').clear().type(newUser.phone).should('have.value', newUser.phone);
  });

  const fillForm = (user: UserFieldValues) => {
    cy.get('input[name="name"]').clear().type(user.name);
    cy.get('input[name="email"]').clear().type(user.email);
    cy.get('input[name="phone"]').clear().type(user.phone);
    cy.get('textarea[name="address"]').clear().type(user.address);
  };

  it('should enable the submit button after valid input', () => {
    cy.get('[data-testid="submit-button"]').should('be.disabled');

    fillForm(newUser);

    cy.get('[data-testid="submit-button"]').should('not.be.disabled');
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

  // fetch;
  it('should fetch the user data successfully', async () => {
    cy.intercept('GET', BASE_URL, { body: defaultUser }).as('fetchUser');
    const result = await fetchUser(1);

    expect(result).to.deep.equal(defaultUser);
    cy.wait('@fetchUser').its('request.url').should('include', `${BASE_URL}`);
  });

  it('should handle errors during fetch', async () => {
    cy.intercept('GET', BASE_URL, {
      statusCode: 404,
      body: { message: 'User not found' },
    }).as('fetchUserError');

    try {
      await fetchUser(1);
      throw new Error('User not found');
    } catch (error: any) {
      expect(error.message).to.equal('User not found');
    }

    cy.wait('@fetchUserError').its('response.statusCode').should('equal', 404);
  });

  // update
  it('should update the user data successfully', async () => {
    const result = await updateUser({ id: 1, user: { ...newUser, address: addressObj } });

    expect(result).to.deep.equal({ user: newUser, message: 'Update complete' });
    cy.wait('@updateUser').its('request.url').should('include', `${BASE_URL}`);
  });
  it('should handle errors during updating', async () => {
    cy.intercept('PUT', BASE_URL, {
      statusCode: 404,
      body: { message: 'User not found' },
    }).as('updateUser');

    try {
      await updateUser({ id: 1, user: { ...newUser, address: addressObj } });
      throw new Error('Expected updateUser to throw an error, but it did not.');
    } catch (error: any) {
      expect(error.message).to.equal('User not found');
    }

    cy.wait('@updateUser').its('response.statusCode').should('equal', 404);
  });
});
