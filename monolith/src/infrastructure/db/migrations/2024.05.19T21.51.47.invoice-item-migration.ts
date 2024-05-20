import { DataType, Sequelize } from 'sequelize-typescript';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('invoice_items', {
    id: {
      type: DataType.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataType.NUMBER,
      allowNull: false,
    },
    invoiceId: {
      type: DataType.STRING(255),
      allowNull: false,
    },
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('invoice_items')
} 