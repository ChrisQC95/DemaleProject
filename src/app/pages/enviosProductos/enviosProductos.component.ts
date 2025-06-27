import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface Envio {
  id: string;
  destino: string;
  fechaSalida: Date;
  fechaLlegada: Date;
  chofer: string;
  acopio: string;
  vehiculo: string;
  ruta: string;
  estado: string;
}

interface ProductoHistorial {
  cliente: string;
  producto: string;
  categoria: string;
  fechaIngreso: string;
  puntoAcopio: string;
  destino: string;
  estado: string;
  chofer: string;
  vehiculo: string;
}

@Component({
  selector: 'app-enviosProductos',
  templateUrl: './enviosProductos.component.html',
  styleUrls: ['./enviosProductos.component.scss']
})
export class EnviosProductosComponent implements OnInit {
  @ViewChild('envioModal') envioModalContent: any;

  constructor(private modalService: NgbModal) {}

  // Lista completa
  envios: Envio[] = [
    {
      id: 'ENV-001',
      destino: 'Arequipa',
      fechaSalida: new Date('2024-06-10'),
      fechaLlegada: new Date('2024-06-13'),
      chofer: 'Carlos Gómez',
      acopio: 'Lima',
      vehiculo: 'ABC-123',
      ruta: 'Ruta 1',
      estado: 'pendiente'
    },
    {
      id: 'ENV-002',
      destino: 'Puno',
      fechaSalida: new Date('2024-06-12'),
      fechaLlegada: new Date('2024-06-15'),
      chofer: 'Luis Pérez',
      acopio: 'Arequipa',
      vehiculo: 'XYZ-789',
      ruta: 'Ruta 2',
      estado: 'completado'
    },
    {
      id: 'ENV-003',
      destino: 'Arequipa',
      fechaSalida: new Date('2024-06-10'),
      fechaLlegada: new Date('2024-06-13'),
      chofer: 'Carlos Gómez',
      acopio: 'Lima',
      vehiculo: 'ABC-123',
      ruta: 'Ruta 1',
      estado: 'cancelado'
    },
    {
      id: 'ENV-004',
      destino: 'Puno',
      fechaSalida: new Date('2024-06-12'),
      fechaLlegada: new Date('2024-06-15'),
      chofer: 'Luis Pérez',
      acopio: 'Arequipa',
      vehiculo: 'XYZ-789',
      ruta: 'Ruta 2',
      estado: 'completado'
    },
    {
      id: 'ENV-005',
      destino: 'Cusco',
      fechaSalida: new Date('2024-06-15'),
      fechaLlegada: new Date('2024-06-17'),
      chofer: 'Ana Torres',
      acopio: 'Lima',
      vehiculo: 'LMN-456',
      ruta: 'Ruta 3',
      estado: 'pendiente'
    },
    {
      id: 'ENV-006',
      destino: 'Ica',
      fechaSalida: new Date('2024-06-16'),
      fechaLlegada: new Date('2024-06-18'),
      chofer: 'Pedro Sánchez',
      acopio: 'Cusco',
      vehiculo: 'DEF-321',
      ruta: 'Ruta 4',
      estado: 'completado'
    },
    {
      id: 'ENV-007',
      destino: 'Tacna',
      fechaSalida: new Date('2024-06-20'),
      fechaLlegada: new Date('2024-06-22'),
      chofer: 'Lucía Quispe',
      acopio: 'Arequipa',
      vehiculo: 'JKL-987',
      ruta: 'Ruta 1',
      estado: 'pendiente'
    }
  ];

  // Lista de productos en el modal
productosHistorialModal: ProductoHistorial[] = [
  {
    cliente: 'Juan Pérez',
    producto: 'Leche',
    categoria: 'Lácteos',
    fechaIngreso: '2024-06-20',
    puntoAcopio: 'Lima',
    destino: 'Arequipa',
    estado: 'completado',
    chofer: 'Carlos Gómez',
    vehiculo: 'ABC-123'
  },
  {
    cliente: 'María López',
    producto: 'Arroz',
    categoria: 'Granos',
    fechaIngreso: '2024-06-21',
    puntoAcopio: 'Arequipa',
    destino: 'Cusco',
    estado: 'pendiente',
    chofer: 'Ana Torres',
    vehiculo: 'LMN-456'
  }
];

// Función para eliminar producto del modal
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
    this.aplicarFiltros();
  }

  openModal(modalRef: any) {
    this.modalService.open(modalRef, { size: 'xl', centered: true });
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

}
