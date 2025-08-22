import { ThemeService } from './services/theme.service';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { UserContextService } from './services/userContext/user-context.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'archi-o24';

  constructor(private userContextService: UserContextService, private themeService: ThemeService) { }

  ngOnInit(): void {
    // Le UserContextService s'initialise automatiquement depuis le storage
    this.themeService.loadTheme();
  }
}
