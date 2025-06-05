import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
islogin = input<boolean>(true)
private readonly routerService = inject(Router)
logout():void
{
  localStorage.removeItem('token')
  this.routerService.navigate(['/login'])
}
}
