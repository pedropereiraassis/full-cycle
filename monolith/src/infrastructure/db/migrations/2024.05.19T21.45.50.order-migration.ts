import { DataType, Sequelize } from 'sequelize-typescript';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('orders', {
    id: {
      type: DataType.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    clientId: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataType.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataType.DATE,
      allowNull: true,
    },
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('orders')
} 