import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-mainlayout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './mainlayout.component.html',
  styleUrl: './mainlayout.component.scss'
})
export class MainlayoutComponent {

}
