import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatosComponent } from './datos-nuevos/datos.component';
import { SharedModule } from '../shared/shared.module';
import { BuscarUComponent } from './buscar-u/buscar-u.component';


@NgModule({
  declarations: [
    DatosComponent,
    BuscarUComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    DatosComponent
  ]
})
export class DatosModule { }
