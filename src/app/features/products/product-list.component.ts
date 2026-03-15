import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductFacadeService } from '../../state/product-facade.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TagModule, DropdownModule, FormsModule, CurrencyPipe, TranslateModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  public productFacade = inject(ProductFacadeService);
  globalFilter: string = '';

  ngOnInit(): void {
    this.productFacade.loadProducts();
    this.productFacade.loadCategories();
  }

  getSeverity(category: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch(category?.toLowerCase()) {
      case 'electronics': return 'info';
      case 'jewelery': return 'warn';
      case "men's clothing": return 'success';
      case "women's clothing": return 'secondary';
      default: return 'info';
    }
  }

  getStockStatus(count: number): { label: string, colorClass: string, barColor: string, percentage: number } {
    if (!count) return { label: 'OUT OF STOCK', colorClass: 'text-red-500', barColor: '#ef4444', percentage: 0 };
    if (count > 200) return { label: 'IN STOCK', colorClass: 'text-green-600', barColor: '#10b981', percentage: 100 };
    if (count > 80) return { label: 'IN STOCK', colorClass: 'text-green-600', barColor: '#10b981', percentage: count > 100 ? 100 : count };
    if (count > 0) return { label: 'LOW STOCK', colorClass: 'text-orange-500', barColor: '#f59e0b', percentage: (count / 80) * 100 };
    return { label: 'OUT OF STOCK', colorClass: 'text-red-500', barColor: '#ef4444', percentage: 0 };
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productFacade.deleteProduct(id);
    }
  }
}
