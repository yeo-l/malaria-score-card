import { Component, OnInit } from '@angular/core';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {OrgUnitService} from '../services/org-unit.service';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  keyword = 'name';
 dates: any;
 data = [
    {
      id: 1,
      name: 'Dakota Gaylord PhD',
      address: '14554 Smith Mews'
    },
    {
      id: 2,
      name: 'Maria Legros',
      address: '002 Pagac Drives'
    },
    {
      id: 3,
      name: 'Brandyn Fritsch',
      address: '8542 Lowe Mountain'
    },
    {
      id: 4,
      name: 'Glenna Ward V',
      address: '1260 Oda Summit'
    },
    {
      id: 5,
      name: 'Jamie Veum',
      address: '5017 Lowe Route'
    }
  ];
  constructor( private dataSeries: DataService) { }


  ngOnInit(): void {
  }
  getDataTest(){
    this.dataSeries.getDataStore().subscribe( dat => {
      this.dates = dat;
    });
  }
}
