/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
/* eslint-disable no-trailing-spaces */
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError, finalize, mergeMap } from 'rxjs/operators';
import { UiService } from '../services/ui.service';

import { StorageService } from 'src/app/core/services/storage.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
      private uiService: UiService,
      private storageService: StorageService,
      private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      // this.uiService.loadingChecker.next(true);
      // let promise = this.storageService.getAuthToken();
      const token = this.storageService.getString('token');
      if(token)
      {
        req = req.clone({
          setHeaders: {
              Authorization: `Bearer ${token}`
          }
      });
      }
      return next.handle(req).pipe(

          map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
          }
          return event;

      }),

      catchError((error: HttpErrorResponse) => {

          if (error.status === 401) {
              this.storageService.clear();
              this.uiService.openSnackBar('Unauthorized Access Please Login','Close');
              this.router.navigate(['']);

          }
          else if (error.status === 0) {
              alert('Internet connection error');
              return throwError({error: {message: 'Internet Connection Error'}});

          }
          else if(error.status === 429){
            this.storageService.clear();
            this.router.navigate(['']);
            return throwError({error: {message: 'Too many requests from this IP, please try again in an hour!'}});
          }
          return throwError(error);
      }),

      finalize(() => {
          // this.uiService.loadingChecker.next(false);
      }));
      // return from(promise)
      // .pipe(mergeMap((token) => {
      //     let clonedReq = this.addToken(req, token);

      // }));

  }

  private addToken(request: HttpRequest<any>, token: any) {
      if (token) {
          let clone: HttpRequest<any>;
          clone = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${token.value}`
              }
          });
          return clone;
      }

      return request;
  }
}
