import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {QrScannerComponent} from 'angular2-qrscanner';
import { usuarioModel } from 'src/app/shared/interface/datos.interface';
import { DbService } from '../../shared/services/db.service';
import { librosModel } from '../../shared/interface/datos.interface';

@Component({
  selector: 'app-buscar-u',
  templateUrl: './buscar-u.component.html',
  styles: [
  ],
  encapsulation: ViewEncapsulation.None
})
export class BuscarUComponent implements OnInit {
  actualizarDatos: string = '';
  valor: string = '';
  busqueda!: usuarioModel;
  libros!: string[];
  objLibro!: librosModel;
  arrLibros: string[] = [];
  arrConcatenados!: string[];
  escaner!: boolean ;
  escaneando: string = '';
  get leerDu (){
    return this.dbS.leerDato;
  }
  get leerDl (){
    return this.dbS.leerDatoL;
  }
  @ViewChild('busca') buscarU!: ElementRef<HTMLInputElement> 
  @ViewChild(QrScannerComponent, { static: false}) qrScannerComponent!: QrScannerComponent ;
  formulario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    edad: ['', Validators.required],
    telefono: ['', Validators.required]
  });
  constructor(private dbS: DbService, private fb: FormBuilder,  private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dbS.db();
  }

  escanear(){
    this.qrScannerComponent.getMediaDevices().then(devices => {
      
      this.escaneando = 'Escaneando...';
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
              videoDevices.push(device);
          }
      }
      if (videoDevices.length > 0){
          let choosenDev;
          for (const dev of videoDevices){
              if (dev.label.includes('front')){
                  choosenDev = dev;
                  break;
              }
          }
          if (choosenDev) {
              this.qrScannerComponent.chooseCamera.next(choosenDev);
          } else {
              this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
          }
      }
  });

  this.qrScannerComponent.capturedQr.subscribe(result => {
    this.valor = result;
    this.buscar();
    
      console.log(this.valor);
  });
  }

  mensajeActualizado(){
    this._snackBar.open('Usuario y libro actualizado!!!', 'db', {
      duration: 3000,
    });
  }

  buscar(){
    this.arrLibros = [];
    const valor = this.buscarU.nativeElement.value.trim();
    this.dbS.leerU(valor || this.valor);
   
    this.leerDu.onsuccess = (e: Event) =>{
      const u = this.leerDu.result;
      this.escaner = true;
      this.escaneando = '';
      this.busqueda = u;
      this.libros = u.libros;
      this.formulario.reset({
        nombre: u.nombre,
        edad: u.edad,
        telefono: u.telefono
        });
        this.actualizarDatos = u.id
    }
  
    this.qrScannerComponent.stopScanning();
    this.valor = '';
  }

  update(){
   this.formulario.value.id = this.actualizarDatos;
   const u = this.libros.concat(this.arrLibros)
   this.formulario.value.libros = u;
   console.log(this.formulario.value)
   this.dbS.actualizarU(this.formulario.value);
  this.mensajeActualizado()
  }

  devolverLibro(id: string, indice: number){
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
  }
}
