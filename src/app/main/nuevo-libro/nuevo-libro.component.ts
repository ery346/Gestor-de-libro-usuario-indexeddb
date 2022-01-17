import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbService } from '../../shared/services/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuevo-libro',
  templateUrl: './nuevo-libro.component.html',
  styles: [
  ]
})
export class NuevoLibroComponent implements OnInit {
  error!: string;
  mostrarId!: string;
  formulario: FormGroup = this.fb.group({
    titulo: ['', Validators.required],
    autor: ['',Validators.required],
    fechaEntrada: ['',Validators.required],
    editorial: ['',Validators.required],
    estatus: []
  })
  constructor(private fb: FormBuilder, private dbS: DbService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  agregarLibro(){
    if(this.formulario.valid){
     this.error = '';
     this.formulario.value.id = 'li_' + Date.now();
     this.formulario.value.estatus = true;
     this.dbS.agregarL(this.formulario.value);
     this.mostrarId = this.formulario.value.id;
     this.formulario.reset();
     this.mensajeAgregado();
    }
    else{
      this.error = 'Error!!!';
    }
  }

  borrarNuevoId(){
    this.mostrarId = '';
  }
  mensajeAgregado() {
    this._snackBar.open('Nuevo libro agregado!!!', 'db', {
      duration: 3000,
    });
  }
}
