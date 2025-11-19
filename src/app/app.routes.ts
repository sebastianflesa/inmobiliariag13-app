import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login-modal/login-modal.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { UnidadesComponent } from './components/unidades/unidades.component';
import { LogoutComponent } from './components/auth/logout.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'proyectos', component: ProyectosComponent, canActivate: [authGuard] },
    { path: 'clientes', component: ClientesComponent, canActivate: [authGuard] },
    { path: 'unidades', component: UnidadesComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'auth/callback', loadComponent: () => import('./components/auth/oidc-callback.component').then(m => m.OidcCallbackComponent) },
    { path: 'auth/logout-callback', loadComponent: () => import('./components/auth/oidc-logout-callback.component').then(m => m.OidcLogoutCallbackComponent) },
    { path: 'registro', component: RegisterModalComponent },
    { path: 'logout', component: LogoutComponent, canActivate: [authGuard] },
    { path: 'unauthorized', component: UnauthorizedComponent },
];
