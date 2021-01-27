describe('Login', () => {
  const user = cy;
  it('should see login page', () => {
    user.visit('/').title().should('eq', 'Login | Uber Eats');
  });

  it('can see email / password validation error', () => {
    user.visit('/');
    user.findByPlaceholderText(/email/i).type('valid@email');
    user.findByRole(/alert/i).should('have.text', 'Please enter a valid email');
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole(/alert/i).should('have.text', 'Email is required');
    user.findByPlaceholderText(/email/i).type('test@test.com');
    user
      .findByPlaceholderText(/password/i)
      .type('test')
      .clear();
    user.findByRole(/alert/i).should('have.text', 'Password is required');
  });

  it('can fill out the form and log in', () => {
    // @ts-ignore
    user.login();
  });
});
