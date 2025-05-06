import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductosService } from '../../Services/productos.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Producto } from '../../Models/Productos';
import { map, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { RespuestaAPI } from '../../Models/RespuestaAPI';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Categorias } from '../../Models/Categorias';
import { CategoriasService } from '../../Services/categorias.service';

@Component({
  selector: 'app-editar-productos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './editar-productos.component.html',
  styleUrl: './editar-productos.component.css',
})
export class EditarProductosComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  Editarform: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  productId: number = 0;
  isTblLoading: boolean = true;
  categorias: Categorias[] = [];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    public productosService: ProductosService,
    private categoriasService: CategoriasService
  ) {
    this.Editarform = this.fb.group({

    id: [{value: null, disabled: true}],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      idcategoria: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(0)]]
    });  
  }
  get f() {
    return this.Editarform.controls;
  }
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.productId = params['id'];
      console.log('id1', this.productId);
    });

    this.getProductoUpdate(this.productId.toString());
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.categoriasService.obtener().subscribe({
      next: (result: any) => {
        console.log('S3', result);
        if (result.success) {
          this.categorias = result.data;
          console.log('S5', this.categorias);
        } else {
          console.error('Error al cargar categorías:', result.message);
        }
      },
      error: (error: any) => {
        console.error('Error al obtener los datos de categorías:', error);
      },
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.Editarform.invalid) return;
    const producto: Producto = this.Editarform.getRawValue();
    this.editarProducto(producto);
  }

  editarProducto(producto: Producto): void {
    this.loading = true;
    console.log('LLAMR333:', producto);
    
    // Asegurarnos que el ID es correcto
    producto.id = this.productId;
  
    this.productosService.editarProducto(producto).subscribe({
      next: (result: RespuestaAPI) => {
        this.loading = false;
        console.log('LLAMR444:', producto);
        
        if (result.success) {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Producto actualizado correctamente',
            icon: 'success'
          });
          this.router.navigate(['/productos']);
        } else {
          Swal.fire({
            title: 'Error',
            text: result.message || 'Error al actualizar el producto',
            icon: 'error'
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.error('Error completo:', error);
        
        Swal.fire({
          title: 'Error',
          text: error.error?.message || error.message || 'Error en el servidor',
          icon: 'error'
        });
      }
    });
  }
  
  getProductoUpdate(productId: string): void {
    this.isTblLoading = true;
    
    this.productosService.obtener(productId).subscribe({
      next: (respuesta: RespuestaAPI) => {
        this.isTblLoading = false;
        
        if (respuesta.success && respuesta.data) {
          const producto = Array.isArray(respuesta.data) ? respuesta.data[0] : respuesta.data;
          this.cargarProductoForm(producto);
        } else {
          console.error('Producto no encontrado:', respuesta.message);
        }
      },
      error: (err) => {
        this.isTblLoading = false;
        console.error('Error al cargar producto:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el producto',
          icon: 'error'
        });
      }
    });
  }

  cargarProductoForm(producto: any[]): void {
    console.log('DATO2', producto);
    this.Editarform.patchValue(producto);   
  }

  retornar() {
    this.router.navigate(['/productos']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
 
}

 