import { Routes } from '@angular/router';
import { loggedGuard } from './guards/looged.guard';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    canActivate:[loggedGuard]
    ,
    loadComponent: () =>
      import('./layout/authlayout/authlayout.component').then(
        (c) => c.AuthlayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login.component').then(
            (c) => c.LoginComponent
          ),
        title:"login"
      },
    ],
  },
  {
    path: '',
    canActivate:[authGuard]
    ,
    loadComponent: () =>
      import('./layout/mainlayout/mainlayout.component').then(
        (c) => c.MainlayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home.component').then(
            (c) => c.HomeComponent
          ),
          title:"home"
      },
    ],
  },
];
