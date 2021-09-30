import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { HelperService } from './helper.service';
// export const apiUrl = 'http://localhost:3000/api/';
// export const loginUrl = 'http://localhost:3000/';
export const apiUrl = 'https://us-central1-bluexch-com.cloudfunctions.net/webApi/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  qstring: any;
  params: any;
  requestHeader: any = new HttpHeaders().append(
    'Authorization',
    `${this.getToken()}`
  );
  private getToken() {
    return localStorage.getItem('token');
  }
  constructor(private http: HttpClient, private helper: HelperService) {}
  sendHttpCallWithToken(data: any = '', url: any, method: any) {
    if (navigator.onLine === false) {
      this.helper.alertFordanger('', 'No Connection!');
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          accept: 'aplication/json',
          Authorization: `${this.getToken()}`,
        }),
      };

      switch (method) {
        case 'post':
          return this.http.post<any>(apiUrl + url, data, httpOptions);

        case 'get':
          return this.http.get<any>(apiUrl + url, httpOptions);

        case 'put':
          return this.http.put<any>(apiUrl + url, data, httpOptions);
          
        case 'patch':
        return this.http.patch<any>(apiUrl + url, data, httpOptions);

        case 'delete':
          return this.http.delete<any>(apiUrl + url, httpOptions);

        default:
          console.log('Add method');
      }
    }
  }

  sendHttpCall(data: any = '', url: any, method: any) {
    if (navigator.onLine === false) {
      this.helper.alertFordanger('', 'No Connection!');
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          accept: 'aplication/json , */*',
          // withCredentials: 'true'
        }),
      };
      switch (method) {
        case 'post':
          return this.http.post<any>(apiUrl + url, data, httpOptions);

        case 'get':
          return this.http.get<any>(apiUrl + url, httpOptions);

        case 'put':
          return this.http.put<any>(apiUrl + url, data, httpOptions);

        case 'delete':
          return this.http.delete<any>(apiUrl + url, httpOptions);
      }
    }
  }

  sendHttpCallForLogin(data: any = '', url: any, method: any) {
    if (navigator.onLine === false) {
      this.helper.alertFordanger('', 'No Connection!');
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          accept: 'aplication/json , */*',
          // withCredentials: 'true'
        }),
      };
      switch (method) {
        case 'post':
          return this.http.post<any>(apiUrl + url, data, httpOptions);
        case 'get':
          return this.http.get<any>(url, httpOptions);
      }
    }
  }
}
