import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { RestaurantItem } from "../../components/restaurant-item";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from "../../__generated__/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

interface IFormProps {
  searchTerm: string;
}

export const Category = () => {
  const { slug } = useParams<ICategoryParams>();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    { variables: { input: { page, slug } } }
  );

  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };
  const onPrevPageClick = () => setPage((current) => current - 1);
  const onNextPageClick = () => setPage((current) => current + 1);

  return (
    <div>
      <Helmet>
        <title>Category | Uber Eats</title>
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
            {data?.category.restaurants?.map(
              ({ id, name, coverImg, category }) => (
                <RestaurantItem
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
                Page {page} of {data?.category.totalPages}
              </span>
              {page !== data?.category.totalPages ? (
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
