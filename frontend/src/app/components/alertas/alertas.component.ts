import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { VitalCampusService } from '../../services/vitalcampus.service';
import { Alerta, ApiResponse } from '../../models/vitalcampus.models';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe],
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {
  alertas: Alerta[] = [];
  cargando = true;
  errorMsg = '';
  exitoMsg = '';

  constructor(private apiService: VitalCampusService) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  cargarAlertas(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.apiService.getAlertas().subscribe({
      next: (res: ApiResponse<Alerta[]>) => {
        if (res.success && res.data) {
          this.alertas = res.data.sort((a, b) => {
            const pesoPrioridad: Record<string, number> = { ALTA: 3, MEDIA: 2, BAJA: 1 };
            const diffPrioridad = (pesoPrioridad[b.prioridad] || 0) - (pesoPrioridad[a.prioridad] || 0);
            if (diffPrioridad !== 0) return diffPrioridad;
            return new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime();
          });
        } else {
          this.errorMsg = res.error || 'Error al cargar alertas';
        }
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'Error al conectar con el servidor';
        this.cargando = false;
      }
    });
  }

  marcarComoLeida(alerta: Alerta): void {
    if (alerta.leida) return;

    this.apiService.marcarAlertaLeida(alerta.id).subscribe({
      next: (res: ApiResponse<Alerta>) => {
        if (res.success) {
          alerta.leida = true;
          this.exitoMsg = 'Alerta marcada como leída';
          setTimeout(() => this.exitoMsg = '', 3000);
        }
      },
      error: () => {
        this.errorMsg = 'Error al actualizar estado de la alerta';
      }
    });
  }

  getIconoTipo(tipo: string): string {
    switch (tipo) {
      case 'CARGA_ACADEMICA': return '📚';
      case 'SUENO': return '🌙';
      case 'ESTRES': return '⚡';
      case 'RECOMENDACION': return '💡';
      default: return '🔔';
    }
  }

  getClasePrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'ALTA': return 'priority-high';
      case 'MEDIA': return 'priority-medium';
      case 'BAJA': return 'priority-low';
      default: return 'priority-low';
    }
  }
}
