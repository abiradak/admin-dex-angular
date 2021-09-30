import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../service/api.service';
import { DataService } from '../service/data.service';
import { HelperService } from '../service/helper.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  account: FormGroup;
  roles: any;
  userData: any;
  data: any;
  showMaster = false;
  showSuperAgent = false;
  response: any;
  masters: any = [];
  superAgents:  any = [];
  childlist: any = [];
  header: string | undefined;
  parentBalance: any;
  parentLimit: any;
  parentShare: any;
  parentSessioncommission: any;
  parentMatchcommission: any;
  parent_id: any;
  header2: string | undefined;
  accountForm = false;
  roles_list: any = ["agent", "superagent", "master" , "supermaster", "subadmin"];
  subadmin_id = null;
  supermaster_id = null;
  master_id = null;
  superagent_id = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dataService: DataService,
    private helper: HelperService
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
      role: new FormControl(null , [Validators.required]),
      session_bet_max: new FormControl(50000, [Validators.required]),
      session_bet_min: new FormControl(500, [Validators.required]),
      match_bet_max: new FormControl(50000, [Validators.required]),
      match_bet_min: new FormControl(500, [Validators.required]),
      selectMaster: new FormControl(null),
      selectagent: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.getDataFromHeader();
  }

  getDataFromHeader() {
    this.userData = localStorage.getItem('user');
    this.data = this.dataService.decryptData(JSON.parse(this.userData));
    if (this.data.role == '9') {
      this.roles = [
        { name: 'Subadmin', value: '4' },
        { name: 'Supermaster' , value: '3' },
        { name: 'Master', value: '2' },
        { name: 'Superagent', value: '1' },
        { name: 'Agent', value: '0' },
      ];
      this.getChildren(4);
    } else if (this.data.role == '4') {
      this.roles = [
        { name: 'Supermaster' , value: '3' },
        { name: 'Master', value: '2' },
        { name: 'Superagent', value: '1' },
        { name: 'Agent', value: '0' },
      ];
      this.getChildren(3);
    } else if (this.data.role == '3') {
      this.roles = [
        { name: 'Master', value: '2' },
        { name: 'Superagent', value: '1' },
        { name: 'Agent', value: '0' },
      ];
      this.getChildren(2);
    } else if (this.data.role == '2') {
      this.roles = [
        { name: 'Superagent', value: '1' },
        { name: 'Agent', value: '0' },
      ];
      this.getChildren(1);
    } else if (this.data.role == '1') {
      this.roles = [{ name: 'Agent', value: '0' }];
      this.getChildren(0);
    }
  }

  setFormRoleWise(role: any) {
    this.api
      .sendHttpCallWithToken('', `api/account/data/${role}`, 'get')
      ?.subscribe((res) => {
        // console.log('res', response);
        this.response = res;
        this.account.patchValue({
          username: res.username,
        });
        switch (this.data.role) {
          case 9:
            switch (parseInt(role)) {
              case 4:
                this.showMaster = false;
                this.parent_id = this.data.id;
                this.parentLimit = '';
                this.parentShare = '';
                this.parentSessioncommission = '';
                this.parentMatchcommission = '';
                break;
              case 3:
              case 2:
              case 1:
              case 0:      
                this.showMaster = true;
                this.header = 'Master';
                this.masters = this.response.parents_data;
                this.parentLimit = '';
                this.parentShare = '';
                this.parentSessioncommission = '';
                this.parentMatchcommission = '';
                this.account.get('selectMaster')?.setValidators(Validators.required);
                break;
              default:
                break;
            }
            break;
          case 4:
            switch (parseInt(role)) {
              case 3:
                this.showSuperAgent = false;
                this.parent_id = this.data.id;
                this.parentLimit = this.response.parents_data.current;
                this.parentShare = this.response.parents_data.share;
                this.parentSessioncommission = this.response.parents_data.session_commission;
                this.parentMatchcommission = this.response.parents_data.match_commission;
                break;
              case 2:
              case 1:
              case 0:    
                this.showMaster = true;
                this.header = 'Master';
                this.masters = this.response.parents_data;
                this.parentLimit = '';
                this.parentShare = '';
                this.parentSessioncommission = '';
                this.parentMatchcommission = '';
                this.account.get('selectMaster')?.setValidators(Validators.required);
                break;

              default:
                break;
            }
            break;
          case 3:
            switch (parseInt(role)) {
              case 2:
                this.parent_id = this.data.id;
                this.parentLimit = this.response.parents_data.current;
                this.parentShare = this.response.parents_data.share;
                this.parentSessioncommission = this.response.parents_data.session_commission;
                this.parentMatchcommission = this.response.parents_data.match_commission;
                break;
              case 1 || 0:
                this.showMaster = true;
                this.header = 'Master';
                this.masters = this.response.parents_data;
                this.parentLimit = '';
                this.parentShare = '';
                this.parentSessioncommission = '';
                this.parentMatchcommission = '';
                this.account.get('selectMaster')?.setValidators(Validators.required);
                break;
  
              default:
                break;
            }
            break;
          case 2:
            switch (parseInt(role)) {
              case 1:
                this.parent_id = this.data.id;
                this.parentLimit = this.response.parents_data.current;
                this.parentShare = this.response.parents_data.share;
                this.parentSessioncommission = this.response.parents_data.session_commission;
                this.parentMatchcommission = this.response.parents_data.match_commission;
                break;
              case 0:
                this.showMaster = true;
                this.header = 'Master';
                this.masters = this.response.parents_data;
                this.parentLimit = '';
                this.parentShare = '';
                this.parentSessioncommission = '';
                this.parentMatchcommission = '';
                this.account.get('selectMaster')?.setValidators(Validators.required);
                break;
  
              default:
                break;
            }
            break;
          case 1:
            switch (parseInt(role)) {
              case 0:
                this.parent_id = this.data.id;
                this.parentLimit = this.response.parents_data.current;
                this.parentShare = this.response.parents_data.share;
                this.parentSessioncommission = this.response.parents_data.session_commission;
                this.parentMatchcommission = this.response.parents_data.match_commission;
                break;
  
              default:
                break;
            }
            break;    
          default:
            break;
        }
      });
  }

  selectMaster(id: any) {
    this.response.parents_data.filter( (item: any) => {
      if (item.id == id) {
        this.parent_id = id;
        if (item.subadmin_id != null) {
          this.subadmin_id = item.subadmin_id
        } 
        if (item.supermaster_id != null) {
          this.supermaster_id = item.supermaster_id;
        } 
        if (item.master_id != null) {
          this.master_id = item.master_id;
        } 
        if (item.superagent_id != null) {
          this.superagent_id = item.superagent_id
        }
        this.parentLimit = item.current;
        this.parentShare = item.share;
        this.parentSessioncommission = item.session_commission;
        this.parentMatchcommission = item.match_commission;
        this.account.get('current')?.setValidators(Validators.max(parseInt(this.parentLimit)));
        this.account.get('share')?.setValidators(Validators.max(parseInt(this.parentShare)));
        this.account.get('match_commission')?.setValidators(Validators.max(parseInt(this.parentMatchcommission)));
        this.account.get('session_commission')?.setValidators(Validators.max(parseInt(this.parentSessioncommission)));
      }
    });
  }

  async getChildren(role: any): Promise<void> {
    if (role)
      this.api.sendHttpCallWithToken("", `api/account/${role}`, 'get')?.subscribe( (childs) => {
        if (childs.status == true)
          this.childlist = childs.child;
        console.log('childs', this.childlist);
      });
  }

  async submit(): Promise<void> {
    // console.log("here -------");
    if (this.account.valid) {
      const payLoad = {
        username: this.account.value.username,
        name: this.account.value.name,
        password: this.account.value.password,
        parent_id: this.parent_id,
        mobile: this.account.value.mobile,
        share: this.account.value.share,
        current: this.account.value.current,
        match_commission: this.account.value.match_commission,
        session_commission: this.account.value.session_commission,
        role: this.account.value.role,
        session_bet_max: this.account.value.session_bet_max,
        session_bet_min: this.account.value.session_bet_min,
        match_bet_max: this.account.value.match_bet_max,
        match_bet_min: this.account.value.match_bet_min,
        reference: 'Abir Adak',
        subadmin_id: this.subadmin_id,
        supermaster_id: this.supermaster_id,
        master_id: this.master_id,
        superagent_id: this.superagent_id
      };
      this.api
        .sendHttpCallWithToken(
          this.dataService.encryptData(payLoad),
          `api/account/add`,
          'post'
        )
        ?.subscribe((res) => {
          if (res.status == true) {
            this.helper.alertForSuccess(res.msg, 'Success');
            this.account.reset();
            this.showMaster = false;
            this.showSuperAgent = false;
            this.superAgents = [];
            this.parentLimit = '';
            this.parentShare = '';
            this.parentSessioncommission = '';
            this.parentMatchcommission = '';
          }
        });
    } else {
      Object.keys(this.account.controls).forEach((field) => {
        const control = this.account.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
    }
  }
}
