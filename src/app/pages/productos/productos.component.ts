import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentService } from 'src/app/document.service';
import { DocumentLookupResponse } from 'src/app/interfaces/document-lookup-response.interface';

import { ClienteService } from '../../services/cliente.service';
import { ClienteRegistroRequest } from '../../interfaces/cliente-registro-request.interface';
import { ClienteResponse } from '../../interfaces/cliente-response.interface'; // DTO de respuesta del backend
import { TipoDocumento } from '../../interfaces/tipo-documento.interface';
import { TipoCliente } from '../../interfaces/tipo-cliente.interface';
import { Distrito } from '../../interfaces/distrito.interface';
import { TipoVia } from '../../interfaces/tipo-via.interface';

import { TipoProducto } from '../../interfaces/tipo-producto.interface'; // Importa el nuevo modelo
import { PuntoAcopio } from '../../interfaces/punto-acopio.interface'; // Importa el nuevo modelo
import { TrabajadorDropdown } from '../../interfaces/trabajador-dropdown.interface'; // Importa el nuevo modelo

import { TipoProductoService } from '../../services/tipo-producto.service'; // Importa el nuevo servicio
import { PuntoAcopioService } from '../../services/punto-acopio.service'; // Importa el nuevo servicio
import { DistritoService } from '../../services/distrito.service';
import { TrabajadorService } from '../../services/trabajador.service'; // Importa el nuevo servicio
import { ProductoService } from '../../services/producto.service';

interface ClienteForm {
  id?: number;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  idTipoDoc?: number;
  numeroDocumento: string;
  telefono?: string;
  email?: string;
  idTipoCliente?: number;
  idDistrito?: number;
  idTipoVia?: number;
  direccion?: string;
  nMunicipal?: string;
}
interface Producto {
  id?: number;
  nombre: string;
  peso: number;
  alto?: number;
  largo?: number;
  ancho?: number;
  guiaRemisionFile?: File | null;
  idTipoProducto: number | null; 
  idPuntoAcopio: number | null; 
  idCliente: number | null; 
  idEstadoEnvio: number | null;
  idDistrito: number | null; 
  idTrabajador: number | null;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {
  activeTab: string = 'clientes';

  searchQuery: string = '';
  clientResults: ClienteResponse[] = [];
  currentClient: ClienteForm = this.createEmptyClient();
  searchPerformed: boolean = false;
  selectedClientForProductManagement: ClienteResponse | null = null;


  tiposDocumento: TipoDocumento[] = [];
  tiposCliente: TipoCliente[] = [];
  distritos: Distrito[] = [];
  tiposVia: TipoVia[] = [];

  readonly DNI_ID = 1;
  readonly RUC_ID = 2;
  readonly CARNET_EXTRANJERIA_ID = 5;

  isLoadingDocument: boolean = false;
  documentLookupResult: DocumentLookupResponse | null = null;

  showNaturalPersonFields: boolean = true; // Por defecto, mostrar nombres y apellidos
  showLegalPersonFields: boolean = false; // Por defecto, ocultar razón social

  @ViewChild('productModal') productModal!: TemplateRef<any>;
  productos: Producto[] = [];
  currentProduct: Producto = this.createEmptyProduct();
  isEditingProduct: boolean = false;

  tiposProducto: TipoProducto[] = []; 
  puntosAcopioList: PuntoAcopio[] = [];
  trabajadoresList: TrabajadorDropdown[] = [];
  distritosDestino: Distrito[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private documentService: DocumentService,
    private clienteService: ClienteService,
    private tipoProductoService: TipoProductoService,
    private puntoAcopioService: PuntoAcopioService,
    private distritoService: DistritoService,
    private trabajadorService: TrabajadorService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.loadTiposDocumento();
    this.loadTiposCliente();
    this.loadDistritos();
    this.loadTiposVia();
    this.loadInitialData();
    this.loadProductDropdowns();
    this.selectTab('cliente'); 
  }

  selectTab(tab: string): void {
    if (tab === 'productos' && !this.selectedClientForProductManagement) {
      console.warn('Debe seleccionar un cliente para acceder a la gestión de productos.');
      return;
    }
    if (tab === 'cliente') {
      this.selectedClientForProductManagement = null;
    }
    this.activeTab = tab;
  }

  getMinLengthForDocumentType(): number {
    switch (this.currentClient.idTipoDoc) {
      case this.DNI_ID:
        return 8;
      case this.RUC_ID:
        return 11;
      case this.CARNET_EXTRANJERIA_ID:
        return 9;
      default:
        return 1;
    }
  }

  getMaxLengthForDocumentType(): number {
    switch (this.currentClient.idTipoDoc) {
      case this.DNI_ID:
        return 8;
      case this.RUC_ID:
        return 11;
      case this.CARNET_EXTRANJERIA_ID:
        return 12;
      default:
        return 15;
    }
  }
  // ========== MÉTODOS PARA CLIENTES ==========

  private createEmptyClient(): ClienteForm {
    return {
      nombres: '',
      apellidos: '',
      razonSocial: '',
      idTipoDoc: undefined,
      numeroDocumento: '',
      telefono: '',
      email: '',
      idTipoCliente: undefined,
      idDistrito: undefined,
      idTipoVia: undefined,
      direccion: '',
      nMunicipal: ''
    };
  }

  loadTiposDocumento(): void {
    this.clienteService.getTiposDocumento().subscribe({
      next: (data) => {
        this.tiposDocumento = data;
        console.log('Tipos de Documento cargados:', this.tiposDocumento);
      },
      error: (err) => console.error('Error al cargar tipos de documento:', err)
    });
  }

  loadTiposCliente(): void {
    this.clienteService.getTiposCliente().subscribe({
      next: (data) => {
        this.tiposCliente = data;
        console.log('Tipos de Cliente cargados:', this.tiposCliente);
      },
      error: (err) => console.error('Error al cargar tipos de cliente:', err)
    });
  }

  loadDistritos(): void {
    this.clienteService.getDistritos().subscribe({
      next: (data) => {
        this.distritos = data;
        console.log('Distritos cargados:', this.distritos);
      },
      error: (err) => console.error('Error al cargar distritos:', err)
    });
  }

  loadTiposVia(): void {
    this.clienteService.getTiposVia().subscribe({
      next: (data) => {
        this.tiposVia = data;
        console.log('Tipos de Vía cargados:', this.tiposVia);
      },
      error: (err) => console.error('Error al cargar tipos de vía:', err)
    });
  }

  loadInitialData(): void {
    this.onDocumentTypeChange();
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.clientResults = [];
      this.searchPerformed = false;
      return;
    }

    this.searchPerformed = true;
    this.clienteService.buscarClientes(this.searchQuery.trim()).subscribe({
      next: (data) => {
        this.clientResults = data;
        console.log('Resultados de búsqueda:', this.clientResults);
      },
      error: (err) => {
        console.error('Error al buscar clientes:', err);
        this.clientResults = [];
        alert('Error al buscar clientes: ' + (err.error?.message || err.message || 'Error desconocido.'));
      }
    });
  }
  onSelectClient(client: ClienteResponse): void {
    console.log('Cliente seleccionado:', client);
    this.selectedClientForProductManagement = client;
    this.selectTab('producto');
  }

  onDocumentTypeChange(): void {
    const selectedTypeId = this.currentClient.idTipoDoc;

    this.currentClient.nombres = '';
    this.currentClient.apellidos = '';
    this.currentClient.razonSocial = '';
    this.currentClient.numeroDocumento = '';

    if (selectedTypeId === this.RUC_ID) {
      this.showNaturalPersonFields = false;
      this.showLegalPersonFields = true;
    } else if (selectedTypeId === this.DNI_ID || selectedTypeId === this.CARNET_EXTRANJERIA_ID) {
      this.showNaturalPersonFields = true;
      this.showLegalPersonFields = false;
    } else {
      this.showNaturalPersonFields = true;
      this.showLegalPersonFields = false;
    }
    this.clearDocumentLookupResults();
  }

  onSubmit(): void {
    const idTipoDoc = this.currentClient.idTipoDoc;

    if (idTipoDoc === this.DNI_ID || idTipoDoc === this.CARNET_EXTRANJERIA_ID) {
      if (!this.currentClient.nombres?.trim() || !this.currentClient.apellidos?.trim()) {
        alert('Para DNI/Carnet de Extranjería, Nombres y Apellidos son obligatorios.');
        return;
      }
    } else if (idTipoDoc === this.RUC_ID) {
      if (!this.currentClient.razonSocial?.trim()) {
        alert('Para RUC, la Razón Social es obligatoria.');
        return;
      }
    } else {
      alert('Por favor, seleccione un Tipo de Documento válido.');
      return;
    }

    if (!this.currentClient.idTipoDoc ||
      !this.currentClient.numeroDocumento?.trim() ||
      !this.currentClient.idTipoCliente
    ) {
      alert('Por favor, complete todos los campos obligatorios: Tipo de Documento, Número de Documento y Tipo de Cliente.');
      return;
    }

    const clienteParaBackend: ClienteRegistroRequest = {
      nombres: (idTipoDoc === this.DNI_ID || idTipoDoc === this.CARNET_EXTRANJERIA_ID) ? this.currentClient.nombres || null : null,
      apellidos: (idTipoDoc === this.DNI_ID || idTipoDoc === this.CARNET_EXTRANJERIA_ID) ? this.currentClient.apellidos || null : null,
      razonSocial: (idTipoDoc === this.RUC_ID) ? this.currentClient.razonSocial || null : null,

      idTipoDoc: this.currentClient.idTipoDoc,
      numeroDocumento: this.currentClient.numeroDocumento,
      telefono: this.currentClient.telefono || null,
      correo: this.currentClient.email || null,

      idDistrito: this.currentClient.idDistrito || null,
      idTipoVia: this.currentClient.idTipoVia || null,
      direccion: this.currentClient.direccion || null,
      nMunicipal: this.currentClient.nMunicipal || null,

      idTipoCliente: this.currentClient.idTipoCliente
    };

      this.clienteService.registrarCliente(clienteParaBackend).subscribe({
        next: (response) => {
          console.log('Cliente registrado con éxito:', response);
          alert('Cliente registrado con éxito!');
          this.resetForm();
          this.onSearch();
        },
        error: (err) => {
          console.error('Error al registrar cliente:', err);
          alert('Error al registrar cliente: ' + (err.error?.message || err.message || 'Error desconocido.'));
        }
      });
  }

  public resetForm(): void {
    this.currentClient = this.createEmptyClient();
    this.clearDocumentLookupResults();
    this.onDocumentTypeChange();
  }

  onLookupDocument(): void {
    const numero = this.currentClient.numeroDocumento ? this.currentClient.numeroDocumento.trim() : '';

    if (!numero || !this.currentClient.idTipoDoc) {
      this.documentLookupResult = {
        success: false,
        type: 'Desconocido',
        number: '',
        errorMessage: 'Por favor, ingrese un número de documento para consultar.'
      };
      return;
    }

    this.isLoadingDocument = true;
    this.documentLookupResult = null;

    this.documentService.consultarDocumento(numero).subscribe({
      next: (response: DocumentLookupResponse) => {
        this.documentLookupResult = response;
        this.isLoadingDocument = false;

        if (response.success) {
          this.currentClient.numeroDocumento = response.number;

          if (response.type === 'RUC') {
            this.currentClient.razonSocial = response.fullName || '';
            this.currentClient.nombres = '';
            this.currentClient.apellidos = '';
            this.currentClient.idTipoDoc = this.RUC_ID;
          } else if (response.type === 'DNI' && response.fullName) {
            // Separar nombres y apellidos
            const parts = response.fullName.trim().split(/\s+/);
            if (parts.length >= 4) {
              this.currentClient.nombres = parts.slice(0, 2).join(' ');
              this.currentClient.apellidos = parts.slice(2, 4).join(' ');
            } else if (parts.length === 3) {
              this.currentClient.nombres = parts[0];
              this.currentClient.apellidos = parts.slice(1).join(' ');
            } else {
              this.currentClient.nombres = response.fullName;
              this.currentClient.apellidos = '';
            }
            this.currentClient.razonSocial = '';
            this.currentClient.idTipoDoc = this.DNI_ID;
          } else if (response.type === 'CEE' || response.type === 'CARNET_EXTRANJERIA') {
            this.currentClient.nombres = response.fullName || '';
            this.currentClient.apellidos = response.otherInfo || '';
            this.currentClient.razonSocial = '';
            this.currentClient.idTipoDoc = this.CARNET_EXTRANJERIA_ID;
          } else {
            console.warn(`Tipo de documento desconocido retornado por la API: ${response.type}`);
            this.currentClient.razonSocial = '';
            this.currentClient.nombres = '';
            this.currentClient.apellidos = '';
          }
          //this.onDocumentTypeChange();
        }
      },
      error: (err) => {
        console.error('Error al consultar el documento:', err);
        this.isLoadingDocument = false;
        this.documentLookupResult = {
          success: false,
          type: 'Desconocido',
          number: numero,
          errorMessage: 'Ocurrió un error inesperado al comunicarse con la API de documentos.'
        };
      }
    });
  }

  clearDocumentLookupResults(): void {
    this.documentLookupResult = null;
  }

  // ========== MÉTODOS PARA PRODUCTOS ==========
  private createEmptyProduct(): Producto {
    return {
      nombre: '',
      peso: 0,
      alto: undefined,
      largo: undefined,
      ancho: undefined,
      guiaRemisionFile: null,
      idTipoProducto: null,
      idPuntoAcopio: null,
      idCliente: null, 
      idEstadoEnvio: null,
      idDistrito: null, 
      idTrabajador: null
    };
  }

  loadProductDropdowns(): void {
    this.tipoProductoService.getTiposProducto().subscribe(data => {
      this.tiposProducto = data;
      console.log('Tipos de Producto cargados para dropdown:', this.tiposProducto);
    }, error => {
      console.error('Error al cargar tipos de producto para dropdown:', error);
    });

    this.puntoAcopioService.getPuntosAcopio().subscribe(data => {
      this.puntosAcopioList = data;
      console.log('Puntos de Acopio cargados para dropdown:', this.puntosAcopioList);
    }, error => {
      console.error('Error al cargar puntos de acopio para dropdown:', error);
    });

    this.trabajadorService.getTrabajadoresAtencionCliente().subscribe(data => {
      this.trabajadoresList = data;
      console.log('Trabajadores (Atención al Cliente) cargados para dropdown:', this.trabajadoresList);
    }, error => {
      console.error('Error al cargar trabajadores para dropdown:', error);
    });

    this.distritoService.getAllDistritos().subscribe({
      next: (data) => {
        this.distritosDestino = data;
        console.log('Distritos cargados:', this.distritosDestino);
      },
      error: (error) => {
        console.error('Error al cargar distritos:', error);
      }
    });
  }

  loadProductsForClient(idCliente: number | undefined): void {
    if (idCliente) {
      this.productoService.getProductosByCliente(idCliente).subscribe({
        next: (data) => {
          this.productos = data;
          this.totalItems = data.length;
          console.log(`Productos cargados para cliente ${idCliente}:`, this.productos);
        },
        error: (err) => {
          console.error(`Error al cargar productos para cliente ${idCliente}:`, err);
          this.productos = [];
          this.totalItems = 0;
        }
      });
    } else {
      this.productos = [];
      this.totalItems = 0;
    }
  }

  openProductModal(producto?: Producto): void {
    if (!this.selectedClientForProductManagement) {
      alert('Por favor, seleccione un cliente primero para gestionar sus productos.');
      return;
    }
    this.isEditingProduct = !!producto;
    this.currentProduct = producto ? { ...producto } : this.createEmptyProduct();

    this.modalService.open(this.productModal, {
      size: 'lg',
      backdrop: 'static'
    }).result.then(
      () => this.resetProductForm(),
      () => this.resetProductForm()
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.currentProduct.guiaRemisionFile = file;
      const fileName = file.name;
      const label = document.getElementById('customFileLabel');
      if (label) {
        label.innerText = fileName;
      }
    } else {
      this.currentProduct.guiaRemisionFile = null;
      const label = document.getElementById('customFileLabel');
      if (label) {
        label.innerText = 'Buscar archivo...';
      }
    }
  }

  saveProduct(): void {
    if (!this.selectedClientForProductManagement || !this.selectedClientForProductManagement.idCliente) {
      alert('Error: No hay un cliente seleccionado para registrar el producto.');
      return;
    }

    if (this.currentProduct.idTipoProducto === null ||
        this.currentProduct.idPuntoAcopio === null ||
        this.currentProduct.idTrabajador === null ||
        this.currentProduct.idDistrito === null ||
        !this.currentProduct.nombre || 
        this.currentProduct.peso === null ||
        this.currentProduct.peso <= 0 ||
        this.currentProduct.alto === null ||
        this.currentProduct.alto <= 0 ||
        this.currentProduct.largo === null ||
        this.currentProduct.largo <= 0 ||
        this.currentProduct.ancho === null ||
        this.currentProduct.ancho <= 0
        ) {
      alert('Por favor, complete todos los campos obligatorios del producto.');
      return;
    }


    const formData = new FormData();
    // Añadir todos los campos del formulario al FormData
    formData.append('producto', this.currentProduct.nombre);
    formData.append('alto', this.currentProduct.alto!.toString());
    formData.append('ancho', this.currentProduct.ancho!.toString());
    formData.append('largo', this.currentProduct.largo!.toString());
    formData.append('peso', this.currentProduct.peso!.toString());
    formData.append('idPuntoAcopio', this.currentProduct.idPuntoAcopio!.toString());
    formData.append('idTipoProducto', this.currentProduct.idTipoProducto!.toString());
    formData.append('idCliente', this.currentProduct.idCliente!.toString());
    formData.append('idEstadoEnvio', '1');
    formData.append('idDistrito', this.currentProduct.idDistrito!.toString());
    formData.append('idTrabajador', this.currentProduct.idTrabajador!.toString());

    if (this.currentProduct.guiaRemisionFile) {
      formData.append('guiaRemisionFile', this.currentProduct.guiaRemisionFile, this.currentProduct.guiaRemisionFile.name);
    }

      this.productoService.registrarProducto(formData).subscribe({
        next: (response) => {
          console.log('Producto registrado exitosamente:', response);
          alert('Producto registrado exitosamente!');
          this.modalService.dismissAll(); // Cierra el modal
          this.resetProductForm(); // Limpia el formulario
          this.loadProductsForClient(this.selectedClientForProductManagement!.idCliente); // Recarga la lista de productos
        },
        error: (err) => {
          console.error('Error al registrar producto:', err);
          alert('Error al registrar producto: ' + (err.error?.message || err.message || 'Error desconocido.'));
        }
      });
  }

  editProduct(producto: Producto): void {
    this.openProductModal(producto);
  }

  confirmDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.deleteProduct(id).subscribe({
        next: () => {
          alert('Producto eliminado correctamente.');
          this.loadProductsForClient(this.selectedClientForProductManagement!.idCliente); // Recarga la lista
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          alert('Error al eliminar producto: ' + (err.error?.message || err.message || 'Error desconocido.'));
        }
      });
    }
  }

  viewDetails(producto: Producto): void {
    console.log('Detalles del producto:', producto);
  }

  getEstadoText(estado: string): string {
    const estados: { [key: string]: string } = {
      'EN_ALMACEN': 'En almacén',
      'EN_TRANSITO': 'En tránsito',
      'ENTREGADO': 'Entregado'
    };
    return estados[estado] || estado;
  }

  resetProductForm(): void {
    this.currentProduct = this.createEmptyProduct();
    this.isEditingProduct = false;
    const label = document.getElementById('customFileLabel');
    if (label) {
      label.innerText = 'Buscar archivo...';
    }
  }

  updateMedidas(): void {
   
  }
}