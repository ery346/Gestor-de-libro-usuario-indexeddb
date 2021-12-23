import {  Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { usuarioModel } from 'src/app/shared/interface/datos.interface';
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
    mat-expansion-panel{
      width: 682px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  `
  ]
})
export class DatosComponent implements OnInit {
  c: boolean = false;
  actualizarDatos: string = '';
  infoArr: usuarioModel[] = [];
  desabilitarBA: boolean = true;
  desabilitarB!: boolean;
  desabilitarPanel!: boolean;
  mostrarId!: string;
  titulo: string = 'Agregar';
  get consultarDb (){
    return this.dbS.consultaDb;
  }
  get leerD (){
    return this.dbS.leerDato;
  }
  formulario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    edad: ['', Validators.required],
    telefono: ['', Validators.required]
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
      this.formulario.value.id = 'usuario_' + Date.now();
      this.dbS.agregar(this.formulario.value);
      this.mostrarId = this.formulario.value.id;
      this.mensageAgregado();
      this.formulario.reset();
    }else{
      this.formulario.markAllAsTouched();
    }
  }
  editar(id: number, index: number){
    // console.log(id)
    this.desabilitarBA = false;
    this.desabilitarB = true;
    this.titulo = 'Editar';
    this.dbS.leerr(id);
    this.leerD.onsuccess = (e: any) => {
      const usuario = this.leerD.result;
          this.formulario.reset({
          nombre: usuario.nombre,
          edad: usuario.edad,
          telefono: usuario.telefono
          });
          this.actualizarDatos = usuario.id
    }
 
    this.desabilitarPanel = true;
    this.infoArr.splice(index , 1)
  }

  actualizar(){
    this.formulario.value.id = this.actualizarDatos
    // console.log(this.formulario.value)
    this.dbS.actualizar(this.formulario.value);
    this.infoArr = [...this.infoArr, this.formulario.value ];
    this.formulario.reset();
    this.actualizarDatos = '';
    this.desabilitarBA = true;
    this.desabilitarB = false;
    this.desabilitarPanel = false;
    this.mensageEditado();
    this.titulo = 'Agregar';
  }

  eliminar(id: number, index: number){
    this.dbS.eliminar( id );
    this.infoArr.splice(index , 1)
    // console.log(this.infoArr, index)
    this.mensageEliminado();
  }

  consultar(){
    this.infoArr = []
    this.dbS.consultarDb();
    this.consultarDb.onsuccess = (e: any) =>{
        const d  =  e.target.result;  
        // console.log(this.infoArr)
        if(d){
          this.infoArr = [...this.infoArr, d.value];
            // console.log(d.value);
            d.continue()
        }
    }
  }

  mensageAgregado() {
    this._snackBar.open('Nuevo usuario agregado!!!', 'db', {
      duration: 3000,
    });
  }

  mensageEliminado() {
    this._snackBar.open('Se elimino el usuario!!!', 'db', {
      duration: 3000,
    });
  }

  mensageEditado(){
    this._snackBar.open('Se actualizo el usuario!!!', 'db', {
      duration: 3000,
    });
  }
}
