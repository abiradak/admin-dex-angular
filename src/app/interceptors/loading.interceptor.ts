import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import 'rxjs/add/operator/catch';
// import 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { DataService } from '../service/data.service';
import { HelperService } from '../service/helper.service';
import { Router } from '@angular/router';



@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private helper: HelperService , private dataService: DataService , private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    Promise.resolve(null).then(() => this.dataService.showLoader());
    return next.handle(req).pipe( tap(event => {
      if (event instanceof HttpResponse) {
        if (event.body === null) {
          this.helper.alertFordanger('' ,'No Data Found');
          this.dataService.hideLoader();
        }
        this.dataService.hideLoader();
      }
    })).pipe( catchError( (error: HttpErrorResponse) => {
      if (error instanceof HttpErrorResponse && error.status == 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(["login"]);
      }
      this.dataService.hideLoader();
      return Observable.throwError(error);
    }));
  }
}
