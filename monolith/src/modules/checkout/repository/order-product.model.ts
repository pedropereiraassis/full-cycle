import { Table, Column, Model, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import OrderModel from './order.model';
import ProductModel from './product.model';

@Table({
  tableName: 'orders_products',
  timestamps: false,
})
export default class OrderProductModel extends Model {
  @ForeignKey(() => OrderModel)
  @PrimaryKey
  @Column({ allowNull: false })
  declare orderId: string;

  @ForeignKey(() => ProductModel)
  @PrimaryKey
  @Column({ allowNull: false })
  declare productId: string;
}