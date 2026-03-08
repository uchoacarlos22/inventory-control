import { Component, OnInit, inject, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFacadeService } from '../../state/product-facade.service';
import Chart from 'chart.js/auto';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public productFacade = inject(ProductFacadeService);
  @ViewChild('pricingChart', { static: true }) chartRef!: ElementRef;
  @ViewChild('salesChart', { static: true }) salesChartRef!: ElementRef;
  private chartInstance: Chart | null = null;
  private salesChartInstance: Chart | null = null;

  constructor() {
    effect(() => {
      if (this.productFacade.products().length > 0) {
        this.renderBarChart(this.productFacade.products());
      }
    });
  }

  ngOnInit(): void {
    this.productFacade.loadProducts();
    this.renderSalesChart();
  }

  private renderBarChart(products: any[]): void {
    if (this.chartInstance) this.chartInstance.destroy();

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [380, 520, 1000, 320, 200, 680, 800];
    const bgColors = ['#f1f5f9', '#f1f5f9', '#4f46e5', '#f1f5f9', '#f1f5f9', '#f1f5f9', '#f1f5f9'];

    this.chartInstance = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: bgColors,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            padding: 12,
            titleFont: { size: 13, family: 'Inter' },
            bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
            displayColors: false,
            callbacks: { label: (context) => context.raw + ' Units' }
          }
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Inter' } } },
          y: { display: false }
        }
      }
    });
  }

  private renderSalesChart(): void {
    if (this.salesChartInstance) this.salesChartInstance.destroy();

    this.salesChartInstance = new Chart(this.salesChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          data: [1200, 1500, 2800, 1100, 3900],
          borderColor: '#4f46e5',
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: '#4f46e5',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(79, 70, 229, 0.25)');
            gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
            return gradient;
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } },
          y: { display: false, min: 0 }
        }
      }
    });
  }
}

