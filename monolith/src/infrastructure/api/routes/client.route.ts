import express, { Request, Response } from 'express'
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/facade.factory'

export const clientRoute = express.Router()

clientRoute.post('/', async (req: Request, res: Response) => {
  const cliendAdmFacade = ClientAdmFacadeFactory.create()

  try {
    const clientDTO = {
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
    }

    const output = await cliendAdmFacade.addClient(clientDTO)
    res.send(output)
  } catch (err) {
    res.status(500).send(err)
  }
})
