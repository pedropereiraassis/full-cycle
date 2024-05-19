import { DataType, Sequelize } from 'sequelize-typescript';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('products', {
    id: {
      type: DataType.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    stock: {
      type: DataType.NUMBER,
      allowNull: true,
    },
    purchasePrice: {
      type: DataType.NUMBER,
      allowNull: true,
    },
    salePrice: {
      type: DataType.NUMBER,
      allowNull: true,
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
  await sequelize.getQueryInterface().dropTable('products')
} 