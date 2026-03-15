import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductFacadeService } from './product-facade.service';
import { ProductDataService } from '../data/services/product-data.service';
import { of, throwError } from 'rxjs';
import { Product } from '../domain/models/product.model';

describe('ProductFacadeService', () => {
  let service: ProductFacadeService;
  let dataServiceMock: {
    getProducts: jest.Mock;
    getCategories: jest.Mock;
    deleteProduct: jest.Mock;
  };

  const mockProducts: Product[] = [
    { id: 1, title: 'Product A', price: 10, description: 'A', category: 'electronics', image: 'a.jpg', rating: { rate: 4.5, count: 100 } },
    { id: 2, title: 'Product B', price: 20, description: 'B', category: 'jewelery', image: 'b.jpg', rating: { rate: 3.8, count: 50 } },
    { id: 3, title: 'Product C', price: 30, description: 'C', category: 'electronics', image: 'c.jpg', rating: { rate: 4.0, count: 75 } },
  ];

  beforeEach(() => {
    dataServiceMock = {
      getProducts: jest.fn(),
      getCategories: jest.fn(),
      deleteProduct: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductFacadeService,
        { provide: ProductDataService, useValue: dataServiceMock },
      ],
    });

    service = TestBed.inject(ProductFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have empty products initially', () => {
    expect(service.products()).toEqual([]);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('loadProducts() should populate products signal', fakeAsync(() => {
    dataServiceMock.getProducts.mockReturnValue(of(mockProducts));

    service.loadProducts();
    tick();

    expect(service.products().length).toBe(3);
    expect(service.products()[0].title).toBe('Product A');
    expect(service.loading()).toBe(false);
  }));

  it('loadProducts() should NOT re-fetch if cache exists', fakeAsync(() => {
    dataServiceMock.getProducts.mockReturnValue(of(mockProducts));

    service.loadProducts();
    tick();

    service.loadProducts(); // second call
    expect(dataServiceMock.getProducts).toHaveBeenCalledTimes(1);
  }));

  it('loadProducts() should set error on failure', fakeAsync(() => {
    dataServiceMock.getProducts.mockReturnValue(throwError(() => new Error('Network error')));

    service.loadProducts();
    tick();

    expect(service.products()).toEqual([]);
    expect(service.error()).toBe('Network error');
    expect(service.loading()).toBe(false);
  }));

  it('loadCategories() should populate categories signal', fakeAsync(() => {
    const mockCategories = ['electronics', 'jewelery', "men's clothing"];
    dataServiceMock.getCategories.mockReturnValue(of(mockCategories));

    service.loadCategories();
    tick();

    expect(service.categories().length).toBe(3);
    expect(service.categories()).toContain('electronics');
  }));

  it('loadCategories() should NOT re-fetch if cache exists', fakeAsync(() => {
    dataServiceMock.getCategories.mockReturnValue(of(['electronics']));

    service.loadCategories();
    tick();

    service.loadCategories(); // second call
    expect(dataServiceMock.getCategories).toHaveBeenCalledTimes(1);
  }));

  it('deleteProduct() should remove product from signal', fakeAsync(() => {
    // First load products
    dataServiceMock.getProducts.mockReturnValue(of(mockProducts));
    service.loadProducts();
    tick();
    expect(service.products().length).toBe(3);

    // Then delete product with id 2
    dataServiceMock.deleteProduct.mockReturnValue(of(mockProducts[1]));
    service.deleteProduct(2);
    tick();

    expect(service.products().length).toBe(2);
    expect(service.products().find(p => p.id === 2)).toBeUndefined();
    expect(service.loading()).toBe(false);
  }));

  it('deleteProduct() should set error on failure', fakeAsync(() => {
    dataServiceMock.deleteProduct.mockReturnValue(throwError(() => new Error('Delete failed')));

    service.deleteProduct(99);
    tick();

    expect(service.error()).toBe('Delete failed');
    expect(service.loading()).toBe(false);
  }));
});
