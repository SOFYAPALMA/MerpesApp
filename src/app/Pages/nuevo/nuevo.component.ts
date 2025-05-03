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
    ReactiveFormsModule 
  ],
})

export class NuevoComponent implements OnInit {
  subscription: Subscription = new Subscription();
  authForm!: UntypedFormGroup;
 
  submitted = false;
  loading = false;
  error = '';
  hide = true;  


  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private productosService: ProductosService
  ) {}

  ngOnInit() {

    this.authForm = this.formBuilder.group({

      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],   
      cantidad: ['', [Validators.required, Validators.min(0)]]  
    });
  }


  get f() { return this.authForm.controls; }

  onSubmit() {
    if (this.authForm.invalid) {
      this.error = 'Por favor complete todos los campos correctamente';
      return;
    }

    this.loading = true;
    this.error = '';

    this.productosService.crear(this.authForm.value).subscribe({
      next: (response) => {
        if (response.success) {
         
          this.router.navigate(['/productos']);
        } else {
          this.error = response.message || 'Error al crear el producto';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.message || 'Error en la conexión con el servidor';
        console.error('Error:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
