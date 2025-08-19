import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
selector: 'app-login',
imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
templateUrl: './login.component.html',
styleUrls: ['./login.component.scss']
})
export class LoginComponent {
loginForm: FormGroup;
submitted = false;
loading = false;
message: string = '';
succ: boolean = true;

constructor(private fb: FormBuilder, private http: HttpClient) {
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

this.http.post(`${environment.apiLocal}/auth/login`, this.loginForm.value).subscribe({
next: (res: any) => {
this.message = 'Connexion réussie ✅';
this.succ = true;
// console.log('Login success:', res);
// 👉 Ici tu peux stocker le token (localStorage) et rediriger
},
error: (err) => {
this.message = 'Nom d\'utilisateur ou mot de passe incorrect ❌';
this.succ = false;
// console.error(err);
this.loading = false;
},
complete: () => {
this.loading = false;
}
});
}
}
