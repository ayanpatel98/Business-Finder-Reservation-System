import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleModule } from './business-module/business-module.module';

const routes: Routes = [
  {
    path: 'business',
    loadChildren: () => BusinessModuleModule
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
