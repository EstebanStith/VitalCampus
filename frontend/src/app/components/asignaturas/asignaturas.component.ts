import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, NgStyle } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VitalCampusService } from '../../services/vitalcampus.service';
import { Asignatura, AsignaturaInput, ApiResponse } from '../../models/vitalcampus.models';

@Component({
  selector: 'app-asignaturas',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgStyle, ReactiveFormsModule],
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.css']
})
export class AsignaturasComponent implements OnInit {
  asignaturaForm!: FormGroup;
  asignaturas: Asignatura[] = [];
  cargando = true;
  guardando = false;
  errorMsg = '';
  exitoMsg = '';
  editandoId: number | null = null;
  asignaturaAEliminar: Asignatura | null = null;

  paletteColors = [
    '#0f766e', '#0284c7', '#8b5cf6', '#d97706', '#dc2626', '#10b981', '#6366f1', '#ec4899'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: VitalCampusService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarAsignaturas();
  }

  initForm(): void {
    this.asignaturaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      codigo: [''],
      creditos: [null, [Validators.min(1), Validators.max(20)]],
      color: ['#0f766e'],
      activa: [true]
    });
  }

  cargarAsignaturas(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.apiService.getAsignaturas().subscribe({
      next: (res: ApiResponse<Asignatura[]>) => {
        if (res.success && res.data) {
          this.asignaturas = res.data;
        } else {
          this.errorMsg = res.error || 'Error al cargar asignaturas';
        }
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'Error al conectar con el servidor';
        this.cargando = false;
      }
    });
  }

  onSubmit(): void {
    if (this.asignaturaForm.invalid) {
      this.asignaturaForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMsg = '';
    this.exitoMsg = '';

    const val = this.asignaturaForm.value;
    const payload: AsignaturaInput = {
      nombre: val.nombre,
      codigo: val.codigo || undefined,
      creditos: val.creditos ? Number(val.creditos) : undefined,
      color: val.color || '#0f766e',
      activa: val.activa !== undefined ? Boolean(val.activa) : true
    };

    if (this.editandoId !== null) {
      this.apiService.updateAsignatura(this.editandoId, payload).subscribe({
        next: (res: ApiResponse<Asignatura>) => {
          if (res.success) {
            this.exitoMsg = 'Asignatura actualizada correctamente';
            this.cancelarEdicion();
            this.cargarAsignaturas();
          } else {
            this.errorMsg = res.error || 'Error al actualizar asignatura';
          }
          this.guardando = false;
        },
        error: () => {
          this.errorMsg = 'Error en el servidor al actualizar';
          this.guardando = false;
        }
      });
    } else {
      this.apiService.createAsignatura(payload).subscribe({
        next: (res: ApiResponse<Asignatura>) => {
          if (res.success) {
            this.exitoMsg = '¡Asignatura registrada con éxito!';
            this.initForm();
            this.cargarAsignaturas();
          } else {
            this.errorMsg = res.error || 'Error al crear asignatura';
          }
          this.guardando = false;
        },
        error: () => {
          this.errorMsg = 'Error en el servidor al guardar';
          this.guardando = false;
        }
      });
    }
  }

  editar(asig: Asignatura): void {
    this.editandoId = asig.id;
    this.asignaturaForm.patchValue({
      nombre: asig.nombre,
      codigo: asig.codigo || '',
      creditos: asig.creditos || null,
      color: asig.color || '#0f766e',
      activa: asig.activa
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.initForm();
  }

  confirmarEliminar(asig: Asignatura): void {
    this.asignaturaAEliminar = asig;
  }

  cancelarEliminar(): void {
    this.asignaturaAEliminar = null;
  }

  eliminarConfirmado(): void {
    if (!this.asignaturaAEliminar) return;

    const id = this.asignaturaAEliminar.id;
    this.asignaturaAEliminar = null;

    this.apiService.deleteAsignatura(id).subscribe({
      next: (res: ApiResponse<void>) => {
        if (res.success) {
          this.exitoMsg = 'Asignatura eliminada correctamente';
          this.cargarAsignaturas();
        } else {
          this.errorMsg = res.error || 'Error al eliminar la asignatura';
        }
      },
      error: () => {
        this.errorMsg = 'Error al eliminar la asignatura en el servidor';
      }
    });
  }
}
