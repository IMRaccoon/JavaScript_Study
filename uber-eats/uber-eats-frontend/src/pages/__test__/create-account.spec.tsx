import { ApolloProvider } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import { render, RenderResult, waitFor } from '../../test-utils';
import { UserRole } from '../../__generated__/globalTypes';
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from '../create-account';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
  const realModuel = jest.requireActual('react-router-dom');
  return {
    ...realModuel,
    useHistory: () => ({
      push: mockPush,
    }),
  };
});

describe('<CreateAccount />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>,
      );
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render OK', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Create Account | Uber Eats');
    });
  });

  it('renders validation errors', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText('Email');
    const button = getByRole('button');

    await waitFor(() => {
      userEvent.type(email, 'not@work');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('Please enter a valid email');

    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('Email is required');

    await waitFor(() => {
      userEvent.type(email, 'test@test.com');
      userEvent.click(button);
    });

    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('Password is required');
  });

  it('submit mutation with form values error', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText('Email');
    const password = getByPlaceholderText('Password');
    const button = getByRole('button');
    const formData = {
      email: 'test@test.com',
      password: 'test',
      role: UserRole.Client,
    };

    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: { createAccount: { ok: false, error: 'mutation error' } },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse,
    );
    jest.spyOn(window, 'alert').mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });
    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('mutation error');
  });

  it('submits mutation with form values', async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText('Email');
    const password = getByPlaceholderText('Password');
    const button = getByRole('button');
    const formData = {
      email: 'test@test.com',
      password: 'test',
      role: UserRole.Client,
    };

    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: { createAccount: { ok: true, error: null } },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse,
    );
    jest.spyOn(window, 'alert').mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });

    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: formData,
    });
    expect(window.alert).toHaveBeenCalledWith('Account Created! Log in now!');
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
