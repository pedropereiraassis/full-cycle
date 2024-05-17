import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import PaymentFacadeFactory from "../factory/facade.factory";

describe('PaymentFacade test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [TransactionModel],
      sync: { force: true },
    });

    await sequelize.sync();
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it('should process a payment', async () => {
    const facade = PaymentFacadeFactory.create()

    const input = {
      orderId: '1',
      amount: 100,
    }

    const result = await facade.processPayment(input)

    expect(result.transactionId).toBeDefined()
    expect(result.orderId).toEqual(input.orderId)
    expect(result.amount).toEqual(input.amount)
    expect(result.status).toEqual('approved')
  })
})