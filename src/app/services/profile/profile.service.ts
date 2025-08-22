import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment, END_POINTS } from '../../../environments/environment';
import { AuthService } from '../../auth.service';
import { UserContextService } from '../userContext/user-context.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userContextService: UserContextService
  ) { }

  /**
   * Récupère le profil utilisateur depuis l'API
   */
  getProfile(): Observable<any> {
    const token = this.authService.getToken();
    
    if (!token) {
      return throwError(() => new Error('Token manquant'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(END_POINTS.user.profile, { headers }).pipe(
      tap(profile => {
        // Mettre à jour les infos stockées localement ET le contexte utilisateur
        this.authService.saveUser(profile as any);
        this.userContextService.setUser(profile as any);
      }),
      catchError(error => {
        console.error('Erreur lors du chargement du profil:', error);
        
        // Si erreur d'authentification, nettoyer les données locales ET le contexte
        if (error.status === 401) {
          this.authService.logout();
          this.userContextService.clearUser();
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * Met à jour le profil utilisateur
   */
  updateProfile(profileData: any): Observable<any> {
    const token = this.authService.getToken();
    
    if (!token) {
      return throwError(() => new Error('Token manquant'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(END_POINTS.user.profile, profileData, { headers }).pipe(
      tap(updatedProfile => {
        // Mettre à jour les infos stockées localement ET le contexte utilisateur
        this.authService.saveUser(updatedProfile as any);
        this.userContextService.setUser(updatedProfile as any);
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Supprime le compte utilisateur
   */
  deleteAccount(): Observable<any> {
    const token = this.authService.getToken();
    
    if (!token) {
      return throwError(() => new Error('Token manquant'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${environment.apiLocal}/users/account`, { headers }).pipe(
      tap(() => {
        // Nettoyer les données locales ET le contexte après suppression du compte
        this.authService.logout();
        this.userContextService.clearUser();
      }),
      catchError(error => {
        console.error('Erreur lors de la suppression du compte:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Récupère l'utilisateur actuel depuis le contexte (plus performant)
   */
  getCurrentUserFromCache(): any {
    // Utiliser d'abord le contexte, puis le fallback sur AuthService
    return this.userContextService.getUser() || this.authService.getCurrentUser();
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    this.authService.logout();
    this.userContextService.clearUser();
  }
}
