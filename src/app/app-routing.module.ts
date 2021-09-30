import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AccountupdateComponent } from './accountupdate/accountupdate.component';
import { FlashmsgComponent } from './flashmsg/flashmsg.component';
import { LoginGuard } from './guards/login.guard';
import { RouteguardGuard } from './guards/routeguard.guard';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MatchlistComponent } from './match/matchlist/matchlist.component';
import { MatchvalueComponent } from './match/matchvalue/matchvalue.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { SessionComponent } from './session/session.component';
import { SessionvalueComponent } from './session/sessionvalue/sessionvalue.component';
import { SportsComponent } from './sports/sports.component';
import { TournamentsComponent } from './tournaments/tournaments.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '',
    component: HeaderComponent,
    children: [
        {
          path: "home",
          component: HomeComponent,
          canActivate: [RouteguardGuard],
        },
        {
          path: "matchlist",
          component: MatchlistComponent,
          canActivate: [RouteguardGuard],
        },
        {
          path: "sports",
          component: SportsComponent,
          canActivate: [RouteguardGuard],
        },
        {
          path: "tournaments",
          component: TournamentsComponent,
          canActivate: [RouteguardGuard],
        }
        ,
        {
          path: "flash-msg",
          component: FlashmsgComponent,
          canActivate: [RouteguardGuard],
        }
        ,
        {
          path: "session/:id",
          component: SessionComponent,
          canActivate: [RouteguardGuard],
        }
        ,
        {
          path: "session-value/:eid/:mid",
          component: SessionvalueComponent
        },
        {
          path: "match-value/:eid/:mid",
          component: MatchvalueComponent
        },
        {
          path: "add-account",
          component: AccountComponent
        },
        {
          path: "update-account/:id",
          component: AccountupdateComponent
        },
        {
          path: "score/:id",
          component: ScoreboardComponent
        }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
