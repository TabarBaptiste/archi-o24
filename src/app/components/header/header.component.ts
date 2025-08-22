import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { UserContextService, User } from '../../services/userContext/user-context.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-header',
    imports: [RouterModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
    isLoggedIn = false;
    showDropdown = false;
    currentUser: User | null = null;
    private subscriptions = new Subscription();

    constructor(
        private authService: AuthService,
        private userContextService: UserContextService,
        private router: Router,
        private themeService: ThemeService
    ) { }

    ngOnInit() {
        // S'abonner aux changements d'utilisateur via le contexte
        const userSub = this.userContextService.getUser$().subscribe(user => {
            this.currentUser = user;
            this.isLoggedIn = user !== null;
        });

        // Ajouter l'abonnement aux subscriptions pour le cleanup
        this.subscriptions.add(userSub);
    }

    ngOnDestroy() {
        // Nettoyer tous les abonnements
        this.subscriptions.unsubscribe();
    }

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    closeDropdown() {
        this.showDropdown = false;
    }

    logout() {
        this.userContextService.clearUser();
        this.authService.logout();
        this.closeDropdown();
        this.router.navigate(['/login']);
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    getTheme(): string {
        return this.themeService.getCurrentTheme();
    }
}
