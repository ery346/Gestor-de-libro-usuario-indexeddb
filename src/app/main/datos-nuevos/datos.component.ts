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
    mat-expansion-panel{
      width: 800px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  `
  ]
})
export class DatosComponent implements OnInit {
  c: boolean = false;
  actualizarDatos: string = '';
  usuariosArr: usuarioModel[] = [];
  librosArr: librosModel[] = [];
  desabilitarBA: boolean = true;
  desabilitarB!: boolean;
  desabilitarPanel!: boolean;
  mostrarId!: string;
  titulo: string = 'Agregar';
  formulario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    edad: ['', Validators.required],
    telefono: ['', Validators.required],
    libros: [[]]
  });

  get consultarU (){
    return this.dbS.consultaU;
  }
  get consultarL(){
    return this.dbS.consultaL;
  }
  get leerD (){
    return this.dbS.leerDato;
  }
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
      this.mensageAgregado();
      this.formulario.reset();
    }else{
      this.formulario.markAllAsTouched();
    }
  }

  actualizar(){
    this.formulario.value.id = this.actualizarDatos
    // console.log(this.formulario.value)
    this.dbS.actualizarU(this.formulario.value);
    this.usuariosArr = [...this.usuariosArr, this.formulario.value ];
    this.formulario.reset();
    this.actualizarDatos = '';
    this.desabilitarBA = true;
    this.desabilitarB = false;
    this.desabilitarPanel = false;
    this.mensageEditado();
    this.titulo = 'Agregar';
  }

  eliminarU(id: number , index: number){
    this.dbS.eliminarU( id );
    this.usuariosArr.splice(index , 1)
    this.mensageEliminado();
  }

  eliminarL( id: number, index: number){
    this.dbS.eliminarL( id );
    this.librosArr.splice(index, 1);
    this.mensageEliminado();
  }
  // consultar(){
  //   this.usuariosArr = [];
  //   this.librosArr = [];
  //   this.dbS.consultarDb();
  //   this.consultarU.onsuccess = (e: any) =>{
  //       const valores  =  e.target.result;  
  //       // console.log(this.infoArr)
  //       if(valores){
  //         this.usuariosArr = [...this.usuariosArr, valores.value];
  //           // console.log(d.value);
  //           valores.continue()
  //       }
  //   }

  //   this.consultarL.onsuccess = (e: any) => {
  //     const valores = e.target.result;

  //     if(valores){
      
  //       this.librosArr = [...this.librosArr, valores.value]
  //     valores.continue()
  //     }
  //   }
  // }

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
