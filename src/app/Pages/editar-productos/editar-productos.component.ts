import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductosService } from '../../Services/productos.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './editar-productos.component.html',
  styleUrl: './editar-productos.component.css',
})
export class EditarProductosComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  productId: number | null = null;

  constructor(
    private fb: UntypedFormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private productosService: ProductosService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.getProductIdFromRoute();  

    const idParam = this.route.snapshot.paramMap.get('id');
    this.productId = idParam ? Number(idParam) : null;

    if (this.productId) {
      this.loadProductData(this.productId);
    }
  }

  public navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [{value: null, disabled: true}],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      idcategoria: [null],
    });
  }

  private getProductIdFromRoute(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.productId = idParam ? Number(idParam) : null;

    if (this.productId) {
      this.loadProductData(this.productId);
    }
  }

  private loadProductData(id: number): void {
    this.loading = true;
    this.productosService.obtener(id).subscribe({
      next: (producto) => {
       
        this.form.setValue({
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          categoria: producto.categoria,
          cantidad: producto.cantidad,
          idcategoria: producto.idcategoria
        }, {emitEvent: false});
        
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar producto:', error);
        this.error = 'No se pudo cargar el producto.';
        this.loading = false;
        this.router.navigate(['/productos']);
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.error = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.loading = true;
    this.error = '';
    const producto = this.form.value;

    const request$ = producto.id
      ? this.productosService.editar(producto)
      : this.productosService.crear(producto);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/editar-productos', producto.id]);
      },
      error: (error: HttpErrorResponse) => {
        this.error =
          error.error?.message ||
          (producto.id ? 'Error al actualizar el producto' : 'Error al crear el producto');
        this.loading = false;
      },
    });
  }
}
