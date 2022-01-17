import { Injectable } from '@angular/core';
import { usuarioModel, librosModel } from '../interface/datos.interface';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  baseDeDatos!: IDBDatabase;
  leerD!: IDBRequest;
  leerDL!: IDBRequest;
  consultaUsuario!: IDBRequest<IDBCursorWithValue | null>;
  consultaLibro!: IDBRequest<IDBCursorWithValue | null>;
  get leerDato(){
    return this.leerD;
  }
  get leerDatoL(){
    return this.leerDL;
  }
  get consultaL(){
    return this.consultaLibro;
  }
  get consultaU(){
    return this.consultaUsuario;
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

    agregarL(info: librosModel){
      const transaccion = this.baseDeDatos.transaction(['libros'],'readwrite')
      const coleccionObjetos = transaccion.objectStore('libros')
      coleccionObjetos.add(info)
      // console.log('Agregado', info)
    }


    agregarU(info: usuarioModel){
      const transaccion = this.baseDeDatos.transaction(['usuarios'],'readwrite')
      const coleccionObjetos = transaccion.objectStore('usuarios')
      coleccionObjetos.add(info)
      // console.log('Agregado', info)
    }
    
    leerU( id: number | string){
      const transaccion = this.baseDeDatos.transaction(['usuarios'],'readonly')
      const coleccionObjetos = transaccion.objectStore('usuarios')
      const conexion = coleccionObjetos.get(id)

     this.leerD = conexion;
    }
    leerL( id: number | string){
      const transaccion = this.baseDeDatos.transaction(['libros'],'readonly')
      const coleccionObjetos = transaccion.objectStore('libros')
      const conexion = coleccionObjetos.get(id)

     this.leerDL = conexion;
    }

    actualizarU(datos: usuarioModel){
      const trasaccion = this.baseDeDatos.transaction(['usuarios'],'readwrite')
      const coleccionObjetos = trasaccion.objectStore('usuarios')
      const conexion = coleccionObjetos.put(datos)
      
      // conexion.onsuccess = () =>{
      //   console.log(conexion.results) 
      // }
    }
    actualizarL(datos: librosModel){
      const trasaccion = this.baseDeDatos.transaction(['libros'],'readwrite')
      const coleccionObjetos = trasaccion.objectStore('libros')
      const conexion = coleccionObjetos.put(datos)
      
      // conexion.onsuccess = () =>{
      //   console.log(conexion.results) 
      // }
    }

    eliminarU(id: number | string){
      const trasaccion = this.baseDeDatos.transaction(['usuarios'],'readwrite')
      const coleccionObjetos = trasaccion.objectStore('usuarios')
      const conexion = coleccionObjetos.delete(id)
  
      // conexion.onsuccess = () =>{
      //     this.consultar();
      // }
    }

    eliminarL(id: number | string){
      const trasaccion = this.baseDeDatos.transaction(['libros'],'readwrite')
      const coleccionObjetos = trasaccion.objectStore('libros')
      const conexion = coleccionObjetos.delete(id)
  
      // conexion.onsuccess = () =>{
      //     this.consultar();
      // }
    }
    consultarDb(){
      const t = this.baseDeDatos.transaction(['libros'],'readonly')
      const coleccionO = t.objectStore('libros')
      const c = coleccionO.openCursor();
      const transaccion = this.baseDeDatos.transaction(['usuarios'],'readonly')
      const coleccionObjetos = transaccion.objectStore('usuarios')
      const conexion = coleccionObjetos.openCursor();

      this.consultaLibro = c ;
      this.consultaUsuario = conexion;

    }
 
}
