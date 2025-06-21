import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentService } from 'src/app/document.service'; 
import { DocumentLookupResponse } from 'src/app/interfaces/document-lookup-response.interface';

import { ClienteService } from '../../services/cliente.service'; // Ajusta la ruta si es necesario
import { ClienteRegistroRequest } from '../../interfaces/cliente-registro-request.interface'; // DTO para enviar al backend
import { ClienteResponse } from '../../interfaces/cliente-response.interface'; // DTO de respuesta del backend
import { TipoDocumento } from '../../interfaces/tipo-documento.interface';
import { TipoCliente } from '../../interfaces/tipo-cliente.interface';
import { Distrito } from '../../interfaces/distrito.interface'; 
import { TipoVia } from '../../interfaces/tipo-via.interface'; 

interface ClienteForm {
  id?: number;
  nombres?: string; // Hacer opcional
  apellidos?: string; // Hacer opcional
  razonSocial?: string; // Nuevo campo
  idTipoDoc?: number; // Usar idTipoDoc en lugar de tipoDocumento (string)
  numeroDocumento: string;
  telefono?: string;
  email?: string; // Corresponde al 'correo' en tu DTO de Spring Boot
  idTipoCliente?: number;
  idDistrito?: number; // Añadir campos de dirección
  idTipoVia?: number;
  direccion?: string;
  nMunicipal?: string;
}
interface Producto {
  id?: number;
  codigo?: string;
  nombre: string;
  categoria: string;
  peso: number;
  alto?: number;
  largo?: number;
  ancho?: number;
  medidas?: string;
  puntoAcopio: string;
  destino: string;
  estado: string;
  fechaIngreso?: Date | string;
  guiaRemision?: File | string;
  empleado: string;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {
  activeTab: string = 'clientes';
  
  // Variables para pestaña Clientes
  searchQuery: string = '';
  clientResults: ClienteResponse[] = [];
  selectedClient: ClienteForm | null = null;
  currentClient: ClienteForm = this.createEmptyClient();
  isEditMode: boolean = false;
  searchPerformed: boolean = false;

  tiposDocumento: TipoDocumento[] = [];
  tiposCliente: TipoCliente[] = [];
  distritos: Distrito[] = []; 
  tiposVia: TipoVia[] = []; 

  showNaturalPersonFields: boolean = true; // Por defecto, mostrar nombres y apellidos
  showLegalPersonFields: boolean = false; // Por defecto, ocultar razón social

  // <<--- CAMBIO: IDs para los tipos de documento (usados en la lógica) --->>
  readonly DNI_ID = 1;
  readonly RUC_ID = 2;
  readonly CARNET_EXTRANJERIA_ID = 5;

  // <<--- CAMBIO: Nuevas variables de estado para la consulta de documento
  isLoadingDocument: boolean = false;
  documentLookupResult: DocumentLookupResponse | null = null;

  // Variables para pestaña Productos
  @ViewChild('productModal') productModal!: TemplateRef<any>;
  productos: Producto[] = [];
  currentProduct: Producto = this.createEmptyProduct();
  isEditingProduct: boolean = false;
  categorias = ['Electrónicos', 'Equipo Médico', 'Insumos', 'Materiales'];
  puntosAcopio = ['Almacén Central', 'Centro de Distribución Norte', 'Centro de Distribución Sur'];
  empleados = ['Juan Pérez', 'María Gómez', 'Carlos Sánchez'];
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private http: HttpClient, 
    private modalService: NgbModal, 
    private documentService: DocumentService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.loadTiposDocumento();
    this.loadTiposCliente();
    this.loadDistritos(); 
    this.loadTiposVia();
    this.loadInitialData();
    this.loadProducts();
    this.selectTab('cliente');
  }
  selectTab(tab: string): void {
    this.activeTab = tab;
  }
  getMinLengthForDocumentType(): number {
    switch (this.currentClient.idTipoDoc) { // Usar idTipoDoc
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
    switch (this.currentClient.idTipoDoc) { // Usar idTipoDoc
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
      razonSocial: '', // <<--- CAMBIO: Inicializar razonSocial --->>
      idTipoDoc: undefined, // <<--- CAMBIO: Usar idTipoDoc y undefined para el valor inicial del select --->>
      numeroDocumento: '',
      telefono: '',
      email: '',
      idTipoCliente: undefined, // <<--- CAMBIO: Usar undefined para el valor inicial del select --->>
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
        console.log('Tipos de Documento cargados:', this.tiposDocumento); // <--- AÑADIDO
      },
      error: (err) => console.error('Error al cargar tipos de documento:', err)
    });
  }

  loadTiposCliente(): void {
    this.clienteService.getTiposCliente().subscribe({
      next: (data) => {
        this.tiposCliente = data;
        console.log('Tipos de Cliente cargados:', this.tiposCliente); // <--- AÑADIDO
      },
      error: (err) => console.error('Error al cargar tipos de cliente:', err)
    });
  }

  loadDistritos(): void {
    this.clienteService.getDistritos().subscribe({
      next: (data) => {
        this.distritos = data;
        console.log('Distritos cargados:', this.distritos); // <--- AÑADIDO
      },
      error: (err) => console.error('Error al cargar distritos:', err)
    });
  }

  loadTiposVia(): void {
    this.clienteService.getTiposVia().subscribe({
      next: (data) => {
        this.tiposVia = data;
        console.log('Tipos de Vía cargados:', this.tiposVia); // <--- AÑADIDO
      },
      error: (err) => console.error('Error al cargar tipos de vía:', err)
    });
  }
  loadInitialData(): void {
    this.clientResults = [];
    // <<--- CAMBIO: Llamar a onDocumentTypeChange al cargar el formulario inicialmente --->>
    this.onDocumentTypeChange(); // Para establecer la visibilidad inicial de los campos
  }
  /*loadInitialData(): void {
    this.http.get<Cliente[]>('/api/clientes/frecuentes').subscribe({
      next: (data) => this.clientResults = data,
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }*/

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    // Aquí deberías llamar a un endpoint de búsqueda en tu backend
    /*
    this.clienteService.buscarClientes(this.searchQuery).subscribe({
      next: (data) => {
        this.clientResults = data;
        this.searchPerformed = true;
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
        this.clientResults = [];
      }
    });
    */
    this.clientResults = []; // Temporalmente vacío
    this.searchPerformed = true;
  }

  onSelectClient(client: ClienteResponse): void {
    this.selectedClient = {
      id: client.idCliente,
      nombres: client.nombres,
      apellidos: client.apellidos,
      razonSocial: client.razonSocial, // <<--- CAMBIO: Mapear razonSocial --->>
      idTipoDoc: this.tiposDocumento.find(td => td.nombreDoc === client.tipoDocumentoNombre)?.idTipoDoc || undefined, // Mapear a ID numérico
      numeroDocumento: client.numeroDocumento,
      telefono: client.telefono,
      email: client.correo,
      idTipoCliente: client.idTipoCliente, // Asegurarse de que el ID del tipo de cliente se mapee
      idDistrito: client.idDistrito, // Asegurarse de que los IDs de dirección se mapeen
      idTipoVia: client.idTipoVia,
      direccion: client.direccion,
      nMunicipal: client.nMunicipal
    };
    this.currentClient = { ...this.selectedClient };
    this.isEditMode = true;
    // <<--- CAMBIO: Llamar a onDocumentTypeChange al seleccionar un cliente para ajustar la vista --->>
    this.onDocumentTypeChange();
  }
  onDocumentTypeChange(): void {
    const selectedTypeId = this.currentClient.idTipoDoc;

    // Reiniciar los campos de nombres/apellidos y razón social al cambiar el tipo
    this.currentClient.nombres = '';
    this.currentClient.apellidos = '';
    this.currentClient.razonSocial = '';
    this.currentClient.numeroDocumento = ''; // También reiniciar el número de documento para evitar confusiones

    if (selectedTypeId === this.RUC_ID) {
      this.showNaturalPersonFields = false;
      this.showLegalPersonFields = true;
    } else if (selectedTypeId === this.DNI_ID || selectedTypeId === this.CARNET_EXTRANJERIA_ID) {
      this.showNaturalPersonFields = true;
      this.showLegalPersonFields = false;
    } else {
      // Para cualquier otro tipo, o si no se ha seleccionado nada, puedes decidir un comportamiento por defecto
      // Por ejemplo, ocultar ambos o mostrar los campos de persona natural
      this.showNaturalPersonFields = true; // Mostrar por defecto para otros tipos
      this.showLegalPersonFields = false;
    }
    // También limpia el resultado de la consulta del documento anterior
    this.clearDocumentLookupResults();
  }

  onSubmit(): void {
    // <<--- CAMBIO: Validaciones condicionales en el frontend --->>
    const idTipoDoc = this.currentClient.idTipoDoc;

    // Validar nombres/apellidos O razonSocial
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

    // Validaciones comunes
    if (!this.currentClient.idTipoDoc ||
      !this.currentClient.numeroDocumento?.trim() ||
      !this.currentClient.idTipoCliente
    ) {
      alert('Por favor, complete todos los campos obligatorios: Tipo de Documento, Número de Documento y Tipo de Cliente.');
      return;
    }

    // Mapear ClienteForm a ClienteRegistroRequest para enviar al backend
    const clienteParaBackend: ClienteRegistroRequest = {
      // Los campos nombres, apellidos, razonSocial se asignarán condicionalmente
      nombres: (idTipoDoc === this.DNI_ID || idTipoDoc === this.CARNET_EXTRANJERIA_ID) ? this.currentClient.nombres || '' : undefined,
      apellidos: (idTipoDoc === this.DNI_ID || idTipoDoc === this.CARNET_EXTRANJERIA_ID) ? this.currentClient.apellidos || '' : undefined,
      razonSocial: (idTipoDoc === this.RUC_ID) ? this.currentClient.razonSocial || '' : undefined,

      idTipoDoc: this.currentClient.idTipoDoc,
      numeroDocumento: this.currentClient.numeroDocumento,
      telefono: this.currentClient.telefono || undefined,
      correo: this.currentClient.email || undefined,

      idDistrito: this.currentClient.idDistrito || undefined,
      idTipoVia: this.currentClient.idTipoVia || undefined,
      direccion: this.currentClient.direccion || undefined,
      nMunicipal: this.currentClient.nMunicipal || undefined,

      idTipoCliente: this.currentClient.idTipoCliente
    };

    if (this.isEditMode) {
      console.warn('La funcionalidad de edición/actualización de clientes aún no está implementada completamente.');
      alert('Funcionalidad de edición no implementada. Por favor, registre un nuevo cliente.');
    } else {
      this.clienteService.registrarCliente(clienteParaBackend).subscribe({
        next: (response) => {
          console.log('Cliente registrado con éxito:', response);
          alert('Cliente registrado con éxito!');
          this.resetForm();
          this.loadInitialData();
        },
        error: (err) => {
          console.error('Error al registrar cliente:', err);
          alert('Error al registrar cliente: ' + (err.error?.message || err.message || 'Error desconocido.'));
        }
      });
    }
  }

  onCancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.currentClient = this.createEmptyClient();
    this.isEditMode = false;
    this.selectedClient = null;
    this.clearDocumentLookupResults();
    // <<--- CAMBIO: Volver a llamar a onDocumentTypeChange para resetear la visibilidad --->>
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
    this.documentLookupResult = null; // Limpiar resultados anteriores

    this.documentService.consultarDocumento(numero).subscribe({
      next: (response: DocumentLookupResponse) => {
        this.documentLookupResult = response;
        this.isLoadingDocument = false;

        if (response.success) {
          // Rellenar campos del formulario
          this.currentClient.numeroDocumento = response.number; // Asegurar que el número consultado se mantenga

          if (response.type === 'RUC') {
              this.currentClient.razonSocial = response.fullName || '';
              this.currentClient.nombres = ''; // Limpiar nombres y apellidos
              this.currentClient.apellidos = '';
              this.currentClient.idTipoDoc = this.RUC_ID; // Asignar el ID de RUC
          } else if (response.type === 'DNI') {
              this.currentClient.nombres = response.fullName || '';
              this.currentClient.apellidos = response.otherInfo || ''; // Asumiendo que otherInfo tiene apellidos para DNI
              this.currentClient.razonSocial = ''; // Limpiar razón social
              this.currentClient.idTipoDoc = this.DNI_ID; // Asignar el ID de DNI
          } else if (response.type === 'CEE') { // Asumiendo que la API devuelve 'CEE' para Carnet de Extranjería
              this.currentClient.nombres = response.fullName || '';
              this.currentClient.apellidos = response.otherInfo || '';
              this.currentClient.razonSocial = '';
              this.currentClient.idTipoDoc = this.CARNET_EXTRANJERIA_ID; // Asignar el ID de Carnet Extranjería
          } else {
              // Si el tipo de documento retornado por la API no coincide con DNI/RUC/CEE
              console.warn(`Tipo de documento desconocido retornado por la API: ${response.type}`);
              this.currentClient.razonSocial = '';
              this.currentClient.nombres = '';
              this.currentClient.apellidos = '';
              // Mantener el idTipoDoc que el usuario seleccionó o establecer un valor por defecto si es necesario
          }
          // <<--- IMPORTANTE: Llamar a onDocumentTypeChange para que se actualice la vista después de rellenar los datos --->>
          this.onDocumentTypeChange();
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
      categoria: '',
      peso: 0,
      puntoAcopio: '',
      destino: '',
      estado: 'EN_ALMACEN',
      empleado: ''
    };
  }

  loadProducts(): void {
    // Carga productos desde el backend, usando HttpClient o un ProductService
    this.productos = []; 
    this.totalItems = 0;
  }
  /*loadProducts(): void {
    const params = {
      page: this.currentPage.toString(),
      limit: this.itemsPerPage.toString()
    };

    this.http.get<any>('/api/productos', { params }).subscribe({
      next: (response) => {
        this.productos = response.data;
        this.totalItems = response.total;
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }*/

  openProductModal(producto?: Producto): void {
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
      this.currentProduct.guiaRemision = file;
    }
  }

  saveProduct(): void {
    console.warn('La funcionalidad de guardar/actualizar producto aún no está conectada al backend.');
    this.modalService.dismissAll();
  }
  /*saveProduct(): void {
    const formData = new FormData();
    Object.keys(this.currentProduct).forEach(key => {
      const value = this.currentProduct[key as keyof Producto];
      if (value !== null && value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const apiCall = this.isEditingProduct
      ? this.http.put(`/api/productos/${this.currentProduct.id}`, formData)
      : this.http.post('/api/productos', formData);

    apiCall.subscribe({
      next: () => {
        this.loadProducts();
        this.modalService.dismissAll();
      },
      error: (err) => console.error('Error al guardar producto:', err)
    });
  }*/

  editProduct(producto: Producto): void {
    this.openProductModal(producto);
  }

  confirmDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      console.warn('La funcionalidad de eliminar producto aún no está conectada al backend.');
    }
  }
  /*confirmDelete(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.http.delete(`/api/productos/${id}`).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }*/

  viewDetails(producto: Producto): void {
    // Implementar según necesidades
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
  }

  // Método para generar medidas automáticamente
  updateMedidas(): void {
    if (this.currentProduct.alto && this.currentProduct.largo && this.currentProduct.ancho) {
      this.currentProduct.medidas = 
        `${this.currentProduct.alto}x${this.currentProduct.largo}x${this.currentProduct.ancho} cm`;
    }
  }
}