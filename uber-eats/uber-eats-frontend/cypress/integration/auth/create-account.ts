describe('Create Account', () => {
  const user = cy;
  it('should see email / password validation errors', () => {
    user.visit('/');
    user.findByText(/create an account/i).click();
    user.findByPlaceholderText(/email/i).type('invalid@test');
    user.findByRole('alert').should('have.text', 'Please enter a valid email');

    user.findByPlaceholderText(/email/i).clear();
    user.findByRole('alert').should('have.text', 'Email is required');

    user.findByPlaceholderText(/email/i).type('test@test.com');
    user
      .findByPlaceholderText(/password/i)
      .type('test')
      .clear();
    user.findByRole(/alert/i).should('have.text', 'Password is required');
  });

  it('should be able to create account', () => {
    user.intercept('http://localhost:4000/graphql', (req) => {
      const { operationName } = req.body;

      if (operationName && operationName === 'createAccountMutation') {
        req.reply((res) =>
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: 'CreateAccountOutput',
              },
            },
          }),
        );
      }
    });

    user.visit('/create-account');
    user.findByPlaceholderText(/email/i).type('test1@test.com');
    user.findByPlaceholderText(/password/i).type('test');
    user.findByRole('button').click();
    user.wait(1000);
    user.title().should('eq', 'Login | Uber Eats');

    // @ts-ignore
    user.login('test1@test.com', 'test');
    // @ts-ignore
    user.assertLoggedIn();
  });
});
