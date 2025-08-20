import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  loading = false;
  error: string = '';

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Vérifier d'abord si l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      this.error = "Vous devez être connecté.";
      this.router.navigate(['/login']);
      return;
    }

    // Récupérer les infos depuis le service d'abord
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profile = currentUser;
    }

    // Puis charger les infos depuis l'API pour avoir des données à jour
    this.getProfile();
  }

  getProfile(): void {
    this.loading = true;
    this.error = '';

    const token = this.authService.getToken();
    if (!token) {
      this.error = "Vous devez être connecté.";
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get(`${environment.apiLocal}/users/profile`, { headers }).subscribe({
      next: (res: any) => {
        this.profile = res;
        // Mettre à jour les infos stockées localement
        this.authService.saveUser(res);
        this.loading = false;
      },
      error: (err) => {
        this.error = "Impossible de charger le profil ❌";
        console.error(err);
        this.loading = false;
        
        // Si erreur d'authentification, rediriger vers login
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  refreshProfile(): void {
    this.getProfile();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
