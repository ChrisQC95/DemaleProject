import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { ProductosComponent } from './pages/productos/productos.component';
import { historialComponent } from './pages/historialProductos/historialProductos.component';
import { vehiculosComponent } from './pages/vehiculos/vehiculos.component';
import { conductoresComponent } from './pages/conductores/conductores.component';
import { EnviosProductosComponent } from './pages/enviosProductos/enviosProductos.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    vehiculosComponent,
    conductoresComponent,
    ProductosComponent,
    historialComponent,
    EnviosProductosComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
