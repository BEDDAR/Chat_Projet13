import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { WebSocketService } from 'src/app/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {

  public user: User | undefined;
  public formMe: FormGroup | undefined;

  constructor(private wsService: WebSocketService,
    private router :Router,
    private sessionService: SessionService,
    private matSnackBar: MatSnackBar,
    private userService: UserService,
    private fb: FormBuilder) {
  }

  public ngOnInit(): void {
    this.userService
      .getById(this.sessionService.sessionInformation!.id.toString())
      .subscribe((user: User) => {
        this.user = user;
        this.initForm();
        console.log(this.user)
      });
    ;
  }

  public submit(): void {
    const user = this.formMe?.value as User;

    if (this.user && this.sessionService.sessionInformation?.id) {
      user.id = this.sessionService.sessionInformation?.id
      console.log(user)
      this.userService.update(user)
        .subscribe((_: User) => {
          this.matSnackBar.open("Tes nouvelles informations sont bien enregistrées !", 'Close', { duration: 3000 });
        })
    } else {
      this.matSnackBar.open("Echec d'enregistrement", 'Close', { duration: 3000 });
    }
  }

  initForm(): void {
    console.log(this.user)
    this.formMe = this.fb.group({
      userName: [this.user?.userName],
      email: [this.user?.email,
      [
        Validators.required,
        Validators.email
      ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.min(3)
        ]
      ]
    });
  }
}
