import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessModuleRoutingModule } from './business-module-routing.module';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchTableComponent } from './search-table/search-table.component';
import { SearchDetailsComponent } from './search-details/search-details.component';
import { GoogleMapsModule } from '@angular/google-maps'


@NgModule({
  declarations: [
    SearchComponent,
    SearchTableComponent,
    SearchDetailsComponent
  ],
  imports: [
    CommonModule,
    BusinessModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    HttpClientModule,
    MatAutocompleteModule,
    GoogleMapsModule
  ]
})
export class BusinessModuleModule { }
