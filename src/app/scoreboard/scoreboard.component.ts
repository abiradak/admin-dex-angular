import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { interval, Subscription } from 'rxjs';
import { ApiService } from '../service/api.service';
import { DataService } from '../service/data.service';
import { HelperService } from '../service/helper.service';
import { SocketService } from '../service/socket.service';
import { mergeMap } from 'rxjs/operators';


@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css'],
})
export class ScoreboardComponent implements OnInit {
  intervalDetails: Subscription | undefined;
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event: any) {
    if (this.manual == true )
    $event.returnValue = 'Are you sure?';
    this.autoModeOn();
  }

  // @HostListener('window:beforeunload', ['$event'])
  autoModeOn() {
    this.manual = false;
    this.intervalDetails = interval(30000)
      .pipe(mergeMap(() => this.getMatchDatacrickbuzz()))
      .subscribe((data) => console.log('here >>>>>'));
  }

  response: any;
  match: any;
  Math = Math;
  subscription: Subscription | undefined;
  run: any;
  wicket = 0;
  totalover: any;
  over: any = 0;
  freehit = false;
  message: any;
  batsman: any;
  runningInnings: any;
  matchType = 1;
  bowler: any;
  p1: any;
  p2: any;
  score = {
    t1: {
      f: '',
    },
    t2: {
      f: '',
    },
    i1: {
      sc: '',
      wk: '',
      ov: '',
    },
    i2: {
      sc: '',
      wk: '',
      ov: '',
      tr: '',
    },
    i3: {
      sc: '',
      wk: '',
      ov: '',
    },
    i4: {
      sc: '',
      wk: '',
      ov: '',
    },
    cs: {
      msg: '',
    },
    iov: '',
    p1: '',
    p2: '',
    os: '',
    b1s: '',
    b2s: '',
    bw: '',
    pb: '',
  };
  rescore = {
    t1: {
      f: '',
    },
    t2: {
      f: '',
    },
    i1: {
      sc: '',
      wk: '',
      ov: '',
    },
    i2: {
      sc: '',
      wk: '',
      ov: '',
      tr: '',
    },
    cs: {
      msg: '',
    },
    iov: '',
    p1: '',
    p2: '',
    os: '',
    b1s: '',
    b2s: '',
    bw: '',
    pb: '',
  };
  sesAuthenticate: string | null | undefined;
  miniscoreBackup: any;
  manual = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private helper: HelperService,
    private socket: SocketService,
    private dataService: DataService,
    private http: HttpClient
  ) {
    // if (this.manual == false) {
    //   interval(30000)
    //     .pipe(mergeMap(() => this.getMatchDatacrickbuzz()))
    //     .subscribe((data) => console.log('here >>>>>', data));
    // }
  }

  ngOnInit(): void {
    // this.getMatchData();
    // this.socket.emit('score', '37916');
    this.autoModeOn();
    this.getMatchDatacrickbuzz();
  }

  // @HostListener('window:beforeunload', ['$event'])
  autoModeOff() {
    this.manual = true;
    this.intervalDetails?.unsubscribe();
  }

  control() {
    this.manual = true;
    this.autoModeOff();
    const crickbuzz_id = this.route.snapshot.paramMap.get('id');
    var token = localStorage.getItem('token');
    sessionStorage.setItem(`token_${crickbuzz_id}`, JSON.stringify(token));
    this.sesAuthenticate = sessionStorage.getItem(`token_${crickbuzz_id}`);
  }

  async getMatchData(): Promise<any> {
    const event_id = this.route.snapshot.paramMap.get('eid');
    // const market_id = this.route.snapshot.paramMap.get('mid');
    // this.socket.emit("test", event_id);
    this.api.sendHttpCallWithToken('', `api/match/10000`, 'get')?.subscribe(
      (res) => {
        // console.log('response', res);
        if (res.status == true) {
          this.response = res.data;
          this.match = this.response.short_name.split('v');
        }
      },
      (err) => {
        console.log('error', err);
      }
    );

    // if (event_id ) {
    //   this.api.sendHttpCallWithToken('' , `matchbyid?event_id=10000` , 'get')?.subscribe( (res) => {
    //     // console.log('response', res);
    //     if (res.status == true) {
    //       this.response = res.data;
    //       this.match = this.response.short_name.split("v");
    //     }
    //   }, (err) => {
    //     console.log('error', err);
    //   });
    // }
  }

  playerOne(bat1: any) {
    this.score.p1 = bat1;
    this.score.b1s = '0,0,0,0';
    console.log('=====>', this.score);
  }

  playerTwo(bat2: any) {
    this.score.p2 = bat2;
    this.score.b2s = '0,0,0,0';
    console.log('=====>', this.score);
  }

  out(player: string) {
    if (player == 'p1') {
      this.score.p1 = '';
      this.score.b1s = '';
    } else if (player == 'p2') {
      this.score.p2 = '';
      this.score.b2s = '';
    }
  }

  newBowler(bowler: string) {
    this.score.bw = bowler;
  }

  async getMatchDatacrickbuzz(): Promise<any> {
    const crickbuzz_id = this.route.snapshot.paramMap.get('id');
    this.http
      .get(`https://www.cricbuzz.com/api/cricket-match/commentary/${crickbuzz_id}`)
      .subscribe((res: any) => {
        if (res.miniscore) {
          this.miniscoreBackup = res.miniscore;
          (this.over = res.miniscore.matchScoreDetails.inningsScoreList[0]
            ? res.miniscore.matchScoreDetails.inningsScoreList[0].overs
                .toString()
                .split('.')[1] == '6'
              ? parseInt(
                  res.miniscore.matchScoreDetails.inningsScoreList[0].overs
                    .toString()
                    .split('.')[0]
                ) + 1
              : res.miniscore.matchScoreDetails.inningsScoreList[0].overs
            : '0'),
            (this.score = {
              t1: {
                f: res.matchHeader.team1.shortName,
              },
              t2: {
                f: res.matchHeader.team2.shortName,
              },
              i1: {
                sc:
                  res.miniscore.matchScoreDetails.inningsScoreList.length > 0
                    ? res.miniscore.inningsId == 2 &&
                      res.miniscore.matchScoreDetails.inningsScoreList.length >
                        0
                      ? res.miniscore.matchScoreDetails.inningsScoreList[1].score.toString()
                      : res.miniscore.matchScoreDetails.inningsScoreList[0].score.toString()
                    : '0',
                wk:
                  res.miniscore.matchScoreDetails.inningsScoreList.length > 0
                    ? res.miniscore.inningsId == 2 &&
                      res.miniscore.matchScoreDetails.inningsScoreList.length >
                        0
                      ? res.miniscore.matchScoreDetails.inningsScoreList[1].wickets.toString()
                      : res.miniscore.matchScoreDetails.inningsScoreList[0].wickets.toString()
                    : '0',
                ov:
                  res.miniscore.matchScoreDetails.inningsScoreList.length > 0
                    ? res.miniscore.inningsId == 2 &&
                      res.miniscore.matchScoreDetails.inningsScoreList.length >
                        0
                      ? res.miniscore.matchScoreDetails.inningsScoreList[1].overs.toString()
                      : res.miniscore.matchScoreDetails.inningsScoreList[0].overs.toString()
                    : '0',
              },
              i2: {
                sc:
                  res.miniscore.inningsId == 2 &&
                  res.miniscore.matchScoreDetails.inningsScoreList.length > 1
                    ? res.miniscore.matchScoreDetails.inningsScoreList[0].score.toString()
                    : '0',
                wk:
                  res.miniscore.inningsId == 2 &&
                  res.miniscore.matchScoreDetails.inningsScoreList.length > 1
                    ? res.miniscore.matchScoreDetails.inningsScoreList[0].wickets.toString()
                    : '0',
                ov:
                  res.miniscore.inningsId == 2 &&
                  res.miniscore.matchScoreDetails.inningsScoreList.length > 1
                    ? res.miniscore.matchScoreDetails.inningsScoreList[0].overs.toString()
                    : '0',
                tr:
                  res.miniscore.inningsId == 2 &&
                  res.miniscore.matchScoreDetails.inningsScoreList.length > 1
                    ? (
                        res.miniscore.matchScoreDetails.inningsScoreList[1]
                          .score + 1
                      ).toString()
                    : '0',
              },
              i3: {
                sc: '',
                wk: '',
                ov: '',
              },
              i4: {
                sc: '',
                wk: '',
                ov: '',
              },
              cs: {
                msg: res.miniscore.status,
              },
              iov: '',
              p1: res.miniscore.batsmanStriker
                ? res.miniscore.batsmanStriker.batName
                : '',
              p2: res.miniscore.batsmanNonStriker
                ? res.miniscore.batsmanNonStriker.batName
                : '',
              os: 'p1',
              b1s: `${
                res.miniscore.batsmanStriker
                  ? res.miniscore.batsmanStriker.batRuns
                  : 0
              },${
                res.miniscore.batsmanStriker
                  ? res.miniscore.batsmanStriker.batBalls
                  : 0
              },${
                res.miniscore.batsmanStriker
                  ? res.miniscore.batsmanStriker.batFours
                  : 0
              },${
                res.miniscore.batsmanStriker
                  ? res.miniscore.batsmanStriker.batSixes
                  : 0
              }`,
              b2s: `${
                res.miniscore.batsmanNonStriker
                  ? res.miniscore.batsmanNonStriker.batRuns
                  : 0
              },${
                res.miniscore.batsmanNonStriker
                  ? res.miniscore.batsmanNonStriker.batBalls
                  : 0
              },${
                res.miniscore.batsmanNonStriker
                  ? res.miniscore.batsmanNonStriker.batFours
                  : 0
              },${
                res.miniscore.batsmanNonStriker
                  ? res.miniscore.batsmanNonStriker.batSixes
                  : 0
              }`,
              bw: res.miniscore.bowlerStriker
                ? res.miniscore.bowlerStriker.bowlName
                : '',
              pb: res.miniscore.recentOvsStats
                .replace(/\|/g, '')
                .replace(/  /g, '')
                .split(' ')
                .toString(),
            });
          this.callToServer();
          console.log('over', this.over);
        }
      });
  }

  setballbyrun(value: string, type: string, run: string) {
    if (this.over == 0) {
      this.miniscoreBackup.inningsId = 1;
    }
    switch (type) {
      case 'normal':
        this.over = (parseFloat(this.over) + 0.1).toFixed(1).toString();
        console.log('over here', this.over);
        if (this.over.toString().split('.')[1] == '6') {
          this.over = parseInt(this.over.toString().split('.')[0]) + 1;
        }
        if (this.score.os == 'p1') {
          var p1run =
            this.score.b1s.length > 1
              ? parseInt(this.score.b1s.split(',')[0]) + parseInt(run)
              : run;
          var p1ball =
            this.score.b1s.length > 1
              ? parseInt(this.score.b1s.split(',')[1]) + 1
              : '1';
          var p1fours =
            this.score.b1s.length > 1
              ? run == '4'
                ? parseInt(this.score.b1s.split(',')[2]) + 1
                : this.score.b1s.split(',')[2]
              : '0';
          var p1six =
            this.score.b1s.length > 1
              ? run == '6'
                ? parseInt(this.score.b1s.split(',')[3]) + 1
                : this.score.b1s.split(',')[3]
              : '0';
          this.score.b1s = `${p1run},${p1ball},${p1fours},${p1six}`;
        }
        if (this.score.os == 'p2') {
          var p2run =
            this.score.b2s.length > 1
              ? parseInt(this.score.b2s.split(',')[0]) + parseInt(run)
              : run;
          var p2ball =
            this.score.b2s.length > 1
              ? parseInt(this.score.b2s.split(',')[1]) + 1
              : '1';
          var p2fours =
            this.score.b2s.length > 1
              ? run == '4'
                ? parseInt(this.score.b2s.split(',')[2]) + 1
                : this.score.b1s.split(',')[2]
              : '0';
          var p2six =
            this.score.b2s.length > 1
              ? run == '6'
                ? parseInt(this.score.b2s.split(',')[3]) + 1
                : this.score.b1s.split(',')[3]
              : '0';
          this.score.b2s = `${p2run},${p2ball},${p2fours},${p2six}`;
        }
        if (this.score.pb.length > 0) {
          this.score.pb = `${this.score.pb},${value}`;
          if (this.miniscoreBackup.inningsId == 1) {
            this.score.i1.sc = (
              parseInt(run) + parseInt(this.score.i1.sc)
            ).toString();
            this.score.i1.ov = this.over.toString();
          } else if (this.miniscoreBackup.inningsId == 2) {
            this.score.i2.sc = (
              parseInt(run) + parseInt(this.score.i2.sc)
            ).toString();
            this.score.i2.ov = this.over.toString();
          }
        } else {
          this.score.pb = `${value}`;
          if (this.miniscoreBackup.inningsId == 1) {
            this.score.i1.sc = run;
            this.score.i1.ov = this.over.toString();
          } else if (this.miniscoreBackup.inningsId == 2) {
            this.score.i2.sc = run;
            this.score.i2.ov = this.over.toString();
          }
        }
        break;
      case 'wide':
        if (this.score.pb.length > 0) {
          this.score.pb = `${value},${this.score.pb}`;
          if (this.miniscoreBackup.inningsId == 1) {
            this.score.i1.sc = (
              1 +
              parseInt(run) +
              parseInt(this.score.i1.sc)
            ).toString();
            // this.score.i1.ov = this.over;
          } else if (this.miniscoreBackup.inningsId == 2) {
            this.score.i2.sc = (
              1 +
              parseInt(run) +
              parseInt(this.score.i2.sc)
            ).toString();
            // this.score.i2.ov = this.over;
          }
        } else {
          this.score.pb = `${value}`;
          if (this.miniscoreBackup.inningsId == 1) {
            this.score.i1.sc = run;
            this.score.i1.ov = this.over;
          } else if (this.miniscoreBackup.inningsId == 2) {
            this.score.i2.sc = run;
            this.score.i2.ov = this.over;
          }
        }
        break;
      case 'no':
        this.freehit = true;
        if (this.score.pb.length > 0) {
          this.score.pb = `${value},${this.score.pb}`;
          if (this.miniscoreBackup.inningsId == 1) {
            this.score.i1.sc = (
              1 +
              parseInt(run) +
              parseInt(this.score.i1.sc)
            ).toString();
            // this.score.i1.ov = this.over;
          } else if (this.miniscoreBackup.inningsId == 2) {
            this.score.i2.sc = (
              1 +
              parseInt(run) +
              parseInt(this.score.i2.sc)
            ).toString();
            // this.score.i2.ov = this.over;
          }
        } else {
          this.score.pb = `${value}`;
          if (this.miniscoreBackup.inningsId == 1) {
            this.score.i1.sc = run;
            // this.score.i1.ov = this.over;
          } else if (this.miniscoreBackup.inningsId == 2) {
            this.score.i2.sc = run;
            // this.score.i2.ov = this.over;
          }
        }
        break;
      case 'out':
        if (run == '0') {
          if (this.score.pb.length > 0) {
            this.score.pb = `${value},${this.score.pb}`;
            if (this.miniscoreBackup.inningsId == 1) {
              this.score.i1.sc = (
                parseInt(run) + parseInt(this.score.i1.sc)
              ).toString();
              this.score.i1.wk = (parseInt(this.score.i1.wk) + 1).toString();
              this.score.i1.ov = this.over;
            } else if (this.miniscoreBackup.inningsId == 2) {
              this.score.i2.sc = (
                parseInt(run) + parseInt(this.score.i2.sc)
              ).toString();
              this.score.i2.ov = this.over;
              this.score.i2.wk = (parseInt(this.score.i2.wk) + 1).toString();
            }
          } else {
            this.score.pb = `${value}`;
            if (this.miniscoreBackup.inningsId == 1) {
              this.score.i1.wk = (parseInt(this.score.i1.wk) + 1).toString();
              this.score.i1.sc = run;
              this.score.i1.ov = this.over;
            } else if (this.miniscoreBackup.inningsId == 2) {
              this.score.i1.wk = (parseInt(this.score.i2.wk) + 1).toString();
              this.score.i1.sc = run;
              this.score.i1.ov = this.over;
            }
          }
        }
        break;
      default:
        break;
    }
    this.callToServer();
    this.run = '';
  }

  sendReqestToServer() {
    return new Promise((resolve) => {
      this.api
        .sendHttpCallWithToken(
          this.dataService.encryptData(this.score),
          'api/score',
          'post'
        )
        ?.subscribe((res) => {
          this.api
            .sendHttpCallWithToken('', 'api/score/37916', 'get')
            ?.subscribe((res) => {
              if (res.status == true) {
                // this.inningsstarted = true;
              }
            });
        });
    });
  }

  callToServer() {
    console.log('run', this.score);
    const crickbuzz_id = this.route.snapshot.paramMap.get('id');
    this.api
      .sendHttpCallWithToken(
        this.dataService.encryptData(this.score),
        `api/score/${crickbuzz_id}`,
        'post'
      )
      ?.subscribe((res) => {
        if (res.status == true) {
          this.subscription = this.socket
            .listen(`score`)
            .subscribe((data: any = []) => {
              console.log('score', data);
            });
        }
      });
  }
  runManual(e: any) {
    if (e.code == 'Enter' && e.key == 'Enter') {
      if (
        this.run == '0' ||
        this.run == '1' ||
        this.run == '2' ||
        this.run == '3' ||
        this.run == '4' ||
        this.run == '5' ||
        this.run == '6' ||
        this.run == 'N' ||
        this.run == 'N1' ||
        this.run == 'N2' ||
        this.run == 'N3' ||
        this.run == 'N4' ||
        this.run == 'N5' ||
        this.run == 'N6' ||
        this.run == 'Wd' ||
        this.run == 'Wd1' ||
        this.run == 'Wd2' ||
        this.run == 'Wd3' ||
        this.run == 'Wd4' ||
        this.run == 'W' ||
        this.run == 'W1' ||
        this.run == 'W2' ||
        this.run == 'W3'
      ) {
        switch (this.run) {
          case '0':
            this.setballbyrun('0', 'normal', '0');
            break;
          case '1':
            this.setballbyrun('1', 'normal', '1');
            break;
          case '2':
            this.setballbyrun('2', 'normal', '2');
            break;
          case '3':
            this.setballbyrun('3', 'normal', '3');
            break;
          case '4':
            this.setballbyrun('4', 'normal', '4');
            break;
          case '5':
            this.setballbyrun('5', 'normal', '5');
            break;
          case '6':
            this.setballbyrun('6', 'normal', '6');
            break;
          case 'N':
            this.setballbyrun('N', 'no', '0');
            break;
          case 'N1':
            this.setballbyrun('N1', 'no', '1');
            break;
          case 'N2':
            this.setballbyrun('N2', 'no', '2');
            break;
          case 'N3':
            this.setballbyrun('N3', 'no', '3');
            break;
          case 'N4':
            this.setballbyrun('N4', 'no', '4');
            break;
          case 'N5':
            this.setballbyrun('N5', 'no', '5');
            break;
          case 'N6':
            this.setballbyrun('N6', 'no', '6');
            break;
          case 'Wd':
            this.setballbyrun('Wd', 'wide', '1');
            break;
          case 'Wd1':
            this.setballbyrun('Wd1', 'wide', '2');
            break;
          case 'Wd2':
            this.setballbyrun('Wd', 'wide', '3');
            break;
          case 'Wd3':
            this.setballbyrun('Wd3', 'wide', '4');
            break;
          case 'Wd4':
            this.setballbyrun('Wd4', 'wide', '5');
            break;
          case 'W':
            this.setballbyrun('W', 'out', '0');
            break;
          case 'W1':
            this.setballbyrun('W1', 'out', '1');
            break;
          case 'W2':
            this.setballbyrun('W2', 'out', '2');
            break;
          case 'W3':
            this.setballbyrun('W3', 'out', '3');
            break;
          default:
            break;
        }
      } else {
      }
    }
  }
}
