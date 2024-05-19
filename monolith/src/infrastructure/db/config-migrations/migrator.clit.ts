import { join } from "path";
import { Sequelize } from "sequelize-typescript";
import { migrator } from "./migrator";

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(__dirname, '../../../database.sqlite'),
  logging: true
})

migrator(sequelize).runAsCLI()