import { Restaurant } from '../entities/restaurant.entity';

export interface FindRestaurantOutput {
  ok: boolean;
  error?: string;
  restaurant?: Restaurant;
}
