import { NgModule } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';


import { ContenidoCentradoDirective } from './directivas/contenido-centrado.directive';



@NgModule({
  declarations: [
    ContenidoCentradoDirective
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,
    MatCardModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    ContenidoCentradoDirective
  ]
})
export class SharedModule { }
