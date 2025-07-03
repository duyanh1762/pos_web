import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsImVtYWlsIjoibmFtcGh1dGhvQGdtYWlsLmNvbSIsImlhdCI6MTc1MTU0ODI1MSwiZXhwIjoxNzUxNjM0NjUxfQ.B4iCkQVpwxS1bjZ6FHd-Tvcq2uftojaKYbJbcBkIhHM';
    let newReq = request.clone({headers:request.headers.set('Authorization', 'Bearer ' + token)});
    return next.handle(newReq);
  }
}
