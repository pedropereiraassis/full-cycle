import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
  generateInvoiceUseCase: UseCaseInterface
  findInvoiceUseCase: UseCaseInterface
}

export default class InvoiceFacade implements ClientAdmFacadeInterface {
  private _generateInvoiceUseCase: UseCaseInterface;
  private _findInvoiceUseCase: UseCaseInterface;

  constructor({ generateInvoiceUseCase, findInvoiceUseCase }: UseCaseProps) {
    this._generateInvoiceUseCase = generateInvoiceUseCase;
    this._findInvoiceUseCase = findInvoiceUseCase;
  }

  async generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return await this._generateInvoiceUseCase.execute(input);
  }

  async findInvoice(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
    return await this._findInvoiceUseCase.execute(input);
  }
}