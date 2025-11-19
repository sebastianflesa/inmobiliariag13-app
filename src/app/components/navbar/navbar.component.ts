import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Input() isAuthenticated: boolean = false;
  userName: string = '';
  userEmail: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Check authentication state on initialization
    this.isAuthenticated = this.authService.isLoggedIn();

    // Subscribe to authentication state changes
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });

    this.authService.userProfile$.subscribe((profile) => {
      this.userName = profile?.name ?? '';
      this.userEmail = profile?.email ?? '';
    });

    // Handle redirect callback if code is present in URL
    if (isPlatformBrowser(this.platformId) && window.location.href.includes('code=')) {
      this.authService.handleRedirectCallback();
    }
  }

  openRegisterModal(): void {
    this.authService.registerWithCognito();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/logout']);
  }

  openLoginModal() {
    this.authService.loginWithCognito();
  }
}
