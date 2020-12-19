import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurants.resolver';

@Module({
  providers: [RestaurantService],
})
export class RestaurantsModule {}
