import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { HelperService } from '../service/helper.service';
import { HttpClient } from "@angular/common/http";
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: FormGroup;
  ip: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private helper: HelperService,
    private router: Router,
    private http: HttpClient,
    private dataService: DataService
  ) {
    this.login = this.fb.group({
      username: new FormControl( null , [Validators.required]),
      password: new FormControl( null , [Validators.required])
    });
  }

  ngOnInit(): void {
    this.getIpClient();
  }

  getIpClient() {
    this.http.get("http://api.ipify.org/?format=json").subscribe((data: any) => {
      // tslint:disable-next-line: no-string-literal
      this.ip = data.ip;
    });
  }

  async submit(): Promise<any> {
    if (this.login.valid) {
      const payLoad = {
        username: this.login.value.username,
        password: this.login.value.password,
        ip: this.ip,
      }
      this.api.sendHttpCallForLogin(payLoad , 'login', 'post')?.subscribe((res) => {
        if (res.status == true) {
          this.helper.alertForSuccess(res.msg, 'Success!');
          localStorage.setItem("user", JSON.stringify(this.dataService.encryptData((res.data))));
          localStorage.setItem("token", res.data.uuid);
          this.router.navigate(["home"]);
        }
      }, (err) => {
        console.log('>>>>>>>>', err);
      });
    }
  }
}
