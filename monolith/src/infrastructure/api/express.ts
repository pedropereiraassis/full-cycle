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
import OrderModel from '../../modules/checkout/repository/order.model'
import ClientCheckoutModel from '../../modules/checkout/repository/client.model'
import ProductCheckoutModel from '../../modules/checkout/repository/product.model'
import OrderProductModel from '../../modules/checkout/repository/order-product.model'
import { checkoutRoute } from './routes/checkout.route'
import { invoiceRoute } from './routes/invoice.route'

export const app: Express = express()
app.use(express.json())
app.use('/clients', clientRoute)
app.use('/products', productRoute)
app.use('/checkout', checkoutRoute)
app.use('/invoice', invoiceRoute)

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
      OrderModel,
      ClientCheckoutModel,
      ProductCheckoutModel,
      OrderProductModel,
      ClientModel,
    ],
  })
}
setupDB()