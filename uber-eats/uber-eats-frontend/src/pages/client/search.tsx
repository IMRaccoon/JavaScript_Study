import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
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

interface IFormProps {
  searchTerm: string;
}

export const Search = () => {
  const location = useLocation();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [callQuery, { loading, data }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    setPage(1);
    callQuery({ variables: { input: { query: searchTerm, page } } });
  };
  const onPrevPageClick = () => setPage((current) => current - 1);
  const onNextPageClick = () => setPage((current) => current + 1);

  useEffect(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, query] = location.search.split("?term=");
      if (!query) {
        return history.replace("/");
      }
      callQuery({ variables: { input: { query, page } } });
    },
    // eslint-disable-next-line
    []
  );

  return (
    <div>
      <Helmet>
        <title>Search | Uber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-16 flex items-center justify-center"
      >
        <input
          ref={register({ required: true, min: 3 })}
          name="searchTerm"
          type="search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search Restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="grid md:grid-cols-3 gap-y-10 gap-x-5 mt-16">
            {data?.searchRestaurant.restaurants?.map(
              ({ id, name, coverImg, category }) => (
                <Restaurant
                  key={id}
                  id={String(id)}
                  name={name}
                  coverImg={coverImg}
                  categoryName={category?.name}
                />
              )
            )}
          </div>
          <div>
            <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
              {page > 1 ? (
                <button
                  className="font-medium text-2xl focus:outline-none"
                  onClick={onPrevPageClick}
                >
                  &larr;
                </button>
              ) : (
                <div></div>
              )}
              <span>
                Page {page} of {data?.searchRestaurant.totalPages}
              </span>
              {page !== data?.searchRestaurant.totalPages ? (
                <button
                  className="font-medium text-2xl focus:outline-none"
                  onClick={onNextPageClick}
                >
                  &rarr;
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
