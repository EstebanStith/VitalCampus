import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { VitalCampusService } from '../../services/vitalcampus.service';
import { DashboardResumen, ApiResponse } from '../../models/vitalcampus.models';

Chart.register(...registerables);

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, RouterLink],
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  dashboardData: DashboardResumen | null = null;
  cargando = true;
  errorMsg = '';
  chartInstance: Chart | null = null;

  constructor(private apiService: VitalCampusService) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  ngAfterViewInit(): void {
    if (this.dashboardData) {
      this.initChart();
    }
  }

  cargarDashboard(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.apiService.getDashboardResumen().subscribe({
      next: (res: ApiResponse<DashboardResumen>) => {
        if (res.success && res.data) {
          this.dashboardData = res.data;
          setTimeout(() => this.initChart(), 50);
        } else {
          this.errorMsg = res.error || 'No se pudieron cargar los datos del resumen';
        }
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar dashboard:', err);
        this.errorMsg = 'Error de conexión con el servidor. Verifica que el backend esté activo.';
        this.cargando = false;
      }
    });
  }

  get recomendacionDiaria(): string {
    if (!this.dashboardData || !this.dashboardData.alertas.length) {
      return 'Mantén un ritmo de estudio constante, toma pausas de 10 minutos cada hora y duerme 8 horas diarias.';
    }
    const alta = this.dashboardData.alertas.find(a => a.prioridad === 'ALTA' && !a.leida);
    if (alta) return alta.mensaje;

    const media = this.dashboardData.alertas.find(a => a.prioridad === 'MEDIA' && !a.leida);
    if (media) return media.mensaje;

    return this.dashboardData.alertas[0].mensaje;
  }

  initChart(): void {
    if (!this.chartCanvas || !this.dashboardData) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const registrosSueno = [...(this.dashboardData.resumenSueno?.registros || [])].reverse();
    const labels = registrosSueno.map(r => {
      const d = new Date(r.fecha);
      return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
    });
    const dataHoras = registrosSueno.map(r => r.horasSueno);

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Horas de Sueño',
            data: dataHoras.length ? dataHoras : [7, 6.5, 5, 5, 5.5, 5, 5.5],
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#0284c7',
            pointRadius: 5
          },
          {
            label: 'Meta Mínima (6h)',
            data: Array(labels.length || 7).fill(6),
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: '#94a3b8' }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 12,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }
}
