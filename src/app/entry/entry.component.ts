import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  floorCount: number = 10;
  eleveatorCount: number = 5;
  constructor() { }

  ngOnInit(): void {
  }

}
