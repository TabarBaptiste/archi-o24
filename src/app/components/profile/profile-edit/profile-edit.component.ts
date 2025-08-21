import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../services/profile/profile.service';

@Component({
  selector: 'app-profile-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent implements OnInit {
  editForm: FormGroup;
  profile: any = null;
  loading = false;
  saving = false;
  error: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: [''] // Email sera désactivé
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    // Vérifier d'abord si l'utilisateur est connecté
    if (!this.profileService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Récupérer les infos depuis le cache local
    const cachedUser = this.profileService.getCurrentUserFromCache();
    if (cachedUser) {
      this.profile = cachedUser;
      this.populateForm();
    }

    // Charger depuis l'API pour avoir les données à jour
    this.getProfile();
  }

  private getProfile(): void {
    this.loading = true;
    this.error = '';

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.populateForm();
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private populateForm(): void {
    if (this.profile) {
      this.editForm.patchValue({
        name: this.profile.name,
        email: this.profile.email
      });
      
      // Désactiver le champ email
      this.editForm.get('email')?.disable();
    }
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    const formData = {
      name: this.editForm.get('name')?.value
    };

    this.profileService.updateProfile(formData).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.successMessage = 'Profil mis à jour avec succès ! ✅';
        this.saving = false;
        
        // Retourner au profil après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
      },
      error: (err) => {
        this.saving = false;
        this.handleError(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

  get f() {
    return this.editForm.controls;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  private handleError(err: any): void {
    this.loading = false;
    
    if (err.status === 401) {
      this.error = "Session expirée. Redirection...";
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else if (err.status === 400) {
      this.error = "Données invalides. Veuillez vérifier vos informations.";
    } else if (err.message === 'Token manquant') {
      this.router.navigate(['/login']);
    } else {
      this.error = "Erreur lors de la mise à jour du profil ❌";
      console.error('Erreur edit profile:', err);
    }
  }
}
