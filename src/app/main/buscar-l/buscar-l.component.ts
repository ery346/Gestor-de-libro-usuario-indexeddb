import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { librosModel } from 'src/app/shared/interface/datos.interface';
import { DbService } from 'src/app/shared/services/db.service';

@Component({
  selector: 'app-buscar-l',
  templateUrl: './buscar-l.component.html',
  styles: [
  ]
})
export class BuscarLComponent implements OnInit {

  formulario: FormGroup = this.fb.group({
    titulo: ['' ],
    autor: [''],
    fechaEntrada: [''],
    editorial: [''],
    estatus: []
  });
  mostrar!: string;
  busqueda!: librosModel;
  actualizarDatos: any;
  valor!: string;
  @ViewChild('busca') buscarL!: ElementRef<HTMLInputElement>
  @Output() p  = new EventEmitter<string>();
  get leerD (){
    return this.dbS.leerDatoL;
  }
  constructor(private dbS: DbService, private fb: FormBuilder,  private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  mensageAnadido() {
    this._snackBar.open('Se añadio el libro!!!', 'db', {
      duration: 3000,
    });
  }
  mensageEliminado() {
    this._snackBar.open('Se elimino el libro!!!', 'db', {
      duration: 3000,
    });
  }

  buscar(){
    const valor = this.buscarL.nativeElement.value.trim();
    this.mostrar = 'm';
    this.dbS.leerL(valor);

    this.leerD.onsuccess = (e: Event) =>{
      const u = this.leerD.result;
      this.busqueda = u;
      // console.log(u);
      this.formulario.reset({
        titulo: u.titulo,
        autor: u.autor,
        fechaEntrada: u.fechaEntrada,
        editorial: u.editorial,
        estatus: u.estatus
        });
        this.actualizarDatos = u.id
      
    }
    this.valor = '';
  }

  actualizar(){
    this.formulario.value.id = this.actualizarDatos;
    this.p.emit(this.formulario.value.id);
    this.formulario.value.estatus = false;
    this.dbS.actualizarL(this.formulario.value);
    this.formulario.reset();
    this.mensageAnadido();
    this.mostrar = '';
  }

  eliminar(){
    this.dbS.eliminarL(this.actualizarDatos);
    this.mensageEliminado();
    this.mostrar = '';
  }
}
