import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/componenent/login/login.component';
import { RegisterComponent } from './pages/auth/componenent/register/register.component';
import { ChatComponent } from './pages/chat/chat.component';
import { MeComponent } from './pages/me/me.component';
import { NotFoundComponent } from './pages/notFound/notFound.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'me', component: MeComponent },
  { path: 'chat', component: ChatComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
