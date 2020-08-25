import {
  Column,
  CreatedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Shop, BrandProduct } from '.';

@Table
export default class Brand extends Model {
  @Column({ primaryKey: true, unique: true })
  userId: string;

  @Column
  password: string;

  @Column
  name: string;

  @Column
  refreshToken: string;

  @HasMany(() => Shop, { foreignKey: 'brandKey' })
  shops: Shop[];

  @HasMany(() => BrandProduct, { foreignKey: 'brandKey' })
  products: BrandProduct[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updateAt: Date;
}
