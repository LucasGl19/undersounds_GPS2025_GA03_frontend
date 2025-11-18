import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem('access');

  const isUsersApi = req.url.startsWith(environment.usersApiUrl);
  const isContentApi = req.url.startsWith(environment.contentApiUrl);

  if (accessToken && (isUsersApi || isContentApi)) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
