import {  Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { librosModel, usuarioModel } from 'src/app/shared/interface/datos.interface';
import { DbService } from 'src/app/shared/services/db.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styles: [`
    button {
      margin-left: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    #color-id{
      color: #1e7df0;
    }
  `
  ]
})
export class DatosComponent implements OnInit {
  actualizarDatos: string = '';
  usuariosArr: usuarioModel[] = [];
  librosArr: librosModel[] = [];
  desabilitarB!: boolean;
  mostrarId!: string;
  titulo: string = 'Agregar';
  formulario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    edad: ['', Validators.required],
    telefono: ['', Validators.required],
    libros: [[]]
  });

  constructor( private dbS: DbService, private fb: FormBuilder, private _snackBar: MatSnackBar){}
 
  ngOnInit(): void {
    this.dbS.db();
    
  }

  requerido(campo: string){
    return this.formulario.get( campo )?.invalid && 
           this.formulario.get( campo)?.touched 
  }

  borrarNuevoId(){
    this.mostrarId = '';
  }
  agregar(){
    if(this.formulario.valid){
      this.formulario.value.libros = []
      this.formulario.value.id = 'u_' + Date.now();
      this.dbS.agregarU(this.formulario.value);
      this.mostrarId = this.formulario.value.id;
      this.mensajeAgregado();
      this.formulario.reset();
    }else{
      this.formulario.markAllAsTouched();
    }
  }

  actualizar(){
    this.formulario.value.id = this.actualizarDatos
    this.dbS.actualizarU(this.formulario.value);
    this.usuariosArr = [...this.usuariosArr, this.formulario.value ];
    this.formulario.reset();
    this.actualizarDatos = '';
    this.desabilitarB = false;
    this.titulo = 'Agregar';
  }

  mensajeAgregado() {
    this._snackBar.open('Nuevo usuario agregado!!!', 'db', {
      duration: 3000,
    });
  }


  
}
