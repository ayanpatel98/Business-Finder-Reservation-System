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

  // When the clear button is pressed
  @Input() resetSection: any;
  resetSec: boolean;

  @Input() searchBoxParams: any;
  tableData: searchTableData[];

  searchDetailParams: submitParams  | undefined;
  reviewParams: submitParams  | undefined;
  constructor(private formBuilder: FormBuilder,
    private myserv: SearchService,) { }

  ngOnInit(): void {
    
  }
  
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.searchBoxParams, 'Second');
    this.resetSec = this.resetSection;
    if(!this.resetSec) {
      // Reset the details section first on change of table component
      this.searchDetailParams = undefined;
      this.reviewParams = undefined;
      
      if (this.searchBoxParams!= undefined && this.searchBoxParams['response'].length>0) {
        this.showMainTable = true;
        let idx = 0;
        this.tableData = this.searchBoxParams['response'];
        
          this.tableData.forEach(element => {
            idx+=1
            element['idx'] = idx;
          });
      }
      else if (this.searchBoxParams!= undefined && this.searchBoxParams['response'].length==0){
        this.tableData=[];
        this.showMainTable = false;
        // To reset the details section
        this.reviewParams ==  undefined; 
        this.searchDetailParams ==  undefined; 
      }
    }
    // else {

    // }
  }

  // Business Details Box
  businessDetails(b_id:any){
    this.myserv.getBusinessDetails(b_id).subscribe(res =>{
      console.log(b_id);
      if(res!= undefined && res['response'].length>0) {
        this.showMainTable = false;
        this.searchDetailParams = res;
        this.resetSec = false;
        // Go to the Details section
        let element: any = document.getElementById('detailBox')
        element.scrollIntoView();
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
