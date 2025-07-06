import { UserService } from './services/user.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SessionService } from './services/session.service';
import { User } from './interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isHomePage: boolean = false;
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;
  isLogged$: Observable<boolean> = of(false);
  showFiller = false;
  currentUser: User | undefined;
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService) {
  }


  ngOnInit() {

    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/';
      this.isLoginPage = this.router.url === '/login';
      this.isRegisterPage = this.router.url === '/register';
    });
    this.isLogged$ = this.$isLogged();

    this.isLogged$.subscribe((isLogged) => {
      if (isLogged) {
        const session = this.sessionService.sessionInformation;
        this.userService
          .getById(session?.id.toString())
          .subscribe({
            next: (user: User) => {
              this.currentUser = user;
              console.log("user", this.currentUser);
            },
            error: (err) => {
              console.error('Erreur de récupération utilisateur:', err);
            }
          });
      } else {
        console.warn("Pas d'utilisateur en session.");
      }
    });
  }

  public $isLogged(): Observable<boolean> {
    return this.sessionService.$isLogged();
  }

  public logout(): void {
    this.sessionService.logOut();
    this.router.navigate([''])
  }
}
