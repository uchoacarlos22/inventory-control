import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthFacadeService } from './state/auth-facade.service';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { Drawer } from 'primeng/drawer';
import { Popover } from 'primeng/popover';
import { signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, InputTextModule, BadgeModule, Drawer, Popover, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public authFacade = inject(AuthFacadeService);
  private router = inject(Router);
  public translate = inject(TranslateService);
  public mobileMenuVisible = signal(false);

  constructor() {
    this.translate.addLangs(['en', 'pt']);
    this.translate.setDefaultLang('en');
    
    // Try to get browser lang, otherwise fallback to en
    const browserLang = this.translate.getBrowserLang() || 'en';
    this.translate.use(browserLang.match(/en|pt/) ? browserLang : 'en');
  }

  toggleLanguage() {
    const current = this.translate.currentLang;
    this.translate.use(current === 'en' ? 'pt' : 'en');
  }

  menuItems = [
    { label: 'MENU.DASHBOARD', icon: 'pi pi-th-large', routerLink: '/dashboard' },
    { label: 'MENU.PRODUCTS', icon: 'pi pi-box', routerLink: '/products' },
    { label: 'MENU.CATEGORIES', icon: 'pi pi-sitemap', routerLink: '/categories' },
    { label: 'MENU.SALES', icon: 'pi pi-shopping-cart', routerLink: '/sales' },
    { label: 'MENU.REPORTS', icon: 'pi pi-chart-bar', routerLink: '/reports' }
  ];

  systemItems = [
    { label: 'MENU.SETTINGS', icon: 'pi pi-cog', routerLink: '/settings' },
    { label: 'MENU.SUPPORT', icon: 'pi pi-question-circle', routerLink: '/support' }
  ];

  notifications = [
    { icon: 'pi pi-cart-plus', iconBg: 'bg-green-100', iconColor: 'text-green-600', title: 'New stock arrived', description: '250 units of "Ergonomic Chair" added.', time: '10 mins ago', unread: true },
    { icon: 'pi pi-exclamation-triangle', iconBg: 'bg-red-100', iconColor: 'text-red-600', title: 'Low stock alert', description: '"Bluetooth Headphones" is critically low (5 left).', time: '45 mins ago', unread: true },
    { icon: 'pi pi-check-circle', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', title: 'Order #8921 completed', description: 'Processed by Alex Rivera for $420.00.', time: '2 hours ago', unread: false },
    { icon: 'pi pi-pencil', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-700', title: 'Product updated', description: 'Category "Electronics" updated with 4 items.', time: '5 hours ago', unread: false }
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
