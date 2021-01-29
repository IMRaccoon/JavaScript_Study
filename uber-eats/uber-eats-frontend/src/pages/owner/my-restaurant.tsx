import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaurants } from "../../__generated__/myRestaurants";

const MY_RESTAUTANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAUTANTS_QUERY);

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Uber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h2 className="text-4xl font-medium ub-10">My Restaurants</h2>
        {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 && (
          <>
            <h4 className="text-xl mb-5">You have no restaurants</h4>
            <Link className="link" to="/add-restaurant">
              Create one &rarr;
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
