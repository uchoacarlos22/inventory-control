import { Component, OnInit, inject, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFacadeService } from '../../state/product-facade.service';
import Chart from 'chart.js/auto';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule],
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
    const bgColors = ['rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.8)', 'rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.2)'];
    const borderColors = ['rgba(0, 255, 255, 0.5)', 'rgba(0, 255, 255, 0.5)', '#0ff', 'rgba(0, 255, 255, 0.5)', 'rgba(0, 255, 255, 0.5)', 'rgba(0, 255, 255, 0.5)', 'rgba(0, 255, 255, 0.5)'];

    this.chartInstance = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
          hoverBackgroundColor: '#0ff',
          hoverBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(5, 10, 20, 0.85)',
            borderColor: 'rgba(0, 255, 255, 0.3)',
            borderWidth: 1,
            padding: 12,
            titleFont: { size: 13, family: 'Orbitron' },
            titleColor: '#0ff',
            bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
            bodyColor: '#e2e8f0',
            displayColors: false,
            callbacks: { label: (context) => context.raw + ' Units' }
          }
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Inter' } } },
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
          borderColor: '#0ff',
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: '#030712',
          pointBorderColor: '#0ff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#0ff',
          pointHoverBorderColor: '#fff',
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0.0)');
            return gradient;
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(5, 10, 20, 0.85)',
            borderColor: 'rgba(0, 255, 255, 0.3)',
            borderWidth: 1,
            padding: 12,
            titleFont: { size: 13, family: 'Orbitron' },
            titleColor: '#0ff',
            bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
            bodyColor: '#e2e8f0',
            displayColors: false,
            callbacks: { label: (context) => '$' + context.raw }
          }
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Orbitron', size: 11 } } },
          y: { display: false, min: 0 }
        }
      }
    });
  }
}

