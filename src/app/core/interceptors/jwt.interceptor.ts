import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacadeService } from '../../state/auth-facade.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacadeService);
  const token = authFacade.token();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
