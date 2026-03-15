import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductDataService } from './product-data.service';
import { Product } from '../../domain/models/product.model';

describe('ProductDataService', () => {
  let service: ProductDataService;
  let httpTesting: HttpTestingController;

  const mockProducts: Product[] = [
    { id: 1, title: 'Product A', price: 10, description: 'Desc A', category: 'cat1', image: 'img1.jpg', rating: { rate: 4.5, count: 100 } },
    { id: 2, title: 'Product B', price: 20, description: 'Desc B', category: 'cat2', image: 'img2.jpg', rating: { rate: 3.8, count: 50 } },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductDataService,
      ],
    });

    service = TestBed.inject(ProductDataService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProducts() should GET /products', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products[0].title).toBe('Product A');
    });

    const req = httpTesting.expectOne((r) => r.url.includes('/products') && !r.url.includes('categories'));
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('getProduct(id) should GET /products/:id', () => {
    service.getProduct(1).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product.title).toBe('Product A');
    });

    const req = httpTesting.expectOne((r) => r.url.includes('/products/1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts[0]);
  });

  it('getCategories() should GET /products/categories', () => {
    const mockCategories = ['electronics', 'jewelery', 'men\'s clothing'];

    service.getCategories().subscribe((categories) => {
      expect(categories.length).toBe(3);
      expect(categories).toContain('electronics');
    });

    const req = httpTesting.expectOne((r) => r.url.includes('/products/categories'));
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('deleteProduct(id) should DELETE /products/:id', () => {
    service.deleteProduct(1).subscribe((product) => {
      expect(product.id).toBe(1);
    });

    const req = httpTesting.expectOne((r) => r.url.includes('/products/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush(mockProducts[0]);
  });

  it('createProduct() should POST /products', () => {
    const newProduct = { title: 'New', price: 30, description: 'New desc', category: 'cat1', image: 'new.jpg' };

    service.createProduct(newProduct).subscribe((product) => {
      expect(product.title).toBe('New');
    });

    const req = httpTesting.expectOne((r) => r.url.includes('/products') && r.method === 'POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush({ id: 3, ...newProduct });
  });
});
