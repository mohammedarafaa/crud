import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-authlayout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './authlayout.component.html',
  styleUrl: './authlayout.component.scss'
})
export class AuthlayoutComponent {

}
