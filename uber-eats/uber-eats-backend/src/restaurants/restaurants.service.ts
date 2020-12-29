import { Injectable } from '@nestjs/common';
import { EditProfileOutput } from 'src/users/dtos/edit-profile.dto';
import { User } from 'src/users/entities/user.entity';
import { Raw } from 'typeorm';
import { AllCategoriesOutput } from './dto/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dto/category.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dto/delete-restaurant.dto';
import { EditRestaurantInput } from './dto/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dto/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dto/restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dto/search-restaurant.dto';
import { Category } from './entities/category.entity';
import { FindRestaurantOutput } from './interfaces/find-restaurant.interface';
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly restaurants: RestaurantRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.categories.getOrCreateCategory(
        createRestaurantInput.categoryName,
      );
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditProfileOutput> {
    try {
      const { ok, error } = await this.findRestaurant(
        editRestaurantInput.restaurantId,
        owner.id,
      );
      if (!ok) {
        return { ok, error };
      }

      let category: Category = null;
      if (!!editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreateCategory(
          editRestaurantInput.categoryName,
        );
      }

      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const { ok, error } = await this.findRestaurant(restaurantId, owner.id);
      if (!ok) {
        return { ok, error };
      }
      await this.restaurants.delete(restaurantId);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Could not delete' };
    }
  }

  async findRestaurant(
    restaurantId: number,
    ownerId: number,
  ): Promise<FindRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return { ok: false, error: 'Could not find Restaurant' };
      }

      if (restaurant.ownerId !== ownerId) {
        return { ok: false, error: 'Not Owned Restaurant' };
      }
      return { ok: true, restaurant };
    } catch (error) {
      return { ok: false, error: 'Database Error' };
    }
  }

  async callCategoreis(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return { ok: true, categories };
    } catch (error) {
      return { ok: false, error: 'Could not load categories' };
    }
  }

  async countRestaurants(category: Category): Promise<number> {
    return this.restaurants.count({ category });
  }

  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({ slug });
      if (!category) {
        return { ok: false, error: 'Category not found' };
      }
      const [
        restaurants,
        totalResults,
        totalPage,
      ] = await this.restaurants.findAndCountPages(page, { category });
      return {
        ok: true,
        category,
        restaurants,
        totalPage,
        totalResults,
      };
    } catch {
      return { ok: false, error: 'Could not load category' };
    }
  }

  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [
        results,
        totalResults,
        totalPage,
      ] = await this.restaurants.findAndCountPages(page);
      return {
        ok: true,
        totalPage,
        results,
        totalResults,
      };
    } catch {
      return { ok: false, error: 'Could not load restaurants' };
    }
  }

  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOneOrFail(restaurantId);
      return { ok: true, restaurant };
    } catch {
      return { ok: false, error: 'Could not find restaurant' };
    }
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [
        restaurants,
        totalResults,
        totalPage,
      ] = await this.restaurants.findAndCountPages(page, {
        name: Raw((name) => `${name} ILIKE '%${query}%'`),
      });
      return {
        ok: true,
        totalPage,
        totalResults,
        restaurants,
      };
    } catch {
      return { ok: false, error: 'Could not search for restaurants' };
    }
  }
}
