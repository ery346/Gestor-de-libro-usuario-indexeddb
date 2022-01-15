import { Component, OnInit } from '@angular/core';
import { librosModel, usuarioModel } from '../../shared/interface/datos.interface';
import { DbService } from '../../shared/services/db.service';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styles: [
  ]
})
export class ConsultarComponent implements OnInit {
  usuariosArr: usuarioModel[] = [];
  librosArr: librosModel[] = [];

  get consultarL(){
    return this.dbS.consultaL;
  }
  get consultarU(){
    return this.dbS.consultaU;
  }
  constructor(private dbS: DbService) { }

  ngOnInit(): void {
    this.dbS.db();
  }


  consultar(){
     this.dbS.consultarDb();
    this.consultarU.onsuccess = (e: any) =>{
        const valores  =  e.target.result;  
        // console.log(this.infoArr)
        if(valores){
          this.usuariosArr = [...this.usuariosArr, valores.value];
            // console.log(d.value);
            valores.continue()
        }
    }

    this.consultarL.onsuccess = (e: any) => {
      const valores = e.target.result;

      if(valores){
      
        this.librosArr = [...this.librosArr, valores.value]
      valores.continue()
      }
    }
  }
}
