import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ProductAdmFacadeInterface, { AddProductFacadeInputDto, CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "./product-adm.facade.interface";

export interface UseCaseProps {
  addUseCase: UseCaseInterface
  checkStockUseCase: UseCaseInterface
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUseCase: UseCaseInterface;
  private _checkStockUseCase: UseCaseInterface;

  constructor({ addUseCase, checkStockUseCase }: UseCaseProps) {
    this._addUseCase = addUseCase;
    this._checkStockUseCase = checkStockUseCase;
  }

  async addProduct(input: AddProductFacadeInputDto): Promise<void> {
    return await this._addUseCase.execute(input);
  }

  async checkStock(input: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto> {
    return await this._checkStockUseCase.execute(input);
  }
}