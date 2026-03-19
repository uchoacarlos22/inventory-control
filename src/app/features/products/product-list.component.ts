import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductFacadeService } from '../../state/product-facade.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TagModule, DropdownModule, FormsModule, ReactiveFormsModule, CurrencyPipe, TranslateModule, DialogModule, InputNumberModule, TextareaModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  public productFacade = inject(ProductFacadeService);
  private fb = inject(FormBuilder);

  globalFilter: string = '';
  displayAddDialog: boolean = false;
  productForm: FormGroup;

  constructor() {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      description: ['', Validators.required],
      image: ['https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', Validators.required]
    });
  }

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

  showAddDialog(): void {
    this.productForm.reset({
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
    });
    this.displayAddDialog = true;
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const newProduct = {
        ...this.productForm.value,
        rating: { rate: 0, count: 0 } // Mock default rating for fake store
      };
      this.productFacade.addProduct(newProduct);
      this.displayAddDialog = false;
    }
  }

  exportPdf(): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const head = [['Product', 'Category', 'Price', 'Stock Status']];
    const data = this.productFacade.products().map(product => [
      product.title,
      product.category,
      `$${product.price.toFixed(2)}`,
      (product.rating?.count ?? 0) > 0 ? 'In Stock' : 'Out of Stock'
    ]);

    // Add Title
    doc.setFontSize(18);
    doc.text('Product Inventory Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Generate Table
    autoTable(doc, {
      head: head,
      body: data,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255] },
      styles: { fontSize: 9 }
    });

    doc.save('inventory-report.pdf');
  }
}
