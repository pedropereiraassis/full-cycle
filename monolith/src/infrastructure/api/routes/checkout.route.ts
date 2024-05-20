import express, { Request, Response } from 'express'
import CheckoutFacadeFactory from '../../../modules/checkout/factory/facade.factory'

export const checkoutRoute = express.Router()

checkoutRoute.post('/', async (req: Request, res: Response) => {
  const checkoutFacade = CheckoutFacadeFactory.create()

  try {
    const checkoutDTO = {
      clientId: req.body.clientId,
      products: req.body.products,
    }

    const output = await checkoutFacade.placeOrder(checkoutDTO)

    res.send(output)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})
