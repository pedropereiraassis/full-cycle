import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import InvoiceItemModel from "./invoice-item.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare document: string;

  @Column({ allowNull: false, type: DataType.JSON })
  declare address: Address;

  @HasMany(() => InvoiceItemModel)
  declare items: InvoiceItem[];

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
