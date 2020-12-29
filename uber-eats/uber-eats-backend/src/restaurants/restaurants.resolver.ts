import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dto/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dto/category.dto';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish-dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dto/delete-dish.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dto/delete-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dto/edit-dish.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dto/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dto/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dto/restaurants.dto';
import {
  SearchRestaurantOutput,
  SearchRestaurantInput,
} from './dto/search-restaurant.dto';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './restaurants.service';

@Resolver(() => Restaurant)
export class RestuarantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Mutation(() => CreateRestaurantOutput)
  @Role([UserRole.Owner])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantsService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }

  @Mutation(() => EditRestaurantOutput)
  @Role([UserRole.Owner])
  async editRestaurant(
    @AuthUser() authUser: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantsService.editRestaurant(
      authUser,
      editRestaurantInput,
    );
  }

  @Mutation(() => DeleteRestaurantOutput)
  @Role([UserRole.Owner])
  async deleteRestaurant(
    @AuthUser() authUser: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantsService.deleteRestaurant(
      authUser,
      deleteRestaurantInput,
    );
  }

  @Query(() => RestaurantsOutput)
  async restaurants(
    @Args('input') restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantsService.allRestaurants(restaurantsInput);
  }

  @Query(() => RestaurantOutput)
  async restaurant(
    @Args('input') restaurantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.restaurantsService.findRestaurantById(restaurantInput);
  }

  @Query(() => SearchRestaurantOutput)
  async searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantsService.searchRestaurantByName(
      searchRestaurantInput,
    );
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @ResolveField(() => Int)
  async restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantsService.countRestaurants(category);
  }

  @Query(() => AllCategoriesOutput)
  async allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantsService.callCategoreis();
  }

  @Query(() => CategoryOutput)
  async category(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantsService.findCategoryBySlug(categoryInput);
  }
}

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Mutation(() => CreateDishOutput)
  @Role(['Owner'])
  async createDish(
    @AuthUser() owner: User,
    @Args('input') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.restaurantsService.createDish(owner, createDishInput);
  }

  @Mutation(() => EditDishOutput)
  @Role(['Owner'])
  async editDish(
    @AuthUser() owner: User,
    @Args('input') editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    return this.restaurantsService.editDish(owner, editDishInput);
  }

  @Mutation(() => DeleteDishOutput)
  @Role(['Owner'])
  async deleteDish(
    @AuthUser() owner: User,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.restaurantsService.deleteDish(owner, deleteDishInput);
  }
}
