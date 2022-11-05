import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { geoResponse, ipinfoResponse, searchTable } from './model';


// const  base_backend_api = 'http://localhost:8080'
const  base_backend_api = 'https://api-dot-trial-business-081998.uw.r.appspot.com'

// Google maps geo location
const  base_geo_api = 'https://maps.googleapis.com/maps/api/geocode/json'
const  base_geo_api_key = 'AIzaSyCxyrgZ_Jw6ZFo4vG3AAPnsAk6LHfimJS8'

// IPINFO API
const  base_geo_api_ipinfo = 'https://ipinfo.io'
const  base_geo_api_key_ipinfo = '196ec65b0b0406'

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private httpserv: HttpClient) { }

  // Ipinfo API
  getIpinfo(): Observable<ipinfoResponse>{
    return this.httpserv.get(base_geo_api_ipinfo+'?token='+base_geo_api_key_ipinfo)
  }

  // Geolocation Google
  getGoogleGeo(location: string): Observable<geoResponse>{
    return this.httpserv.get(base_geo_api+'?address='+location+'&key='+base_geo_api_key)
  }

  getSearchTable(term:string, latitude:number, longitude:number, categories: string, radius: string): Observable<searchTable> {
    return this.httpserv.get(base_backend_api+`/businesses/search?term=${term}&latitude=${latitude}&longitude=${longitude}&categories=${categories}&radius=${radius}`)
  }

  getBusinessDetails(b_id: string): Observable<searchTable> {
    return this.httpserv.get(base_backend_api+`/businesses?b_id=${b_id}`)
  }

  getBusinessReviews(b_id: string): Observable<searchTable> {
    return this.httpserv.get(base_backend_api+`/businesses/reviews?b_id=${b_id}`)
  }

}

