import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {
  competetions: any = [];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.getTournaments();
  }

  async getTournaments(): Promise<any> {
    this.api.sendHttpCall('' , `competetion/competetionlist` , 'get')?.subscribe( (res) => {
      this.competetions = res.data;
      console.log('comp', this.competetions);
    }, (err) => {
      console.log('error', err);
    });
  }

}
