import express, { Request, Response } from 'express'
import InvoiceFacadeFactory from '../../../modules/invoice/factory/facade.factory'

export const invoiceRoute = express.Router()

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
  const invoiceFacade = InvoiceFacadeFactory.create()

  try {
    const invoiceDTO = {
      id: req.params.id,
    }

    const output = await invoiceFacade.findInvoice(invoiceDTO)

    res.send(output)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})
