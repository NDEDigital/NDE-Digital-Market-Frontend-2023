// import { Injectable } from '@angular/core';
// import { UserDataService } from 'src/app/services/user-data.service';
// import { SharedService } from 'src/app/services/shared.service';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import { Observable, catchError, switchMap, throwError } from 'rxjs';
// import { Router } from '@angular/router';

// @Injectable()
// export class UserTokenInterceptor implements HttpInterceptor {
//   constructor(
//     private user: UserDataService,
//     private router: Router,
//     private sharedService: SharedService
//   ) {}

//   intercept(
//     request: HttpRequest<unknown>,
//     next: HttpHandler
//   ): Observable<HttpEvent<unknown>> {
//     const userToken = this.user.GetAccessToken();

//     if (userToken) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       });
//     }

//     return next.handle(request).pipe(
//       catchError((err: HttpErrorResponse) => {
//         // console.log(' refreshhhhhhhhhhhhhhhhhhhhhhhhhhhh');
//         if (err instanceof HttpErrorResponse && err.status === 401) {
//           // const refreshToken = localStorage.getItem('RefreshToken');
//           // console.log(' refresh ', refreshToken);

//           return this.user.RenewToken().pipe(
//             switchMap((response: any) => {
//               console.log(response.accessToken, 'usss');

//               if (response.accessToken) {
//                 return next.handle(request) as Observable<HttpEvent<any>>;
//               }
//               return throwError('Token refresh failed') as Observable<
//                 HttpEvent<any>
//               >;
//             })
//           );
//         } else if (err instanceof HttpErrorResponse && err.status === 403) {
//           // console.log('  forbiddddddddddd');
//           this.logout();
//         }

//         return throwError(err); // Re-throw the original error for non-401 errors
//       })
//     );
//   }

//   logout() {
//     this.sharedService.updateLoginStatus(false, null, null);
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = '/login';
//   }
// }
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
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          // Handle unauthorized access, e.g., redirect to login page or show a login modal
          //   this.logout();
        } else if (err instanceof HttpErrorResponse && err.status === 403) {
          // Handle forbidden access, e.g., redirect to a forbidden page or show an access denied message
          // You might want to perform additional actions based on your requirements
        }

        return throwError(err); // Re-throw the original error for non-401 errors
      })
    );
  }

  logout() {
    this.sharedService.updateLoginStatus(false, null, null);
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']); // Use Angular router for navigation
  }
}
