import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { searchTableData, submitParams } from '../model';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit, OnChanges {

  showMainTable: boolean = false;

  @Input() searchBoxParams: any;
  tableData: searchTableData[];

  searchDetailParams: submitParams;
  reviewParams: submitParams;
  constructor(private formBuilder: FormBuilder,
    private myserv: SearchService,) { }

  ngOnInit(): void {
    
  }
  
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.searchBoxParams, 'ej9843o');
    if (this.searchBoxParams!= undefined && this.searchBoxParams['response'].length>0) {
      this.showMainTable = true;
      let idx = 0;
      this.tableData = this.searchBoxParams['response'];
      
      // if (this.searchBoxParams['response'].length > 0 ){
        this.tableData.forEach(element => {
          idx+=1
          element['idx'] = idx;
        });
      // }
      // else {
      //   this.tableData = []
      // }
    }
    else if (this.searchBoxParams!= undefined && this.searchBoxParams['response'].length==0){
      this.tableData=[]
      this.showMainTable = false;
    }
  }

  // Business Details Box
  businessDetails(b_id:any){
    this.myserv.getBusinessDetails(b_id).subscribe(res =>{
      // console.log(res);
      if(res!= undefined && res['response'].length>0) {
        this.showMainTable = false;
        this.searchDetailParams = res;
      }
    });

    this.myserv.getBusinessReviews(b_id).subscribe(res =>{
      // console.log(res);
        this.reviewParams = res;
    });
  }


  showTable(event:boolean){
    this.showMainTable = event;
  }

}
