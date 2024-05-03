import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  loc_keys: any[];
  localStore: Object | any;
  bookTableValues: any;

  constructor() { }

  ngOnInit(): void {
    //Load the table
    this.reservationTable();
  }
  reservationTable() {
    if (localStorage != null) {
      this.localStore = {}

      Object.keys(localStorage).forEach(key => this.localStore[key] = JSON.parse(localStorage[key]))
      this.loc_keys = Object.keys(this.localStore);

      // Logic added for SrNo
      this.bookTableValues = []
      let i = 1;
      this.loc_keys.forEach(element => {
        this.bookTableValues.push({
          'locStr_keys': element,
          'srNo': i
        })
        i += 1
      })

    }
  }

  delete(key: any) {
    localStorage.removeItem(key);
    alert('Reservation cancelled.')
    delete this.localStore[key];

    // Refresh the keys again
    this.loc_keys = Object.keys(this.localStore);

    // Logic added for SrNo
    this.bookTableValues = []
    let i = 1;
    this.loc_keys.forEach(element => {
      this.bookTableValues.push({
        'locStr_keys': element,
        'srNo': i
      })
      i += 1
    })

  }


}
