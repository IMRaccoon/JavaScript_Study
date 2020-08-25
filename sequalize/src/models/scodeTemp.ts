import {
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Shop } from '.';

// TODO : 실제로 삭제되는 것이 아니기 때문에 삭제 작업을 해주어야 한다.
@Table({ paranoid: true })
export default class ScodeTemp extends Model<ScodeTemp> {
  @Column({ primaryKey: true, unique: true })
  barcode: string;

  @Column({ allowNull: false })
  code_name: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  phone: string;

  @Column({ defaultValue: '' })
  address1: string;

  @Column({ defaultValue: '' })
  address2: string;

  @ForeignKey(() => Shop)
  @Column({ allowNull: false })
  shopId: string;

  @CreatedAt
  createdAt: Date;

  @DeletedAt
  deletedAt: Date;
}
