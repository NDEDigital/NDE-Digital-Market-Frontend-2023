import { Injectable } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { SharedService } from 'src/app/services/shared.service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class UserTokenInterceptor implements HttpInterceptor {
  constructor(
    private user: UserDataService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const userToken = this.user.GetAccessToken();

    if (userToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${userToken}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // console.log(' refreshhhhhhhhhhhhhhhhhhhhhhhhhhhh');
        if (err instanceof HttpErrorResponse && err.status === 401) {
          // const refreshToken = localStorage.getItem('RefreshToken');
          // console.log(' refresh ', refreshToken);
          
            return this.user.RenewToken().pipe(
              switchMap((response: any) => {
                console.log(response.accessToken,"usss");
                
                if (response.accessToken) {
                
                  return next.handle(request) as Observable<HttpEvent<any>>;
                }
                return throwError('Token refresh failed') as Observable<
                  HttpEvent<any>
                >;
              })
            );
          
        } else if (err instanceof HttpErrorResponse && err.status === 403) {
          // console.log('  forbiddddddddddd');
          this.logout();
        }

        return throwError(err); // Re-throw the original error for non-401 errors
      })
    );
  }

  logout() {
    this.sharedService.updateLoginStatus(false, null, null);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
}
