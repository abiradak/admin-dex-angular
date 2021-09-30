import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
// import { NgxIndexedDBService } from 'ngx-indexed-db';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: "root",
})
export class DataService {
  toastConfig: object = {
    timeOut: 3000,
    progressBar: true,
  };
  encryptSecretKey = 'vrx9fd91fvrx9fd91f';
  private messageSource = new BehaviorSubject("");
  currentMessage = this.messageSource.asObservable();
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    // private dbService: NgxIndexedDBService
  ) {}

  private fooSubject = new Subject<any>();

  publishSomeData(data: any): void {
    this.fooSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.fooSubject;
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  encryptData(data: any) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  decryptData(data: any) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  // --- For showing the loader with custom setup, you can change the setup here
  showLoader(): void {
    this.spinner.show();
  }

  // --- For hideing the loader
  hideLoader(): void {
    this.spinner.hide();
  }

  isLogin(): boolean {
    const userData = localStorage.getItem("user");
    if (userData) {
      return true;
    } else {
      return false;
    }
  }

  transformDate(tdate: any) {
    var date = new Date(tdate)
    console.log('######', `${date.getFullYear()}-${("0"+(Math.round(date.getMonth() + 1))).slice(-2)}-${("0"+date.getDate()).slice(-2)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
    return `${date.getFullYear()}-${("0"+(Math.round(date.getMonth() + 1))).slice(-2)}-${("0"+date.getDate()).slice(-2)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  retransformDate(date: any) {
    return date.trim().replace(" ", "T").substring(0, 19);
  }

  transformToIso(date: any) {
    console.log('=======', date);
    return "16-06-2021T18:30:00"
  }

  // storeData() {
  //   this.dbService
  //   .add('session', {
  //     name: `Test Session 2`,
  //     market_id: `1.0001536239`,
  //     event_id: `0001536238.2`,
  //   })
  //   .subscribe((key) => {
  //     console.log('key: ', key);
  //   });
  // }

  // getData(schema: string , path: string , event_id: string) {
  //   this.dbService.getAllByIndex(schema, path,  event_id).subscribe((session) => {
  //     return session;
  //   });
  // }

  // deleteData() {
  //   this.dbService.clear('session', '0001536238.1').subscribe((allPeople) => {
  //     console.log('all people:', allPeople);
  //   });
  // }
}
