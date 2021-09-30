import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { ApiService } from '../../service/api.service';
import { HelperService } from '../../service/helper.service';
import { SocketService } from '../../service/socket.service';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-matchvalue',
  templateUrl: './matchvalue.component.html',
  styleUrls: ['./matchvalue.component.css'],
})
export class MatchvalueComponent implements OnInit, OnDestroy {

  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event: any) {
    $event.returnValue = "Are you sure?";
    this.destroy();
  }

  // @HostListener('window:beforeunload', ['$event'])
  destroy() {
    const event_id = this.route.snapshot.paramMap.get('eid');
      const payLoad = {
        update: {
          manual_lock: 0
        }
      }
      this.api.sendHttpCallWithToken(payLoad , `match?event_id=${event_id}`, 'put')?.subscribe( (res) => {
        
      }, (err) => {
        console.log('>>>', err);
      });
    sessionStorage.removeItem(`token_${event_id}`);
    this.back = null;
    this.lay = null;
    this.sesAuthenticate = null;
  }

  response: any;
  back: any;
  lay: any;
  diff: any = 2;
  userData: any;
  parsedata: any;
  match: any = [];
  fav: any = 0;
  lck: any
  socketRes: any;
  disabled = false;
  minus_disabled = false;
  sesAuthenticate: any;

  constructor(
    private api: ApiService,
    private helper: HelperService,
    private route: ActivatedRoute,
    private socket: SocketService,
    private dataService: DataService
  ) { }
  
  ngOnInit(): void {
    const event_id = this.route.snapshot.paramMap.get('eid');
    // const market_id = this.route.snapshot.paramMap.get('mid');
    this.socket.emit("match_event", event_id);
    this.sesAuthenticate = sessionStorage.getItem(`token_${event_id}`);
    console.log('jsdsds', this.sesAuthenticate);
    this.getMatchData();
    this.getUserDetails();
  }

  getUserDetails() {
    this.userData = localStorage.getItem("user");
    this.parsedata = this.dataService.decryptData(JSON.parse(this.userData));
  }

  async getMatchData(): Promise<any> {
    const event_id = this.route.snapshot.paramMap.get('eid');
    const market_id = this.route.snapshot.paramMap.get('mid');
    // this.socket.emit("test", event_id);
    
    if (event_id && market_id ) {
      this.api.sendHttpCallWithToken('' , `api/match/${event_id}` , 'get')?.subscribe( (res) => {
        // console.log('response', res);
        if (res.status == true) {
          this.response = res.data;
          this.lck = this.response.locked;
          this.match = this.response.short_name.split("v");
        }
      }, (err) => {
        console.log('error', err);
      });
    }
  }

  changeMatch(pos: any) {
    this.fav = pos;
  }

  insertData(type: any = null) {
    const event_id = this.route.snapshot.paramMap.get('eid');
    const market_id = this.route.snapshot.paramMap.get('mid');
    if (event_id && market_id) {
      var back1 = 0;
      var lay1 = 0;
      var back2 = 0;
      var lay2 = 0;
      // this.match.forEach( (key: any, element: any) => { var back[key] = 0 });
      if (type != null) {
        if (this.diff == 0) {
          if (type == "lay") {
            if (this.lay != 0) {
              if (this.fav == 0) {
                back1 = this.back;
                lay1 = this.lay;
              } else {
                back2 = this.back;
                lay2 = this.lay;
              }
            }
          } else {
            document.getElementById("lay")?.focus();
            throw new Error("Something went badly wrong!");
          }
        } else {
          if (this.fav == 0) {
            this.lay = parseInt(this.back) + parseInt(this.diff);
            back1 = this.back;
            lay1 = parseInt(this.back) + parseInt(this.diff);
          } else {
            this.lay = parseInt(this.back) + parseInt(this.diff);
            back2 = this.back
            lay2 = parseInt(this.back) + parseInt(this.diff);; 
          }
        }
      }
      var odds: any = [];
      odds.push({
        mtype:'match_odds', 
        marketName: this.response.long_name, 
        bet_min: this.response.bet_min, 
        bet_max: this.response.bet_max, 
        locked: this.lck, 
        inPlay: this.response.in_play, 
        active: this.response.active, 
        eventId:event_id, 
        marketId:market_id, 
        delay: this.response.delay, 
        runners: {
          obj: {
            name1: this.match[0].trim(),
            name1full: this.response.long_name.split("v")[0].trim(),
            back1: back1,
            lay1: lay1,
            name2: this.match[1].trim(),
            name2full: this.response.long_name.split("v")[1].trim(),
            back2: back2,
            lay2: lay2,
            fav: this.fav,
            string: this.match[0].trim() + ' ( ' + back1.toString() + ' - ' + lay1.toString() + ' )  ||  ' + this.match[1].trim() + ' ( ' + back2.toString() + ' - ' + lay2.toString() + ' )',
            string_opt: this.match[0].trim() + '#' + back1.toString() + '-' + lay1.toString() + '||' + this.match[1].trim() + '#' + back2.toString() + '-' + lay2.toString(),
            str: btoa(this.match[0].trim() + '#' + back1.toString() + '-' + lay1.toString() + '||' + this.match[1].trim() + '#' + back2.toString() + '-' + lay2.toString())
          }
        }
      });
      // const url = `odds?uuid=${this.parsedata.uuid}&id=${event_id}`
      const payLoad = {
        id: event_id,
        market_id: market_id,
        uuid: this.parsedata.uuid,
        odds: odds
      }
      console.log('pay', payLoad);
      this.socket.emit("odds", payLoad);
      this.socket.listen(`match_odds_${event_id}`).subscribe( (res: any) => {
        // 
        console.log('event emit' , res);
        this.socketRes = res[0];
      })
      // this.api.sendHttpCallWithToken(payLoad , url , 'post')?.subscribe( (res) => {
      //   console.log('----', res);
      // });
    } else {
      this.helper.alertForWarning('Something Went Wrong!', 'Warning!');
    }
  }

  async control(): Promise<any> {
    const event_id = this.route.snapshot.paramMap.get('eid');
    const market_id = this.route.snapshot.paramMap.get('mid');
    if (event_id && market_id ) {
      this.api.sendHttpCallWithToken('' , `matchbyid?event_id=${event_id}` , 'get')?.subscribe( (res) => {
        if (res.data.manual_lock == 0) {
          const event_id = this.route.snapshot.paramMap.get('eid');
          const payLoad = {
            update: {
              manual_lock: 1
            }
          }
          this.api.sendHttpCallWithToken(payLoad , `match?event_id=${event_id}`, 'put')?.subscribe( (res) => {
            if (res.status == true) {
              this.helper.alertForSuccess(res.msg, 'Success');
              var token = localStorage.getItem("token");
              sessionStorage.setItem(`token_${event_id}`, JSON.stringify(token));
              this.sesAuthenticate = sessionStorage.getItem(`token_${event_id}`);
              // this.getMatchList()
              this.response.manual_lock = 1;
            }
          }, (err) => {
            console.log('>>>', err);
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
      const payLoad = {
        update: {
          manual_lock: 0
        }
      }
      this.api.sendHttpCallWithToken(payLoad , `match?event_id=${event_id}`, 'put')?.subscribe( (res) => {
        if (res.status == true) {
          this.helper.alertForSuccess(res.msg, 'Success');
          this.response.manual_lock = 0;
        }
      }, (err) => {
        console.log('>>>', err);
      });
    sessionStorage.removeItem(`token_${event_id}`);
    this.back = null;
    this.lay = null;
    this.sesAuthenticate = null;
    // console.log('uuuuu', this.sesAuthenticate);
  }

  ngOnDestroy(): void {
    this.clearData();
  }
}
