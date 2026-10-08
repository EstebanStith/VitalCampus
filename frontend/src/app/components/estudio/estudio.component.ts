import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VitalCampusService } from '../../services/vitalcampus.service';
import { RegistroEstudio, RegistroEstudioInput, Asignatura, CargaSemanalInfo, ApiResponse } from '../../models/vitalcampus.models';

@Component({
  selector: 'app-estudio',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule],
  templateUrl: './estudio.component.html',
  styleUrls: ['./estudio.component.css']
})
export class EstudioComponent implements OnInit {
  estudioForm!: FormGroup;
  registros: RegistroEstudio[] = [];
  asignaturas: Asignatura[] = [];
  cargaInfo: CargaSemanalInfo | null = null;
  cargando = true;
  guardando = false;
  errorMsg = '';
  exitoMsg = '';

  constructor(
    private fb: FormBuilder,
    private apiService: VitalCampusService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarAsignaturas();
    this.cargarDatos();
  }

  initForm(): void {
    const hoyStr = new Date().toISOString().substring(0, 10);
    this.estudioForm = this.fb.group({
      asignaturaId: [null, [Validators.required]],
      fecha: [hoyStr, [Validators.required]],
      horasEstudio: [2, [Validators.required, Validators.min(0.5), Validators.max(16)]],
      observacion: ['']
    });
  }

  cargarAsignaturas(): void {
    this.apiService.getAsignaturas().subscribe({
      next: (res: ApiResponse<Asignatura[]>) => {
        if (res.success && res.data) {
          this.asignaturas = res.data;
          if (this.asignaturas.length && !this.estudioForm.get('asignaturaId')?.value) {
            this.estudioForm.patchValue({ asignaturaId: this.asignaturas[0].id });
          }
        }
      }
    });
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMsg = '';

    this.apiService.getEstudio().subscribe({
      next: (res: ApiResponse<RegistroEstudio[]>) => {
        if (res.success && res.data) {
          this.registros = res.data;
        }
        this.cargarCargaSemanal();
      },
      error: () => {
        this.errorMsg = 'Error al cargar historial de estudio';
        this.cargando = false;
      }
    });
  }

  cargarCargaSemanal(): void {
    this.apiService.getCargaSemanal().subscribe({
      next: (res: ApiResponse<CargaSemanalInfo>) => {
        if (res.success && res.data) {
          this.cargaInfo = res.data;
        }
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  onSubmit(): void {
    if (this.estudioForm.invalid) {
      this.estudioForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMsg = '';
    this.exitoMsg = '';

    const val = this.estudioForm.value;
    const payload: RegistroEstudioInput = {
      asignaturaId: Number(val.asignaturaId),
      fecha: new Date(val.fecha).toISOString(),
      horasEstudio: Number(val.horasEstudio),
      observacion: val.observacion || undefined
    };

    this.apiService.createEstudio(payload).subscribe({
      next: (res: ApiResponse<RegistroEstudio>) => {
        if (res.success) {
          this.exitoMsg = '¡Sesión de estudio registrada con éxito!';
          this.initForm();
          if (this.asignaturas.length) {
            this.estudioForm.patchValue({ asignaturaId: this.asignaturas[0].id });
          }
          this.cargarDatos();
        } else {
          this.errorMsg = res.error || 'Error al guardar sesión de estudio';
        }
        this.guardando = false;
      },
      error: () => {
        this.errorMsg = 'Error en el servidor al registrar horas de estudio';
        this.guardando = false;
      }
    });
  }
}
