import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import PaymentFacadeInterface, { PaymentFacadeInputDto, PaymentFacadeOutputDto } from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
  private _processPaymentUseCase: UseCaseInterface

  constructor({ processPaymentUseCase }: { processPaymentUseCase: UseCaseInterface }) {
    this._processPaymentUseCase = processPaymentUseCase;
  }

  async processPayment(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    return await this._processPaymentUseCase.execute(input);
  }
}