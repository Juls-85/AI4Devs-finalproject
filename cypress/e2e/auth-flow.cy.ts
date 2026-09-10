describe('Frapen Angels - Authentication Flow E2E', () => {
  const testUser = {
    firstName: `John_${Date.now()}`,
    lastName: `Doe_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'TestPassword123!',
    dni: '12345678A',
    phone: '123456789',
    address: 'Test Address 123',
    city: 'Test City',
    postalCode: '28001',
  };

  before(() => {
    cy.visit('/');
  });

  describe('Step 1: Navigate to Register Page', () => {
    it('should display home page with register button', () => {
      cy.contains('Bienvenido a Frapen Angels').should('be.visible');
      cy.contains('Registrarse').should('be.visible');
    });

    it('should navigate to register page when register button is clicked', () => {
      cy.get('a:contains("Registrarse")').first().click();
      cy.url().should('include', '/auth/register');
      cy.contains('Registrarse').should('be.visible');
      cy.contains('Crea tu cuenta de Frapen Angels').should('be.visible');
    });
  });

  describe('Step 2: Register New User', () => {
    it('should fill register form with valid data', () => {
      cy.get('input[name="firstName"]').type(testUser.firstName);
      cy.get('input[name="lastName"]').type(testUser.lastName);
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="dni"]').type(testUser.dni);
      cy.get('input[name="phone"]').type(testUser.phone);
      cy.get('input[name="address"]').type(testUser.address);
      cy.get('input[name="city"]').type(testUser.city);
      cy.get('input[name="postalCode"]').type(testUser.postalCode);
    });

    it('should submit register form', () => {
      cy.get('button:contains("Registrarse")').click();

      // Should redirect to home after successful registration
      cy.url().should('equal', 'http://localhost:5173/');
      cy.wait(1000);
    });

    it('should show user logged in on home page', () => {
      cy.visit('/');
      // Check if sidebar is visible (indicates user is logged in)
      cy.get('.home-sidebar').should('be.visible');
    });
  });

  describe('Step 3: Logout', () => {
    it('should logout user from home page', () => {
      cy.get('.btn-logout').click();
      cy.url().should('include', '/auth/login');
    });
  });

  describe('Step 4: Login with Registered User', () => {
    it('should navigate to login page', () => {
      cy.get('a:contains("Iniciar sesión")').first().click();
      cy.url().should('include', '/auth/login');
      cy.contains('Iniciar sesión').should('be.visible');
    });

    it('should fill login form with registered credentials', () => {
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
    });

    it('should submit login form', () => {
      cy.get('button:contains("Iniciar sesión")').click();

      // Should redirect to home after successful login
      cy.url().should('equal', 'http://localhost:5173/');
      cy.wait(1000);
    });

    it('should show logged in user info in sidebar', () => {
      cy.get('.home-sidebar').should('be.visible');
      cy.contains(testUser.firstName).should('be.visible');
      cy.contains(testUser.email).should('be.visible');
    });
  });

  describe('Step 5: Navigate to Profile', () => {
    it('should navigate to profile page from sidebar', () => {
      cy.get('a:contains("Mi Perfil")').click();
      cy.url().should('include', '/profile/');
      cy.contains('Mi Perfil').should('be.visible');
    });

    it('should display user information on profile page', () => {
      cy.contains(testUser.firstName).should('be.visible');
      cy.contains(testUser.lastName).should('be.visible');
      cy.contains(testUser.email).should('be.visible');
    });

    it('should display profile sections', () => {
      cy.contains('Información Personal').should('be.visible');
      cy.contains('Información de Contacto').should('be.visible');
    });
  });

  describe('Step 6: Logout from Profile', () => {
    it('should logout user from profile page', () => {
      cy.get('.btn-logout').click();
      cy.url().should('include', '/auth/login');
      cy.contains('Iniciar sesión').should('be.visible');
    });

    it('should display home page without sidebar when not logged in', () => {
      cy.visit('/');
      cy.get('.home-sidebar').should('not.exist');
      cy.contains('Iniciar sesión').should('be.visible');
    });
  });
});
