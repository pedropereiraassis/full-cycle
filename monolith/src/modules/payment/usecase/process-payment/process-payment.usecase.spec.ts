import Id from "../../../@shared/domain/value-object/id.value-object"
import Transaction from "../../domain/transaction.entity"
import ProcessPaymentUseCase from "./process-payment.usecase"

describe('ProcessPaymentUsecase test', () => {
  it('should process payment', async () => {
    const transaction = new Transaction({
      id: new Id('1'),
      amount: 100,
      orderId: '1',
      status: 'approved',
    })
  
    const MockRepository = () => {
      return {
        save: jest.fn().mockResolvedValue(transaction)
      }
    }

    const repository = MockRepository()
    const usecase = new ProcessPaymentUseCase(repository)

    const input = {
      orderId: '1',
      amount: 100,
    }

    const result = await usecase.execute(input)

    expect(repository.save).toHaveBeenCalled()
    expect(result.transactionId).toBe(transaction.id.id)
    expect(result.orderId).toBe(input.orderId)
    expect(result.amount).toBe(input.amount)
    expect(result.status).toBe('approved')
    expect(result.createdAt).toStrictEqual(transaction.createdAt)
    expect(result.updatedAt).toStrictEqual(transaction.updatedAt)
  })

  it('should decline a transaction', async () => {
    const transaction = new Transaction({
      id: new Id('2'),
      amount: 50,
      orderId: '1',
      status: 'declined',
    })
  
    const MockRepository = () => {
      return {
        save: jest.fn().mockResolvedValue(transaction)
      }
    }

    const repository = MockRepository()
    const usecase = new ProcessPaymentUseCase(repository)

    const input = {
      orderId: '1',
      amount: 50,
    }

    const result = await usecase.execute(input)

    expect(repository.save).toHaveBeenCalled()
    expect(result.transactionId).toBe(transaction.id.id)
    expect(result.orderId).toBe(input.orderId)
    expect(result.amount).toBe(input.amount)
    expect(result.status).toBe('declined')
    expect(result.createdAt).toStrictEqual(transaction.createdAt)
    expect(result.updatedAt).toStrictEqual(transaction.updatedAt)
  })
})