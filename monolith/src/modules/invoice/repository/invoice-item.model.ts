import { Column, ForeignKey, Model, PrimaryKey, Table, BelongsTo } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import Invoice from "../domain/invoice.entity";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})
export default class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare price: number;

  @ForeignKey(() => InvoiceModel)
  @Column
  declare invoiceId: string;

  @BelongsTo(() => InvoiceModel)
  declare invoice: Invoice;
}