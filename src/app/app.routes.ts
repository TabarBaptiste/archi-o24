import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { MainComponent } from './components/main/main.component';
import { CountriesListComponent } from './components/countries-list/countries-list.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';

export const routes: Routes = [
    { path: 'contact', component: ContactComponent },
    { path: 'about', component: AboutComponent },
    { path: '', component: MainComponent },
    { path: 'countries-list', component: CountriesListComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'profile/edit', component: ProfileEditComponent }
];
