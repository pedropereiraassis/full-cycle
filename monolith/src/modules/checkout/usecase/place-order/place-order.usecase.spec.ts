import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface"
import Product from "../../domain/product.entity"
import CheckoutGateway from "../../gateway/checkout.gateway"
import { PlaceOrderInputDto } from "./place-order.dto"
import PlaceOrderUseCase from "./place-order.usecase"

const mockDate = new Date(2024, 1, 1)

describe('PlaceOrderUsecase test', () => {
  describe('validateProducts method', () => {
    const mockClientFacade = {
      findClient: jest.fn(),
      addClient: jest.fn(),
    }
    // @ts-expect-error - params not match for test purpose
    const placeOrderUsecase = new PlaceOrderUseCase(mockClientFacade)

    it('should throw an error if no products are selected', async () => {
      const input: PlaceOrderInputDto = {
        clientId: '0',
        products: []
      }

      await expect(placeOrderUsecase['validateProducts'](input))
        .rejects.toThrow(new Error('No products selected'))
    })

    it('should throw an error when product is out of stock', async () => {
      const mockProductFacade = {
        checkStock: jest.fn().mockImplementation(async ({ productId }: { productId: string }) => {
          return {
            productId,
            stock: productId === '1' ? 0 : 1
          }
        }),
      }

      // @ts-expect-error - force set productFacade
      placeOrderUsecase['_productFacade'] = mockProductFacade

      let input: PlaceOrderInputDto = {
        clientId: '0',
        products: [
          { productId: '1' }
        ]
      }

      await expect(placeOrderUsecase['validateProducts'](input))
        .rejects.toThrow(new Error('Product 1 is not available in stock'))

      input = {
        clientId: '0',
        products: [
          { productId: '0' },
          { productId: '1' }
        ]
      }

      await expect(placeOrderUsecase['validateProducts'](input))
        .rejects.toThrow(new Error('Product 1 is not available in stock'))
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)

      input = {
        clientId: '0',
        products: [
          { productId: '0' },
          { productId: '1' },
          { productId: '2' },
        ]
      }

      await expect(placeOrderUsecase['validateProducts'](input))
        .rejects.toThrow(new Error('Product 1 is not available in stock'))
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5)
    })
  })

  describe('getProduct method', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(mockDate)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    // @ts-expect-error - no params in constructor
    const placeOrderUsecase = new PlaceOrderUseCase()

    it('should throw an error when product not found', async () => {
      const mockCatalogFacade = {
        findProduct: jest.fn().mockResolvedValue(null),
        addProduct: jest.fn(),
      }

      // @ts-expect-error - force set catalogFacade
      placeOrderUsecase['_catalogFacade'] = mockCatalogFacade

      await expect(placeOrderUsecase['getProduct']('0'))
        .rejects.toThrow(new Error('Product not found'))
    })

    it('should return a product', async () => {
      const mockCatalogFacade = {
        findProduct: jest.fn().mockResolvedValue({
          id: '0',
          name: 'Product',
          description: 'Description',
          salesPrice: 10,
        }),
        addProduct: jest.fn(),
      }

      // @ts-expect-error - force set catalogFacade
      placeOrderUsecase['_catalogFacade'] = mockCatalogFacade

      const product = await placeOrderUsecase['getProduct']('0')

      expect(product).toEqual(new Product({
        id: new Id('0'),
        name: 'Product',
        description: 'Description',
        salesPrice: 10,
      }))
      expect(mockCatalogFacade.findProduct).toHaveBeenCalledTimes(1)
    })
  })

  describe('execute method', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(mockDate)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should throw an error when client not found', async () => {
      const mockClientFacade = {
        findClient: jest.fn().mockResolvedValue(null),
        addClient: jest.fn(),
      }
      // @ts-expect-error - params not match for test purpose
      const placeOrderUsecase = new PlaceOrderUseCase(mockClientFacade)

      const input: PlaceOrderInputDto = {
        clientId: '0',
        products: []
      }

      await expect(placeOrderUsecase.execute(input))
        .rejects.toThrow(new Error('Client not found'))
    })

    it('should throw an error when products are not valid', async () => {
      const mockClientFacade = {
        findClient: jest.fn().mockResolvedValue({}),
        addClient: jest.fn(),
      }
      // @ts-expect-error - params not match for test purpose
      const placeOrderUsecase = new PlaceOrderUseCase(mockClientFacade)

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUsecase, 'validateProducts')
        // @ts-expect-error - not return never
        .mockRejectedValue(new Error('No products selected'))

      const input: PlaceOrderInputDto = {
        clientId: '1',
        products: []
      }

      await expect(placeOrderUsecase.execute(input))
        .rejects.toThrow(new Error('No products selected'))
      expect(mockValidateProducts).toHaveBeenCalledTimes(1)
    })

    describe('place an order', () => {
      const clientProps = {
        id: '1',
        name: 'Client',
        document: '00000',
        email: 'client@email.com',
        street: 'Street',
        number: '123',
        complement: 'Complement',
        city: 'City',
        state: 'State',
        zipCode: '00000000',
      }

      const mockClientFacade = {
        findClient: jest.fn().mockResolvedValue(clientProps),
        addClient: jest.fn(),
      }

      const mockPaymentFacade = {
        processPayment: jest.fn(),
      }

      const mockCheckoutRepository: CheckoutGateway = {
        addOrder: jest.fn(),
        findOrder: jest.fn(),
      }

      const mockInvoiceFacade: InvoiceFacadeInterface = {
        generateInvoice: jest.fn().mockResolvedValue({ id: '1' }),
        findInvoice: jest.fn(),
      }

      const placeOrderUsecase = new PlaceOrderUseCase(
        mockClientFacade,
        null,
        null,
        mockCheckoutRepository,
        mockInvoiceFacade,
        mockPaymentFacade,
      )

      const products = {
        '1': new Product({
          id: new Id('1'),
          name: 'Product 1',
          description: 'Description 1',
          salesPrice: 10,
        }),
        '2': new Product({
          id: new Id('2'),
          name: 'Product 2',
          description: 'Description 2',
          salesPrice: 20,
        }),
      }

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUsecase, 'validateProducts')
        // @ts-expect-error - not return never
        .mockResolvedValue(null)

      const mockGetProduct = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUsecase, 'getProduct')
        // @ts-expect-error - not return never
        .mockImplementation((productId: keyof typeof products) => products[productId])

      it('should not be approved', async () => {
        mockPaymentFacade.processPayment.mockResolvedValue({
          transactionId: '1',
          orderId: '1',
          amount: 100,
          status: 'error',
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        const input: PlaceOrderInputDto = {
          clientId: '1',
          products: [
            { productId: '1' },
            { productId: '2' },
          ]
        }

        let output = await placeOrderUsecase.execute(input)

        expect(output.invoiceId).toBeNull()
        expect(output.total).toBe(30)
        expect(output.products).toStrictEqual([
          { productId: '1' },
          { productId: '2' },
        ])
        expect(mockClientFacade.findClient).toHaveBeenCalledTimes(1)
        expect(mockClientFacade.findClient).toHaveBeenCalledWith({ id: '1' })
        expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        expect(mockValidateProducts).toHaveBeenCalledWith(input)
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.processPayment).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.processPayment).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        })
        expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledTimes(0)
      })

      it('should be approved', async () => {
        mockPaymentFacade.processPayment.mockResolvedValue({
          transactionId: '1',
          orderId: '1',
          amount: 100,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        const input: PlaceOrderInputDto = {
          clientId: '1',
          products: [
            { productId: '1' },
            { productId: '2' },
          ]
        }

        let output = await placeOrderUsecase.execute(input)

        expect(output.invoiceId).toBe('1')
        expect(output.total).toBe(30)
        expect(output.products).toStrictEqual([
          { productId: '1' },
          { productId: '2' },
        ])
        expect(mockClientFacade.findClient).toHaveBeenCalledTimes(1)
        expect(mockClientFacade.findClient).toHaveBeenCalledWith({ id: '1' })
        expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        expect(mockValidateProducts).toHaveBeenCalledWith(input)
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.processPayment).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.processPayment).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        })
        expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledTimes(1)
        expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledWith({
          name: clientProps.name,
          document: clientProps.document,
          street: clientProps.street,
          number: clientProps.number,
          complement: clientProps.complement,
          city: clientProps.city,
          state: clientProps.state,
          zipCode: clientProps.zipCode,
          items: [
            {
              id: products['1'].id.id,
              name: products['1'].name,
              price: products['1'].salesPrice,
            },
            {
              id: products['2'].id.id,
              name: products['2'].name,
              price: products['2'].salesPrice,
            },
          ]
        })
      })
    })
  })
})