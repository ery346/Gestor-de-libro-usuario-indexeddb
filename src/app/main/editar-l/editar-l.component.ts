import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { librosModel } from 'src/app/shared/interface/datos.interface';
import { DbService } from '../../shared/services/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QrScannerComponent } from 'angular2-qrscanner';

@Component({
  selector: 'app-editar-l',
  templateUrl: './editar-l.component.html',
  styles: [
  ]
})
export class EditarLComponent implements OnInit {
  limpiarInputLibro!: string;
  idLibro!: string;
  mostrarInfoL!: librosModel | undefined;
  botonEliminar: boolean = false;
  estatusLibro!: boolean;
  formularioL: FormGroup = this.fb.group({
    titulo: [''],
    autor: [''],
    fechaEntrada: [''],
    editorial: ['']
  });
  valor!: string;
  escaneando: string = '';
  escaner!: boolean;
  get datosL(){
    return this.dbS.leerDatoL;
  }
  @ViewChild('busca2') buscarL!: ElementRef<HTMLInputElement>;
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
    this.buscarLibro();
  });
  }

  buscarLibro(){
    const valor = this.buscarL.nativeElement.value;
    this.dbS.leerL(valor || this.valor);

    this.datosL.onsuccess = (e: Event) => {
      const u = this.datosL.result;
      this.escaner = true;
      this.escaneando = '';
      this.mostrarInfoL = u;
      this.idLibro = u.id;
      this.estatusLibro = u.estatus;
      this.formularioL.reset({
        titulo:       u.titulo,
        autor:        u.autor,
        fechaEntrada: u.fechaEntrada,
        editorial:    u.editorial,
      })
      if (this.estatusLibro) {
        this.botonEliminar = false;
      }else{
        this.botonEliminar = true;
      }
    }
    this.qrScannerComponent.stopScanning();
    this.limpiarInputLibro = '';
  }

  editarLibro(){
    this.formularioL.value.id = this.idLibro;
    this.formularioL.value.estatus = this.estatusLibro;
    this.dbS.actualizarL(this.formularioL.value);
    this.mensajeEditado( this.mostrarInfoL?.titulo );
    this.mostrarInfoL = undefined;
  }

  eliminarLibro(){
    this.dbS.eliminarL(this.idLibro);
    this.mesnajeEliminado( this.mostrarInfoL?.titulo );
    this.mostrarInfoL = undefined;
  }

}
