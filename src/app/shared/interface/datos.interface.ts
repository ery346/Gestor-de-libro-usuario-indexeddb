export interface usuarioModel {
    id:        number ;
    nombre:    string;
    edad:      number;
    telefono:  number;
    libros:    string[];
}


export interface librosModel {
    id: number ;
    titulo: string
    autor: string;
    fechaEntrada: number;
    editorial: string;
    estatus: boolean;
}