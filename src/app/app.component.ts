import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthFacadeService } from './state/auth-facade.service';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, InputTextModule, BadgeModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public authFacade = inject(AuthFacadeService);

  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-th-large', routerLink: '/dashboard' },
    { label: 'Products', icon: 'pi pi-box', routerLink: '/products' },
    { label: 'Categories', icon: 'pi pi-sitemap', routerLink: '/categories' },
    { label: 'Sales', icon: 'pi pi-shopping-cart', routerLink: '/sales' },
    { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: '/reports' }
  ];

  systemItems = [
    { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
    { label: 'Support', icon: 'pi pi-question-circle', routerLink: '/support' }
  ];
}
