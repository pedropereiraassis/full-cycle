import { DataType, Sequelize } from 'sequelize-typescript';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('orders_products', {
    orderId: {
      type: DataType.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    productId: {
      type: DataType.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('orders_products')
} 