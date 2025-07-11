import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http'; 
import { ClienteService } from '../../services/cliente.service'; // Asegúrate de la ruta correcta
import { ProductoService } from '../../services/producto.service';
import { ConductorDropdown } from '../../interfaces/conductor-dropdown.interface';
import { VehiculoDropdown } from '../../interfaces/vehiculo-dropdown.interface';
import { RutaDropdown } from '../../interfaces/ruta-dropdown.interface';
import { EnviosService } from '../../services/envios.service';
import { ConductorService } from '../../services/conductor.service';
import { VehiculoService } from '../../services/vehiculo.service';
import { RutaService } from '../../services/ruta.service';
import { PuntoAcopioService } from '../../services/punto-acopio.service';
import { DistritoService } from '../../services/distrito.service';
import { Distrito } from '../../interfaces/distrito.interface'; // Asume que esta es la interfaz correcta
import { HistorialProducto } from '../../services/producto.service';
import { EnvioCreacionDto } from '../../interfaces/envio-creacion-dto.interface';
import { EnvioListadoDto } from '../../interfaces/envio-listado-dto.interface';

interface Envio {
  id: string;
  destino: string;
  fechaSalida: Date;
  fechaLlegada: Date | null;
  chofer: string;
  acopio: string;
  vehiculo: string;
  ruta: string;
  estado: string;
  observacion: string | null;
}

interface ProductoHistorial {
  idProducto: number;
  cliente: string;
  producto: string;
  categoria: string;
  medidas: string;
  fechaIngreso: string;
  puntoAcopio: string;
  destino: string;
  estado: string;
  atendidoPor: string;
}

@Component({
  selector: 'app-enviosProductos',
  templateUrl: './enviosProductos.component.html',
  styleUrls: ['./enviosProductos.component.scss']
})
export class EnviosProductosComponent implements OnInit {
  @ViewChild('envioModal') envioModalContent: any;

  conductores: ConductorDropdown[] = [];
  vehiculos: VehiculoDropdown[] = [];
  rutas: RutaDropdown[] = [];
  productosEnAlmacenModal: ProductoHistorial[] = [];
  puntosAcopioDropdown: { id: number; nombre: string }[] = [];
  distritosDropdown: { id: number; nombre: string }[] = [];
  estadosEnvioDropdown: { id: number, nombre: string }[] = [];

  nuevoEnvio: {
    idChofer: number | null;
    idVehiculo: number | null;
    idRuta: number | null;
    idAcopio: number | null; // Corresponde al punto de acopio
    idDestino: number | null; // Corresponde al distrito de destino
    fechaSalida: string | null; // Para vincular con el input type="date"
    observacion: string | null;
    fechaInicioProductos: string | null; // Para el filtro de fecha de productos
    fechaFinProductos: string | null; // Para el filtro de fecha de productos
  } = {
    idChofer: null,
    idVehiculo: null,
    idRuta: null,
    idAcopio: null,
    idDestino: null,
    fechaSalida: null,
    observacion: null,
    fechaInicioProductos: null,
    fechaFinProductos: null,
  };

  constructor(private modalService: NgbModal,
    private conductorService: ConductorService,
    private vehiculoService: VehiculoService,
    private rutaService: RutaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private envioService: EnviosService
  ) {}

  // Lista completa
  envios: Envio[] = [];
  productosHistorialModal: ProductoHistorial[] = [];
  allProductosModal: ProductoHistorial[] = [];

  eliminarProducto(producto: ProductoHistorial): void {
    this.productosHistorialModal = this.productosHistorialModal.filter(p => p !== producto);
  }
    
  seleccionarTodos: boolean = false;
  productoSeleccionado: ProductoHistorial[] = [];
  // Filtros
  filteredEnvios: Envio[] = [];
  searchTerm: string = '';
  estadoFilter: string = '';
  acopioFilter: string = '';

  // Paginación
  pageSize: number = 5;
  pageIndex: number = 0;
  totalRegistros: number = 0;
  datosPaginados: Envio[] = [];

  ngOnInit(): void {
    this.loadEnvios();
    this.aplicarFiltros();
    this.loadConductores();
    this.loadVehiculos();
    this.loadRutas();
    this.loadDistritos();
    this.loadPuntosAcopio();
    this.loadEstadosEnvio();
  }
  loadEnvios(): void {
    this.envioService.obtenerTodosLosEnvios().subscribe({
      next: (data: EnvioListadoDto[]) => {
        // Mapear EnvioListadoDto[] a Envio[]
        this.envios = data.map(dto => this.mapEnvioListadoDtoToEnvio(dto));
        console.log('Envios cargados y mapeados:', this.envios);
        this.aplicarFiltros(); // Aplica filtros y paginación después de cargar los datos
      },
      error: (err) => {
        console.error('Error al cargar envíos:', err);
        // Podrías mostrar un mensaje de error al usuario
      }
    });
  }
  loadConductores(): void {
    this.conductorService.getConductoresForDropdown().subscribe(
      data => {
        this.conductores = data;
        console.log('Conductores cargados:', this.conductores);
      },
      error => {
        console.error('Error al cargar conductores:', error);
      }
    );
  }
  loadVehiculos(): void {
    this.vehiculoService.getVehiculosForDropdown().subscribe(
      data => {
        this.vehiculos = data;
        console.log('Vehículos cargados:', this.vehiculos);
      },
      error => {
        console.error('Error al cargar vehículos:', error);
      }
    );
  }
  loadRutas(): void {
    this.rutaService.getRutasForDropdown().subscribe(
      data => {
        this.rutas = data;
        console.log('Rutas cargadas:', this.rutas);
      },
      error => {
        console.error('Error al cargar rutas:', error);
      }
    );
  }
  loadDistritos(): void {
    this.clienteService.getDistritos().subscribe({ // Usando ClienteService
      next: (data: Distrito[]) => { // Especifica el tipo para 'data'
        this.distritosDropdown = data.map(d => ({
          id: d.idDistrito,
          nombre: d.nombreDistrito
        }));
        console.log('Distritos cargados:', this.distritosDropdown);
      },
      error: (err) => console.error('Error al cargar distritos:', err)
    });
  }

  loadPuntosAcopio(): void {
    this.productoService.getPuntosAcopio().subscribe(data => { // Usando ProductoService
      this.puntosAcopioDropdown = data.map(a => ({
        id: a.idPuntoAcopio,
        nombre: a.nombreAcopio
      }));
      console.log('Puntos de Acopio cargados:', this.puntosAcopioDropdown);
    });
  }
  loadEstadosEnvio(): void {
    this.productoService.getEstadosEnvio().subscribe(data => {
      this.estadosEnvioDropdown = data.map(e => ({
          id: e.idEstadoEnvio,
          nombre: e.estado
        }));
    });
  }
  
  openModal(modalRef: any) {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    this.nuevoEnvio = {
      idChofer: null,
      idVehiculo: null,
      idRuta: null,
      idAcopio: null,
      idDestino: null,
      fechaSalida: null,
      observacion: null,
      fechaInicioProductos: formattedToday,
      fechaFinProductos: formattedToday,
    };
    this.productoSeleccionado = []; // Limpia las selecciones previas
    this.seleccionarTodos = false; // Desmarca "Seleccionar todos"
    this.loadProductosEnAlmacen();
    this.modalService.open(modalRef, { size: 'xl', centered: true });
  }
  loadProductosEnAlmacen(): void {
    // Asumiendo que getProductosEnAlmacen() devuelve un Observable<HistorialProducto[]>
    this.productoService.getProductosEnAlmacen().subscribe(
      (data: HistorialProducto[]) => { // Esperamos un array de HistorialProducto
        this.allProductosModal = data.map(p => ({
          idProducto: p.idProducto,
          cliente: p.clienteNombreCompleto || '',
          producto: p.producto || '',
          categoria: p.tipoProductoNombre || '',
          medidas: `${p.alto || 0}x${p.ancho || 0}x${p.largo || 0} cm, ${p.peso || 0} kg`,
          fechaIngreso: p.fechIngreso || '',
          puntoAcopio: p.puntoAcopioNombre || '',
          destino: p.distritoDestinoNombre || '',
          estado: p.estadoEnvioNombre || '',
          atendidoPor: p.trabajadorNombre || ''
        }));
        console.log('Productos en almacén cargados para el modal:', this.productosHistorialModal);
      },
      error => {
        console.error('Error al cargar productos en almacén:', error);
      }
    );
  }
  applyDateFilter(): void {
    if (this.allProductosModal.length === 0) {
      this.productosHistorialModal = [];
      return;
    }

    const fechaInicio = this.nuevoEnvio.fechaInicioProductos ? new Date(this.nuevoEnvio.fechaInicioProductos) : null;
    const fechaFin = this.nuevoEnvio.fechaFinProductos ? new Date(this.nuevoEnvio.fechaFinProductos) : null;

    this.productosHistorialModal = this.allProductosModal.filter(producto => {
      const fechaIngresoProducto = new Date(producto.fechaIngreso);

      // Si ambas fechas de filtro están presentes, verifica el rango
      if (fechaInicio && fechaFin) {
        // Asegúrate de comparar solo las fechas (sin la hora) para evitar problemas de zona horaria
        const start = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
        const end = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());
        const productDate = new Date(fechaIngresoProducto.getFullYear(), fechaIngresoProducto.getMonth(), fechaIngresoProducto.getDate());

        return productDate >= start && productDate <= end;
      }
      // Si solo hay fecha de inicio, filtra a partir de esa fecha
      else if (fechaInicio) {
        const start = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
        const productDate = new Date(fechaIngresoProducto.getFullYear(), fechaIngresoProducto.getMonth(), fechaIngresoProducto.getDate());
        return productDate >= start;
      }
      // Si solo hay fecha de fin, filtra hasta esa fecha
      else if (fechaFin) {
        const end = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());
        const productDate = new Date(fechaIngresoProducto.getFullYear(), fechaIngresoProducto.getMonth(), fechaIngresoProducto.getDate());
        return productDate <= end;
      }
      // Si no hay fechas de filtro, incluye todos los productos
      return true;
    });

    // Asegúrate de que los productos seleccionados también se actualicen si se filtran
    this.productoSeleccionado = this.productoSeleccionado.filter(p =>
      this.productosHistorialModal.some(filteredP => filteredP.idProducto === p.idProducto)
    );
    this.seleccionarTodos = this.productosHistorialModal.length > 0 &&
                           this.productoSeleccionado.length === this.productosHistorialModal.length;

    console.log('Productos filtrados por fecha:', this.productosHistorialModal);
  }
  aplicarFiltros(): void {
    let result = [...this.envios];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(envio =>
        Object.values(envio).some(val =>
          val.toString().toLowerCase().includes(term)
        )
      );
    }

    if (this.estadoFilter) {
      result = result.filter(envio => envio.estado === this.estadoFilter);
    }

    if (this.acopioFilter) {
      result = result.filter(envio => envio.acopio === this.acopioFilter);
    }

    this.filteredEnvios = result;
    this.totalRegistros = result.length;
    this.pageIndex = 0; // 👈 Reiniciar a la primera página SIEMPRE
    this.actualizarPaginacion();

  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.estadoFilter = '';
    this.acopioFilter = '';
    this.pageIndex = 0;
    this.aplicarFiltros();
  }

  actualizarPaginacion(): void {
    const inicio = this.pageIndex * this.pageSize;
    const fin = inicio + this.pageSize;
    this.datosPaginados = this.filteredEnvios.slice(inicio, fin);
  }

  primeraPagina() {
    this.pageIndex = 0;
    this.actualizarPaginacion();
  }

  anteriorPagina() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.actualizarPaginacion();
    }
  }

  siguientePagina() {
    if ((this.pageIndex + 1) * this.pageSize < this.totalRegistros) {
      this.pageIndex++;
      this.actualizarPaginacion();
    }
  }

  ultimaPagina() {
    this.pageIndex = Math.ceil(this.totalRegistros / this.pageSize) - 1;
    this.actualizarPaginacion();
  }

  irAPagina(pagina: number) {
    this.pageIndex = pagina - 1;
    this.actualizarPaginacion();
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalRegistros / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  toggleSeleccionProducto(producto: ProductoHistorial) {
  const index = this.productoSeleccionado.indexOf(producto);
  if (index > -1) {
    this.productoSeleccionado.splice(index, 1);
  } else {
    this.productoSeleccionado.push(producto);
  }

  // Si alguno no está seleccionado, desmarca "Seleccionar todos"
  this.seleccionarTodos = this.productoSeleccionado.length === this.productosHistorialModal.length;
}

  toggleSeleccionTodos() {
    if (this.seleccionarTodos) {
      this.productoSeleccionado = [...this.productosHistorialModal];
    } else {
      this.productoSeleccionado = [];
    }
  }

  editarEnvio(envio: Envio): void {
    console.log('Editar envío:', envio);
    // Aquí puedes abrir el modal y cargar los datos, por ejemplo
    this.openModal(this.envioModalContent);
    // Lógica para precargar los datos del envío en los campos del formulario
  }

  eliminarEnvio(envio: Envio): void {
    const confirmacion = confirm(`¿Estás seguro de eliminar el envío ${envio.id}?`);
    if (confirmacion) {
      this.envios = this.envios.filter(e => e !== envio);
      this.aplicarFiltros();
    }
  }
  guardarEnvio(): void {
    // 1. Validaciones básicas del frontend
    if (!this.nuevoEnvio.idChofer || !this.nuevoEnvio.idVehiculo || !this.nuevoEnvio.idRuta ||
        !this.nuevoEnvio.idAcopio || !this.nuevoEnvio.idDestino || !this.nuevoEnvio.fechaSalida) {
      alert('Por favor, complete todos los campos obligatorios del envío: Chofer, Vehículo, Ruta, Acopio, Destino y Fecha de Salida.');
      return;
    }

    if (this.productoSeleccionado.length === 0) {
      alert('Debe seleccionar al menos un producto para crear el envío.');
      return;
    }

    // 2. Extraer los IDs de los productos seleccionados
    const idProductos = this.productoSeleccionado.map(p => p.idProducto);

    // 3. Crear el DTO que se enviará al backend
    const envioCreacionDto: EnvioCreacionDto = {
      idConductor: this.nuevoEnvio.idChofer,
      idVehiculo: this.nuevoEnvio.idVehiculo,
      idRuta: this.nuevoEnvio.idRuta,
      idAcopio: this.nuevoEnvio.idAcopio,   // <-- Incluye el ID de Acopio
      idDestino: this.nuevoEnvio.idDestino, // <-- Incluye el ID de Destino
      fechSalida: this.nuevoEnvio.fechaSalida,
      observacion: this.nuevoEnvio.observacion,
      idProductosSeleccionados: idProductos
    };

    console.log('Enviando DTO al backend:', envioCreacionDto);

    // 4. Llamar al servicio de envío para enviar los datos al backend
    this.envioService.crearEnvio(envioCreacionDto).subscribe({
      next: (response) => {
        console.log('Envío creado exitosamente:', response);
        alert('Envío creado y productos actualizados con éxito.');
        this.modalService.dismissAll(); // Cierra el modal
        // Opcional: Recargar los productos en almacén para reflejar los cambios de estado
        this.loadProductosEnAlmacen();
        // Opcional: Si tienes una tabla principal de envíos, recargarla
        // this.loadEnviosPrincipales();
      },
      error: (error) => {
        console.error('Error al crear el envío:', error);
        let errorMessage = 'Error al crear el envío. Por favor, intente de nuevo.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Datos de envío incompletos o incorrectos.';
        } else if (error.status === 500) {
          errorMessage = 'Error interno del servidor. Verifique los IDs o el estado del backend.';
        }
        alert(errorMessage);
      }
    });
  }
  private mapEnvioListadoDtoToEnvio(dto: EnvioListadoDto): Envio {
    return {
      id: dto.idEnvio.toString(), // Convertir number a string para el ID local
      destino: dto.distritoDestinoNombre,
      fechaSalida: new Date(dto.fechSalida), // Convertir string a Date
      fechaLlegada: dto.fechLlegada ? new Date(dto.fechLlegada) : null, // Convertir string a Date o null
      chofer: dto.conductorNombreCompleto,
      acopio: dto.puntoAcopioNombre,
      vehiculo: dto.vehiculoDescripcion,
      ruta: dto.rutaDescripcion,
      estado: dto.estadoEnvioNombre,
      observacion: dto.observacion // Asegúrate de incluir la observación
    };
  }

}
