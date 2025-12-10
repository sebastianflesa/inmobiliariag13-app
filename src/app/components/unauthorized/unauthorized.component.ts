import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="unauthorized-loading" aria-busy="true" aria-live="polite">
      <div class="spinner" role="status" aria-label="Cargando"></div>
      <p class="text">Cargando...</p>
      <a routerLink="/" class="back-link">Volver al inicio</a>
    </div>
  `,
  styles: [`
    .unauthorized-loading {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      background: #f8f9fa;
      color: #0d6efd;
    }

    .spinner {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 4px solid rgba(13, 110, 253, 0.2);
      border-top-color: #0d6efd;
      animation: spin 1s linear infinite;
    }

    .text {
      font-weight: 600;
      margin: 0;
    }

    .back-link {
      color: #0d6efd;
      text-decoration: none;
      font-weight: 600;
    }

    .back-link:hover,
    .back-link:focus-visible {
      text-decoration: underline;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class UnauthorizedComponent {}
