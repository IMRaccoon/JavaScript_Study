import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { getConnection, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from 'src/users/entities/verification.entity';

const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
  email: 'test1@test.com',
  password: 'test',
  token: null,
};

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

describe('User Module (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let verificationsRepository: Repository<Verification>;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string) =>
    baseTest().set('x-jwt', testUser.token).send({ query });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    usersRepository = module.get(getRepositoryToken(User));
    verificationsRepository = module.get(getRepositoryToken(Verification));
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    it('should create account', () => {
      return publicTest(`
      mutation {
        createAccount(input: {
          email: "${testUser.email}",
          password: "${testUser.password}",
          role: Owner
        }) {
          ok
          error
        }
      }
      `)
        .expect(200)
        .expect(({ body: { data } }) =>
          expect(data.createAccount).toEqual({
            ok: true,
            error: null,
          }),
        );
    });

    it('should fail if account already exists', () => {
      return publicTest(`
          mutation {
            createAccount(input: {
              email: "${testUser.email}",
              password: "${testUser.password}",
              role: Owner
            }) {
              ok
              error
            }
          }
          `)
        .expect(200)
        .expect(({ body: { data } }) =>
          expect(data.createAccount).toEqual({
            ok: false,
            error: 'There is a user with that email already',
          }),
        );
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return publicTest(`
        mutation {
          login(input: {
            email: "${testUser.email}"
            password: "${testUser.password}"
          }) {
            token
            ok
            error
          }
        }
        `)
        .expect(200)
        .expect(({ body: { data } }) => {
          expect(data.login).toEqual({
            ok: true,
            error: null,
            token: expect.any(String),
          });
          testUser.token = data.login.token;
        });
    });

    it('should not be able to login with wrong id', () => {
      return publicTest(`
      mutation {
        login(input: {
          email: "wrongEmail"
          password: "${testUser.password}"
        }) {
          token
          ok
          error
        }
      }
      `)
        .expect(200)
        .expect(({ body: { data } }) => {
          expect(data.login).toEqual({
            ok: false,
            error: 'User not found',
            token: null,
          });
        });
    });

    it('should not be able to login with wrong password', () => {
      return publicTest(`
        mutation {
          login(input: {
            email: "${testUser.email}"
            password: "wrongPassword"
          }) {
            token
            ok
            error
          }
        }
        `)
        .expect(200)
        .expect(({ body: { data } }) => {
          expect(data.login).toEqual({
            ok: false,
            error: 'Wrong Password',
            token: null,
          });
        });
    });
  });

  describe('userProfile', () => {
    let userId: number = null;

    beforeAll(async () => {
      const [{ id }] = await usersRepository.find();
      userId = id;
    });

    it("should see a user's profile", () => {
      return privateTest(`
          {
            userProfile(userId: ${userId}) {
              ok
              error
              user {
                id
              }
            }
          }
        `)
        .expect(200)
        .expect(({ body: { data } }) => {
          const {
            userProfile: {
              ok,
              error,
              user: { id },
            },
          } = data;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        });
    });

    it('should not find a profile', () => {
      return privateTest(`
          {
            userProfile(userId: 999) {
              ok
              error
              user {
                id
              }
            }
          }
        `)
        .expect(200)
        .expect(({ body: { data } }) => {
          const {
            userProfile: { ok, error, user },
          } = data;
          expect(ok).toBe(false);
          expect(error).toBe('User Not Found');
          expect(user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should find my profile', () => {
      return privateTest(`
        {
          me {
            email
          }
        }
        `)
        .expect(200)
        .expect(({ body: { data } }) =>
          expect(data.me.email).toBe(testUser.email),
        );
    });

    it('should now allow logged out user', () => {
      return publicTest(`
      {
        me {
          email
        }
      }
      `)
        .expect(200)
        .expect(({ body: { errors } }) =>
          expect(errors[0].message).toBe('Forbidden resource'),
        );
    });
  });

  describe('editProfile', () => {
    const NEW_EMAIL = 'test2@test.com';
    it('should change email', () => {
      return privateTest(`
          mutation {
            editProfile(input: { email: "${NEW_EMAIL}" }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect(({ body: { data } }) =>
          expect(data.editProfile).toEqual({ ok: true, error: null }),
        );
    });

    it('should have new email', () => {
      return privateTest(`
        {
          me {
            email
          }
        }
        `)
        .expect(200)
        .expect(({ body: { data } }) => expect(data.me.email).toBe(NEW_EMAIL));
    });
  });

  describe('verifyEmail', () => {
    let verificationCode: string = null;
    beforeAll(async () => {
      const [{ code }] = await verificationsRepository.find();
      verificationCode = code;
    });

    it('should verify email', () => {
      return publicTest(`
        mutation {
          verifyEmail(input: { code: "${verificationCode}" }) {
            error
            ok
          }
        }
        `)
        .expect(200)
        .expect(({ body: { data } }) =>
          expect(data.verifyEmail).toEqual({ ok: true, error: null }),
        );
    });

    it('should fail on wrong verification code', () => {
      return publicTest(`
        mutation {
          verifyEmail(input: { code: "${verificationCode}" }) {
            error
            ok
          }
        }
        `)
        .expect(200)
        .expect(({ body: { data } }) =>
          expect(data.verifyEmail).toEqual({
            ok: false,
            error: 'Verification Not Found',
          }),
        );
    });
  });
});
