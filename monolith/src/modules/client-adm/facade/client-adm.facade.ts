import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, { AddClientFacadeInputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";

export interface UseCaseProps {
  addClientUseCase: UseCaseInterface
  findClientUseCase: UseCaseInterface
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _addUseCase: UseCaseInterface;
  private _findClientUseCase: UseCaseInterface;

  constructor({ addClientUseCase, findClientUseCase }: UseCaseProps) {
    this._addUseCase = addClientUseCase;
    this._findClientUseCase = findClientUseCase;
  }

  async addClient(input: AddClientFacadeInputDto): Promise<void> {
    return await this._addUseCase.execute(input);
  }

  async findClient(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
    return await this._findClientUseCase.execute(input);
  }
}