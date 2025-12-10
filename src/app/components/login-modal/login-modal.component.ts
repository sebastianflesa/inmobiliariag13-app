import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Injector, Inject, OnInit, Optional, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PLATFORM_ID } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginComponent implements OnInit {
  isAuthenticated = false;
  userDataJson = signal<string>('{}');

  constructor(
    @Optional() private activeModal: NgbActiveModal,
    private router: Router,
    private injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const oidc = this.injector.get<OidcSecurityService>(OidcSecurityService);

    oidc.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        oidc.userData$.subscribe(data => this.userDataJson.set(JSON.stringify(data, null, 2)));
        this.activeModal?.close();
        this.router.navigate(['/']);
      }
    });
  }

  login(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const oidc = this.injector.get<OidcSecurityService>(OidcSecurityService);
    oidc.authorize();
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const oidc = this.injector.get<OidcSecurityService>(OidcSecurityService);
    oidc.logoff();
  }

  closeModal(): void {
    this.activeModal?.close();
  }
}
