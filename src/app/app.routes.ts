import { Routes } from '@angular/router';
import { ProductosComponent } from './Pages/productos/productos.component';
import { EditarProductosComponent } from './Pages/editar-productos/editar-productos.component';
import { NuevoComponent } from './Pages/nuevo/nuevo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos',component: ProductosComponent },
  { path: 'nuevo',component: NuevoComponent },
  { path: 'editar-productos',component: EditarProductosComponent }, 
];

