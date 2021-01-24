import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Restaurant } from "../../components/restaurant";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, { variables: { input: { page } } });
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          type="search"
          className="input rounded-md border-0 w-3/12"
          placeholder="Search Restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="flex justify-around max-w-5xl mx-auto">
            {data?.allCategories.categories?.map((category, index) => (
              <div className="flex flex-col group items-center cursor-pointer">
                <div
                  className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                />
                <span className="mt-1 text-sm text-center font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-y-10 gap-x-5 mt-16">
            {data?.restaurants.results?.map(
              ({ id, name, coverImg, category }) => (
                <Restaurant
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
                Page {page} of {data?.restaurants.totalPages}
              </span>
              {page !== data?.restaurants.totalPages ? (
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
