import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [SearchService]
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private myserv: SearchService) { }

  ngOnInit(): void {
    this.createForm();
  }
  
  createForm() {
    this.searchForm = this.formBuilder.group({
      keyword: [null, Validators.required],
      distance: [null],
      category: ['All', Validators.required],
      location: [null, Validators.required],
    });
  }

  validateForm(): void {
    console.log(this.searchForm.value.category);
    this.myserv.getSongAlbum();
  }

}
