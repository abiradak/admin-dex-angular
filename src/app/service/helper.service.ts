import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private toastr: ToastrService) {}

  setDataToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  alertForSuccess(message: string | undefined, title: string | undefined) {
    this.toastr.success(message, title);
  }
  alertForWarning(message: string | undefined, title: string | undefined) {
    this.toastr.warning(message, title);
  }
  alertFordanger(message: string | undefined, title: string | undefined) {
    this.toastr.error(message, title);
  }
}
