import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  loading = false;
  error: string = '';

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    // Vérifier d'abord si l'utilisateur est connecté
    if (!this.profileService.isAuthenticated()) {
      this.error = "Vous devez être connecté.";
      this.router.navigate(['/login']);
      return;
    }

    // Récupérer les infos depuis le cache local d'abord
    const cachedUser = this.profileService.getCurrentUserFromCache();
    if (cachedUser) {
      this.profile = cachedUser;
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
    this.router.navigate(['/login']);
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
