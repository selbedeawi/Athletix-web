import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexResponsive,
  NgApexchartsModule,
  ApexFill,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  fill: ApexFill;
};

export type BarChartOptions = {
  series: { name: string; data: number[] }[];
  chart: ApexChart;
  xaxis: ApexXAxis;
  colors: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  grid: object;
  yaxis: ApexYAxis;
};

interface StatCard {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: string;
  color: string;
}


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatDividerModule, MatButtonModule, MatIconModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  selectedPeriod = signal<'this_month' | 'last_month' | 'last_3'>('this_month');

  statCards: StatCard[] = [
    {
      label: 'Monthly Revenue',
      value: '184,500 EGP',
      trend: 'up',
      trendValue: '+12% vs last month',
      icon: 'icon-payments',
      color: '#ac2e00'
    },
    {
      label: 'Active Memberships',
      value: '247',
      trend: 'up',
      trendValue: '+8 this month',
      icon: 'icon-group',
      color: '#ac2e00'
    },
    {
      label: 'New This Month',
      value: '34',
      trend: 'up',
      trendValue: '+5 vs last month',
      icon: 'icon-person_add',
      color: '#ac2e00'
    },
    {
      label: 'Sessions Booked',
      value: '215',
      trend: 'up',
      trendValue: '+14% vs last month',
      icon: 'icon-today',
      color: '#ac2e00'
    }
  ];

  // ── Membership Breakdown Donut Chart ──────────────────────────────────────
  membershipChartOptions: PieChartOptions = {
    series: [148, 74, 25],
    chart: {
      type: 'donut',
      height: 260,
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
      background: 'transparent',
    },
    labels: ['Individual', 'Session Based', 'Private Coach'],
    colors: ['#ac2e00', '#d73c00', '#ffb5a0'],
    fill: { opacity: 1 },
    stroke: { width: 2, colors: ['#fff'] },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`,
      style: { fontSize: '12px', fontWeight: '600', colors: ['#fff'] },
      dropShadow: { enabled: false },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              fontWeight: '600',
              color: '#999',
              formatter: () => '247',
            },
            value: {
              fontSize: '24px',
              fontWeight: '800',
              color: '#1a1a1a',
            },
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontWeight: '500',
      markers: { size: 7 } as any,
      itemMargin: { horizontal: 10, vertical: 6 },
      labels: { colors: '#555' },
    },
    tooltip: {
      y: { formatter: (val: number) => `${val} members` },
    },
    responsive: [
      {
        breakpoint: 480,
        options: { chart: { height: 220 }, legend: { position: 'bottom' } },
      },
    ],
  };

  // ── Monthly Revenue Bar Chart ─────────────────────────────────────────────
  revenueChartOptions: BarChartOptions = {
    series: [{ name: 'Revenue (EGP)', data: [98000, 112000, 125000, 138000, 164000, 184500] }],
    chart: {
      type: 'bar',
      height: 220,
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 700,
        animateGradually: { enabled: true, delay: 100 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
      background: 'transparent',
    },
    xaxis: {
      categories: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#999', fontSize: '12px' } },
    },
    colors: ['#ac2e00'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 7,
        columnWidth: '48%',
        distributed: false,
      },
    },
    tooltip: {
      y: { formatter: (val: number) => `${(val / 1000).toFixed(0)}k EGP` },
    },
    grid: {
      borderColor: '#f0f0f0',
      strokeDashArray: 5,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    yaxis: {
      labels: {
        style: { colors: '#999', fontSize: '12px' },
        formatter: (val: number) => `${(val / 1000).toFixed(0)}k`,
      },
    },
  };


  sessionStats = [
    { name: 'Group Classes', count: 98, percent: 100, color: '#ac2e00' },
    { name: 'PT Sessions',   count: 64, percent: 65,  color: '#d73c00' },
    { name: 'Open Gym',      count: 53, percent: 54,  color: '#ffb5a0' },
  ];

  setPeriod(p: 'this_month' | 'last_month' | 'last_3') {
    this.selectedPeriod.set(p);
  }
}
