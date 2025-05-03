import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { RespuestaAPI } from '../Models/RespuestaAPI';
import { Producto } from '../Models/Productos';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Productos/';

  constructor() { }

   // metodo para solicitud tipo Get que trae la lista de productos
   lista(){
    return this.http.get<RespuestaAPI>(this.apiUrl + "ConsultarProducto");
  }

   //metodo para la consulta por id de producto
   obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(
      `${this.apiUrl}ConsultarProducto/${id}`
    ).pipe(
      catchError(error => {
        console.error('Error al obtener producto:', error);
        return throwError(() => error);
      })
    );
  }

    //metodo tipo post para crear producto
    crear(value: Producto): Observable<RespuestaAPI> {
    console.log('nuevo producto', value);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<RespuestaAPI>(
      `${this.apiUrl}CrearProducto`,
      value,
      httpOptions
    );
  }
    //metodo tipo put para editar producto
    editar(objeto: Producto): Observable<RespuestaAPI> {
      return this.http.put<RespuestaAPI>(
        `${this.apiUrl}ActualizarProducto/${objeto.id}`,
        objeto
      );
    }
  
    //metodo para la eliminar por id de producto
    eliminar(id: number): Observable<RespuestaAPI> {
      return this.http.delete<RespuestaAPI>(`${this.apiUrl}Eliminar/${id}`).pipe(
        catchError(error => {
          console.error('Error al eliminar producto:', error);
          return throwError(() => error);
        })
      );
    }
}
