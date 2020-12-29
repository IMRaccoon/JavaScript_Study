import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';
import { CategoryResolver, RestuarantsResolver } from './restaurants.resolver';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantRepository, CategoryRepository]),
  ],
  providers: [RestuarantsResolver, RestaurantsService, CategoryResolver],
})
export class RestaurantsModule {}
