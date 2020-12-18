import { Table, Model, Column } from 'sequelize-typescript';

@Table
export default class Parcel extends Model<Parcel> {
  @Column({ primaryKey: true, unique: true, autoIncrement: true })
  code: number;

  @Column
  name: string;

  @Column
  memo: string;
}
