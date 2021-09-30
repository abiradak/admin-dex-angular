import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { DataService } from '../service/data.service';
import { HelperService } from '../service/helper.service';

@Component({
  selector: 'app-accountupdate',
  templateUrl: './accountupdate.component.html',
  styleUrls: ['./accountupdate.component.css']
})
export class AccountupdateComponent implements OnInit {

  account: FormGroup;
  response: any;
  parentLimit: string | undefined;
  parentShare: string | undefined;
  parentSessioncommission: string | undefined;
  parentMatchcommission: string | undefined;
  showForm = true;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dataService: DataService,
    private helper: HelperService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.account = this.fb.group({
      username: new FormControl(null, [
        Validators.required,
      ]),
      name: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      mobile: new FormControl(null, [Validators.required]),
      share: new FormControl(null, [Validators.required, Validators.min(0), Validators.maxLength(2)]),
      current: new FormControl(null, [Validators.required, Validators.min(0)]),
      match_commission: new FormControl(null, [Validators.required, Validators.min(0)]),
      session_commission: new FormControl(null, [Validators.required, Validators.min(0)]),
      session_bet_max: new FormControl(50000, [Validators.required]),
      session_bet_min: new FormControl(500, [Validators.required]),
      match_bet_max: new FormControl(50000, [Validators.required]),
      match_bet_min: new FormControl(500, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getAccountData();
  }

  async getAccountData(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.sendHttpCallWithToken("", `api/getaccount/${id}`, 'get')?.subscribe( (res) => {
      // console.log("res", res);
      this.response = res.data;
      this.account.patchValue({
        name: this.response.account.name,
        username: this.response.account.username,
        password: this.response.account.password,
        mobile: this.response.account.mobile,
        reference: this.response.account.reference,
        share: this.response.limit.share,
        current: this.response.limit.current,
        match_commission: this.response.limit.match_commission,
        session_commission: this.response.limit.session_commission,
        match_bet_min: this.response.limit.match_bet_min,
        match_bet_max: this.response.limit.match_bet_max,
        session_bet_min: this.response.limit.session_bet_min,
        session_bet_max: this.response.limit.session_bet_max
      });
      if (this.response.parent_limit) {
        this.parentLimit = this.response.parent_limit.current;
        this.parentShare = this.response.parent_limit.share;
        this.parentSessioncommission = this.response.parent_limit.session_commission;
        this.parentMatchcommission = this.response.parent_limit.match_commission;
      }
    }, (error) => {
      console.log("error", error);
    });
  }

  async submit(): Promise<void> {
    if (this.account.valid) {
      const payLoad = {
        id: this.response.account.id,
        username: this.account.value.username,
        name: this.account.value.name,
        password: this.account.value.password,
        parent_id: this.response.account.parent_id,
        mobile: this.account.value.mobile,
        share: this.account.value.share,
        current: this.account.value.current,
        match_commission: this.account.value.match_commission,
        session_commission: this.account.value.session_commission,
        role: this.response.account.role,
        session_bet_max: this.account.value.session_bet_max,
        session_bet_min: this.account.value.session_bet_min,
        match_bet_max: this.account.value.match_bet_max,
        match_bet_min: this.account.value.match_bet_min,
        reference: 'Abir Adak'
      };
      console.log('pay', payLoad);
      this.api
        .sendHttpCallWithToken(
          this.dataService.encryptData(payLoad),
          `api/account/update`,
          'patch'
        )
        ?.subscribe((res) => {
          if (res.status == true) {
            this.helper.alertForSuccess(res.msg, 'Success');
            this.account.reset();
            this.parentLimit = '';
            this.parentShare = '';
            this.parentSessioncommission = '';
            this.parentMatchcommission = '';
            this.router.navigate(["add-account"]);
          }
        });
    }
  }
}
