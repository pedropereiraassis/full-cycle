import { DataType, Sequelize } from 'sequelize-typescript';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('invoices', {
    id: {
      type: DataType.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    document: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataType.JSON,
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
  await sequelize.getQueryInterface().dropTable('invoices')
} 