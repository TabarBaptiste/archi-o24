import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.loading = true;
    this.error = '';

    // 👉 Récupération du token depuis localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = "Vous devez être connecté.";
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get(`${environment.apiLocal}/users/profile`, { headers }).subscribe({
      next: (res: any) => {
        this.profile = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Impossible de charger le profil ❌";
        console.error(err);
        this.loading = false;
      }
    });
  }

  refreshProfile(): void {
    this.getProfile();
  }
}
