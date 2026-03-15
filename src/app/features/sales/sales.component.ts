import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductFacadeService } from '../../state/product-facade.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TranslateModule } from '@ngx-translate/core';

interface SaleTransaction {
  id: number;
  date: string;
  time: string;
  productName: string;
  productImg: string;
  qty: number;
  total: number;
  status: 'Completed' | 'Pending' | 'Canceled';
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, DropdownModule, TagModule, CurrencyPipe, TranslateModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  public productFacade = inject(ProductFacadeService);
  private fb = inject(FormBuilder);

  saleForm = this.fb.group({
    product: [null, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  transactions: SaleTransaction[] = [];
  productsList: any[] = [];
  estimatedTotal = 0;

  ngOnInit() {
    this.productFacade.loadProducts();
    
    // Generate initial fake transactions for layout demonstration
    this.transactions = [
      { id: 101, date: 'Oct 24, 2023', time: '14:32 PM', productName: 'MacBook Pro M3', productImg: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg', qty: 1, total: 2499.00, status: 'Completed' },
      { id: 102, date: 'Oct 24, 2023', time: '12:15 PM', productName: 'iPhone 15 Pro', productImg: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg', qty: 2, total: 1998.00, status: 'Completed' },
      { id: 103, date: 'Oct 23, 2023', time: '10:05 AM', productName: 'MX Master 3S', productImg: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg', qty: 5, total: 495.00, status: 'Pending' },
      { id: 104, date: 'Oct 23, 2023', time: '09:12 AM', productName: 'Samsung G9', productImg: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-t-shirt.jpg', qty: 1, total: 1299.00, status: 'Canceled' },
    ];

    // Reactive listener for estimated total
    this.saleForm.valueChanges.subscribe(val => {
      const selectedProduct: any = val.product;
      const qty = val.quantity || 0;
      if (selectedProduct) {
        this.estimatedTotal = selectedProduct.price * qty;
      } else {
        this.estimatedTotal = 0;
      }
    });

    // Feed products when loaded
    setTimeout(() => {
        this.productsList = this.productFacade.products();
    }, 500);
  }

  getSeverity(status: string): 'success' | 'warn' | 'danger' {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warn';
      case 'Canceled': return 'danger';
      default: return 'warn';
    }
  }

  registerSale() {
    if (this.saleForm.valid) {
      const formVal = this.saleForm.value;
      const selectedProduct: any = formVal.product;
      
      const newTx: SaleTransaction = {
        id: Math.floor(Math.random() * 1000) + 200,
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        productName: selectedProduct.title,
        productImg: selectedProduct.image,
        qty: formVal.quantity || 1,
        total: this.estimatedTotal,
        status: 'Completed'
      };

      // Unshift para adicionar no começo da array
      this.transactions.unshift(newTx);
      this.saleForm.reset({ quantity: 1 });
      this.estimatedTotal = 0;
    }
  }
}
