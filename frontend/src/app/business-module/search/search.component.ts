import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { pipe } from 'rxjs';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { submitParams } from '../model';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [SearchService]
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  filteredKeywords :any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;
  selectedMovie: any = "";
  keywordCtrl: FormControl = new FormControl();
  latitude: any = '';
  longitude: any = '';
  isLocationValid: boolean = false;
  searchParams:submitParams;

  constructor(private formBuilder: FormBuilder,
    private myserv: SearchService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.createForm();
 
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
    // let abc = pipe(()=>console.log('first'), ()=>console.log('second'))
    // console.log(abc);
    
    
    // if (!this.isLocationValid) {
    //   this.getGoogleLocation();
    // }

    // if(this.isLocationValid){
      let term = this.keywordCtrl.value;
      let latitude = this.latitude;
      let longitude = this.longitude;
      let categories = this.searchForm.controls['category'].value;
      let radius = String(Number(this.searchForm.controls['distance'].value)*1609);
      this.myserv.getSearchTable(term,latitude,longitude,categories,radius).subscribe(res =>{
        console.log(res);
        this.searchParams = res
      });
    // }
  }

  // AutoSelect Checkbox function
  autoSelect(target: any) {
    // console.log(target.checked);
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
          console.log(this.latitude, this.longitude);
        }
      });
    }
  }

}
