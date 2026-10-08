import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { VitalCampusService } from '../../services/vitalcampus.service';
import { RegistroSueno, RegistroSuenoInput, ApiResponse } from '../../models/vitalcampus.models';

Chart.register(...registerables);

@Component({
  selector: 'app-sueno',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, ReactiveFormsModule],
  templateUrl: './sueno.component.html',
  styleUrls: ['./sueno.component.css']
})
export class SuenoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  suenoForm!: FormGroup;
  registros: RegistroSueno[] = [];
  cargando = true;
  guardando = false;
  errorMsg = '';
  exitoMsg = '';
  
  editandoId: number | null = null;
  registroAEliminar: RegistroSueno | null = null;
  horasCalculadas: number = 7;
  chartInstance: Chart | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: VitalCampusService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    if (this.registros.length) {
      this.initChart();
    }
  }

  initForm(): void {
    const hoyStr = new Date().toISOString().substring(0, 10);
    this.suenoForm = this.fb.group({
      fecha: [hoyStr, [Validators.required]],
      horaDormir: ['23:00', [Validators.required]],
      horaDespertar: ['06:00', [Validators.required]],
      calidadSueno: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
      observacion: [''],
      nivelEstres: [null]
    });

    this.suenoForm.valueChanges.subscribe(() => {
      this.calcularHorasForm();
    });

    this.calcularHorasForm();
  }

  calcularHorasForm(): void {
    const hDormir = this.suenoForm.get('horaDormir')?.value;
    const hDespertar = this.suenoForm.get('horaDespertar')?.value;

    if (hDormir && hDespertar) {
      this.horasCalculadas = this.calcularHoras(hDormir, hDespertar);
    }
  }

  calcularHoras(horaDormir: string, horaDespertar: string): number {
    if (!horaDormir || !horaDespertar) return 0;
    const [h1, m1] = horaDormir.split(':').map(Number);
    const [h2, m2] = horaDespertar.split(':').map(Number);

    if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return 0;

    let minDormir = h1 * 60 + m1;
    let minDespertar = h2 * 60 + m2;

    if (minDespertar <= minDormir) {
      minDespertar += 24 * 60;
    }

    const dif = minDespertar - minDormir;
    return Math.round((dif / 60) * 10) / 10;
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.apiService.getSuenos().subscribe({
      next: (res: ApiResponse<RegistroSueno[]>) => {
        if (res.success && res.data) {
          this.registros = res.data;
          setTimeout(() => this.initChart(), 50);
        } else {
          this.errorMsg = res.error || 'Error al cargar registros de sueño';
        }
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al obtener registros de sueño:', err);
        this.errorMsg = 'Error al conectar con el servidor';
        this.cargando = false;
      }
    });
  }

  onSubmit(): void {
    if (this.suenoForm.invalid) {
      this.suenoForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMsg = '';
    this.exitoMsg = '';

    const val = this.suenoForm.value;
    const payload: RegistroSuenoInput = {
      fecha: new Date(val.fecha).toISOString(),
      horaDormir: val.horaDormir,
      horaDespertar: val.horaDespertar,
      calidadSueno: Number(val.calidadSueno),
      observacion: val.observacion || undefined,
      nivelEstres: val.nivelEstres ? Number(val.nivelEstres) : undefined
    };

    if (this.editandoId !== null) {
      this.apiService.updateSueno(this.editandoId, payload).subscribe({
        next: (res: ApiResponse<RegistroSueno>) => {
          if (res.success) {
            this.exitoMsg = 'Registro de sueño actualizado correctamente';
            this.cancelarEdicion();
            this.cargarDatos();
          } else {
            this.errorMsg = res.error || 'Error al actualizar registro';
          }
          this.guardando = false;
        },
        error: () => {
          this.errorMsg = 'Error de servidor al actualizar';
          this.guardando = false;
        }
      });
    } else {
      this.apiService.createSueno(payload).subscribe({
        next: (res: ApiResponse<RegistroSueno>) => {
          if (res.success) {
            this.exitoMsg = '¡Nuevo registro de sueño guardado exitosamente!';
            this.initForm();
            this.cargarDatos();
          } else {
            this.errorMsg = res.error || 'Error al guardar registro de sueño';
          }
          this.guardando = false;
        },
        error: () => {
          this.errorMsg = 'Error de servidor al guardar';
          this.guardando = false;
        }
      });
    }
  }

  editar(reg: RegistroSueno): void {
    this.editandoId = reg.id;
    const fechaFormatted = new Date(reg.fecha).toISOString().substring(0, 10);
    this.suenoForm.patchValue({
      fecha: fechaFormatted,
      horaDormir: reg.horaDormir,
      horaDespertar: reg.horaDespertar,
      calidadSueno: reg.calidadSueno,
      observacion: reg.observacion || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.initForm();
  }

  confirmarEliminar(reg: RegistroSueno): void {
    this.registroAEliminar = reg;
  }

  cancelarEliminar(): void {
    this.registroAEliminar = null;
  }

  eliminarConfirmado(): void {
    if (!this.registroAEliminar) return;

    const id = this.registroAEliminar.id;
    this.registroAEliminar = null;

    this.apiService.deleteSueno(id).subscribe({
      next: (res: ApiResponse<void>) => {
        if (res.success) {
          this.exitoMsg = 'Registro de sueño eliminado correctamente';
          this.cargarDatos();
        } else {
          this.errorMsg = res.error || 'Error al eliminar el registro';
        }
      },
      error: () => {
        this.errorMsg = 'Error al eliminar el registro en el servidor';
      }
    });
  }

  initChart(): void {
    if (!this.chartCanvas || !this.registros.length) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const ultimos7 = [...this.registros].reverse().slice(-7);
    const labels = ultimos7.map(r => new Date(r.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }));
    const horasData = ultimos7.map(r => r.horasSueno);

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Horas Dormidas',
            data: horasData,
            backgroundColor: horasData.map(h => h < 6 ? 'rgba(239, 68, 68, 0.75)' : 'rgba(2, 132, 199, 0.75)'),
            borderColor: horasData.map(h => h < 6 ? '#ef4444' : '#0284c7'),
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
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
