import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { RespuestaAPI } from '../Models/RespuestaAPI';
import { Producto } from '../Models/Productos';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private http = inject(HttpClient);
    private apiUrl: string = appsettings.apiUrl + 'Productos/'

  constructor(private httpClient: HttpClient) { }

   // metodo para solicitud tipo Get que trae la lista de productos
   lista() {
      return this.http.get<RespuestaAPI>(this.apiUrl);
    }

   //metodo para la consulta por id de producto
    obtener(id: number) {
      return this.http.get<RespuestaAPI>(`${this.apiUrl}/${id}`);
    }

    //metodo tipo post para crear producto
    crear(objeto:Producto) {
      return this.http.post<RespuestaAPI>(this.apiUrl,objeto);
    }

    //metodo tipo put para editar producto
    editar(objeto:Producto) {
      return this.http.put<RespuestaAPI>(this.apiUrl,objeto);
    }

    //metodo para la eliminar por id de producto
    eliminar(id: number) {
      return this.http.delete<RespuestaAPI>(`${this.apiUrl}/${id}`);
    }
}
