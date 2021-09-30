import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { HelperService } from '../service/helper.service';
import { SocketService } from '../service/socket.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  declaredSessions: any = [];
  sessionData: any = {};
  showSessionForm = false;
  showSessionEditForm = false;
  session: FormGroup;
  sessionedit: FormGroup;
  result: any;
  active: any = [];
  odds: any = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private helper: HelperService,
    private socket: SocketService
  ) {
    this.session = this.fb.group({
      name: new FormControl(null , [Validators.required]),
      session_bet_min: new FormControl(500 , [Validators.required]),
      session_bet_max: new FormControl(50000 , [Validators.required]),
      grp: new FormControl(0 , [Validators.required]),
      type: new FormControl(0 , [Validators.required]),
      session_commission: new FormControl(1 , [Validators.required])
    });
    this.sessionedit = this.fb.group({
      name: new FormControl(null , [Validators.required]),
      session_bet_min: new FormControl(500 , [Validators.required]),
      session_bet_max: new FormControl(50000 , [Validators.required]),
      grp: new FormControl(0 , [Validators.required]),
      type: new FormControl(0 , [Validators.required]),
      session_commission: new FormControl(1 , [Validators.required]),
      market_id: new FormControl(null , [Validators.required])
    });
  }

  ngOnInit(): void {
    this.getSessionsList();
  }

  showSession() {
    this.showSessionForm = true;
  }

  showEditSession(session: any) {
    this.showSessionEditForm = true;
    this.sessionedit.patchValue({
      name: session.name,
      session_bet_min: session.session_bet_min,
      session_bet_max: session.session_bet_max,
      grp: session.grp,
      type: session.type,
      session_commission: session.session_commission,
      market_id: session.market_id
    })
  }

  async getSessionsList(): Promise<any> {
    const event_id = this.route.snapshot.paramMap.get('id');
    this.api.sendHttpCallWithToken('' , `api/session/${event_id}` , 'get')?.subscribe( (res) => {
      if (res.status == true) {
        // console.log('response', res);
        this.sessionData = res.data;
        if (this.sessionData && this.sessionData.sessions.length > 0) {
          var sessions_declared: any =  [];
          var sessions_completed: any = [];
          var sessions_not_active: any = [];
          var sessions_active: any = [];
          var sessions_deleted: any = [];
          this.sessionData.sessions.forEach((element: any) => {
              if (element.declared == 1 && element.deleted == 0) sessions_declared.push(element);
              if (element.completed == 1 && element.declared == 0 && element.deleted == 0) sessions_completed.push(element);
              if (element.completed == 0 && element.declared == 0 && element.active == 0 && element.deleted == 0) sessions_not_active.push(element);
              if (element.completed == 0 && element.declared == 0 && element.active == 1 && element.deleted == 0) sessions_active.push(element);
              if (element.completed == 0 && element.declared == 0 && element.deleted == 1) sessions_deleted.push(element);
          });
          this.sessionData.sessions_declared = sessions_declared;
          this.sessionData.sessions_completed = sessions_completed;
          this.sessionData.sessions_not_active = sessions_not_active;
          this.sessionData.sessions_active = sessions_active;
          this.sessionData.sessions_deleted = sessions_deleted;
        }
      }
    }, (err) => {
      console.log('error' , err);
    });
  }

  async deleteSession(session: any , deleted: any): Promise<any> {
    var payLoad = {};
    if (deleted == '1') {
      payLoad = {
        update: {
          deleted: 1
        }
      };
    } else {
      payLoad = {
        update: {
          deleted: 0
        }
      };
    }
    this.api.sendHttpCallWithToken(payLoad , `api/session/${session.event_id}/${session.market_id}` , 'patch')?.subscribe( (res) => {
      if (res.status == true) {
        this.helper.alertForSuccess(res.msg , 'Success!');
        this.getSessionsList();
      }
    }, (err) => {
      console.log('error' , err);
    })
  }

  async submit(): Promise<any> {
    const event_id = this.route.snapshot.paramMap.get('id');
    if (event_id && this.session.valid) {
      const payLoad = {
        event_id: event_id,
        name: this.session.value.name,
        session_bet_min: this.session.value.session_bet_min,
        session_bet_max: this.session.value.session_bet_max,
        grp: this.session.value.grp,
        type: this.session.value.type,
        session_commission: this.session.value.session_commission
      }
      console.log('payload', payLoad);
      this.api.sendHttpCallWithToken(payLoad , `api/session` , 'post')?.subscribe( (res) => {
        if (res.status == true) {
          console.log('response', res);
          this.helper.alertForSuccess(res.msg, 'Success');
          this.session.reset();
          this.showSessionForm = false;
          this.getSessionsList();
        }
      }, (err) => {
        console.log('error' , err);
      })
    } else {
      Object.keys(this.session.controls).forEach((field) => {
        const control = this.session.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
    }
  }

  async sessionUpdate(): Promise<any> {
    const event_id = this.route.snapshot.paramMap.get('id');
    if (event_id && this.sessionedit.valid) {
      const payLoad = {
        update: {
          name: this.sessionedit.value.name,
          session_bet_min: this.sessionedit.value.session_bet_min,
          session_bet_max: this.sessionedit.value.session_bet_max,
          grp: this.sessionedit.value.grp,
          type: this.sessionedit.value.type,
          session_commission: this.sessionedit.value.session_commission,
        }
      }
      this.api.sendHttpCallWithToken(payLoad , `api/session/${event_id}/${this.sessionedit.value.market_id}` , 'patch')?.subscribe( (res) => {
        if (res.status == true) {
          console.log('response', res);
          this.helper.alertForSuccess(res.msg, 'Success');
          this.sessionedit.reset();
          this.showSessionEditForm = false;
          this.getSessionsList();
        }
      }, (err) => {
        console.log('error' , err);
      })
    } else {
      Object.keys(this.sessionedit.controls).forEach((field) => {
        const control = this.sessionedit.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
    }
  }

  async declareSession(event_id: any , market_id: any , result: any , declared: any): Promise<any> {
    if (event_id && market_id && result) {
      var payLoad = {}
      if (declared == '1') {
        payLoad = {
          update: {
            result: result,
            locked: 1,
            declared: 1,
            completed: 1
          }
        }
      } else {
        payLoad = {
          update: {
            declared: 0,
            result: 0
          }
        }
      }
      
      this.api.sendHttpCallWithToken(payLoad , `api/session/${event_id}/${market_id}` , 'patch')?.subscribe( (res) => {
        if (res.status == true) {
          console.log('response', res);
          this.helper.alertForSuccess(res.msg, 'Success');
          this.getSessionsList(); 
        }
      }, (err) => {
        console.log('error' , err);
      });
    } else {
      this.helper.alertFordanger('Something Went Wrong!', 'Warning!');
    }
  }

  async sessionStatus(market_id: any , active: any): Promise<any> {
    const event_id = this.route.snapshot.paramMap.get('id');
    if (event_id && market_id && active) {
      const payLoad = {
        update: {
          active: active
        }
      }
      this.api.sendHttpCallWithToken(payLoad , `api/session/${event_id}/${market_id}` , 'patch')?.subscribe( (res) => {
        if (res.status == true) {
          this.helper.alertForSuccess(res.msg, 'Success');
          this.getSessionsList(); 
        }
      }, (err) => {
        console.log('error' , err);
        this.helper.alertFordanger(err.error.message , "Warning!");
      });
    } else {
      this.helper.alertFordanger('Something Went Wrong!', 'Warning!');
    }
  }

  async manual(session: any , manual: any): Promise<any> {
    if (session.event_id && session.market_id && manual) {
      const payLoad = {
        update: {
          manual: manual,
        }
      }
      this.api.sendHttpCallWithToken(payLoad , `api/session/${session.event_id}/${session.market_id}` , 'patch')?.subscribe( (res) => {
        if (res.status == true) {
          this.helper.alertForSuccess(res.msg, 'Success');
          // this.getSessionsList(); 
          this.sessionData.sessions_active.forEach((element: any) => {
            if (element.market_id == session.market_id && element.event_id == session.event_id)
                element.manual = manual;
          });
        }
      }, (err) => {
        console.log('error' , err);
        this.helper.alertFordanger(err.error.message , "Warning!");
      });
    } else {
      this.helper.alertFordanger('Something Went Wrong!', 'Warning!');
    }
  }

  async conplete(session: any , complete: any): Promise<any> {
    if (session.event_id && session.market_id && complete) {
      var payLoad = {};
      if (complete == '1') {
        payLoad = {
          update: {
            locked: 1 ,
            completed: 1
          } 
        }
      } else {
        payLoad = {
          update: {
            locked: 0 ,
            completed: 0
          }
        }
      }
      this.api.sendHttpCallWithToken(payLoad , `api/session/${session.event_id}/${session.market_id}` , 'patch')?.subscribe( (res) => {
        if (res.status == true) {
          this.helper.alertForSuccess(res.msg, 'Success');
          this.getSessionsList(); 
        }
      }, (err) => {
        console.log('error' , err);
        this.helper.alertFordanger(err.error.message , "Warning!");
      });
    } else {
      this.helper.alertFordanger('Something Went Wrong!', 'Warning!');
    }
  }
}
