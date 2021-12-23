import { Injectable } from '@angular/core';
import { usuarioModel } from '../interface/datos.interface';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  baseDeDatos!: IDBDatabase;
  leerD: any;
  consultaDb: any
  get leerDato(){
    return this.leerD;
  }

  get consuta(){
    return this.consultaDb;
  }
  constructor() { }

  db(){
    const indexedDb = window.indexedDB;
    const conexion = indexedDb.open('lista',1)
  
    conexion.onsuccess = () =>{
        this.baseDeDatos = conexion.result
        console.log('Base de datos abiertaa', this.baseDeDatos)
    }
    conexion.onupgradeneeded = (e: any) =>{
        this.baseDeDatos = e.target.result
        console.log('Base de datos creada', this.db)
        this.baseDeDatos.createObjectStore('usuarios',{keyPath: 'id', autoIncrement: true});
        this.baseDeDatos.createObjectStore('libros',{keyPath: 'id', autoIncrement: true});

    }
    conexion.onerror = (error) =>{
        console.log('Error ', error)
    }
    }

    agregar(info: usuarioModel){
      const transaccion = this.baseDeDatos.transaction(['usuarios'],'readwrite')
      const coleccionObjetos = transaccion.objectStore('usuarios')
      coleccionObjetos.add(info)
      // console.log('Agregado', info)
    }
    
    leerr( id: any){
      const transaccion = this.baseDeDatos.transaction(['usuarios'],'readonly')
      const coleccionObjetos = transaccion.objectStore('usuarios')
      const conexion = coleccionObjetos.get(id)

     this.leerD = conexion;
    }

    actualizar(datos: usuarioModel){
      const trasaccion = this.baseDeDatos.transaction(['usuarios'],'readwrite')
      const coleccionObjetos = trasaccion.objectStore('usuarios')
      const conexion = coleccionObjetos.put(datos)
      
      // conexion.onsuccess = () =>{
      //   console.log(conexion.results) 
      // }
    }

    eliminar(id: number){
      const trasaccion = this.baseDeDatos.transaction(['usuarios'],'readwrite')
      const coleccionObjetos = trasaccion.objectStore('usuarios')
      const conexion = coleccionObjetos.delete(id)
  
      // conexion.onsuccess = () =>{
      //     this.consultar();
      // }
    }

    consultarDb(){
      const transaccion = this.baseDeDatos.transaction(['usuarios'],'readonly')
      const coleccionObjetos = transaccion.objectStore('usuarios')
      const conexion = coleccionObjetos.openCursor();

      this.consultaDb = conexion;
    }
}
