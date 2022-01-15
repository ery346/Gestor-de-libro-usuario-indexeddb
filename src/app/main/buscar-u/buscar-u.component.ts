import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { usuarioModel } from 'src/app/shared/interface/datos.interface';
import { DbService } from '../../shared/services/db.service';
import { librosModel } from '../../shared/interface/datos.interface';

@Component({
  selector: 'app-buscar-u',
  templateUrl: './buscar-u.component.html',
  styles: [`
  mat-expansion-panel{
      width: 800px;
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
  libros!: any[];
  objLibro!: librosModel;
  arrLibros: string[] = [];
  arrConcatenados!: string[];
  get leerDu (){
    return this.dbS.leerDato;
  }
  get leerDl (){
    return this.dbS.leerDatoL;
  }
  @ViewChild('busca') buscarU!: ElementRef<HTMLInputElement>
  formulario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    edad: ['', Validators.required],
    telefono: ['', Validators.required]
  });
  constructor(private dbS: DbService, private fb: FormBuilder,  private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dbS.db();
  }

  mensageEliminado() {
    this._snackBar.open('Se elimino el usuario!!!', 'db', {
      duration: 3000,
    });
  }

  mensageActualizado(){
    this._snackBar.open('Usuario y libro actualizado!!!', 'db', {
      duration: 3000,
    });
  }

  buscar(){
    const valor = this.buscarU.nativeElement.value.trim();
    console.log(valor)
    this.dbS.leerU(valor);

    this.leerDu.onsuccess = (e: Event) =>{
      const u = this.leerDu.result;
      console.log(u);
      this.busqueda = u;
      this.libros = u.libros;
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
   const u = this.libros.concat(this.arrLibros)
   this.formulario.value.libros = u;
   console.log(this.formulario.value)
   this.dbS.actualizarU(this.formulario.value);
  this.mensageActualizado()
  }

  devolverLibro(id: string, indice: number){
    console.log(id, indice)
    this.libros.splice(indice, 1);
    this.dbS.leerL(id);
    this.leerDl.onsuccess = (e: Event) => {
      const u = this.leerDl.result;
      this.objLibro = u;
      this.objLibro.estatus = true;
      console.log(this.objLibro);
      this.dbS.actualizarL(this.objLibro);
    }
    this.update();
  }



  recibirId(mensage: string){

    if (mensage) {
      this.arrLibros = [... this.arrLibros, mensage];
      this.update();
    }
    console.log(this.arrLibros)
  }
}
