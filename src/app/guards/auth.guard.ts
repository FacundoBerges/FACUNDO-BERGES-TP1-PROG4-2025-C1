import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

import { User } from '@supabase/supabase-js';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService: AuthService = inject(AuthService);
  const user: User | null = authService.user();

  const isLoggedIn: boolean = !!user;

  if (!isLoggedIn) {
    const router = inject(Router);

    router.navigate(['/login'], {
      queryParams: {
        redirectTo: state.url,
      },
    });
  }

  return !!user;
};
