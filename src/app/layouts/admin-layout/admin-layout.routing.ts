import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { ProductosComponent } from '../../pages/productos/productos.component';
import { EmpleadosComponent } from '../../pages/empleados/empleados.component';
import { ConductoresComponent } from '../../pages/conductores/conductores.component';
import { enviosProductosComponent } from '../../pages/enviosProductos/enviosProductos.component';
import { historialComponent } from '../../pages/historialProductos/historialProductos.component';
import { rutasComponent } from '../../pages/rutas/rutas.component';
import { VehiculosComponent } from '../../pages/vehiculos/vehiculos.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',                component: DashboardComponent },
    { path: 'user-profile',             component: UserProfileComponent },
    { path: 'tables',                   component: TablesComponent },
    { path: 'icons',                    component: IconsComponent },
    { path: 'maps',                     component: MapsComponent },
    { path: 'productos',                component: ProductosComponent },
    { path: 'empleados',                component: EmpleadosComponent },
    { path: 'conductores',              component: ConductoresComponent },
    { path: 'enviosProductos',          component: enviosProductosComponent },
    { path: 'historialProductos',       component: historialComponent },
    { path: 'rutas',                    component: rutasComponent },
    { path: 'vehiculos',                component: VehiculosComponent },
];