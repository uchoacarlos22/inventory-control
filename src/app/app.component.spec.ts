import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .overrideComponent(AppComponent, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
      },
    })
    .compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have 5 menu items', () => {
    expect(component.menuItems.length).toBe(5);
  });

  it('should have correct menu labels', () => {
    const labels = component.menuItems.map(i => i.label);
    expect(labels).toEqual(['Dashboard', 'Products', 'Categories', 'Sales', 'Reports']);
  });

  it('should have 2 system items', () => {
    expect(component.systemItems.length).toBe(2);
    expect(component.systemItems[0].label).toBe('Settings');
    expect(component.systemItems[1].label).toBe('Support');
  });

  it('should have 4 notifications', () => {
    expect(component.notifications.length).toBe(4);
  });

  it('should calculate correct unreadCount', () => {
    expect(component.unreadCount).toBe(2);
  });

  it('mobileMenuVisible should start as false', () => {
    expect(component.mobileMenuVisible()).toBe(false);
  });

  it('should toggle mobileMenuVisible', () => {
    component.mobileMenuVisible.set(true);
    expect(component.mobileMenuVisible()).toBe(true);

    component.mobileMenuVisible.set(false);
    expect(component.mobileMenuVisible()).toBe(false);
  });
});
