import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <h1>Acceso no autorizado</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <a routerLink="/">Volver al inicio</a>
    </div>
  `,
  styles: [
    `
      .unauthorized-container {
        text-align: center;
        margin-top: 50px;
      }

      h1 {
        color: #ff0000;
      }

      a {
        color: #007bff;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `
  ]
})
export class UnauthorizedComponent {}
