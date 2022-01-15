import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DbService } from '../../shared/services/db.service';

@Component({
  selector: 'app-editar-u-l',
  templateUrl: './editar-u-l.component.html',
  styles: [
  ]
})
export class EditarULComponent implements OnInit {
  limpiarInput!: string;
  id!: string;
  libros!: string[];
  formularioU: FormGroup = this.fb.group({
    nombre:    [''],
    edad:      [''],
    telefono:  [''],
  });
  @ViewChild('busca') buscarU!: ElementRef<HTMLInputElement>;
  get datosU(){
    return this.dbS.leerDato;
  }
  constructor(private fb: FormBuilder, private dbS: DbService) { }

  ngOnInit(): void {
    this.dbS.db();
  }

  buscar(){
    const valor = this.buscarU.nativeElement.value;
    
    this.dbS.leerU(valor);
    this.datosU.onsuccess = () => {
      const u = this.datosU.result;
      this.libros = u .libros;
      this.id = u.id;
      this.formularioU.reset({
        nombre:    u.nombre,
        edad:      u.edad,
        telefono:  u.telefono
      })
    }
    this.limpiarInput = '';
  }
}
