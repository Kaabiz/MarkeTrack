import { HttpInterceptorFn } from '@angular/common/http';

export const NoCacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only apply to API requests
  if (req.url.includes('/campaigns')) {
    const modifiedReq = req.clone({
      setHeaders: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    return next(modifiedReq);
  }
  
  return next(req);
};