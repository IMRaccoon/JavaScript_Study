import { render } from '@testing-library/react';
import React from 'react';
import { RestaurantItem } from '../restaurant-item';
import { BrowserRouter as Router } from 'react-router-dom';

describe('<RestaurantItem />', () => {
  const restaurantProps = {
    id: '1',
    name: 'nameTest',
    categoryName: 'categoryNameTest',
    coverImg: 'coverImgTest',
  };

  it('renders OK with props', () => {
    const { getByText, container } = render(
      <Router>
        <RestaurantItem {...restaurantProps} />
      </Router>,
    );

    getByText(restaurantProps.name);
    getByText(restaurantProps.categoryName);
    expect(container.firstChild).toHaveAttribute(
      'href',
      '/restaurant/' + restaurantProps.id,
    );
  });
});
