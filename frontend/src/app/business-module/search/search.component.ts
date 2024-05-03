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
  isLoading = false;
  isLocationValid: boolean = false;
  // When the clear button is pressed
  resetSection: boolean = false;
  errorMsg!: string;
  minLengthTerm = 1;
  filteredKeywords: any;
  selectedMovie: any = "";
  latitude: any = '';
  longitude: any = '';
  searchParams: submitParams;
  localStore: Object | any;
  loc_keys: any[];
  bookTableValues: any;
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
        switchMap(value => this.http.get('http://localhost:8080/autocomplete', { params: { 'text': value } })
          // switchMap(value => this.http.get('https://api-dot-business-search-reserve-081998.uw.r.appspot.com/autocomplete', {params: {'text':value}})
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
    let term = this.keywordCtrl.value;
    let latitude = this.latitude;
    let longitude = this.longitude;
    let categories = this.searchForm.controls['category'].value;
    let radius = String(Number(this.searchForm.controls['distance'].value) * 1609);
    this.myserv.getSearchTable(term, latitude, longitude, categories, radius).subscribe(res => {
      this.searchParams = res;
      this.resetSection = false
    });
  }

  // AutoSelect Checkbox function
  autoSelect(target: any) {
    let locList: any[]
    if (target.checked) {
      this.searchForm.get('location')?.disable();
      this.myserv.getIpinfo().subscribe(res => {
        locList = res.loc.split(',');
        this.latitude = Number(locList[0]);
        this.longitude = Number(locList[1]);
        this.searchForm.controls['location'].reset();
        this.isLocationValid = true;
      });
    }
    else {
      this.searchForm.value.location = '';
      this.searchForm.get('location')?.enable();
      this.latitude = '';
      this.longitude = '';
      this.isLocationValid = false;
    }
  }

  // Geto Location from location field
  submit(): any {
    if (this.isLocationValid) {
      this.getTable()
    }
    else {
      this.myserv.getGoogleGeo(this.searchForm.controls['location'].value).subscribe(res => {
        if (res['status'] != 'OK') {
          alert('Enter Correct Location!!');
          this.latitude = '';
          this.longitude = '';
        }
        else {
          this.latitude = res['results'][0]['geometry']['location']['lat'];
          this.longitude = res['results'][0]['geometry']['location']['lng'];
          this.getTable();
        }
      });
    }
  }

  resetAllSections() {
    this.resetSection = true;
    this.filteredKeywords = [];
    this.searchForm.controls['location'].enable();
    this.latitude = '';
    this.longitude = '';
    this.isLocationValid = false;
  }
}
