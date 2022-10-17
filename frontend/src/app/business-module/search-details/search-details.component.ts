import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { businessDetails, reviews } from '../model';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css']
})
export class SearchDetailsComponent implements OnInit, OnChanges {

  displayData: any[] = []

  @Input() searchDetailParams: any;
  sectionData: businessDetails;

  @Input() reviewParams: any;
  reviewData: reviews;

  showDetailsSection: boolean = false;

  // Child to Parent
  @Output() goBackEvent = new EventEmitter<boolean>();

  constructor(private myserv: SearchService,) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.searchDetailParams, 'details');
    if (this.searchDetailParams!= undefined && this.reviewParams!=undefined) {
      this.showDetailsSection = true;
      this.sectionData = this.searchDetailParams['response'];
      
      if (this.sectionData[0]['display_address']!=[] || this.sectionData[0]['display_address']!='') {
        this.displayData.push(
          {title:'Address', value:this.sectionData[0]['display_address']}
        )
      }
      if (this.sectionData[0]['categories'].length != 0){
        this.displayData.push(
          {title:'Category', value:this.getCategories(this.sectionData[0]['categories'])}
        )

      }
      if (this.sectionData[0]['display_phone']!=''){
        this.displayData.push(
          {title:'Phone', value:this.sectionData[0]['display_phone']}
        )
        
      }
      if (this.sectionData[0]['price']!=''){
        this.displayData.push(
          {title:'Price range', value:this.sectionData[0]['price']}
        )
        
      }
      if (this.sectionData[0]['is_open_now']!='noStatus'){
        if (this.sectionData[0]['is_open_now']){
          this.displayData.push(
            {title:'Status', value: 'Open'}
          )
        }
        else {
          this.displayData.push(
            {title:'Status', value: 'Closed'}
          )
        }
        
      }
      // if (this.sectionData[0]['more_info']!=''){
      //   this.displayData.push(
      //     {title:'Visit yelp for more', value:this.sectionData[0]['more_info']}
      //   )
        
      // }

    }

    if (this.reviewParams!=undefined && this.searchDetailParams!= undefined){
      this.reviewData = this.reviewParams // Reviews might be empty
      // console.log(this.reviewData, 'reviews');
    }

    
  }
  // Covert Category List to String
  getCategories(cat:any){
      let tempCat = cat;
      let catStr = '';
      if (tempCat.length==1){
          catStr=tempCat[0]['title'];
        }
        else{
          for (let i=0; i<tempCat.length;i++){
            if(i==tempCat.length-1){
              catStr+=tempCat[i]['title'];
            }
            else{
              catStr+=tempCat[i]['title']+' '+'| ';
            }
          }
        }
        return catStr
  }

  goBack(){
    this.showDetailsSection = false;
    this.reviewParams = undefined;
    this.searchDetailParams = undefined;
    this.displayData = [];
    this.goBackEvent.emit(true);
  }

}
