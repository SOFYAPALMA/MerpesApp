import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { RespuestaAPI } from '../Models/RespuestaAPI';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiUrl + 'Categorias/'

  constructor(private httpClient: HttpClient) { }

  // metodo para solicitud tipo Get que trae la lista de categorias

  lista() {
    return this.http.get<RespuestaAPI>(this.apiUrl);
  }
  // metodo para la consulta por id de categoria

  obtener(id: number) {
    return this.http.get<RespuestaAPI>(`${this.apiUrl}/${id}`);
  }
}
