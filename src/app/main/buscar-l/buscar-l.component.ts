import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QrScannerComponent } from 'angular2-qrscanner';
import { librosModel } from 'src/app/shared/interface/datos.interface';
import { DbService } from 'src/app/shared/services/db.service';


@Component({
  selector: 'app-buscar-l',
  templateUrl: './buscar-l.component.html',
  styles: [
  ],
  encapsulation: ViewEncapsulation.None
})
export class BuscarLComponent implements OnInit {

  objLibro: librosModel = {
    id: 0,
    titulo: '',
    autor: '',
    fechaEntrada: 0,
    editorial: '',
    estatus: true
  }
  mostrar!: string;
  busqueda!: librosModel;
  actualizarDatos: any;
  valor!: string;
  escaner!: boolean;
  @ViewChild('busca') buscarL!: ElementRef<HTMLInputElement>;
  @ViewChild(QrScannerComponent, { static: false}) qrScannerComponent!: QrScannerComponent ;
  @Output() p  = new EventEmitter<string>();
  iniciar!: string;
  escaneando!: string;
  get leerD (){
    return this.dbS.leerDatoL;
  }
  constructor(private dbS: DbService,  private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  escanear(){
    this.qrScannerComponent.getMediaDevices().then(devices => {
      this.escaneando = this.escaneando = 'Escaneando...'
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

  mensajeAnadido() {
    this._snackBar.open('Se añadio el libro!!!', 'db', {
      duration: 3000,
    });
  }
  mensajeEliminado() {
    this._snackBar.open('Se elimino el libro!!!', 'db', {
      duration: 3000,
    });
  }

  buscar(){
    const valor = this.buscarL.nativeElement.value.trim();
    this.mostrar = 'm';
    this.dbS.leerL(valor || this.valor);

    this.leerD.onsuccess = (e: Event) =>{
      const u = this.leerD.result;
      this.escaneando = '';
      this.escaner = true;
      this.busqueda = u;
      this.objLibro = {
        id: u.id,
        titulo: u.titulo,
        autor: u.autor,
        fechaEntrada: u.fechaEntrada,
        editorial: u.editorial,
        estatus: u.estatus
      }
        this.actualizarDatos = u.id
      
    }
    this.qrScannerComponent.stopScanning();
    this.valor = '';
  }

  actualizar(){
    this.p.emit(this.actualizarDatos);
    this.objLibro.estatus = false;
    this.dbS.actualizarL(this.objLibro);
    this.mensajeAnadido();
    this.mostrar = '';
  }

  eliminar(){
    this.dbS.eliminarL(this.actualizarDatos);
    this.mensajeEliminado();
    this.mostrar = '';
  }
}
