import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { AuthService } from '../../auth.service';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private authService: AuthService) {
    // Initialiser avec l'utilisateur existant s'il y en a un
    this.initializeUserFromStorage();
  }

  /**
   * Initialise l'utilisateur depuis le stockage local au démarrage
   */
  private initializeUserFromStorage(): void {
    const storedUser = this.authService.getCurrentUser();
    if (storedUser && this.authService.isAuthenticated()) {
      this.userSubject.next(storedUser);
    }
  }

  /**
   * Met à jour les informations de l'utilisateur connecté
   * @param user - Les informations utilisateur
   */
  setUser(user: User): void {
    this.userSubject.next(user);
    // Synchroniser avec le AuthService pour maintenir la cohérence
    this.authService.saveUser(user);
  }

  /**
   * Récupère les informations de l'utilisateur connecté (version synchrone)
   * @returns L'utilisateur connecté ou null
   */
  getUser(): User | null {
    return this.userSubject.value;
  }

  /**
   * Récupère l'observable de l'utilisateur pour réactivité
   * @returns Observable de l'utilisateur connecté
   */
  getUser$(): Observable<User | null> {
    return this.user$;
  }

  /**
   * Vide le contexte utilisateur (déconnexion)
   */
  clearUser(): void {
    this.userSubject.next(null);
  }

  /**
   * Vérifie si un utilisateur est connecté
   * @returns true si un utilisateur est connecté
   */
  isUserLoggedIn(): boolean {
    return this.userSubject.value !== null && this.authService.isAuthenticated();
  }

  /**
   * Met à jour partiellement les informations utilisateur
   * @param updates - Les champs à mettre à jour
   */
  updateUser(updates: Partial<User>): void {
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.setUser(updatedUser);
    }
  }

  /**
   * Récupère l'email de l'utilisateur connecté
   * @returns L'email ou null
   */
  getUserEmail(): string | null {
    return this.getUser()?.email || null;
  }

  /**
   * Récupère le nom de l'utilisateur connecté
   * @returns Le nom ou null
   */
  getUserName(): string | null {
    return this.getUser()?.name || null;
  }

  /**
   * Récupère l'ID de l'utilisateur connecté
   * @returns L'ID ou null
   */
  getUserId(): number | null {
    return this.getUser()?.id || null;
  }
}
