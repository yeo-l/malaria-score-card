import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ScoreComponent} from './score/score.component';
import {ConfigurationComponent} from './configuration/configuration.component';


const routes: Routes = [
  {
    path: '',
    component: ScoreComponent,
    data: {
      title: 'Malaria score card'
    }
  },
  {
    path: 'score',
    component: ScoreComponent,
    data: {
      title: 'Malaria score card'
    }
  },
  {
    path: 'setting',
    component: ConfigurationComponent,
    data: {
      title: 'Data setting'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
