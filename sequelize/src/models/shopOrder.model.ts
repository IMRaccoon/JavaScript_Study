import {
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { Scode, Shop } from ".";

@Table({ paranoid: true })
export default class ScodeOrder extends Model<ScodeOrder> {
  @ForeignKey(() => Scode)
  @Column
  codeId: number;

  @Column
  codeName: string;

  @Column({ allowNull: false })
  userPhone: string;

  @ForeignKey(() => Shop)
  order: string;

  @ForeignKey(() => Shop)
  forward: string;

  @Column
  productCode: string;

  @Column
  productSize: string;

  @Column
  productColor: string;

  @Column({ defaultValue: 0 })
  orderType: number;

  @Column({ defaultValue: "" })
  parcel_name: string;

  @Column({ defaultValue: "" })
  parcel_number: string;

  @Column({ defaultValue: "" })
  marketPickup: string;

  @Column({ defaultValue: "" })
  orderStatus: string;

  @Column({ defaultValue: "" })
  parcel_cost: string;

  @Column({ defaultValue: false })
  productRelease: boolean;

  @Column({ defaultValue: "" })
  orderMemo: string;

  @Column({ defaultValue: "" })
  forwardMemo: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
