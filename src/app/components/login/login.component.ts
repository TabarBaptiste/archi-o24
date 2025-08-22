import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { UserContextService } from '../../services/userContext/user-context.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  message: string = '';
  succ: boolean = true;
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private userContextService: UserContextService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.message = 'Connexion réussie ✅';
        this.succ = true;

        // Mettre à jour le contexte utilisateur avec les informations reçues
        if (res.user) {
          this.userContextService.setUser(res.user);
        }

        // Redirection après un délai
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1000);
      },
      error: () => {
        this.message = 'Nom d\'utilisateur ou mot de passe incorrect ❌';
        this.succ = false;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
