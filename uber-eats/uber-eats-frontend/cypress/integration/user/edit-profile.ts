describe('Edit Profile', () => {
  const user = cy;

  beforeEach(() => {
    // @ts-ignore
    user.login();
  });

  it('can go to /edit-priofile using the header', () => {
    user.get('a[href="/edit-profile"]').click();
    user.title().should('eq', 'Edit Profile | Uber Eats');
  });

  it('can change email', () => {
    user.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body?.operationName === 'editProfile') {
        // @ts-ignore
        req.body?.variables?.input?.email = 'test1@test.com';
      }
    });
    user.visit('/edit-profile');
    user.findByPlaceholderText(/email/i).clear().type('newTest@test.com');
    user.findByRole('button').click();
  });
});
