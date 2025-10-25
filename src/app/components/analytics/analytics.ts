import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Chart } from 'chart.js';
import { CountUp } from 'countup.js';
import { AnalyticsService, AnalyticsData } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class Analytics implements OnInit, AfterViewInit {
  @ViewChild('budgetChart') budgetChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('genderChart') genderChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('locationChart') locationChartRef!: ElementRef<HTMLCanvasElement>;

  // Counter elements
  @ViewChild('budgetCounter') budgetCounterRef!: ElementRef;
  @ViewChild('clientsCounter') clientsCounterRef!: ElementRef;
  @ViewChild('ageCounter') ageCounterRef!: ElementRef;
  @ViewChild('activeCampaignsCounter') activeCampaignsCounterRef!: ElementRef;

  loading = true;
  analyticsData: AnalyticsData | null = null;
  displayedColumns = ['name', 'objective', 'status', 'budget'];

  private budgetChart?: Chart;
  private genderChart?: Chart;
  private statusChart?: Chart;
  private locationChart?: Chart;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  ngAfterViewInit() {
    // Charts will be created after data loads
  }

  loadAnalytics() {
    this.loading = true;
    this.analyticsService.getAnalyticsData().subscribe({
      next: (data) => {
        this.analyticsData = data;
        setTimeout(() => {
          this.createCharts(data);
          this.animateCounters(data);
        }, 100);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load analytics', err);
        this.loading = false;
      }
    });
  }

  animateCounters(data: AnalyticsData) {
    // Animate Total Budget
    if (this.budgetCounterRef) {
      const budgetCounter = new CountUp(this.budgetCounterRef.nativeElement, data.kpis.totalBudget, {
        duration: 2,
        separator: ',',
        prefix: '$',
        useEasing: true,
        useGrouping: true
      });
      budgetCounter.start();
    }

    // Animate Total Clients
    if (this.clientsCounterRef) {
      const clientsCounter = new CountUp(this.clientsCounterRef.nativeElement, data.kpis.totalClients, {
        duration: 2,
        useEasing: true
      });
      clientsCounter.start();
    }

    // Animate Average Age
    if (this.ageCounterRef) {
      const ageCounter = new CountUp(this.ageCounterRef.nativeElement, data.kpis.averageAge, {
        duration: 2,
        useEasing: true
      });
      ageCounter.start();
    }

    // Animate Active Campaigns
    if (this.activeCampaignsCounterRef) {
      const campaignsCounter = new CountUp(this.activeCampaignsCounterRef.nativeElement, data.kpis.activeCampaigns, {
        duration: 2,
        useEasing: true
      });
      campaignsCounter.start();
    }
  }

  createCharts(data: AnalyticsData) {
    this.destroyCharts();

    // Budget Chart (with GRADIENTS!)
    if (this.budgetChartRef) {
      const ctx = this.budgetChartRef.nativeElement.getContext('2d');
      if (ctx) {
        // Create gradient backgrounds
        const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient1.addColorStop(0, 'rgba(99, 102, 241, 0.9)');
        gradient1.addColorStop(1, 'rgba(99, 102, 241, 0.4)');

        const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient2.addColorStop(0, 'rgba(139, 92, 246, 0.9)');
        gradient2.addColorStop(1, 'rgba(139, 92, 246, 0.4)');

        const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient3.addColorStop(0, 'rgba(236, 72, 153, 0.9)');
        gradient3.addColorStop(1, 'rgba(236, 72, 153, 0.4)');

        const gradient4 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient4.addColorStop(0, 'rgba(251, 146, 60, 0.9)');
        gradient4.addColorStop(1, 'rgba(251, 146, 60, 0.4)');

        const gradient5 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient5.addColorStop(0, 'rgba(34, 197, 94, 0.9)');
        gradient5.addColorStop(1, 'rgba(34, 197, 94, 0.4)');

        this.budgetChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.campaignBudgets.labels,
            datasets: [{
              data: data.campaignBudgets.data,
              label: 'Budget ($)',
              backgroundColor: [gradient1, gradient2, gradient3, gradient4, gradient5],
              borderColor: [
                'rgb(99, 102, 241)',
                'rgb(139, 92, 246)',
                'rgb(236, 72, 153)',
                'rgb(251, 146, 60)',
                'rgb(34, 197, 94)'
              ],
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 2000,
              easing: 'easeInOutQuart'
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                  label: (context) => {
                    const value = context.parsed.y;
                    if (value === null || value === undefined) return '';
                    const total = data.campaignBudgets.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                    return `Budget: $${value.toLocaleString()} (${percentage}%)`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                },
                border: {
                  display: false
                },
                ticks: {
                  callback: (tickValue) => {
                    if (tickValue === null || tickValue === undefined) return '';
                    return '$' + Number(tickValue).toLocaleString();
                  }
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    }

    // Gender Chart (with enhanced tooltips)
    if (this.genderChartRef) {
      const ctx = this.genderChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.genderChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: data.clientGender.labels,
            datasets: [{
              data: data.clientGender.data,
              backgroundColor: [
                'rgba(59, 130, 246, 0.85)',
                'rgba(236, 72, 153, 0.85)',
                'rgba(139, 92, 246, 0.85)'
              ],
              borderColor: '#ffffff',
              borderWidth: 3,
              hoverOffset: 15
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 2000
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: { size: 12, weight: 'bold' },
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                  label: (context) => {
                    const value = context.parsed;
                    if (value === null || value === undefined) return '';
                    const total = data.clientGender.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                    return `${context.label}: ${value} clients (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
    }

    // Status Chart (Doughnut with gradients)
    if (this.statusChartRef) {
      const ctx = this.statusChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.statusChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: data.campaignStatus.labels,
            datasets: [{
              data: data.campaignStatus.data,
              backgroundColor: [
                'rgba(34, 197, 94, 0.85)',
                'rgba(251, 191, 36, 0.85)',
                'rgba(239, 68, 68, 0.85)',
                'rgba(156, 163, 175, 0.85)'
              ],
              borderColor: '#ffffff',
              borderWidth: 3,
              hoverOffset: 15
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 2000
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: { size: 12, weight: 'bold' },
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                  label: (context) => {
                    const value = context.parsed;
                    if (value === null || value === undefined) return '';
                    const total = data.campaignStatus.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                    return `${context.label}: ${value} campaigns (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
    }

    // Location Chart (Horizontal bar with gradient)
    if (this.locationChartRef) {
      const ctx = this.locationChartRef.nativeElement.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 400, 0);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.9)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.6)');

        this.locationChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.clientLocations.labels,
            datasets: [{
              data: data.clientLocations.data,
              label: 'Clients',
              backgroundColor: gradient,
              borderColor: 'rgb(99, 102, 241)',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 2000,
              easing: 'easeInOutQuart'
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                  label: (context) => {
                    const value = context.parsed.x;
                    if (value === null || value === undefined) return '';
                    const total = data.clientLocations.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                    return `Clients: ${value} (${percentage}%)`;
                  }
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                },
                border: {
                  display: false
                },
                ticks: { stepSize: 1 }
              },
              y: {
                grid: { display: false }
              }
            }
          }
        });
      }
    }
  }

  destroyCharts() {
    this.budgetChart?.destroy();
    this.genderChart?.destroy();
    this.statusChart?.destroy();
    this.locationChart?.destroy();
  }

  refreshData() {
    this.loadAnalytics();
  }
}