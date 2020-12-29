import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';
import {
  CategoryResolver,
  DishResolver,
  RestuarantsResolver,
} from './restaurants.resolver';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantRepository, CategoryRepository, Dish]),
  ],
  providers: [
    RestuarantsResolver,
    RestaurantsService,
    CategoryResolver,
    DishResolver,
  ],
})
export class RestaurantsModule {}
