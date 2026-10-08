import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { VitalCampusService } from './services/vitalcampus.service';
import { Alerta, ApiResponse } from './models/vitalcampus.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  usuarioNombre = 'Estudiante Demo VitalCampus';
  usuarioCorreo = 'estudiante@vitalcampus.com';
  alertasNoLeidasCount = 0;
  mobileMenuOpen = false;

  constructor(private apiService: VitalCampusService) {}

  ngOnInit(): void {
    this.cargarConteoAlertas();
  }

  cargarConteoAlertas(): void {
    this.apiService.getAlertas().subscribe({
      next: (res: ApiResponse<Alerta[]>) => {
        if (res.success && res.data) {
          this.alertasNoLeidasCount = res.data.filter((a: Alerta) => !a.leida).length;
        }
      },
      error: () => {}
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
