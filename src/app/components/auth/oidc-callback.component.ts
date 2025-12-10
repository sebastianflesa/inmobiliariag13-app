import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="auth-loading" aria-busy="true" aria-live="polite">
      <div class="spinner" role="status" aria-label="Cargando"></div>
      <h1 class="title">Procesando tu inicio de sesion</h1>
      <p class="subtitle">
        Estamos validando tus credenciales y preparando la aplicacion. Esto tomara solo unos segundos.
      </p>
    </div>
  `,
  styles: [`
    .auth-loading {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: #f8f9fa;
      color: #0d6efd;
      text-align: center;
    }

    .spinner {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 4px solid rgba(13, 110, 253, 0.2);
      border-top-color: #0d6efd;
      animation: spin 1s linear infinite;
    }

    .title {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 700;
    }

    .subtitle {
      margin: 0;
      color: #4a4a4a;
      max-width: 420px;
      line-height: 1.5;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class OidcCallbackComponent {}
