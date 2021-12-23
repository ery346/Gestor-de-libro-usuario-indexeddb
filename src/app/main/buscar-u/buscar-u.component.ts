import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { usuarioModel } from 'src/app/shared/interface/datos.interface';
import { DbService } from '../../shared/services/db.service';

@Component({
  selector: 'app-buscar-u',
  templateUrl: './buscar-u.component.html',
  styles: [`
  mat-expansion-panel{
      width: 682px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  `
  ]
})
export class BuscarUComponent implements OnInit {
  actualizarDatos: string = '';
  valor: string = '';
  busqueda!: usuarioModel;
  get leerD (){
    return this.dbS.leerDato;
  }
  @ViewChild('busca') buscarU!: ElementRef<HTMLInputElement>
  formulario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    edad: ['', Validators.required],
    telefono: ['', Validators.required]
  });
  constructor(private dbS: DbService, private fb: FormBuilder,  private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // this.dbS.db();
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

  buscar(){
    const valor = this.buscarU.nativeElement.value;

    this.dbS.leerr(valor);

    this.leerD.onsuccess = (e: Event) =>{
      const u = this.leerD.result;
      this.busqueda = u;
      console.log(u);
      this.formulario.reset({
        nombre: u.nombre,
        edad: u.edad,
        telefono: u.telefono
        });
        this.actualizarDatos = u.id
      
    }
  
    this.valor = '';
  }

  update(){
    this.formulario.value.id = this.actualizarDatos;
   this.dbS.actualizar(this.formulario.value);
   this.formulario.reset();
   this.actualizarDatos = '';
   this.mensageEditado();
  }

  borrar(id: number){
    this.dbS.eliminar( id );
    this.mensageEliminado();
    this.formulario.reset();
    this.actualizarDatos = '';
  }
}
