// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { END_POINTS } from '../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const token = this.getToken();
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        this.currentUserSubject.next(parsedUser);
        this.isLoggedInSubject.next(true);
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  // Appel à l'API pour s'inscrire
  register(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(END_POINTS.auth.register, payload)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  // Appel à l'API pour se connecter
  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(END_POINTS.auth.login, payload)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.saveToken(response.token);
    this.saveUser(response.user);
    this.currentUserSubject.next(response.user);
    this.isLoggedInSubject.next(true);
  }

  // Sauvegarde du token dans le localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Sauvegarde des infos utilisateur
  saveUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Récupération du token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Récupération de l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Vérification si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  // Déconnexion
  logout(): void {
    this.clearAuth();
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  private clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
}
