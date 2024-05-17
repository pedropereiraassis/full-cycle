import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import Transaction from "../domain/transaction.entity";
import TransactionRepository from "./transaction.repository";
import Id from "../../@shared/domain/value-object/id.value-object";

describe('TransactionRepository test', () => {
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

  it('should save a transaction', async () => {
    const transaction = new Transaction({
      id: new Id('1'),
      amount: 100,
      orderId: '1',
    });

    transaction.approve()

    const repository = new TransactionRepository()
    await repository.save(transaction)

    const result = await TransactionModel.findOne({ where: { id: transaction.id.id } })

    expect(result.dataValues.id).toEqual(transaction.id.id)
    expect(result.dataValues.orderId).toEqual(transaction.orderId)
    expect(result.dataValues.amount).toEqual(transaction.amount)
    expect(result.dataValues.status).toEqual('approved')
    expect(result.dataValues.createdAt).toStrictEqual(transaction.createdAt)
    expect(result.dataValues.updatedAt).toStrictEqual(transaction.updatedAt)
  })
})