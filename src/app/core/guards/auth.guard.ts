import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacadeService } from '../../state/auth-facade.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  if (authFacade.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
