import { Component, OnInit } from '@angular/core';
import {TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {OrgUnitService} from '../services/org-unit.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
