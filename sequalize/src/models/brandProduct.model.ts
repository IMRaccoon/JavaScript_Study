import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Brand } from '.';

@Table
export default class BrandProduct extends Model<BrandProduct> {
  @Column
  code: string;

  @Column
  memo: string;

  @ForeignKey(() => Brand)
  brandKey: string;
}
