import { ApolloProvider } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import { render, RenderResult, waitFor } from '../../test-utils';
import { Login, LOGIN_MUTATION } from '../login';

describe('<Login />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;

  const formData = { email: 'test@test.com', password: 'test' };

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>,
      );
    });
  });

  it('should render OK', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Login | Uber Eats');
    });
  });

  it('displays email validation error', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    await waitFor(() => {
      userEvent.type(email, 'test@wont');
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);

    await waitFor(() => {
      userEvent.clear(email);
    });

    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });

  it('display password required error', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole('button');
    await waitFor(() => {
      userEvent.type(email, 'test@test.com');
      submitBtn.click();
    });

    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });

  it('submits form and call mutation failed', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;

    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');

    jest.spyOn(Storage.prototype, 'setItem');
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: { login: { ok: false, token: null, error: 'mutation error' } },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent('mutation error');
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it('submits form and calls mutation', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;

    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');

    jest.spyOn(Storage.prototype, 'setItem');
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: { login: { ok: true, token: 'token', error: null } },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });

    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: formData,
    });
  });
});
