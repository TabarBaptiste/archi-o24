import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { UserContextService, User } from '../../services/userContext/user-context.service';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ProfileEditComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: User | null = null;
  loading = false;
  error: string = '';
  showDeleteConfirmation = false;
  showEditModal = false;
  private userSubscription: Subscription = new Subscription();

  constructor(
    private profileService: ProfileService,
    private userContextService: UserContextService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // S'abonner aux changements d'utilisateur dans le contexte
    this.userSubscription = this.userContextService.getUser$().subscribe(user => {
      if (user) {
        this.profile = user;
      } else {
        this.profile = null;
      }
    });

    this.loadProfile();
  }

  ngOnDestroy(): void {
    // Nettoyer les abonnements
    this.userSubscription.unsubscribe();
  }

  private loadProfile(): void {
    // Vérifier d'abord si l'utilisateur est connecté via le contexte
    if (!this.userContextService.isUserLoggedIn()) {
      this.error = "Vous devez être connecté.";
      this.router.navigate(['/login']);
      return;
    }

    // Récupérer les infos depuis le contexte utilisateur d'abord
    const contextUser = this.userContextService.getUser();
    if (contextUser) {
      this.profile = contextUser;
    }

    // Puis charger les infos depuis l'API pour avoir des données à jour
    this.getProfile();
  }

  getProfile(): void {
    this.loading = true;
    this.error = '';

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  refreshProfile(): void {
    this.getProfile();
  }

  logout(): void {
    this.profileService.logout();
    // Le contexte se met à jour automatiquement via le ProfileService
    this.router.navigate(['/login']);
  }

  editProfile(): void {
    // Ouvrir la modale d'édition
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    // Recharger le profil pour avoir les dernières données
    this.loadProfile();
  }

  confirmDeleteAccount(): void {
    this.showDeleteConfirmation = true;
  }

  cancelDeleteAccount(): void {
    this.showDeleteConfirmation = false;
  }

  deleteAccount(): void {
    this.loading = true;
    this.error = '';

    this.profileService.deleteAccount().subscribe({
      next: () => {
        // Le service gère déjà la déconnexion
        alert('Compte supprimé avec succès');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.showDeleteConfirmation = false;
        
        if (err.status === 401) {
          this.error = "Session expirée. Veuillez vous reconnecter.";
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.error = "Erreur lors de la suppression du compte ❌";
          console.error('Erreur suppression compte:', err);
        }
      }
    });
  }

  private handleError(err: any): void {
    this.loading = false;
    
    if (err.status === 401) {
      this.error = "Session expirée. Veuillez vous reconnecter.";
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else if (err.message === 'Token manquant') {
      this.error = "Vous devez être connecté.";
      this.router.navigate(['/login']);
    } else {
      this.error = "Impossible de charger le profil ❌";
      console.error('Erreur profile:', err);
    }
  }
}
