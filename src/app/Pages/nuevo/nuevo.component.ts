import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card'; 
import { Router } from '@angular/router';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';           
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductosService } from '../../Services/productos.service';
import { Categorias } from '../../Models/Categorias';
import { CategoriasService } from '../../Services/categorias.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.scss'],
  standalone: true,
  imports: [ 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule

  ],
})

export class NuevoComponent implements OnInit {
  subscription: Subscription = new Subscription();
  authForm!: UntypedFormGroup;
 
  submitted = false;
  loading = false;
  error = '';
  hide = true;  
  categorias: Categorias[] = [];
  id: number | undefined;
  row: any;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private productosService: ProductosService,
    private categoriasService: CategoriasService
  ) {}

  ngOnInit() {
    this.obtener();

    this.authForm = this.formBuilder.group({

      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      idcategoria: ['', Validators.required],  
    });
  }

  get f() { return this.authForm.controls; }

  obtener() {
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

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';

    if (this.authForm.invalid) {
      this.error = 'Error en la creacion de nuevo producto.';
      this.loading = false;
      return;
    } else {
      this.productosService.crear(this.authForm.value).subscribe({
        next: (response: any) => {
          this.router.navigate(['/productos']);
        },
        error: () => {
          this.error = 'Error al crear el producto';
          this.loading = false;
        },
      });
    }
  }

  // onSubmit() {
  //   if (this.authForm.invalid) {
  //     this.error = 'Por favor complete todos los campos correctamente';
  //     return;
  //   }

  //   this.loading = true;
  //   this.error = '';

  //   this.productosService.crear(this.authForm.value).subscribe({
  //     next: (response) => {
  //       if (response.success) {
         
  //         this.router.navigate(['/nuevo']);
  //       } else {
  //         this.error = response.message || 'Error al crear el producto';
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       this.error = err.error?.message || 'Error en la conexión con el servidor';
  //       console.error('Error:', err);
  //     },
  //     complete: () => {
  //       this.loading = false;
  //     }
  //   });
  // }

  Guardar() {
    console.log("Guardar");
    this.router.navigate(['/nuevo']);
  }
}
