import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessModuleRoutingModule } from './business-module-routing.module';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    CommonModule,
    BusinessModuleRoutingModule
  ]
})
export class BusinessModuleModule { }
