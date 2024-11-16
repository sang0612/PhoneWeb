import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { AuthService } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        authorization: 'Bearer ' + token,
      },
    });

    return next(cloned);
  } else {
    return next(req);
  }
};
