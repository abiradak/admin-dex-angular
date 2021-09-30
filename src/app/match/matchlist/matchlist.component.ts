import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { Match } from 'src/app/models/match';
import { ApiService } from 'src/app/service/api.service';
import { DataService } from 'src/app/service/data.service';
import { HelperService } from 'src/app/service/helper.service';
import { colors } from 'src/assets/colors';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matchlist',
  templateUrl: './matchlist.component.html',
  styleUrls: ['./matchlist.component.css']
})
export class MatchlistComponent implements OnInit {
  
  addmatch: FormGroup;
  editmatch: FormGroup;
  teamArray: FormArray | undefined;
  color = colors;
  declaredMatches: any = [];
  matches: any = [];
  showForm = false;
  showEditForm = false;
  competetionList: any = [];
  currentdatetime = new Date().toISOString();
  dateModel: Date = new Date();
  stringDateModel: string = new Date().toString();
  currentmatch = [];

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private dataService: DataService,
    private helper: HelperService,
    private router: Router
  ) {
    this.addmatch = this.fb.group({
      competition_id: new FormControl("" , [Validators.required]),
      match_id: new FormControl(null),
      event_id: new FormControl(null , [Validators.required , Validators.minLength(4), Validators.maxLength(20), Validators.pattern(/^[0-9]*$/)]),
      event_type_id: new FormControl("" , [Validators.required]),
      market_id: new FormControl(null , [Validators.required , Validators.maxLength(25), Validators.minLength(4)]),
      cricbuzz_id: new FormControl(null , [Validators.required]),
      long_name: new FormControl(null , [Validators.required]),
      short_name: new FormControl(null , [Validators.required]),
      start_time: new FormControl(new Date(), [Validators.required, DateTimeValidator]),
      bet_min: new FormControl(500 , [Validators.required , Validators.max(100000) , Validators.min(500) , Validators.pattern(/^[0-9]*$/)]),
      bet_max: new FormControl(50000 , [ Validators.required, Validators.max(10000000) , Validators.min(500) , Validators.pattern(/^[0-9]*$/)]),
      teams: this.fb.array([
        this.fb.group({
          team: new FormControl(null , [Validators.required])
        }),
        this.fb.group({
          team: new FormControl(null , [Validators.required])
        })
      ]),
    }, { updateOn: 'change' });
    this.addmatch.controls.teams as FormArray;

    this.editmatch = this.fb.group({
      cricbuzz_id: new FormControl(null , [Validators.required]),
      long_name: new FormControl(null , [Validators.required]),
      bet_min: new FormControl(500 , [Validators.required , Validators.max(100000) , Validators.min(500) , Validators.pattern(/^[0-9]*$/)]),
      bet_max: new FormControl(50000 , [ Validators.required, Validators.max(10000000) , Validators.min(500) , Validators.pattern(/^[0-9]*$/)]),
      start_time: new FormControl(new Date(), [Validators.required]),
      zoom: new FormControl( null , [Validators.required]),
      event_id: new FormControl( null , [Validators.required])
    });
  }

  ngOnInit(): void {  
    this.getMatchList();
  }

  cmpare(index: any) {
    return index;
  }

  addTeams() {
    const teams = this.addmatch.controls.teams as FormArray;
    teams.push(this.fb.group({
      team: new FormControl(null , [Validators.required])
    }));
  }

  hideForm() {
    this.showForm = false;
  }

  showMatchForm() {
    this.showForm = true;
  }

  hideEditForm() {
    this.showEditForm = false;
    this.editmatch.reset();
  }

  showEditMatchForm(match: any) {
    this.api.sendHttpCallWithToken('' , `api/match/${match.event_id}` , 'get')?.subscribe ((res) => {
      if (res.status == true) {
        this.editmatch.patchValue({
          long_name: res.data.long_name,
          cricbuzz_id: res.data.cricbuzz_id,
          bet_min: res.data.bet_min,
          bet_max: res.data.bet_max,
          start_time: this.dataService.retransformDate(res.data.start_time),
          zoom: res.data.zoom,  
          event_id: res.data.event_id
        })
      }
    }, (err) => {
      console.log('error', err);
    });
    this.showEditForm = true;
  }
  
  autofill() {
    if(this.addmatch.value.event_id) {
      this.addmatch.patchValue({
        market_id: `1.${this.addmatch.value.event_id}`
      });
    } else {
      const control = this.addmatch.get("event_id");
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty({ onlySelf: true });
    }
  }

  async suggest(): Promise<any> {
    this.api.sendHttpCallWithToken('' , `api/suggest`, 'get')?.subscribe( (res) => {
      console.log('res', res);
      if (res.status == true) {
        this.addmatch.patchValue({
          event_id: res.data.event_id,
          market_id: res.data.market_id,
        });
      }
    }, (err) => {
      console.log('error', err);
    })
  }

  autofillTeams(match: any) {
    const teamsArray = match.target.value.trim().split(" v ");
    this.addmatch.patchValue({
      teams: [
        { team: teamsArray[0].trim().toUpperCase() },
        { team: teamsArray[1].trim().toUpperCase() }
      ]
    });
  }
  autofillShortName(match: any) {
    const shortteamsArray = match.target.value.split(" v ");
    var short_name = `${shortteamsArray[0].trim().substr(0,3)}${shortteamsArray[0].trim().slice(-1)} v ${shortteamsArray[1].trim().substr(0,3)}${shortteamsArray[1].trim().slice(-1)}`;
    this.addmatch.patchValue({
      short_name: short_name
    });
    const teamsArray = short_name.trim().split(" v ");
    this.addmatch.patchValue({
      teams: [
        { team: teamsArray[0].trim().toUpperCase() },
        { team: teamsArray[1].trim().toUpperCase() }
      ]
    });
  }

  async getCompetetionList(id: any): Promise<void> {
    this.api.sendHttpCallWithToken('' , `api/competetion` , 'get')?.subscribe( (res: any) => {
      if (res.status == true) {
        // this.competetionList = res.data;
        this.competetionList = res.data.filter( (item: any) => {
          if (item.event_type_id == id)
            return item;
        });
      }
    })
  }

  async getMatchList(): Promise<void> {
    this.api.sendHttpCallWithToken('' , `api/match` , 'get')?.subscribe( (res: any) => {
      if (res.status == true) {
        this.declaredMatches = res.data.declared_matches;
        this.matches = res.data.matches;
        this.matches.forEach( (match: any) => {
          if (res.data.session_locked && res.data.session_locked.length > 0) {
            res.data.session_locked.forEach((element: any) => {
              if (element.event_id == match.event_id)
                match.s_locked = element.locked;
            });
          }
        });
      }
    })
  }

  async submit(): Promise<any> {
    if (this.addmatch.valid) {
      const teams_send: any[] = [];
      this.addmatch.value.teams.forEach( (element: any) => {
        teams_send.push(element.team);
      });
      if (teams_send[0] != teams_send[1]) {
        const payLoad: Match = {
          competition_id: this.addmatch.value.competition_id,
          match_id: this.addmatch.value.match_id,
          event_id: this.addmatch.value.event_id,
          event_type_id: this.addmatch.value.event_type_id,
          market_id: this.addmatch.value.market_id,
          cricbuzz_id: this.addmatch.value.cricbuzz_id,
          long_name: this.addmatch.value.long_name,
          short_name: this.addmatch.value.short_name,
          start_time: this.dataService.transformDate(this.addmatch.value.start_time),
          bet_min: this.addmatch.value.bet_min,
          bet_max: this.addmatch.value.bet_max,
          teams: teams_send
        }

        this.api.sendHttpCallWithToken(payLoad, `api/match`, 'post')?.subscribe( (res) => {
          if (res.status == true) {
            this.helper.alertForSuccess(res.msg, "Success!");
            this.addmatch.reset();
            this.showForm = false;
            this.getMatchList();
          } 
        }, (err) => {
          console.log('err', err);
        });
      } else {
        this.helper.alertFordanger("Short Name Must be Uniqe!", "Warnig!");
      }
    } else {
      Object.keys(this.addmatch.controls).forEach((field) => {
        const control = this.addmatch.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
    }
  }

  async matchStatus(val: any , inactive: any , inplay: any): Promise<any> {
    const payLoad = {
      update: {
        inactive: inactive,
        in_play: inplay
      }
    }
    this.api.sendHttpCallWithToken(payLoad , `api/match/${val.event_id}`, 'patch')?.subscribe( (res) => {
      if (res.status == true) {
        this.helper.alertForSuccess(res.msg, 'Success');
        // this.getMatchList();
        this.matches.forEach((element: any) => {
          if (element.event_id == val.event_id) element.inactive = inactive; element.in_play = inplay
        });
      }
    }, (err) => {
      console.log('>>>', err)
    });
  }

  async delete(id: any , del: any): Promise<any> {
    if (confirm("Are you Sure !")) {
      if (id && del) {
        var payLoad = {};
        if (del == '1') {
          payLoad = {
            update: {
              deleted: 1
            }
          }
        } else {
          payLoad = {
            update: {
              deleted: 0
            }
          }
        }
        this.api.sendHttpCallWithToken(payLoad , `api/match/${id}`, 'put')?.subscribe( (res) => {
          if (res.status == true) {
            this.helper.alertForSuccess(res.msg, 'Success');
            this.getMatchList();
          }
        }, (err) => {
          console.log('>>>', err)
        });
      } 
    }
  }

  async delay(id: any , delay: any): Promise<any> {
    const payLoad = {
      update: {
        delay: delay
      }
    }
    this.api.sendHttpCallWithToken(payLoad , `api/match/${id}`, 'patch')?.subscribe( (res) => {
      if (res.status == true) {
        this.helper.alertForSuccess(res.msg, 'Success');
        // this.getMatchList();
        this.matches.forEach((element: any) => {
          if (element.event_id == id) element.delay = delay;
        });
        
      }
    }, (err) => {
      console.log('>>>', err)
    });
  }

  async differenceBack(id: any , diff: any): Promise<any> {
    const payLoad = {
      update: {
        difference_back: diff
      }
    }
    this.api.sendHttpCallWithToken(payLoad , `api/match/${id}`, 'patch')?.subscribe( (res) => {
      if (res.status == true) {
        this.helper.alertForSuccess(res.msg, 'Success');
        // this.getMatchList();
        this.matches.forEach((element: any) => {
          if (element.event_id == id) element.difference_back = diff;
        });
      }
    }, (err) => {
      console.log('>>>', err)
    });
  }

  async differenceLay(id: any , diff: any): Promise<any> {
    const payLoad = {
      update: {
        difference_lay: diff
      }
    }
    this.api.sendHttpCallWithToken(payLoad , `api/match/${id}`, 'patch')?.subscribe( (res) => {
      if (res.status == true) {
        this.helper.alertForSuccess(res.msg, 'Success');
        this.matches.forEach((element: any) => {
          if (element.event_id == id) element.difference_lay = diff;
        });
      }
    }, (err) => {
      console.log('>>>', err)
    });
  }

  async updateMatch(): Promise<any> {
    if (this.editmatch.valid) {
      const time = this.dataService.transformDate(this.editmatch.value.start_time);
      const payLoad = {
        update : {
          long_name: this.editmatch.value.long_name.trim().replace(/\b\w/g, (l: any) => l.toUpperCase()).replace(" V "," V ".toLowerCase()),
          cricbuzz_id:  this.editmatch.value.cricbuzz_id.toString(),
          bet_min: this.editmatch.value.bet_min,
          bet_max: this.editmatch.value.bet_max,
          start_time: time.substring(0, 19).toString(),
          zoom: this.editmatch.value.zoom
        }
      }
      this.api.sendHttpCallWithToken(payLoad , `api/match/${this.editmatch.value.event_id}` , 'patch')?.subscribe( (res) => {
        if (res.status == true) {
          this.helper.alertForSuccess(res.msg, 'Success!');
          this.showEditForm = false;
          this.editmatch.reset();
          this.getMatchList();
        }
      }, (err) => {
        console.log('error' , err);
      })
    } else {
      Object.keys(this.editmatch.controls).forEach((field) => {
        const control = this.editmatch.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
    }
  }

  async matchLock(event_id: any, locked: any): Promise<any> {
    if (event_id && locked) {
      const payLoad = {
        update: {
          locked: locked
        }
      };
      this.api.sendHttpCallWithToken(payLoad, `api/match/${event_id}`, 'patch')?.subscribe( (res) => {
        if (res.status == true) {
          this.helper.alertForSuccess(res.msg, 'Success!');
          // this.getMatchList();
          this.matches.forEach((element: any) => {
            if (element.event_id == event_id) element.locked = locked;
          });
        }
      }, (err) => {
        console.log('error', err);
      });
    }
  }

  async sessionLockAll(event_id: any, locked: any): Promise<any> {
    if (event_id && locked) {
      const payLoad = {
        event_id: event_id,
        locked: locked
      };
      this.api.sendHttpCallWithToken(payLoad, `match/session/lockall`, 'post')?.subscribe( (res) => {
        if (res.status == true) {
          this.helper.alertForSuccess(res.msg, 'Success!');
          this.getMatchList();
        }
      }, (err) => {
        console.log('error', err);
      });
    }
  }

  async matchMode(value: any, manual: any): Promise<any> {
    if (value.event_id && manual) {
      const payLoad = {
        update: {
          manual: manual,
        }
      };
      this.api.sendHttpCallWithToken(payLoad, `api/match/${value.event_id}`, 'patch')?.subscribe( (res) => {
        if (res.status == true) {
          this.helper.alertForSuccess(res.msg, 'Success!');
          this.matches.forEach((element: any) => {
            if (element.event_id == value.event_id) element.manual = manual;
          });
          // this.getMatchList();
        }
      }, (err) => {
        console.log('error', err);
      });
    }
  }

  async allLock(event_id: any , m_lock: any, s_lock: any) {
    if (event_id && m_lock && s_lock) {
      const payLoad = {
        update: {
          locked: m_lock
        }
      };
      this.api.sendHttpCallWithToken(payLoad, `api/match/${event_id}`, 'patch')?.subscribe( (res) => {
        if (res.status == true) {
          this.helper.alertForSuccess(res.msg, 'Success!');
          const payLoad = {
            event_id: event_id,
            locked: s_lock
          };
          this.api.sendHttpCallWithToken(payLoad, `match/session/lockall`, 'post')?.subscribe( (res) => {
            if (res.status == true) {
              this.helper.alertForSuccess(res.msg, 'Success!');
              this.getMatchList();
            }
          }, (err) => {
            console.log('error', err);
          });
        }
      }, (err) => {
        console.log('error', err);
      });
    }
  }

  current_event_id: any; 
  selectedTeam: any;
  async complete(match: any) {
    if (confirm("Are You Sure!")) {
      if (match.event_id) {
        const payLoad = {
          update: {
            completed: 1,
          }
        };
        this.api.sendHttpCallWithToken(payLoad, `api/match/${match.event_id}`, 'patch')?.subscribe( (res) => {
          if (res.status == true) {
            this.helper.alertForSuccess(res.msg, 'Success!');
            this.matches.forEach((element: any) => {
              if (element.event_id == match.event_id) element.completed = 1;
            });
          } 
        }, (err) => {
          console.log('error', err);
        });
      }
    }
  }

  dec(match: any) {
    this.currentmatch = match.short_name.trim().split(" v ");
    document.getElementById("winnerselect")?.click();
    this.current_event_id = match.event_id;
  }

  selectWinner(sected: any) {
    this.selectedTeam = sected;
  }

  async matchDeclare() {
    if (confirm("Are You Sure!")) {
      if (this.current_event_id && this.selectedTeam ) {
        const payLoad = {
          update: {
            declared: 1,
            winner: this.selectedTeam
          }
        };
        this.api.sendHttpCallWithToken(payLoad, `api/match/${this.current_event_id}`, 'put')?.subscribe( (res) => {
          if (res.status == true) {
            this.helper.alertForSuccess(res.msg, 'Success!');
            document.getElementById("closemodal")?.click();
            this.getMatchList();
          } 
        }, (err) => {
          console.log('error', err);
        });
      }
    }
  }
}

export const DateTimeValidator = (fc: FormControl) => {
  const date = new Date(fc.value);
  const isValid = !isNaN(date.valueOf());
  return isValid ? null : {
      isValid: {
          valid: false
      }
  };
};

// @Pipe({ name: 'mypipe' })
// export class Mypipe implements PipeTransform {
//   transform(date: Date | string): string {
//     date = new Date(date);  // if orginal type was a string
//     date.setDate(date.getHours()-5.30);
//     return new DatePipe('en-US')?.transform(date);
//   }
// }