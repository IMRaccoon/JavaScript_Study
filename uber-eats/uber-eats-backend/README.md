# Uber Eats

The Backend of Uber Eats Clone

## User Entity:

- id
- createdAt
- updatedAt
- email
- password
- role(client | owner | delivery)

## User Resolver:

- Create Account
- Log In
- See Profile
- Edit Profile
- Verify Email

## Restuarant Entity:

- name
- category
- address
- coverImage

## Restuarant Resolver:

- Create Restaurant
- Edit Restaurant
- Delete Restaurant

* See Categories
* See Restaurants by Category (pagination)
* See Restaurants (pagination)
* See Restaurant
* Search Restaurant

- Create Dish
- Edit Dish
- Delete Dish

* Orders CRUD
* Orders Subscription (Owner, Customer, Delivery) (s: subscribe, t: trigger):
  - Pending Orders (s: newOrder) (t: createOrder(newOrder))
  - Pending Pickup Order (Delivery) (s: orderUpdate) (t: editOrder(orderUpdate))
  - Order Status (Customer, Delivery, Owner) (s: orderUpdate) (t: editOrder(orderUpdate))
* Add Driver to Order

- Payments CRUD
