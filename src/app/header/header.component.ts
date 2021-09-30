
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { DataService } from '../service/data.service';
import { HelperService } from '../service/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userData: any;
  data: any;
  token: any;

  constructor(
    private helper: HelperService,
    private router: Router,
    private api: ApiService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.userData = localStorage.getItem("user");
    this.token = localStorage.getItem("token");
    this.data = this.dataService.decryptData(JSON.parse(this.userData));
  }

  logout() {
    const payLoad  = {
      token: this.token,
      logout: 1
    };
    this.api.sendHttpCallWithToken(payLoad , 'api/logout' , 'patch')?.subscribe( (res) => {
      console.log('res', res);
      if (res.status == true) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        this.helper.alertForSuccess("Logout Success!", 'Success!');
        this.router.navigate(["login"]);
      }
    });
  }
}
