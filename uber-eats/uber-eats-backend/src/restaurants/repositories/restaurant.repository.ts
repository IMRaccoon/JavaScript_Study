import {
  EntityRepository,
  FindConditions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  private readonly pageIndex: number = 25;

  async findAndCountPages(
    page: number,
    where?:
      | string
      | ObjectLiteral
      | FindConditions<Restaurant>
      | FindConditions<Restaurant>[],
  ): Promise<[Restaurant[], number, number]> {
    try {
      const [restuarants, totalResults] = await this.findAndCount({
        ...(where && { where }),
        skip: (page - 1) * this.pageIndex,
        take: this.pageIndex,
      });

      return [
        restuarants,
        totalResults,
        Math.ceil(totalResults / this.pageIndex),
      ];
    } catch (error) {
      throw error;
    }
  }
}
