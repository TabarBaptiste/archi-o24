import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
    // {
    // 	path: 'header',
    // 	component: HeaderComponent
    // },
    { path: 'contact', component: ContactComponent },
    { path: 'about', component: AboutComponent },
    { path: 'main', component: MainComponent }
];
