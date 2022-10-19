import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { businessDetails, reviews } from '../model';
import { SearchService } from '../search.service';

export class User {
  public email!: string;
  public resDate!: string;
}

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css']
})
export class SearchDetailsComponent implements OnInit, OnChanges {
  model = new User();
  todayDate: any = new Date();
  displayData: any[] = []
  displayDataReviews: any[] = []
  mapOptions : google.maps.MapOptions;
  marker : any;

  @Input() searchDetailParams: any;
  sectionData: businessDetails;

  @Input() reviewParams: any;
  reviewData: reviews;

  showDetailsSection: boolean = false;

  // Child to Parent
  @Output() goBackEvent = new EventEmitter<boolean>();

  constructor(private myserv: SearchService,) { }

  ngOnInit(): void {
    this.todayDate = String(this.todayDate.getFullYear()) +'-' + String(new Date().getMonth()+1) 
    +'-' + String(this.todayDate.getDate())
  }
  
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.reviewParams, 'details');
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
    
      // Google Maps Integration
    this.mapOptions = {
        center: { 
          lat: this.sectionData[0]['coordinates']['latitude'], 
          lng: this.sectionData[0]['coordinates']['longitude'] 
        },
        zoom : 14
     }
    this.marker = {
        position: { 
          lat: this.sectionData[0]['coordinates']['latitude'], 
          lng: this.sectionData[0]['coordinates']['longitude'] 
        },
     }

    }

    if (this.reviewParams!=undefined && this.searchDetailParams!= undefined){
      this.reviewData = this.reviewParams['response'] // Reviews might be empty
      this.displayDataReviews.push(this.reviewData)
      // console.log(this.displayDataReviews, 'reviews');
    }

    // Did this bcoz when the details section is being displayed and the user presses sumbit button then we have to close
    // box and reset the displaydata and reviews array
    if (this.reviewParams==undefined && this.searchDetailParams ==undefined) {
      this.displayData = [];
      this.displayDataReviews = [];
      this.showDetailsSection = false;
    }

    
  }


  onSubmit(form: any) {
    console.log(form.email);
    return true
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
    this.displayDataReviews = [];
    this.goBackEvent.emit(true);
  }

}
