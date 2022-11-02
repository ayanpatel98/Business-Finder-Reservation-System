import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { businessDetails, reviews } from '../model';
import { SearchService } from '../search.service';
export class User {
  public email!: string;
  public resDate!: string;
  public hrs!: any;
  public min!: any;
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
  showSubmitRes:boolean;
  statusClass:any;

  // When the clear button is pressed
  @Input() resetSectionLast: any;
  resetSecLast: boolean;
  
  @Input() searchDetailParams: any;
  sectionData: businessDetails;

  @Input() reviewParams: any;
  reviewData: reviews;

  showDetailsSection: boolean = false;

  // Child to Parent
  @Output() goBackEvent = new EventEmitter<boolean>();

  constructor(private myserv: SearchService,) { }

  ngOnInit(): void {
    this.todayDate = new Date();
    // this.todayDate = String(this.todayDate.getFullYear()) +'-' + String(new Date().getMonth()+1) 
    // +'-' + String(this.todayDate.getDate())
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.searchDetailParams, 'details');
    this.resetSecLast = this.resetSectionLast
    if (!this.resetSecLast) {
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
            this.statusClass = 'open'
          }
          else {
            this.statusClass = 'closed'
          }
          
        }
      
        // Google Maps Integration
        this.mapOptions = {
            center: { 
              lat: this.sectionData[0]['coordinates']['latitude'], 
              lng: this.sectionData[0]['coordinates']['longitude'] 
            },
            zoom : 13.75
        }
        this.marker = {
            position: { 
              lat: this.sectionData[0]['coordinates']['latitude'], 
              lng: this.sectionData[0]['coordinates']['longitude'] 
            },
        }

        //  To hide or show reservation button
        if (localStorage.getItem(this.sectionData[0]['id'])==null){
          this.showSubmitRes = true;
        }
        else{
          this.showSubmitRes = false;
        }
        // let element: any = document.querySelector('#businessContentDetail')
        // element.scrollIntoView({ behavior: 'instant'});
        

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

    
  }


  onSubmit(form: NgForm) {
    // Check browser support
    if (typeof(Storage) !== "undefined") {
      // Store
        let a:Object;
        a = {
            'id' : this.sectionData[0]['id'],
            'name': this.sectionData[0]['name'],
            'email': form.form.value.email,
            'resDate': form.form.value.resDate,
            'hrs': form.form.value.hrs,
            'min': form.form.value.min,
          }  
        localStorage.setItem(this.sectionData[0]['id'], JSON.stringify(a));
        alert('Reservation Created!');
        
        // Close the Modal box
        $('#exampleModal').modal('hide');
        form.reset()
        this.showSubmitRes = false;
        
      // }
      // localStorage.clear()
      
    } else {
      console.log("Sorry, your browser does not support Web Storage...");
      ;
    }
  }

  showTabSection() {
      // // Go to the Details section
      // let element: any = document.getElementById('businessContentDetail')
      // element.scrollIntoView();
      let element: any = document.querySelector('#businessContentDetail')
      element.scrollIntoView({ behavior: 'instant'});
    
  }

  // Show submit button of reservation form
  cancelReserv(){
    console.log('Item Removed');
    localStorage.removeItem(this.sectionData[0]['name']);
    this.showSubmitRes = true;
    
    // if (localStorage.getItem(this.sectionData[0]['name'])==null){
    //   this.showSubmitRes = true;
    // }
    // else{
    //   this.showSubmitRes = false;
    // }
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
