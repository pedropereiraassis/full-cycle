import StoreCatalogFacade from "../facade/store-catalog.facade"
import ProductRepository from "../repository/product.repository"
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase"
import FindProductUseCase from "../usecase/find-product/find-product.usecase"

export default class StoreCatalogFacadeFactory {
  static create() {
    const productRepository = new ProductRepository()
    const findProductUseCase = new FindProductUseCase(productRepository)
    const findAllProductsUseCase = new FindAllProductsUseCase(productRepository)

    const storeCatalogFacade = new StoreCatalogFacade({
      findProductUseCase: findProductUseCase,
      findAllProductsUseCase: findAllProductsUseCase,
    })

    return storeCatalogFacade
  }
}