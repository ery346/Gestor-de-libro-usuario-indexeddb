import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DbService } from '../../shared/services/db.service';
import { usuarioModel, librosModel } from '../../shared/interface/datos.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QrScannerComponent } from 'angular2-qrscanner';

@Component({
  selector: 'app-editar-u-l',
  templateUrl: './editar-u-l.component.html',
  styles: [
  ]
})
export class EditarULComponent implements OnInit {
  limpiarInputUsuario!: string;
  idUsuario!: string ;
  librosU!: string[] ;
  mostrarInfoU!: usuarioModel | undefined;
  botonEliminar: boolean = false;
  seleccion: string = 'option2'
  formularioU: FormGroup = this.fb.group({
    nombre:    [''],
    edad:      [''],
    telefono:  [''],
  });
  valor!: string;
  escaneando: string = '';
  escaner!: boolean;

  get datosU(){
    return this.dbS.leerDato;
  }
  @ViewChild('busca') buscarU!: ElementRef<HTMLInputElement>;
  @ViewChild(QrScannerComponent, { static: false}) qrScannerComponent!: QrScannerComponent ;
  constructor(private fb: FormBuilder, private dbS: DbService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dbS.db();
  }
  mensajeEditado(msg: string | undefined ){
    this._snackBar.open(`Se actualizo '${msg}'!!!`, 'db', {
      duration: 3000,
    });
  }
  mesnajeEliminado(msg: string | undefined){
    this._snackBar.open(`Se elimino '${msg}'!!!`, 'db', {
      duration: 3000,
    });
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
    this.buscarUsuario();
  });
  }

  buscarUsuario(){
    const valor = this.buscarU.nativeElement.value;
    
    this.dbS.leerU(valor || this.valor);
    this.datosU.onsuccess = (e: Event) => {
      const u = this.datosU.result;
      this.escaner = true;
      this.escaneando = '';
      this.mostrarInfoU = u;
      this.librosU = u .libros;
      this.idUsuario = u.id;
      this.formularioU.reset({
        nombre:    u.nombre,
        edad:      u.edad,
        telefono:  u.telefono
      });
      if (this.librosU.length > 0) {
        this.botonEliminar = true;
      }else{
        this.botonEliminar = false;
      }
    }
    this.qrScannerComponent.stopScanning();
    this.valor = '';
    this.limpiarInputUsuario = '';
  }

  eliminarUsuario(){
    this.dbS.eliminarU(this.idUsuario);
    this.mesnajeEliminado( this.mostrarInfoU?.nombre );
    this.mostrarInfoU = undefined;
  }

  editarUsuario(){
    this.formularioU.value.id = this.idUsuario;
    this.formularioU.value.libros = this.librosU;
    this.dbS.actualizarU(this.formularioU.value);
    this.mensajeEditado( this.mostrarInfoU?.nombre );
    this.mostrarInfoU = undefined;
  }

}
