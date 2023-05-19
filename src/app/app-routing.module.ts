import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./_components/home/home.component";
import { ItemListComponent } from "./_components/item-list/item-list.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'items', component: ItemListComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
