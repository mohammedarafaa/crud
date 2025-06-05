import { CanActivateFn, Router } from '@angular/router';
import { PlatformService } from '../services/platform.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const platformService = inject(PlatformService);
  const routerService = inject(Router);
  if (platformService.checkPlatform()) {
    if (localStorage.getItem('token') !== null) {
      return true;
    }
  }
  routerService.navigate(['/login']);
  return false;
};
