import Entity from "../../@shared/entity/entity.abstract"
import NotificationError from "../../@shared/notification/notification.error"
import CustomerValidatorFactory from "../factory/customer.validator.factory"
import Address from "../value-object/address"
import CustomerInterface from "./customer.interface"

export default class Customer extends Entity implements CustomerInterface {

  private _name: string
  private _address?: Address
  private _active: boolean = false
  private _rewardPoints: number = 0

  constructor(id: string, name: string) {
    super()
    this._id = id
    this._name = name
    this.validate()
  }

  get name(): string {
    return this._name
  }

  get rewardPoints(): number {
    return this._rewardPoints
  }

  get address(): Address {
    return this._address
  }

  validate() {
    CustomerValidatorFactory.create().validate(this)

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors())
    }
  }

  changeName(name: string) {
    this._name = name
    this.validate()
  }

  changeAddress(address: Address) {
    this._address = address
  }

  isActive(): boolean {
    return this._active
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer")
    }

    this._active = true
  }

  deactivate() {
    this._active = false
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points
  }

  set address(address: Address) {
    this._address = address
  }

}
