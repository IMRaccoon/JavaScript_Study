import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { EditProfileOutput } from 'src/users/dtos/edit-profile.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dto/delete-restaurant.dto';
import { EditRestaurantInput } from './dto/edit-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { FindRestaurantOutput } from './interfaces/find-restaurant.interface';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
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
}
