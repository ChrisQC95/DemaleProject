import { Component, OnInit } from '@angular/core';
import { ProductoService, HistorialProducto} from 'src/app/services/producto.service';


@Component({
  selector: 'app-historialProductos',
  templateUrl: './historialProductos.component.html',
  styleUrls: ['./historialProductos.component.scss']
})
export class historialComponent implements OnInit {
  historial: HistorialProducto[] = [];
  historialFiltrado: HistorialProducto[] = [];
  
  filtroBusqueda: string = '';
  filtroAcopio: number | '' = '';
  filtroEstado: number | '' = '';

  puntosAcopio: { id: number, nombre: string }[] = [];
  estadosEnvio: { id: number, nombre: string }[] = [];

  // 👇 Variables de paginación
  pageSize: number = 5;
  pageIndex: number = 0;
  totalRegistros: number = 0;
  datosPaginados: HistorialProducto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarHistorial();

  this.productoService.getPuntosAcopio().subscribe(data => {
    this.puntosAcopio = data.map(a => ({
      id: a.idPuntoAcopio,
      nombre: a.nombreAcopio
    }));
  });

  this.productoService.getEstadosEnvio().subscribe(data => {
    this.estadosEnvio = data
      .filter(e => e.estado !== 'Temporal') // Omitir el estado temporal si existe
      .map(e => ({
        id: e.idEstadoEnvio,
        nombre: e.estado
      }));
  });
  }

  cargarHistorial() {
    this.productoService.obtenerHistorial().subscribe({
      next: (data) => {
        this.historial = data;
        this.aplicarFiltros();
      },
      error: (err) => {
        this.historial = [];
        this.puntosAcopio = [];
        this.estadosEnvio = [];
        this.aplicarFiltros();
      }
    });
  }
  aplicarFiltros() {
    let resultado = [...this.historial];

    if (this.filtroBusqueda.trim()) {
      const termino = this.filtroBusqueda.toLowerCase();
      resultado = resultado.filter(item =>
        Object.values(item).some(val =>
          val !== null && val !== undefined && val.toString().toLowerCase().includes(termino)
        )
      );
    }

    if (this.filtroEstado) {
      resultado = resultado.filter(item => item.idEstadoEnvio == this.filtroEstado);
    }

    if (this.filtroAcopio) {
      resultado = resultado.filter(item => item.idPuntoAcopio == this.filtroAcopio);
    }

    this.historialFiltrado = resultado;
    this.totalRegistros = resultado.length;
    this.actualizarPaginacion();
  }

  limpiarFiltros() {
    this.filtroBusqueda = '';
    this.filtroAcopio = '';
    this.filtroEstado = '';
    this.pageIndex = 0;
    this.aplicarFiltros();
  }

  // ✅ Paginación
  actualizarPaginacion() {
    const inicio = this.pageIndex * this.pageSize;
    const fin = inicio + this.pageSize;
    this.datosPaginados = this.historialFiltrado.slice(inicio, fin);
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
}
