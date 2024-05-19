import { BelongsTo, BelongsToMany, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Client from "../domain/client.entity";
import ClientModel from "./client.model";
import Product from "../domain/product.entity";
import ProductModel from "./product.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare status: string;

  @ForeignKey(() => ClientModel)
  @Column
  declare clientId: string;

  @BelongsTo(() => ClientModel)
  declare client: Client;

  @BelongsToMany(() => ProductModel, {
    through: "orders_products",
    foreignKey: "orderId",
    otherKey: "productId",
  })
  declare products: Product[];

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
