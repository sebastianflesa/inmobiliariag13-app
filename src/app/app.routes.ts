import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login-modal/login-modal.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';

import { BuscarContratoComponent } from './components/buscar-contrato/buscar-contrato.component';
import { CalificacionComponent } from './components/calificacion/calificacion.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ContratosComponent } from './components/contratos/contratos.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { UnidadesComponent } from './components/unidades/unidades.component';
import { LogoutComponent } from './components/auth/logout.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterModalComponent },
  { path: 'crear-usuario', component: CreateUserComponent },

  { path: 'clientes', component: ClientesComponent, canActivate: [authGuard] },
  { path: 'unidades', component: UnidadesComponent, canActivate: [authGuard] },
  { path: 'proyectos', component: ProyectosComponent, canActivate: [authGuard] },
  { path: 'contratos', component: ContratosComponent, canActivate: [authGuard] },
  { path: 'pagos', component: PagosComponent, canActivate: [authGuard] },
  { path: 'calificacion', component: CalificacionComponent, canActivate: [authGuard] },
  { path: 'mi-perfil', component: ProfileComponent, canActivate: [authGuard] },

  { path: 'buscar-contrato', component: BuscarContratoComponent },

  {
    path: 'neonpay/:id',
    loadComponent: () =>
      import('./components/neonpay/neonpay.component').then(c => c.NeonpayComponent)
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./components/auth/oidc-callback.component').then(c => c.OidcCallbackComponent)
  },
  {
    path: 'auth/logout-callback',
    loadComponent: () =>
      import('./components/auth/oidc-logout-callback.component').then(c => c.OidcLogoutCallbackComponent)
  },

  { path: 'logout', component: LogoutComponent, canActivate: [authGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent },
];
