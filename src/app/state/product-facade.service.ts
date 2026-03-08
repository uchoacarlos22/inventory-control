import { Injectable, inject, signal, computed } from '@angular/core';
import { ProductDataService } from '../data/services/product-data.service';
import { Product } from '../domain/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductFacadeService {
  private dataService = inject(ProductDataService);

  // Signals
  private _products = signal<Product[]>([]);
  private _categories = signal<string[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Computeds (A UI se inscreve nestes getters limpos)
  products = computed(() => this._products());
  categories = computed(() => this._categories());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  // Business Logic
  loadProducts(): void {
    if (this._products().length > 0) return; // Cache simples
    
    this._loading.set(true);
    this.dataService.getProducts().subscribe({
      next: (data) => {
        this._products.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message);
        this._loading.set(false);
      }
    });
  }

  loadCategories(): void {
    if (this._categories().length > 0) return;
    
    this.dataService.getCategories().subscribe({
      next: (data) => this._categories.set(data),
      error: (err) => this._error.set(err.message)
    });
  }

  deleteProduct(id: number): void {
    this._loading.set(true);
    this.dataService.deleteProduct(id).subscribe({
      next: () => {
        this._products.update(prods => prods.filter(p => p.id !== id));
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message);
        this._loading.set(false);
      }
    });
  }
}
