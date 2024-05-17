import InvoiceFacade from "../facade/invoice.facade";
import InvoiceFacadeInterface from "../facade/invoice.facade.interface";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUsecase from "../usecase/find-invoice/find-invoice.usecase";
import GenereateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
  static create(): InvoiceFacadeInterface {
    const invoiceRepository = new InvoiceRepository()
    const generateInvoiceUseCase = new GenereateInvoiceUsecase(invoiceRepository)
    const findInvoiceUseCase = new FindInvoiceUsecase(invoiceRepository)

    const invoiceFacade = new InvoiceFacade({
      generateInvoiceUseCase: generateInvoiceUseCase,
      findInvoiceUseCase: findInvoiceUseCase,
    })

    return invoiceFacade
  }
}