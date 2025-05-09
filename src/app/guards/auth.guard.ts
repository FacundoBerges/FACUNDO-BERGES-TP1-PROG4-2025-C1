import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const authService: AuthService = inject(AuthService);
  const isLoggedIn: boolean = !!authService.user();

  if (!isLoggedIn) {
    const router = inject(Router);

    router.navigate(['/login'], {
      queryParams: {
        redirectTo: state.url,
      },
    });
  }

  return isLoggedIn;
};
