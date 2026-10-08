import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  DashboardResumen,
  RegistroSueno,
  RegistroSuenoInput,
  Asignatura,
  AsignaturaInput,
  EntregaAcademica,
  EntregaAcademicaInput,
  RegistroEstudio,
  RegistroEstudioInput,
  Alerta,
  CargaSemanalInfo
} from '../models/vitalcampus.models';

@Injectable({
  providedIn: 'root'
})
export class VitalCampusService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- DASHBOARD ---
  getDashboardResumen(): Observable<ApiResponse<DashboardResumen>> {
    return this.http.get<ApiResponse<DashboardResumen>>(`${this.apiUrl}/dashboard/resumen`);
  }

  // --- SUEÑO ---
  getSuenos(): Observable<ApiResponse<RegistroSueno[]>> {
    return this.http.get<ApiResponse<RegistroSueno[]>>(`${this.apiUrl}/suenos`);
  }

  getSuenosSemanal(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/suenos/semanal`);
  }

  createSueno(data: RegistroSuenoInput): Observable<ApiResponse<RegistroSueno>> {
    return this.http.post<ApiResponse<RegistroSueno>>(`${this.apiUrl}/suenos`, data);
  }

  updateSueno(id: number, data: Partial<RegistroSuenoInput>): Observable<ApiResponse<RegistroSueno>> {
    return this.http.put<ApiResponse<RegistroSueno>>(`${this.apiUrl}/suenos/${id}`, data);
  }

  deleteSueno(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/suenos/${id}`);
  }

  // --- ASIGNATURAS ---
  getAsignaturas(): Observable<ApiResponse<Asignatura[]>> {
    return this.http.get<ApiResponse<Asignatura[]>>(`${this.apiUrl}/asignaturas`);
  }

  createAsignatura(data: AsignaturaInput): Observable<ApiResponse<Asignatura>> {
    return this.http.post<ApiResponse<Asignatura>>(`${this.apiUrl}/asignaturas`, data);
  }

  updateAsignatura(id: number, data: Partial<AsignaturaInput>): Observable<ApiResponse<Asignatura>> {
    return this.http.put<ApiResponse<Asignatura>>(`${this.apiUrl}/asignaturas/${id}`, data);
  }

  deleteAsignatura(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/asignaturas/${id}`);
  }

  // --- ENTREGAS ACADÉMICAS ---
  getEntregas(estado?: string, asignaturaId?: number): Observable<ApiResponse<EntregaAcademica[]>> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    if (asignaturaId) params = params.set('asignaturaId', asignaturaId.toString());
    return this.http.get<ApiResponse<EntregaAcademica[]>>(`${this.apiUrl}/entregas`, { params });
  }

  createEntrega(data: EntregaAcademicaInput): Observable<ApiResponse<EntregaAcademica>> {
    return this.http.post<ApiResponse<EntregaAcademica>>(`${this.apiUrl}/entregas`, data);
  }

  updateEntrega(id: number, data: Partial<EntregaAcademicaInput>): Observable<ApiResponse<EntregaAcademica>> {
    return this.http.put<ApiResponse<EntregaAcademica>>(`${this.apiUrl}/entregas/${id}`, data);
  }

  deleteEntrega(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/entregas/${id}`);
  }

  // --- ESTUDIO E INDICADORES ---
  getEstudio(asignaturaId?: number): Observable<ApiResponse<RegistroEstudio[]>> {
    let params = new HttpParams();
    if (asignaturaId) params = params.set('asignaturaId', asignaturaId.toString());
    return this.http.get<ApiResponse<RegistroEstudio[]>>(`${this.apiUrl}/estudio`, { params });
  }

  createEstudio(data: RegistroEstudioInput): Observable<ApiResponse<RegistroEstudio>> {
    return this.http.post<ApiResponse<RegistroEstudio>>(`${this.apiUrl}/estudio`, data);
  }

  getCargaSemanal(): Observable<ApiResponse<CargaSemanalInfo>> {
    return this.http.get<ApiResponse<CargaSemanalInfo>>(`${this.apiUrl}/indicadores/carga-semanal`);
  }

  // --- ALERTAS ---
  getAlertas(): Observable<ApiResponse<Alerta[]>> {
    return this.http.get<ApiResponse<Alerta[]>>(`${this.apiUrl}/alertas`);
  }

  marcarAlertaLeida(id: number): Observable<ApiResponse<Alerta>> {
    return this.http.patch<ApiResponse<Alerta>>(`${this.apiUrl}/alertas/${id}/leida`, {});
  }
}
