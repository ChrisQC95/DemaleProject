import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

interface Empleado {
  id?: string;
  nombreCompleto: string;
  correo: string;
  cargo: string;
  departamento: string;
  telefono: string;
  fechaIngreso: string;
  estado: string;
}

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {

  @ViewChild('empleadoModal') private empleadoModalContent: any;

  closeResult = '';
  isEditingEmpleado: boolean = false;
  currentEmpleado: Empleado = {
    nombreCompleto: '',
    correo: '',
    cargo: '',
    departamento: '',
    telefono: '',
    fechaIngreso: '',
    estado: 'activo'
  };

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openEmpleadoModal(content: any) {
    this.isEditingEmpleado = false;
    this.currentEmpleado = {
      nombreCompleto: '',
      correo: '',
      cargo: '',
      departamento: '',
      telefono: '',
      fechaIngreso: '',
      estado: 'activo'
    };
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editEmpleado() {
    this.isEditingEmpleado = true;
    this.currentEmpleado = {
      id: 'EMP-001',
      nombreCompleto: 'Ana López',
      correo: 'ana.lopez@empresa.com',
      cargo: 'Analista',
      departamento: 'Recursos Humanos',
      telefono: '+51 987 654 321',
      fechaIngreso: '2023-03-15',
      estado: 'activo'
    };
    this.modalService.open(this.empleadoModalContent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  saveEmpleado() {
    if (this.isEditingEmpleado) {
      console.log('Actualizando empleado:', this.currentEmpleado);
      alert('Empleado actualizado: ' + JSON.stringify(this.currentEmpleado));
    } else {
      console.log('Registrando nuevo empleado:', this.currentEmpleado);
      alert('Nuevo empleado registrado: ' + JSON.stringify(this.currentEmpleado));
    }
    this.modalService.dismissAll();
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
