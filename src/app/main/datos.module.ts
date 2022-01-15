import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatosComponent } from './datos-nuevos/datos.component';
import { SharedModule } from '../shared/shared.module';
import { BuscarUComponent } from './buscar-u/buscar-u.component';
import { NuevoLibroComponent } from './nuevo-libro/nuevo-libro.component';
import { BuscarLComponent } from './buscar-l/buscar-l.component';
import { EditarULComponent } from './editar-u-l/editar-u-l.component';
import { ConsultarComponent } from './consultar/consultar.component';


@NgModule({
  declarations: [
    DatosComponent,
    BuscarUComponent,
    NuevoLibroComponent,
    BuscarLComponent,
    EditarULComponent,
    ConsultarComponent,
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
