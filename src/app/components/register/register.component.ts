import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.message = '';

    const payload = this.registerForm.value;

    this.http.post(`${environment.apiLocal}/auth/register`, payload).subscribe({
      next: (res) => {
        this.message = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        this.loading = false;
        this.registerForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        this.message = 'Erreur lors de l\'inscription. Vérifiez vos informations.';
        this.loading = false;
      }
    });
  }
}
