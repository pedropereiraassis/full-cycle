import EventDispatcher from './event-dispatcher'
import SendEmailWhenProductIsCreatedHandler from '../../product/event/handler/send-email-when-product-is-created.handler'
import ProductCreatedEvent from '../../product/event/product-created.event'
import SendConsoleLogWhenCustomerIsCreated1Handler from '../../customer/event/handler/send-console-log-when-customer-is-created-1.handler'
import CustomerCreatedEvent from '../../customer/event/customer-created.event'
import SendConsoleLogWhenCustomerIsCreated2Handler from '../../customer/event/handler/send-console-log-when-customer-is-created-2.handler'
import SendConsoleLogWhenCustomerAddressIsChangedHandler from '../../customer/event/handler/send-console-log-when-customer-address-is-changed.handler'
import CustomerAddressChangedEvent from '../../customer/event/customer-address-changed.event'

describe('Domain events tests', () => {
  describe('Product events tests', () => {
    it('should register an event handler', () => {
      const eventDispatcher = new EventDispatcher()
      const eventHandler = new SendEmailWhenProductIsCreatedHandler()

      eventDispatcher.register('ProductCreatedEvent', eventHandler)

      expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined()
      expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(1)
      expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler)
    })

    it('should unregister an event handler', () => {
      const eventDispatcher = new EventDispatcher()
      const eventHandler = new SendEmailWhenProductIsCreatedHandler()

      eventDispatcher.register('ProductCreatedEvent', eventHandler)

      expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler)

      eventDispatcher.unregister('ProductCreatedEvent', eventHandler)

      expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined()
      expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(0)
    })

    it('should unregister all event handlers', () => {
      const eventDispatcher = new EventDispatcher()
      const eventHandler = new SendEmailWhenProductIsCreatedHandler()

      eventDispatcher.register('ProductCreatedEvent', eventHandler)

      expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler)

      eventDispatcher.unregisterAll()

      expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBe(undefined)
    })

    it('should notify all event handlers', () => {
      const eventDispatcher = new EventDispatcher()
      const eventHandler = new SendEmailWhenProductIsCreatedHandler()
      const spyEventHandler = jest.spyOn(eventHandler, 'handle')

      eventDispatcher.register('ProductCreatedEvent', eventHandler)

      expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler)

      const productCreatedEvent = new ProductCreatedEvent({
        name: 'Product 1',
        description: 'Product 1 Description',
        price: 10.0,
      })
      eventDispatcher.notify(productCreatedEvent)

      expect(spyEventHandler).toHaveBeenCalled()
    })
  })

  describe('Customer events tests', () => {
    it('should register an event handler', () => {
      const eventDispatcher = new EventDispatcher()
      const eventHandler = new SendConsoleLogWhenCustomerIsCreated1Handler()
      const eventHandler2 = new SendConsoleLogWhenCustomerIsCreated2Handler()

      eventDispatcher.register('CustomerCreatedEvent', eventHandler)
      eventDispatcher.register('CustomerCreatedEvent', eventHandler2)

      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toBeDefined()
      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].length).toBe(2)
      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler)
      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][1]).toMatchObject(eventHandler2)
    })

    it('should unregister an event handler', () => {
      const eventDispatcher = new EventDispatcher()
      const eventHandler = new SendConsoleLogWhenCustomerIsCreated1Handler()

      eventDispatcher.register('CustomerCreatedEvent', eventHandler)

      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler)

      eventDispatcher.unregister('CustomerCreatedEvent', eventHandler)

      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toBeDefined()
      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].length).toBe(0)
    })

    it('should unregister all event handlers', () => {
      const eventDispatcher = new EventDispatcher()
      const eventHandler = new SendConsoleLogWhenCustomerIsCreated1Handler()
      const eventHandler2 = new SendConsoleLogWhenCustomerIsCreated2Handler()

      eventDispatcher.register('CustomerCreatedEvent', eventHandler)
      eventDispatcher.register('CustomerCreatedEvent', eventHandler2)

      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler)
      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][1]).toMatchObject(eventHandler2)

      eventDispatcher.unregisterAll()

      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toBe(undefined)
    })

    it('should notify all event handlers', () => {
      const eventDispatcher = new EventDispatcher()
      const eventHandler = new SendConsoleLogWhenCustomerIsCreated1Handler()
      const eventHandler2 = new SendConsoleLogWhenCustomerIsCreated2Handler()
      const eventHandler3 = new SendConsoleLogWhenCustomerAddressIsChangedHandler()

      const spyEventHandler = jest.spyOn(eventHandler, 'handle')
      const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle')
      const spyEventHandler3 = jest.spyOn(eventHandler3, 'handle')

      eventDispatcher.register('CustomerCreatedEvent', eventHandler)
      eventDispatcher.register('CustomerCreatedEvent', eventHandler2)

      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][0]).toMatchObject(eventHandler)
      expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'][1]).toMatchObject(eventHandler2)

      const customerCreatedEvent = new CustomerCreatedEvent({
        name: 'Customer 1',
      })
      eventDispatcher.notify(customerCreatedEvent)

      expect(spyEventHandler).toHaveBeenCalled()
      expect(spyEventHandler2).toHaveBeenCalled()

      eventDispatcher.register('CustomerAddressChangedEvent', eventHandler3)
      expect(eventDispatcher.getEventHandlers['CustomerAddressChangedEvent'][0]).toMatchObject(eventHandler3)

      const customerAddressChangedEvent = new CustomerAddressChangedEvent({
        id: '1',
        name: 'Customer 1',
        address: 'Street 1, 78, Manaus, 456789-078'
      })
      eventDispatcher.notify(customerAddressChangedEvent)

      expect(spyEventHandler3).toHaveBeenCalled()
    })
  })
})