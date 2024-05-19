import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript'
import { clientRoute } from './routes/client.route'
import { productRoute } from './routes/product.route'
import ClientModel from '../../modules/client-adm/repository/client.model'
import InvoiceItemModel from '../../modules/invoice/repository/invoice-item.model'
import InvoiceModel from '../../modules/invoice/repository/invoice.model'
import TransactionModel from '../../modules/payment/repository/transaction.model'
import ProductAdmModel from '../../modules/product-adm/repository/product.model'
import ProductCatalogModel from '../../modules/store-catalog/repository/product.model'

export const app: Express = express()
app.use(express.json())
app.use('/clients', clientRoute)
app.use('/products', productRoute)

export let sequelize: Sequelize

async function setupDB() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    models: [
      ClientModel,
      InvoiceItemModel,
      InvoiceModel,
      TransactionModel,
      ProductAdmModel,
      ProductCatalogModel,
    ],
  })

  await sequelize.sync()
}
setupDB()