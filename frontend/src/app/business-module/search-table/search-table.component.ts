import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit {
  @Input() searchBoxParams: any;
  constructor() { }

  ngOnInit(): void {
  }

}