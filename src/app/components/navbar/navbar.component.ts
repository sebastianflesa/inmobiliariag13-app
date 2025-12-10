import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PLATFORM_ID } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Input() isAuthenticated: boolean = false;
  userName: string = '';
  userEmail: string = '';
  isMenuOpen = false;

  readonly protectedLinks = [
    { label: 'Clientes', route: '/clientes' },
    { label: 'Proyectos', route: '/proyectos' },
    { label: 'Unidades', route: '/unidades' },
    { label: 'Contratos', route: '/contratos' },
    { label: 'Pagos', route: '/pagos' },
    { label: 'Calificaciones', route: '/calificacion' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();

    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });

    this.authService.userProfile$.subscribe((profile) => {
      this.userName = profile?.name ?? '';
      this.userEmail = profile?.email ?? '';
    });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.isMenuOpen = false);

    if (isPlatformBrowser(this.platformId) && window.location.href.includes('code=')) {
      this.authService.handleRedirectCallback();
    }
  }

  openRegisterModal(): void {
    this.authService.registerWithCognito();
  }

  openLoginModal() {
    this.authService.loginWithCognito();
  }

  goToProfile(): void {
    this.router.navigate(['/mi-perfil']);
  }

  get avatarInitial(): string {
    const source = (this.userName || this.userEmail || '').trim();
    return source ? source.charAt(0).toUpperCase() : '';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
