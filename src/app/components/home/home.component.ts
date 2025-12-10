import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProyectoService } from '../../services/proyecto.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  loadingProyectos = false;
  proyectoStats = {
    total: 0,
    enConstruccion: 0,
    enPlanificacion: 0,
    terminados: 0
  };

  private subs = new Subscription();

  constructor(
    private authService: AuthService,
    private proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();

    this.subs.add(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.cargarIndicadores();
        }
      })
    );

    if (this.isAuthenticated) {
      this.cargarIndicadores();
    }
  }

  private cargarIndicadores(): void {
    this.loadingProyectos = true;
    this.proyectoService.getProyectos().subscribe({
      next: (response: any) => {
        const proyectos = response?.data ?? [];
        this.proyectoStats = {
          total: proyectos.length,
          enConstruccion: proyectos.filter((p: any) => p.estado === 'En construccion').length,
          enPlanificacion: proyectos.filter((p: any) => p.estado === 'En planificacion').length,
          terminados: proyectos.filter((p: any) => p.estado === 'Terminado').length
        };
        this.loadingProyectos = false;
      },
      error: (err: any) => {
        console.error('Error al cargar indicadores de proyectos', err);
        this.loadingProyectos = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
