import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RutaService } from '../../services/ruta.service';
import { RutaListadoDto } from '../../interfaces/ruta-listado-dto.interface';
import { RutaCreacionDto } from '../../interfaces/ruta-creacion-dto.interface';
import { RutaUpdateDto } from '../../interfaces/ruta-update-dto.interface';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.scss']
})
export class RutasComponent implements OnInit {

  @ViewChild('rutaModal') rutaModalContent: any;

  closeResult = '';
  isEditingRuta: boolean = false;

  currentRuta: RutaUpdateDto = {
    idRuta: null, 
    serialRuta: '',
    nombreRuta: '',
    glosa: null
  };
  rutas: RutaListadoDto[] = [];
  filteredRutas: RutaListadoDto[] = [];
  searchTerm: string = '';

  pageSize: number = 5; // Cantidad de elementos por página
  pageIndex: number = 0; // Índice de la página actual (0-based)
  totalRegistros: number = 0; // Total de registros filtrados
  datosPaginados: RutaListadoDto[] = [];
  constructor(
    private modalService: NgbModal,
    private rutaService: RutaService
  ) { }

  ngOnInit(): void {
    this.loadRutas();
  }
  loadRutas(): void {
    this.rutaService.getAllRutas().subscribe({
      next: (data: RutaListadoDto[]) => {
        this.rutas = data;
        console.log('Rutas cargadas:', this.rutas);
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Error al cargar rutas:', err);
        alert('Error al cargar las rutas. Por favor, intente de nuevo.');
      }
    });
  }
  aplicarFiltros(): void {
    let result = [...this.rutas]; // Copia la lista completa de rutas

    // Aplicar filtro de búsqueda por término en nombre de ruta, código de ruta y glosa
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(ruta =>
        (ruta.serialRuta && ruta.serialRuta.toLowerCase().includes(term)) ||
        (ruta.nombreRuta && ruta.nombreRuta.toLowerCase().includes(term)) ||
        (ruta.glosa && ruta.glosa.toLowerCase().includes(term))
      );
    }
    this.filteredRutas = result;
    this.totalRegistros = result.length;
    this.pageIndex = 0; // Reiniciar a la primera página al aplicar nuevos filtros
    this.actualizarPaginacion();
  }
  limpiarFiltros(): void {
    this.searchTerm = '';
    this.pageIndex = 0;
    this.aplicarFiltros(); // Re-aplica filtros (sin filtros)
  }
  actualizarPaginacion(): void {
    const inicio = this.pageIndex * this.pageSize;
    const fin = inicio + this.pageSize;
    this.datosPaginados = this.filteredRutas.slice(inicio, fin);
  }

  // --- Métodos de Paginación ---
  primeraPagina(): void {
    this.pageIndex = 0;
    this.actualizarPaginacion();
  }

  anteriorPagina(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.actualizarPaginacion();
    }
  }

  siguientePagina(): void {
    if ((this.pageIndex + 1) * this.pageSize < this.totalRegistros) {
      this.pageIndex++;
      this.actualizarPaginacion();
    }
  }

  ultimaPagina(): void {
    this.pageIndex = Math.ceil(this.totalRegistros / this.pageSize) - 1;
    this.actualizarPaginacion();
  }

  irAPagina(pagina: number): void {
    this.pageIndex = pagina - 1;
    this.actualizarPaginacion();
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalRegistros / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  openRutaModal(content: any, rutaToEdit?: RutaListadoDto): void {
    if (rutaToEdit) {
      // Modo edición: Cargar los datos de la ruta seleccionada
      this.isEditingRuta = true;
      this.rutaService.getRutaById(rutaToEdit.idRuta).subscribe({
        next: (data: RutaUpdateDto) => {
          this.currentRuta = data; // Asigna los datos completos para edición
          this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        },
        error: (err) => {
          console.error('Error al cargar ruta para edición:', err);
          alert('No se pudo cargar la ruta para edición. Por favor, intente de nuevo.');
        }
      });
    } else {
      // Modo creación: Inicializar un objeto vacío para la nueva ruta
      this.isEditingRuta = false;
      this.currentRuta = {
        idRuta: null, // Asegura que sea null para que el backend lo genere
        serialRuta: '',
        nombreRuta: '',
        glosa: null
      };
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  saveRuta(): void {
    // Validaciones básicas del frontend
    if (!this.currentRuta.serialRuta || this.currentRuta.serialRuta.trim() === '') {
      alert('El campo "Código de Ruta" es obligatorio.');
      return;
    }
    if (!this.currentRuta.nombreRuta || this.currentRuta.nombreRuta.trim() === '') {
      alert('El campo "Nombre de Ruta" es obligatorio.');
      return;
    }

    if (this.isEditingRuta) {
      // Lógica para actualizar una ruta existente
      if (this.currentRuta.idRuta === null) {
        alert('Error: ID de ruta no válido para actualización.');
        return;
      }
      this.rutaService.updateRuta(this.currentRuta.idRuta, this.currentRuta).subscribe({
        next: (response: RutaListadoDto) => {
          console.log('Ruta actualizada exitosamente:', response);
          alert('Ruta actualizada con éxito.');
          this.modalService.dismissAll(); // Cierra el modal
          this.loadRutas(); // Recarga la lista de rutas
        },
        error: (error) => {
          console.error('Error al actualizar ruta:', error);
          let errorMessage = 'Error al actualizar la ruta. Por favor, intente de nuevo.';
          if (error.status === 409) {
            errorMessage = 'Ya existe una ruta con el mismo Código de Ruta.';
          } else if (error.status === 404) {
            errorMessage = 'La ruta a actualizar no fue encontrada.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          alert(errorMessage);
        }
      });
    } else {
      // Lógica para registrar una nueva ruta
      const newRuta: RutaCreacionDto = {
        serialRuta: this.currentRuta.serialRuta,
        nombreRuta: this.currentRuta.nombreRuta,
        glosa: this.currentRuta.glosa
      };
      this.rutaService.createRuta(newRuta).subscribe({
        next: (response: RutaListadoDto) => {
          console.log('Nueva ruta registrada exitosamente:', response);
          alert('Nueva ruta registrada con éxito.');
          this.modalService.dismissAll(); // Cierra el modal
          this.loadRutas(); // Recarga la lista de rutas
        },
        error: (error) => {
          console.error('Error al registrar ruta:', error);
          let errorMessage = 'Error al registrar la ruta. Por favor, intente de nuevo.';
          if (error.status === 409) {
            errorMessage = 'Ya existe una ruta con el mismo Código de Ruta.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          alert(errorMessage);
        }
      });
    }
  }
  deleteRuta(idRuta: number): void {
    const confirmacion = confirm(`¿Estás seguro de eliminar la ruta con ID: ${idRuta}?`);
    if (confirmacion) {
      this.rutaService.deleteRuta(idRuta).subscribe({
        next: () => {
          alert('Ruta eliminada con éxito.');
          this.loadRutas(); // Recarga la lista de rutas
        },
        error: (error) => {
          console.error('Error al eliminar ruta:', error);
          let errorMessage = 'Error al eliminar la ruta. Por favor, intente de nuevo.';
          if (error.status === 404) {
            errorMessage = 'La ruta a eliminar no fue encontrada.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          alert(errorMessage);
        }
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
