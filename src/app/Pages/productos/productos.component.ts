import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductosService } from '../../Services/productos.service';
import { Producto } from '../../Models/Productos';
import { RespuestaAPI } from '../../Models/RespuestaAPI';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit, AfterViewInit {
 
  private productosServicio = inject(ProductosService);
  public listaProductos: MatTableDataSource<Producto> = new MatTableDataSource<Producto>();
  public displayedColumns: string[] = [ 
    'nombre',
    'descripcion',
    'precio',
    'categoria',
    'cantidad',
    'accion'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    
  ) { }


  ngOnInit(){
    this.obtenerProductos();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.listaProductos.paginator = this.paginator;
    }
    if (this.sort) {
      this.listaProductos.sort = this.sort;
    }
  }
  
  obtenerProductos() {
    this.productosServicio.lista().subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        if (respuesta.success && respuesta.data) {
          this.listaProductos.data = respuesta.data;
        }
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
    });
  }

  ver(name: string) {
    console.log('id');
    this.router.navigate(['editar-productos'], { queryParams: {id: name} });
  }
  nuevo() {
    this.router.navigate(['/nuevo']);
  }

  eliminar(objeto: Producto){
    if(confirm(`¿Desea eliminar el producto ${objeto.nombre}?`)){
      this.productosServicio.eliminar(objeto.id).subscribe({
        next: (respuesta: RespuestaAPI) => {
          console.log(respuesta);
          if (respuesta.success) { 
            this.obtenerProductos(); 
          }else{
            alert(respuesta.message || "No se pudo eliminar el producto");
          }
        },
        error: (err) => {
          console.error(err);
                alert("Error en la solicitud: " + (err.error?.message || err.message));
        }
      })
    }
  }
}
