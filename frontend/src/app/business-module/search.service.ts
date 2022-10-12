import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  dataUrl = 'http://localhost:8080/autocomplete';
  constructor(private httpserv: HttpClient) { }

  getSongAlbum() {
    console.log(this.httpserv.get(this.dataUrl));
    
    this.httpserv.get(this.dataUrl).subscribe(res =>{
      console.log(res);
    });
  }

}

