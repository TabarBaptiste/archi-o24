import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth.service';
import { UserContextService, User } from '../../services/userContext/user-context.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  showDropdown = false;
  currentUser: User | null = null;
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private userContextService: UserContextService,
    private router: Router
  ) {}

  ngOnInit() {
    // ✅ On s’abonne au contexte utilisateur
    const userSub = this.userContextService.getUser$().subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = user !== null;
    });

    this.subscriptions.add(userSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  logout() {
    this.userContextService.clearUser(); // ✅ utile si ton service gère l’état utilisateur
    this.authService.logout();
    this.closeDropdown();
    this.router.navigate(['/login']); // ✅ redirection claire
  }
}
