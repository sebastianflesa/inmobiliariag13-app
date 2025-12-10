import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface UserProfile {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'token';
  private userProfileKey = 'user-profile';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor(
    private oidcSecurityService: OidcSecurityService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.restoreSession();

    if (isPlatformBrowser(this.platformId)) {
      this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, accessToken, userData }) => {
        this.syncAuthState(isAuthenticated, accessToken ?? null, userData ?? null);
      });
    }
  }

  loginWithCognito(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.oidcSecurityService.authorize();
    }
  }

  registerWithCognito(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.oidcSecurityService.authorize(undefined, {
      customParams: {
        screen_hint: 'signup'
      }
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.oidcSecurityService.logoff();
      sessionStorage.clear();
      this.clearSession();
    }
  }
  
  getToken(): Observable<string | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }

    return this.oidcSecurityService.getAccessToken().pipe(
      map((accessToken) => {
        if (accessToken) {
          localStorage.setItem(this.tokenKey, accessToken);
          return accessToken;
        }
        return localStorage.getItem(this.tokenKey);
      })
    );
  }

  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      this.isAuthenticatedSubject.next(true);
    }
  }

  isLoggedIn() {
    return this.isAuthenticatedSubject.value;
  }

  handleRedirectCallback(): void {
    this.ensureAuthenticated().subscribe();
  }

  ensureAuthenticated(): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(false);
    }

    return this.oidcSecurityService.checkAuth().pipe(
      tap(({ isAuthenticated, accessToken, userData }) => {
        this.syncAuthState(isAuthenticated, accessToken ?? null, userData ?? null);
      }),
      map(({ isAuthenticated }) => isAuthenticated)
    );
  }

  private syncAuthState(isAuthenticated: boolean, accessToken: string | null, userData: any = null) {
    if (isAuthenticated && accessToken) {
      localStorage.setItem(this.tokenKey, accessToken);
    } else {
      this.clearSession();
    }

    this.isAuthenticatedSubject.next(isAuthenticated);

    if (isAuthenticated) {
      const profile = this.toUserProfile(userData);
      this.userProfileSubject.next(profile);
      if (profile) {
        localStorage.setItem(this.userProfileKey, JSON.stringify(profile));
      }
    } else {
      this.userProfileSubject.next(null);
      localStorage.removeItem(this.userProfileKey);
    }
  }

  private clearSession() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userProfileKey);
    }
    this.isAuthenticatedSubject.next(false);
    this.userProfileSubject.next(null);
  }

  private restoreSession() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const storedToken = localStorage.getItem(this.tokenKey);
    const storedProfile = localStorage.getItem(this.userProfileKey);

    if (storedToken) {
      this.isAuthenticatedSubject.next(true);
    }

    if (storedProfile) {
      try {
        this.userProfileSubject.next(JSON.parse(storedProfile));
      } catch {
        localStorage.removeItem(this.userProfileKey);
      }
    }
  }

  private toUserProfile(userData: any): UserProfile | null {
    if (!userData) {
      return null;
    }

    const name =
      userData.name ||
      userData.given_name ||
      userData['cognito:username'] ||
      '';

    const email = userData.email || '';

    if (!name && !email) {
      return null;
    }

    return { name, email };
  }
}
