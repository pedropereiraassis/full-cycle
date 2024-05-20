import { DataType, Sequelize } from 'sequelize-typescript';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('transactions', {
    id: {
      type: DataType.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    orderId: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    amount: {
      type: DataType.NUMBER,
      allowNull: false,
    },
    status: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataType.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: true,
    },
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('transactions')
} 