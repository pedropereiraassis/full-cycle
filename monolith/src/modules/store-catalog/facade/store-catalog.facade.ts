import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindAllProductsFacadeOutputDto, FindProductFacadeInputDto, FindProductFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findProductUseCase: UseCaseInterface
  findAllProductsUseCase: UseCaseInterface
}

export default class StoreCatalogFacade {
  private _findProductUseCase: UseCaseInterface;
  private _findAllProductsUseCase: UseCaseInterface;

  constructor({ findProductUseCase, findAllProductsUseCase }: UseCaseProps) {
    this._findProductUseCase = findProductUseCase;
    this._findAllProductsUseCase = findAllProductsUseCase;
  }

  async findProduct(input: FindProductFacadeInputDto): Promise<FindProductFacadeOutputDto> {
    return await this._findProductUseCase.execute(input);
  }

  async findAllProducts(): Promise<FindAllProductsFacadeOutputDto> {
    return await this._findAllProductsUseCase.execute();
  }
}