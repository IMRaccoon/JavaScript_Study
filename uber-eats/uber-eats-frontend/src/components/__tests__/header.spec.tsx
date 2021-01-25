import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { ME_QUERY } from '../../hooks/useMe';
import { MockedProvider } from '@apollo/client/testing';
import { Header } from '../header';
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Header />', () => {
  const mockGenerate = (verified: boolean) => [
    {
      request: { query: ME_QUERY },
      result: {
        data: { me: { id: 1, email: '', role: '', verified } },
      },
    },
  ];

  it('renders verify banner', async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider mocks={mockGenerate(false)}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText('Please verify your email.');
    });
  });

  it('renders without verify banner', async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider mocks={mockGenerate(true)}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(queryByText('Please verify your email.')).toBeNull();
    });
  });
});
