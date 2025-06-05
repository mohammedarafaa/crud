import { AuthService } from './../../services/auth.service';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  public errMessage:WritableSignal<string> = signal('')
  public loginform!: FormGroup;
  private loginSubscription?: Subscription;
    private readonly authService = inject(AuthService);
    private readonly routerService = inject(Router);
  private readonly formBuildeService = inject(FormBuilder);
  ngOnInit(): void {
    this.loginform = this.formBuildeService.group({
      username: [null,Validators.required],
      password: [null,Validators.required],
    });
  }
  loginSubmit(): void {
    if (this.loginform.valid) {
      this.loginSubscription = this.authService.login(this.loginform.value).subscribe({
        next: (res) => {
          console.log(res)
          localStorage.setItem('token',res.token)
          if(res.token !== null)
          {
            this.routerService.navigate(['/home'])
          }
        },
        error: (err) => {
        this.errMessage.set(err.error.message)
        },
      });
    }
    else
    {
      this.loginform.markAllAsTouched()
    }
  }
  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}
