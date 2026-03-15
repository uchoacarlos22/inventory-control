import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFacadeService } from '../../state/product-facade.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface CategoryView {
  name: string;
  description: string;
  count: number;
  status: 'Active' | 'Inactive';
  lastModified: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TagModule, FormsModule, TranslateModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  public productFacade = inject(ProductFacadeService);
  globalFilter: string = '';
  categoryViews: CategoryView[] = [];

  ngOnInit() {
    this.productFacade.loadProducts();
    this.productFacade.loadCategories();
    
    // Construct rich view models from the simple string categories
    this.buildCategoryViews();
  }

  buildCategoryViews() {
    // Ideally we would react to the signal, but for this demo standard initialization works
    // if the categories are already loaded, or we could use an effect. 
    // Using a timeout as a simple hack since fake API is fast, but it's better to use computed signal in real app.
    setTimeout(() => {
        const rawCats = this.productFacade.categories();
        const products = this.productFacade.products();

        this.categoryViews = rawCats.map(catName => {
            const count = products.filter(p => p.category === catName).length;
            const uiDetails = this.getCategoryUIDetails(catName);
            
            return {
                name: catName,
                description: uiDetails.desc,
                count: count,
                status: 'Active',
                lastModified: uiDetails.date,
                icon: uiDetails.icon,
                bgColor: uiDetails.bgColor,
                iconColor: uiDetails.iconColor
            };
        });
    }, 500);
  }

  getCategoryUIDetails(name: string) {
    if (name.includes('electronic')) return { desc: 'Gadgets, laptops, and peripherals', icon: 'pi pi-desktop', bgColor: 'bg-indigo-50', iconColor: 'text-primary', date: 'Oct 12, 2023' };
    if (name.includes('jewel')) return { desc: 'Premium rings, necklaces and watches', icon: 'pi pi-star', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-500', date: 'Sep 28, 2023' };
    if (name.includes('women')) return { desc: 'Clothing, shoes, and accessories', icon: 'pi pi-shopping-bag', bgColor: 'bg-pink-50', iconColor: 'text-pink-500', date: 'Nov 02, 2023' };
    if (name.includes('men')) return { desc: 'Clothing, shoes, and accessories', icon: 'pi pi-briefcase', bgColor: 'bg-blue-50', iconColor: 'text-blue-500', date: 'Aug 15, 2023' };
    
    return { desc: 'General items and assortments', icon: 'pi pi-box', bgColor: 'bg-gray-50', iconColor: 'text-600', date: 'Today' };
  }

  getTotalProducts() {
    return this.categoryViews.reduce((acc, curr) => acc + curr.count, 0);
  }
}
