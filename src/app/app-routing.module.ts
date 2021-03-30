import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElevatorComponent } from './elevator/elevator.component';
import { EntryComponent } from './entry/entry.component';

const routes: Routes = [
  {
    path: 'elevator',
    component: ElevatorComponent,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: EntryComponent
  },
  {
    path: '**',
    component: EntryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
