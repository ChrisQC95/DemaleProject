import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TrabajadorService,Trabajador,Distrito,TipoVia,TipoDocumento,Rol } from 'src/app/services/trabajador.service';


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})

export class EmpleadosComponent implements OnInit {

  @ViewChild('empleadoModal') private empleadoModalContent: any;

  closeResult = '';
  isEditingEmpleado: boolean = false;
  currentEmpleado: Trabajador = {
    nombres: '',
    apellidos: '',
    razonSocial: null, // Puedes dejarlo null si es opcional o '' si lo prefieres
    numeroDocumento: '',
    telefono: '',    // Puedes dejarlo null si es opcional o '' si lo prefieres
    correo: '',      // Puedes dejarlo null si es opcional o '' si lo prefieres
    direccion: '',   // Faltaba esta
    idDistrito: 0,  // Faltaba esta
    idTipoVia: 0,   // Faltaba esta
    idTipoDocumento: 0,  // Faltaba esta (ej. 1 para DNI, etc.)
    fechNacimiento: '',
    foto: null,        // Faltaba esta
    idRol: 0,          // Faltaba esta (ej. 1 para ADMIN, 2 para USER)
    nmunicipal: null   // Faltaba esta
  };
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  filteredTrabajadores: Trabajador[] = [];

  trabajadores: Trabajador[] = [];
  distritos: Distrito[] = [];
  tiposVia: TipoVia[] = [];
  tiposDocumento: TipoDocumento[] = [];
  roles: Rol[] = [];

  constructor(private modalService: NgbModal,
              private trabajadorService: TrabajadorService
  ) { }

  ngOnInit(): void {
    this.loadTrabajadores();
    this.loadSelectData();
  }

  loadTrabajadores(): void {
    // Llama al método de tu servicio que obtiene todos los trabajadores
    this.trabajadorService.getAllTrabajadores().subscribe(
      (data: Trabajador[]) => { // 'data' contendrá el array de trabajadores de tu API
        this.trabajadores = data; // Guarda los datos en tu variable 'trabajadores'
        this.filterTrabajadores();
        console.log('Trabajadores cargados desde la API:', this.trabajadores); // Para verificar en la consola del navegador
      },
      (error) => {
        console.error('Error al cargar trabajadores:', error); // Manejo de errores
        // Aquí puedes añadir lógica para mostrar un mensaje de error en tu UI
      }
    );
  }

  filterTrabajadores(): void {
  const term = this.searchTerm.toLowerCase().trim();
  if (!term) {
    this.filteredTrabajadores = [...this.trabajadores]; // Si no hay término, muestra todos
  } else {
    this.filteredTrabajadores = this.trabajadores.filter(trabajador =>
      trabajador.nombres.toLowerCase().includes(term) ||
      trabajador.apellidos.toLowerCase().includes(term) ||
      (trabajador.correo && trabajador.correo.toLowerCase().includes(term)) ||
      // ¡MODIFICACIÓN AQUÍ para campos numéricos! Convertir a string
      (trabajador.numeroDocumento && String(trabajador.numeroDocumento).toLowerCase().includes(term)) ||
      (trabajador.telefono && String(trabajador.telefono).toLowerCase().includes(term)) || // <-- Añadido para el teléfono
      (trabajador.nombreRol && trabajador.nombreRol.toLowerCase().includes(term)) ||
      // Puedes añadir más campos aquí, por ejemplo:
      (trabajador.nombreDistrito && trabajador.nombreDistrito.toLowerCase().includes(term)) // Si quieres buscar por distrito
    );
  }
}

  // --- NUEVO MÉTODO PARA CARGAR LOS DATOS DE TODOS LOS SELECTS ---
  loadSelectData(): void {
    this.trabajadorService.getDistritos().subscribe(
      data => this.distritos = data,
      error => console.error('Error al cargar distritos:', error)
    );

    this.trabajadorService.getTiposVia().subscribe(
      data => this.tiposVia = data,
      error => console.error('Error al cargar tipos de vía:', error)
    );

    this.trabajadorService.getTiposDocumento().subscribe(
      data => this.tiposDocumento = data,
      error => console.error('Error al cargar tipos de documento:', error)
    );

    this.trabajadorService.getRoles().subscribe(
      data => this.roles = data,
      error => console.error('Error al cargar roles:', error)
    );
  }

  openEmpleadoModal(content: any) {
    this.isEditingEmpleado = false;
    this.currentEmpleado = {
      nombres: '',
    apellidos: '',
    razonSocial: null, // Puedes dejarlo null si es opcional o '' si lo prefieres
    numeroDocumento: '',
    telefono: '',    // Puedes dejarlo null si es opcional o '' si lo prefieres
    correo: '',      // Puedes dejarlo null si es opcional o '' si lo prefieres
    direccion: '',   // Faltaba esta
    idDistrito: 0,  // Faltaba esta
    idTipoVia: 0,   // Faltaba esta
    idTipoDocumento: 0,  // Faltaba esta (ej. 1 para DNI, etc.)
    fechNacimiento: '',
    foto: null,        // Faltaba esta
    idRol: 0,          // Faltaba esta (ej. 1 para ADMIN, 2 para USER)
    nmunicipal: null   // Faltaba esta
    };
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


   openEditEmpleadoModal(empleado: Trabajador) {
    this.isEditingEmpleado = true;
    // Copia profunda del empleado para evitar modificar el original directamente
    this.currentEmpleado = { ...empleado }; 

    // Formatear la fecha de nacimiento para el input type="date" (YYYY-MM-DD)
    if (this.currentEmpleado.fechNacimiento) {
      const date = new Date(this.currentEmpleado.fechNacimiento);
      // toISOString().split('T')[0] formatea a "YYYY-MM-DD"
      this.currentEmpleado.fechNacimiento = date.toISOString().split('T')[0];
    } else {
      this.currentEmpleado.fechNacimiento = ''; // Asegura que sea una cadena vacía si es null/undefined
    }

    this.modalService.open(this.empleadoModalContent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
     this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  saveEmpleado() {
    if (this.isEditingEmpleado) {
        // Lógica para ACTUALIZAR un empleado existente
        if (this.currentEmpleado.idTrabajador) { 
            console.log('Actualizando empleado:', this.currentEmpleado);
            this.trabajadorService.updateTrabajador(this.currentEmpleado.idTrabajador, this.currentEmpleado).subscribe(
                (response) => {
                    console.log('Empleado actualizado con éxito:', response);
                    alert('Empleado actualizado con éxito.');
                    this.loadTrabajadores(); // Recargar la lista para ver los cambios
                    this.modalService.dismissAll(); // Cerrar el modal
                },
                (error) => {
                    console.error('Error al actualizar empleado:', error);
                    alert('Error al actualizar empleado: ' + (error.error?.message || error.message || JSON.stringify(error)));
                }
            );
        } else {
            console.error('Error: No se encontró ID de trabajador para actualizar.');
            alert('Error: No se puede actualizar un empleado sin ID.');
        }
    } else {
      // Lógica para AGREGAR un nuevo empleado
      console.log('Registrando nuevo empleado:', this.currentEmpleado);
      this.trabajadorService.addTrabajador(this.currentEmpleado).subscribe(
        (response) => {
          console.log('Empleado registrado con éxito:', response);
          alert('Nuevo empleado registrado con éxito.');
          this.loadTrabajadores();
          this.modalService.dismissAll();
        },
        (error) => {
          console.error('Error al registrar nuevo empleado:', error);
          alert('Error al registrar empleado: ' + (error.error?.message || error.message || JSON.stringify(error)));
        }
      );
    }
  }

  deleteEmpleado(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado? Esta acción no se puede deshacer.')) {
      this.trabajadorService.deleteTrabajador(id).subscribe(
        () => {
          console.log('Empleado eliminado con éxito');
          alert('Empleado eliminado con éxito.');
          this.loadTrabajadores(); // Recargar la lista para que el empleado eliminado desaparezca
        },
        (error) => {
          console.error('Error al eliminar empleado:', error);
          alert('Error al eliminar empleado: ' + (error.error?.message || error.message || JSON.stringify(error)));
        }
      );
    }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'al presionar ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'al hacer clic fuera del modal';
    } else {
      return `con: ${reason}`;
    }
  }

}
