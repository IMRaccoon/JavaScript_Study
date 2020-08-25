import {
  Column,
  CreatedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Brand, ShopOrder } from '.';

@Table
export default class Shop extends Model<Shop> {
  @Column({ primaryKey: true, unique: true })
  userId: string;

  @Column
  password: string;

  @Column
  name: string;

  @ForeignKey(() => Brand)
  @Column
  brandKey: string;

  @BelongsTo(() => Brand, 'brandKey')
  brands: Brand;

  @HasMany(() => ShopOrder, 'order')
  orders: ShopOrder[];

  @HasMany(() => ShopOrder, 'forward')
  forwards: ShopOrder[];

  @Column({ allowNull: true })
  kokonutId: string;

  // * JSON.stringify
  @Column({ allowNull: true })
  preferParcelCode: string;

  @Column({ allowNull: true })
  refreshToken: string;

  @Column({ defaultValue: 1 })
  permission: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updateAt: Date;
}
