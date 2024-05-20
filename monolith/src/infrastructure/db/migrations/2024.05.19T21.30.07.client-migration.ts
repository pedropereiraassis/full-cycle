import { DataType, Sequelize } from 'sequelize-typescript';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('clients', {
    id: {
      type: DataType.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    document: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    street: {
      type: DataType.STRING(255),
      allowNull: true,
    },
    number: {
      type: DataType.STRING(255),
      allowNull: true,
    },
    complement: {
      type: DataType.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataType.STRING(255),
      allowNull: true,
    },
    state: {
      type: DataType.STRING(255),
      allowNull: true,
    },
    zipCode: {
      type: DataType.STRING(255),
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
  await sequelize.getQueryInterface().dropTable('clients')
} 