import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  titleScore = 'Search Malaria score card by name';
  constructor() { }

  ngOnInit(): void {
  }

}
