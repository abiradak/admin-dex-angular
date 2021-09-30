import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { ApiService } from '../../service/api.service';
import { HelperService } from '../../service/helper.service';
import { SocketService } from '../../service/socket.service';


@Component({
  selector: 'app-sessionvalue',
  templateUrl: './sessionvalue.component.html',
  styleUrls: ['./sessionvalue.component.css']
})
export class SessionvalueComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event: any) {
    $event.returnValue = "Are you sure?";
    this.destroy();
  }
  destroy() {
    const event_id = this.route.snapshot.paramMap.get('eid');
    const market_id = this.route.snapshot.paramMap.get('mid');
    const payLoad = {
      update: {
        manual_lock: 0
      }
    }
    this.api.sendHttpCallWithToken(payLoad , `match?event_id=${event_id}`, 'put')?.subscribe( (res) => {
      if (res.status == true) {
        this.helper.alertForSuccess(res.msg, 'Success');
        // this.getMatchList();
        sessionStorage.removeItem(`token_session_${market_id}`);
        this.sesAuthenticate = null;
        this.response.manual_lock = 0;
        this.getSessionData();
      }
    }, (err) => {
      console.log('>>>', err)
    });
    sessionStorage.removeItem(`token_${event_id}`);
  }
  response: any;
  socketRes: any;
  diff = 1;
  not: any;
  yes: any;
  userData: any;
  parsedata: any;
  YesVolume = 100;
  NoVolume = 100;
  sesAuthenticate: any;
  disabled = false;
  minus_disabled = false;
  lck: any

  constructor(
    private api: ApiService,
    private helper: HelperService,
    private route: ActivatedRoute,
    private socket: SocketService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    // const event_id = this.route.snapshot.paramMap.get('eid');
    const market_id = this.route.snapshot.paramMap.get('mid');
    this.sesAuthenticate = sessionStorage.getItem(`token_session_${market_id}`);
    this.getUserDetails();
    this.getSessionData();
  }

  getUserDetails() {
    this.userData = localStorage.getItem("user");
    this.parsedata = this.dataService.decryptData(JSON.parse(this.userData));
  }

  async getSessionData(): Promise<any> {
    const event_id = this.route.snapshot.paramMap.get('eid');
    const market_id = this.route.snapshot.paramMap.get('mid');
    this.socket.emit("event", market_id);
    if (event_id && market_id ) {
      this.api.sendHttpCallWithToken('' , `match/sessionbyid?event_id=${event_id}&market_id=${market_id}` , 'get')?.subscribe( (res) => {
        // console.log('response', res);
        if (res.status == true) {
          this.response = res.data;
          // console.log('>>>>' , this.response);
          this.lck = this.response.session.locked;
        }
      }, (err) => {
        console.log('error', err);
      });
    }
  }

  insertData() {
    const event_id = this.route.snapshot.paramMap.get('eid');
    const market_id = this.route.snapshot.paramMap.get('mid');
    if (event_id && market_id) {
      this.yes = this.not + this.diff;
      if (this.diff == 0) {
        if (this.yes == this.not)
          this.NoVolume = 90;
          this.YesVolume = 110;
      }
      var odds: any = [];
      odds.push({
        market_id: market_id,
        id: market_id,
        headname: this.response.session.name,
        SessInptYes: this.yes,
        YesValume: this.YesVolume,
        SessInptNo: this.not,
        NoValume: this.NoVolume,
        DisplayMsg: "",
        str: "24||100-23||100",
        locked: this.lck
      });
      const payLoad = {
        id: event_id,
        market_id: market_id,
        uuid: this.parsedata.uuid,
        odds: odds
      }
      this.socket.emit("session_odds", payLoad);
      this.socket.listen(`match_session_active_${event_id}`).subscribe( (res: any) => {
        console.log('---', res);
        this.response.session = res;
      });
    } else {
      this.helper.alertForWarning('Something Went Wrong!', 'Warning!');
    }
  }

  async control(): Promise<any> {
    const event_id = this.route.snapshot.paramMap.get('eid');
    const market_id = this.route.snapshot.paramMap.get('mid');
    this.socket.emit("event", market_id);
    if (event_id && market_id ) {
      this.api.sendHttpCallWithToken('' , `match/sessionbyid?event_id=${event_id}&market_id=${market_id}` , 'get')?.subscribe( (res) => {
        // console.log('response', res);
        console.log('-------', res.data.session.manual_lock);
        if (res.status == true && res.data.session.manual_lock == 0) {
          const payLoad = {
            update: {
              manual_lock: 1
            }
          }
          this.api.sendHttpCallWithToken(payLoad , `match?event_id=${event_id}`, 'put')?.subscribe( (res) => {
            if (res.status == true) {
              this.helper.alertForSuccess(res.msg, 'Success');
              // this.getMatchList();
              var token = localStorage.getItem("token");
              sessionStorage.setItem(`token_session_${market_id}`, JSON.stringify(token));
              this.sesAuthenticate = sessionStorage.getItem(`token_session_${market_id}`);
              this.response.manual_lock = 1;
            }
          }, (err) => {
            console.log('>>>', err)
          });
        } else {
          this.helper.alertFordanger("You cant Access to this page!", "Warning!");
        }
      }, (err) => {
        console.log('error', err);
      });
    }
  }

  clearData() {
    const event_id = this.route.snapshot.paramMap.get('eid');
    const market_id = this.route.snapshot.paramMap.get('mid');
    const payLoad = {
      update: {
        manual_lock: 0
      }
    }
    this.api.sendHttpCallWithToken(payLoad , `match?event_id=${event_id}`, 'put')?.subscribe( (res) => {
      if (res.status == true) {
        this.helper.alertForSuccess(res.msg, 'Success');
        // this.getMatchList();
        sessionStorage.removeItem(`token_session_${market_id}`);
        this.sesAuthenticate = null;
        this.response.manual_lock = 0;
        this.getSessionData();
      }
    }, (err) => {
      console.log('>>>', err)
    });
    sessionStorage.removeItem(`token_${event_id}`);
  }
}
