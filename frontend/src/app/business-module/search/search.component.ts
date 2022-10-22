import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { pipe } from 'rxjs';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { __values } from 'tslib';
import { submitParams } from '../model';
import { SearchService } from '../search.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [SearchService]
})
export class SearchComponent implements OnInit {
  showSearchComp: boolean = true;
  showBookingsComp: boolean = false;
  isLoading = false;
  isLocationValid: boolean = false;
  // When the clear button is pressed
  resetSection:boolean = false;
  errorMsg!: string;
  minLengthTerm = 3;
  filteredKeywords :any;
  selectedMovie: any = "";
  latitude: any = '';
  longitude: any = '';
  searchParams:submitParams;
  localStore:Object | any;
  loc_keys:any[];
  bookTableValues:any;
  searchForm: FormGroup;
  keywordCtrl: FormControl = new FormControl();

  constructor(private formBuilder: FormBuilder,
    private myserv: SearchService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.createForm();
 
    // Autocomplete
    this.keywordCtrl.valueChanges
      .pipe(
        filter(res => {
          if (res === null || res.length < this.minLengthTerm) {
            this.filteredKeywords = []
            return false
          }
          return res !== null && res.length >= this.minLengthTerm
        }),
        // distinctUntilChanged(),
        debounceTime(800),
        tap(() => {
          this.errorMsg = "";
          this.filteredKeywords = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get('http://localhost:8080/autocomplete', {params: {'text':value}})
          .pipe(
            finalize(() => {
              this.isLoading = false;
              
            }),
          )
        )
      )
      .subscribe((data: any) => {
        
        if (data['status'] != 200) {
          this.errorMsg = 'No keywords Found';
          this.filteredKeywords = [];
        } else {
          this.errorMsg = "";
          this.filteredKeywords = data['response'];
        }
        console.log(this.filteredKeywords, this.keywordCtrl.value);
      });

    this.reservationTable();
    
  }
  
  createForm() {
    this.searchForm = this.formBuilder.group({
      keyword: [null, Validators.required],
      distance: [null],
      category: ['All', Validators.required],
      location: [null, Validators.required],
      autodetect: [null],
    });
  }

  getTable(): void {
      let term = this.keywordCtrl.value;
      let latitude = this.latitude;
      let longitude = this.longitude;
      let categories = this.searchForm.controls['category'].value;
      let radius = String(Number(this.searchForm.controls['distance'].value)*1609);
      this.myserv.getSearchTable(term,latitude,longitude,categories,radius).subscribe(res =>{
        // console.log(res, 'first');
        this.searchParams = res;
        this.resetSection = false
      });
  }

  // AutoSelect Checkbox function
  autoSelect(target: any) {
    let locList :any[]
    if (target.checked){
      this.searchForm.get('location')?.disable();
      this.myserv.getIpinfo().subscribe(res =>{
        locList = res.loc.split(',');
        this.latitude = Number(locList[0]);
        this.longitude = Number(locList[1]);
        this.searchForm.controls['location'].reset();
        this.isLocationValid = true;
      });
    }
    else {
      this.searchForm.value.location='';
      this.searchForm.get('location')?.enable();
      this.latitude = '';
      this.longitude = '';
      this.isLocationValid = false;
    }
  }

  // Geto Location from location field
  submit(): any {
    if (this.isLocationValid){
      this.getTable()
    }
    else {
      this.myserv.getGoogleGeo(this.searchForm.controls['location'].value).subscribe(res =>{
        if (res['status']!='OK') {
          alert('Enter Correct Location!!');
          this.latitude = '';
          this.longitude = '';
          // this.isLocationValid = false;
        }
        else {
          this.latitude = res['results'][0]['geometry']['location']['lat'];
          this.longitude = res['results'][0]['geometry']['location']['lng'];
          // this.isLocationValid = false;
          this.getTable();
          // console.log(this.latitude, this.longitude);
        }
      });
    }
  }

  showSearch(){
    // $('.nav-item').removeClass('active');
    //   if($(this).hasClass('active')){
    //      $(this).removeClass('active');
    //   }else{
    //      $(this).addClass('active');
    //   }
    $( '.nav a' ).on( 'click', function () {
      $( '.nav' ).find( 'li.active' ).removeClass( 'active' );
      $( this ).parent( 'li' ).addClass( 'active' );
    });

    this.showSearchComp = true;
    this.showBookingsComp = false;
  }
  showBookings(){
    // $('.nav-item').removeClass('active');
    //   if($(this).hasClass('active')){
    //      $(this).removeClass('active');
    //   }else{
    //      $(this).addClass('active');
    //   }
    $( '.nav a' ).on( 'click', function () {
      $( '.nav' ).find( 'li.active' ).removeClass( 'active' );
      $( this ).parent( 'li' ).addClass( 'active' );
    });
    
    this.resetAllSections();
    this.reservationTable();
    this.showSearchComp = false;
    this.showBookingsComp = true;
    this.searchForm.reset();
    this.searchForm.controls['location'].enable();
    this.keywordCtrl.reset();
    this.searchForm.controls['category'].patchValue('All')
    // console.log(this.searchForm.controls['keyword'].value);
    this.addSrNo();
    
  }

  // Function to enter serial number
  addSrNo() {
    console.log('loaded');
    
    // if(document.getElementById('reserveStorageTable')!=null){
    //   let table = document.getElementById('reserveStorageTable')  as HTMLTableElement;
    //   let row_len = table?.rows.length;

    //   for (let i = 1; i<row_len;i++){
    //     table.rows[i].cells[0].innerHTML = String(i);
    //   }
    // }

  }

  reservationTable(){
    if (localStorage!=null){
      this.localStore={}
      
      // {'key':{'val1':values, 'val2':value}}
      Object.keys(localStorage).forEach(key=>this.localStore[key] = JSON.parse(localStorage[key]))
      this.loc_keys = Object.keys(this.localStore);

      // Logic added for SrNo
      this.bookTableValues =[]
      let i=1;
      this.loc_keys.forEach(element=>{
        this.bookTableValues.push({
          'locStr_keys': element,
          'srNo': i
        })
        i+=1
      })
      
    }
    // console.log(this.localStore);
  }

  delete(key:any){
    // console.log(key);
    localStorage.removeItem(key);
    alert('Reservation cancelled.')
    delete this.localStore[key];

    // Refresh the keys again
    this.loc_keys = Object.keys(this.localStore);
    
    // Logic added for SrNo
    this.bookTableValues =[]
    let i=1;
    this.loc_keys.forEach(element=>{
      this.bookTableValues.push({
        'locStr_keys': element,
        'srNo': i
      })
      i+=1
    })
    
  }

  resetAllSections() {
    this.resetSection = true;
  }




}
