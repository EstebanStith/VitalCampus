import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VitalCampusService } from '../../services/vitalcampus.service';
import { EntregaAcademica, EntregaAcademicaInput, Asignatura, ApiResponse } from '../../models/vitalcampus.models';

@Component({
  selector: 'app-entregas',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, ReactiveFormsModule],
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.css']
})
export class EntregasComponent implements OnInit {
  entregaForm!: FormGroup;
  entregas: EntregaAcademica[] = [];
  asignaturas: Asignatura[] = [];
  cargando = true;
  guardando = false;
  errorMsg = '';
  exitoMsg = '';
  
  filtroEstado: string = 'TODAS';
  editandoId: number | null = null;
  entregaAEliminar: EntregaAcademica | null = null;

  tiposEntrega = ['TAREA', 'ENTREGA', 'PARCIAL', 'QUIZ', 'PROYECTO'];
  estadosEntrega = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];

  constructor(
    private fb: FormBuilder,
    private apiService: VitalCampusService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarAsignaturas();
    this.cargarEntregas();
  }

  initForm(): void {
    const en3dias = new Date();
    en3dias.setDate(en3dias.getDate() + 3);
    const fechaDefecto = en3dias.toISOString().substring(0, 16);

    this.entregaForm = this.fb.group({
      asignaturaId: [null, [Validators.required]],
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['TAREA', [Validators.required]],
      fechaLimite: [fechaDefecto, [Validators.required]],
      porcentajePeso: [null, [Validators.min(0), Validators.max(100)]],
      estado: ['PENDIENTE', [Validators.required]]
    });
  }

  cargarAsignaturas(): void {
    this.apiService.getAsignaturas().subscribe({
      next: (res: ApiResponse<Asignatura[]>) => {
        if (res.success && res.data) {
          this.asignaturas = res.data;
          if (this.asignaturas.length && !this.entregaForm.get('asignaturaId')?.value) {
            this.entregaForm.patchValue({ asignaturaId: this.asignaturas[0].id });
          }
        }
      }
    });
  }

  cargarEntregas(): void {
    this.cargando = true;
    this.errorMsg = '';
    const estadoQuery = this.filtroEstado === 'TODAS' ? undefined : this.filtroEstado;

    this.apiService.getEntregas(estadoQuery).subscribe({
      next: (res: ApiResponse<EntregaAcademica[]>) => {
        if (res.success && res.data) {
          this.entregas = res.data;
        } else {
          this.errorMsg = res.error || 'Error al cargar entregas';
        }
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'Error al conectar con el servidor';
        this.cargando = false;
      }
    });
  }

  filtrarPorEstado(estado: string): void {
    this.filtroEstado = estado;
    this.cargarEntregas();
  }

  onSubmit(): void {
    if (this.entregaForm.invalid) {
      this.entregaForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMsg = '';
    this.exitoMsg = '';

    const val = this.entregaForm.value;
    const payload: EntregaAcademicaInput = {
      asignaturaId: Number(val.asignaturaId),
      titulo: val.titulo,
      tipo: val.tipo,
      fechaLimite: new Date(val.fechaLimite).toISOString(),
      porcentajePeso: val.porcentajePeso ? Number(val.porcentajePeso) : undefined,
      estado: val.estado
    };

    if (this.editandoId !== null) {
      this.apiService.updateEntrega(this.editandoId, payload).subscribe({
        next: (res: ApiResponse<EntregaAcademica>) => {
          if (res.success) {
            this.exitoMsg = 'Entrega académica actualizada correctamente';
            this.cancelarEdicion();
            this.cargarEntregas();
          } else {
            this.errorMsg = res.error || 'Error al actualizar entrega';
          }
          this.guardando = false;
        },
        error: () => {
          this.errorMsg = 'Error de servidor al actualizar';
          this.guardando = false;
        }
      });
    } else {
      this.apiService.createEntrega(payload).subscribe({
        next: (res: ApiResponse<EntregaAcademica>) => {
          if (res.success) {
            this.exitoMsg = '¡Entrega académica programada con éxito!';
            this.initForm();
            this.cargarEntregas();
          } else {
            this.errorMsg = res.error || 'Error al guardar la entrega';
          }
          this.guardando = false;
        },
        error: () => {
          this.errorMsg = 'Error de servidor al guardar la entrega';
          this.guardando = false;
        }
      });
    }
  }

  editar(entrega: EntregaAcademica): void {
    this.editandoId = entrega.id;
    const fStr = new Date(entrega.fechaLimite).toISOString().substring(0, 16);
    this.entregaForm.patchValue({
      asignaturaId: entrega.asignaturaId,
      titulo: entrega.titulo,
      tipo: entrega.tipo,
      fechaLimite: fStr,
      porcentajePeso: entrega.porcentajePeso || null,
      estado: entrega.estado
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.initForm();
  }

  confirmarEliminar(entrega: EntregaAcademica): void {
    this.entregaAEliminar = entrega;
  }

  cancelarEliminar(): void {
    this.entregaAEliminar = null;
  }

  eliminarConfirmado(): void {
    if (!this.entregaAEliminar) return;

    const id = this.entregaAEliminar.id;
    this.entregaAEliminar = null;

    this.apiService.deleteEntrega(id).subscribe({
      next: (res: ApiResponse<void>) => {
        if (res.success) {
          this.exitoMsg = 'Entrega eliminada correctamente';
          this.cargarEntregas();
        } else {
          this.errorMsg = res.error || 'Error al eliminar entrega';
        }
      },
      error: () => {
        this.errorMsg = 'Error en el servidor al eliminar';
      }
    });
  }

  esVencida(fechaLimite: string, estado: string): boolean {
    if (estado === 'COMPLETADA') return false;
    return new Date(fechaLimite).getTime() < new Date().getTime();
  }

  esProxima(fechaLimite: string, estado: string): boolean {
    if (estado === 'COMPLETADA') return false;
    const diffMs = new Date(fechaLimite).getTime() - new Date().getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);
    return diffDias >= 0 && diffDias <= 3;
  }
}
