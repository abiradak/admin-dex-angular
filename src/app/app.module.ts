import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchlistComponent } from './match/matchlist/matchlist.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { RouteguardGuard } from './guards/routeguard.guard';
import { LoginGuard } from './guards/login.guard';
import { EventEmitterService } from './service/event-emitter.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Global } from './service/global.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ApiService } from './service/api.service';
import { LoginComponent } from './login/login.component';
import { SessionComponent } from './session/session.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { SessionvalueComponent } from './session/sessionvalue/sessionvalue.component';
import { FlashmsgComponent } from './flashmsg/flashmsg.component';
import { SportsComponent } from './sports/sports.component';
import { MatchvalueComponent } from './match/matchvalue/matchvalue.component';
import { DatetimepickerComponent } from './datetimepicker/datetimepicker.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
  FaIconLibrary,
  FontAwesomeModule
} from "@fortawesome/angular-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { AccountComponent } from './account/account.component';
import { AccountupdateComponent } from './accountupdate/accountupdate.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';

const config: SocketIoConfig = {
  url: "http://localhost:3000",
  options: {},
};

@NgModule({
  declarations: [
    AppComponent,
    MatchlistComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    SessionComponent,
    TournamentsComponent,
    SessionvalueComponent,
    FlashmsgComponent,
    SportsComponent,
    MatchvalueComponent,
    DatetimepickerComponent,
    AccountComponent,
    AccountupdateComponent,
    ScoreboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    NgbModule,
    FontAwesomeModule,
  ],
  providers: [
    RouteguardGuard,
    LoginGuard,
    ApiService,
    EventEmitterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    Global,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCalendar, faClock);
  }
}
