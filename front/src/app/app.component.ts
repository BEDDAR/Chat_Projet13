import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SessionService } from './services/session.service';

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
  constructor(
    private router: Router,
    private sessionService: SessionService) {
  }


  ngOnInit() {

    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/';
      this.isLoginPage = this.router.url === '/login';
      this.isRegisterPage = this.router.url === '/register';
    });
    this.isLogged$ = this.$isLogged();
  }

  public $isLogged(): Observable<boolean> {
    return this.sessionService.$isLogged();
  }

  public logout(): void {
    this.sessionService.logOut();
    this.router.navigate([''])
  }
}
