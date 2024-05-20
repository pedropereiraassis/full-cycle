import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
  id: Id;
  name: string;
  description: string;
  salesPrice: number;
  purchasePrice?: number;
};

export default class Product extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _description: string;
  private _salesPrice: number;
  private _purchasePrice: number

  constructor(props: ProductProps) {
    super(props.id);
    this._name = props.name;
    this._description = props.description;
    this._salesPrice = props.salesPrice;
    this._purchasePrice = props.purchasePrice;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get salesPrice(): number {
    return this._salesPrice;
  }

  get purchasePrice(): number {
    return this._purchasePrice;
  }
}