import express, { Request, Response } from 'express'
import PlaceOrderUseCase from '../../../modules/checkout/usecase/place-order/place-order.usecase'
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/facade.factory'
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory'
import StoreCatalogFacadeFactory from '../../../modules/store-catalog/factory/facade.factory'
import InvoiceFacadeFactory from '../../../modules/invoice/factory/facade.factory'
import PaymentFacadeFactory from '../../../modules/payment/factory/facade.factory'

export const checkoutRoute = express.Router()

checkoutRoute.post('/', async (req: Request, res: Response) => {
  const clientFacade = ClientAdmFacadeFactory.create()
  const productFacade = ProductAdmFacadeFactory.create()
  const catalogFacade = StoreCatalogFacadeFactory.create()
  const checkoutRepository = new CheckoutRepository()
  const invoiceFacade = InvoiceFacadeFactory.create()
  const paymentFacade = PaymentFacadeFactory.create()

  const placeOrderUseCase = new PlaceOrderUseCase(
    clientFacade,
    productFacade,
    catalogFacade,
    checkoutRepository,
    invoiceFacade,
    paymentFacade,
  )

  try {
    const checkoutDTO = {
      clientId: req.body.clientId,
      products: req.body.products,
    }

    const output = await placeOrderUseCase.execute(checkoutDTO)
    res.send(output)
  } catch (err) {
    res.status(500).send(err)
  }
})
