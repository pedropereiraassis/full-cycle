export interface InputUpdateCustomerDTO {
  id: string
  name: string
  address: {
    street: string
    city: string
    number: number
    zip: string
  }
}

export interface OutputUpdateCustomerDTO {
  id: string
  name: string
  address: {
    street: string
    city: string
    number: number
    zip: string
  }
}