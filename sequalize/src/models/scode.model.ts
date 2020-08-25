import {
  Table,
  Model,
  Column,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Shop } from '.';

@Table
export default class Scode extends Model<Scode> {
  @Column({ primaryKey: true, autoIncrement: true, unique: true })
  kokonutId: number;

  @Column
  codeName: string;

  @Column({ defaultValue: 5 })
  decodeCounter: number;

  @ForeignKey(() => Shop)
  @Column
  order: number;

  @ForeignKey(() => Shop)
  @Column({ allowNull: true })
  forward: number;

  @Column({ defaultValue: '' })
  memo: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
