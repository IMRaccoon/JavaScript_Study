import { gql, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { loading, data }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  useEffect(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, query] = location.search.split("?term=");
      if (!query) {
        return history.replace("/");
      }
      callQuery({ variables: { input: { query, page: 1 } } });
    },
    // eslint-disable-next-line
    []
  );

  return (
    <h1>
      <Helmet>
        <title>Search | Uber Eats</title>
      </Helmet>
      Search Page
    </h1>
  );
};
