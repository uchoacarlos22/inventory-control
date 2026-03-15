import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, TranslateModule, ChartModule, TableModule, ButtonModule, DropdownModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  selectedPeriod: any;
  periods = [
    { label: 'REPORTS.FILTERS.LAST_7_DAYS', value: 7 },
    { label: 'REPORTS.FILTERS.LAST_30_DAYS', value: 30 },
    { label: 'REPORTS.FILTERS.LAST_6_MONTHS', value: 180 }
  ];

  revenueData: any;
  revenueOptions: any;
  
  healthData: any;
  healthOptions: any;

  metrics = [
    { name: 'Inventory Turnover', value: '4.2x', trend: 'REPORTS.TABLE.STATUS_UP', color: 'text-green-400' },
    { name: 'Stock Accuracy', value: '98.5%', trend: 'REPORTS.TABLE.STATUS_STABLE', color: 'text-neon' },
    { name: 'Average Handling Time', value: '14m', trend: 'REPORTS.TABLE.STATUS_DOWN', color: 'text-red-400' },
    { name: 'Return Rate', value: '1.2%', trend: 'REPORTS.TABLE.STATUS_STABLE', color: 'text-neon' }
  ];

  ngOnInit() {
    this.selectedPeriod = this.periods[1];
    this.initCharts();
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = '#94a3b8';
    
    // Revenue Data
    this.revenueData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue (k$)',
          data: [65, 59, 80, 81, 56, 55],
          fill: true,
          borderColor: '#0ff',
          tension: 0.4,
          backgroundColor: 'rgba(0, 255, 255, 0.1)'
        }
      ]
    };

    this.revenueOptions = {
      plugins: {
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
        y: { ticks: { color: textColor }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
      }
    };

    // Health Data
    this.healthData = {
      labels: ['Electronics', 'Clothing', 'Jewelery'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ['#0ff', '#f0f', '#007bff'],
          hoverBackgroundColor: ['#33ffff', '#ff33ff', '#3399ff']
        }
      ]
    };

    this.healthOptions = {
      plugins: {
        legend: { labels: { color: textColor } }
      }
    };
  }

  exportData() {
    console.log('Exporting report for period:', this.selectedPeriod.value);
  }
}
