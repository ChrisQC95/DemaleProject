import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentService } from 'src/app/document.service';
import { DocumentLookupResponse } from 'src/app/interfaces/document-lookup-response.interface';
import { Observable } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { ClienteRegistroRequest } from '../../interfaces/cliente-registro-request.interface';
import { ClienteResponse } from '../../interfaces/cliente-response.interface'; // DTO de respuesta del backend
import { TipoDocumento } from '../../interfaces/tipo-documento.interface';
import { TipoCliente } from '../../interfaces/tipo-cliente.interface';
import { Distrito } from '../../interfaces/distrito.interface';
import { TipoVia } from '../../interfaces/tipo-via.interface';

import { ProductoRegistroRequest } from 'src/app/interfaces/producto-registro-request.interface';
import { ProductoResponse } from 'src/app/interfaces/producto-response.interface';
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
  producto: string;
  peso: number;
  alto?: number;
  largo?: number;
  ancho?: number;
  guiaRemisionFile?: File | null;
  guiaRemisionBase64?: string | null;
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
  //Producto[] = []; // O Producto[] = []; si tienes el tipo definido
  //totalItems: number = 0;
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

  readonly ID_TIPO_CLIENTE_EMPRESA = 2;
  readonly ESTADO_ENVIO_EN_ALMACEN_ID = 1;

  isLoadingDocument: boolean = false;
  documentLookupResult: DocumentLookupResponse | null = null;

  showNaturalPersonFields: boolean = true; // Por defecto, mostrar nombres y apellidos
  showLegalPersonFields: boolean = false; // Por defecto, ocultar razón social

  @ViewChild('productModal') productModal!: TemplateRef<any>;
  //productos: Producto[] = [];
  productos: ProductoResponse[] = []; // Cambiado a ProductoResponse para manejar la respuesta del backend
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
    console.log('Intentando cambiar a la pestaña:', tab); // Para depuración

    if (tab === 'producto') {
      if (!this.selectedClientForProductManagement || !this.selectedClientForProductManagement.idCliente) {
        console.warn('Debe seleccionar un cliente para acceder a la gestión de productos (ID no disponible).');
        // Opcional: Podrías mantener la pestaña actual o redirigir a 'clientes'
        // this.activeTab = 'clientes';
        return; // Detiene la función si no hay cliente seleccionado
      }
      // Si hay un cliente seleccionado, activa la pestaña y carga los productos
      this.activeTab = tab;
      console.log('Cliente seleccionado, cargando productos para ID:', this.selectedClientForProductManagement.idCliente); // Para depuración
      this.loadProductsForClientAndStatus(this.selectedClientForProductManagement.idCliente);
    } else if (tab === 'clientes') {
      this.selectedClientForProductManagement = null; // Deselecciona el cliente
      this.productos = []; // Limpia la lista de productos al volver a clientes
      this.activeTab = tab; // Activa la pestaña de clientes
    } else {
        // Para cualquier otra pestaña que puedas tener en el futuro
        this.activeTab = tab;
    }
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
  getMedidas(producto: ProductoResponse): string {
    // Asegúrate de que las propiedades alto, ancho, largo existan y sean números
    if (producto.alto !== null && producto.alto !== undefined &&
        producto.ancho !== null && producto.ancho !== undefined &&
        producto.largo !== null && producto.largo !== undefined) {
      // Puedes ajustar el formato y las unidades según lo necesites
      return `${producto.alto}x${producto.ancho}x${producto.largo} cm`;
    }
    return '--'; // Si faltan datos, muestra un guion o mensaje
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
    console.log('ID del cliente seleccionado:', client.idCliente);
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
      producto: '',
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
  loadProductsForClientAndStatus(idCliente: number | undefined): void {
    console.log('Iniciando carga de productos "En Almacén" para idCliente:', idCliente);
    this.productos = [];
    this.totalItems = 0;
    if (idCliente) {
      this.productoService.listarProductosPorClienteYEnAlmacen(idCliente).subscribe({
        next: (data) => {
          this.productos = data;
          this.totalItems = data.length;
          console.log(`Productos "En Almacén" cargados para cliente ${idCliente}:`, this.productos);
          if (this.productos.length === 0) {
            console.log('La lista de productos recibida está vacía.');
          }
        },
        error: (err) => {
          console.error(`Error al cargar productos "En Almacén" para cliente ${idCliente}:`, err);
          this.productos = [];
          this.totalItems = 0;
          alert('Error al cargar productos "En Almacén" para el cliente: ' + (err.error?.message || err.message || 'Error desconocido.'));
        },
        complete: () => {
          console.log('Carga de productos completada.');
        }
      });
    } else {
      console.warn('No se proporcionó un idCliente para cargar productos.');
      this.productos = [];
      this.totalItems = 0;
    }
  }

  openProductModal(producto?: ProductoResponse): void {
  if (!this.selectedClientForProductManagement) {
    alert('Por favor, seleccione un cliente primero para gestionar sus productos.');
    return;
  }
  this.isEditingProduct = !!producto; // Se establece en true si se proporciona 'producto'

  if (this.isEditingProduct && producto) {
    // Al editar, mapeamos ProductoResponse a la interfaz Producto del formulario
    this.currentProduct = {
      id: producto.idProducto, // El ID es crucial para la edición
      producto: producto.producto,
      peso: producto.peso,
      alto: producto.alto,
      largo: producto.largo,
      ancho: producto.ancho,
      guiaRemisionFile: null, // No precargamos el campo de archivo, es para nuevas subidas
      //guiaRemisionBase64: producto.guiaRemisionBase64 || null, // Almacena el base64 existente
      idTipoProducto: producto.idTipoProducto,
      idPuntoAcopio: producto.idPuntoAcopio,
      idCliente: producto.idCliente, 
      idEstadoEnvio: producto.idEstadoEnvio,
      idDistrito: producto.idDistrito, 
      idTrabajador: producto.idTrabajador,
      // Convierte las fechas a formato 'YYYY-MM-DD' si son cadenas de fecha
      //fechIngreso: producto.fechIngreso ? new Date(producto.fechIngreso).toISOString().substring(0, 10) : undefined,
      //fechLlegada: producto.fechLlegada ? new Date(producto.fechLlegada).toISOString().substring(0, 10) : undefined
    };
    // La etiqueta HTML se actualizará dinámicamente según guiaRemisionBase64
    // No necesitas la actualización explícita de la etiqueta aquí para 'guia de remision cargada'.
    // La lógica condicional del HTML en el paso 1 lo manejará.

  } else {
    // Al crear un nuevo producto
    this.currentProduct = this.createEmptyProduct();
  }

  // Asegura que idCliente se establezca para nuevos productos, o se mantenga para los editados.
  if (!this.isEditingProduct && this.selectedClientForProductManagement) {
    this.currentProduct.idCliente = this.selectedClientForProductManagement.idCliente;
  }
  
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
    // --- Paso 1: Validaciones previas ---
    if (!this.selectedClientForProductManagement || !this.selectedClientForProductManagement.idCliente) {
      alert('Error: No hay un cliente seleccionado para registrar el producto.');
      return;
    }

    // Validar campos obligatorios
    if (
      this.currentProduct.idTipoProducto === null ||
      this.currentProduct.idPuntoAcopio === null ||
      this.currentProduct.idTrabajador === null ||
      this.currentProduct.idDistrito === null ||
      !this.currentProduct.producto ||
      this.currentProduct.peso === null || this.currentProduct.peso <= 0 ||
      this.currentProduct.alto === null || this.currentProduct.alto <= 0 ||
      this.currentProduct.largo === null || this.currentProduct.largo <= 0 ||
      this.currentProduct.ancho === null || this.currentProduct.ancho <= 0
    ) {
      alert('Por favor, complete todos los campos obligatorios del producto y asegure que las medidas y el peso sean mayores a cero.');
      return;
    }

    // --- EDICIÓN ---
    if (this.isEditingProduct && this.currentProduct.id) {
      // Construye el objeto con relaciones anidadas
      const productoActualizado = {
        idProducto: this.currentProduct.id,
        producto: this.currentProduct.producto,
        alto: this.currentProduct.alto,
        ancho: this.currentProduct.ancho,
        largo: this.currentProduct.largo,
        peso: this.currentProduct.peso,
        fechIngreso: new Date().toISOString().substring(0, 10), // O la fecha original si la tienes
        puntoAcopio: { idPuntoAcopio: this.currentProduct.idPuntoAcopio },
        tipoProducto: { idTipoProducto: this.currentProduct.idTipoProducto },
        cliente: { idCliente: this.currentProduct.idCliente },
        estadoEnvio: { idEstadoEnvio: this.currentProduct.idEstadoEnvio },
        distrito: { idDistrito: this.currentProduct.idDistrito },
        trabajador: { idTrabajador: this.currentProduct.idTrabajador },
        guiaRemision: null // O el valor correspondiente si manejas archivo
      };

      this.productoService.actualizarProducto(this.currentProduct.id, productoActualizado).subscribe({
        next: (response) => {
          alert('Producto actualizado exitosamente!');
          this.modalService.dismissAll();
          this.resetProductForm();
          this.loadProductsForClient(this.selectedClientForProductManagement!.idCliente);
        },
        error: (err) => {
          alert('Error al actualizar producto: ' + (err.error?.message || err.message || 'Error desconocido.'));
          console.error('Error detalle:', err);
        }
      });
      return;
    }

    // --- REGISTRO NUEVO ---
    // (Tu lógica actual para registrar, no la cambies)
    const productDataForBackend: ProductoRegistroRequest = {
      producto: this.currentProduct.producto,
      alto: this.currentProduct.alto!,
      ancho: this.currentProduct.ancho!,
      largo: this.currentProduct.largo!,
      peso: this.currentProduct.peso!,
      idPuntoAcopio: this.currentProduct.idPuntoAcopio!,
      idTipoProducto: this.currentProduct.idTipoProducto!,
      idCliente: this.currentProduct.idCliente!,
      idEstadoEnvio: this.ESTADO_ENVIO_EN_ALMACEN_ID,
      idDistrito: this.currentProduct.idDistrito!,
      idTrabajador: this.currentProduct.idTrabajador!
    };

    let observable: Observable<ProductoResponse>;

    if (this.currentProduct.guiaRemisionFile) {
      const formData = new FormData();
      const productoDataJson = JSON.stringify(productDataForBackend);
      formData.append('productoData', productoDataJson);
      formData.append('guiaRemisionFile', this.currentProduct.guiaRemisionFile, this.currentProduct.guiaRemisionFile.name);
      observable = this.productoService.registrarProductoConGuia(formData);
    } else {
      observable = this.productoService.registrarProductoSinGuia(productDataForBackend);
    }

    observable.subscribe({
      next: (response) => {
        alert('Producto registrado exitosamente!');
        this.modalService.dismissAll();
        this.resetProductForm();
        this.loadProductsForClient(this.selectedClientForProductManagement!.idCliente);
      },
      error: (err) => {
        let errorMessage = 'Ocurrió un error al registrar el producto.';
        if (err.error && err.error.message) {
          errorMessage = 'Error: ' + err.error.message;
        } else if (err.message) {
          errorMessage = 'Error: ' + err.message;
        }
        alert(errorMessage);
      }
    });
  }

  editProduct(producto: ProductoResponse): void {
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