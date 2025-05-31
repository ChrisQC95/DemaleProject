import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

interface Envio {
  id?: string;
  productoAsociado: string;
  fechaSalida: string;
  destinoFinal: string;
  estado: string;
  choferEncargado: string;
  vehiculo: string;
  acopio?: string;
  observacion?: string;
  ruta?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Component({
  selector: 'app-enviosProductos',
  templateUrl: './enviosProductos.component.html',
  styleUrls: ['./enviosProductos.component.scss']
})
// ¡ASEGÚRATE DE QUE LA 'E' DE 'Envios' ESTÉ EN MAYÚSCULA AQUÍ!
export class EnviosProductosComponent implements OnInit {

  @ViewChild('envioModal') private envioModalContent: any;

  closeResult = '';
  isEditingEnvio: boolean = false;
  currentEnvio: Envio = {
    productoAsociado: '',
    fechaSalida: '',
    destinoFinal: '',
    estado: 'En Tránsito',
    choferEncargado: '',
    vehiculo: '',
    acopio: '',
    observacion: '',
    ruta: '',
    fechaInicio: '',
    fechaFin: ''
  };

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openEnvioModal(content: any) {
    this.isEditingEnvio = false;
    this.currentEnvio = {
      productoAsociado: '',
      fechaSalida: '',
      destinoFinal: '',
      estado: 'En Tránsito',
      choferEncargado: '',
      vehiculo: '',
      acopio: '',
      observacion: '',
      ruta: '',
      fechaInicio: '',
      fechaFin: ''
    };
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editEnvio() {
    this.isEditingEnvio = true;
    this.currentEnvio = {
      id: 'ENV-001',
      productoAsociado: 'Laptop Dell XPS 15',
      fechaSalida: '2023-05-20',
      estado: 'En Tránsito',
      destinoFinal: 'Lima - Miraflores',
      choferEncargado: 'Diego Vera',
      vehiculo: 'EFG-789',
      acopio: 'Lima',
      observacion: 'Paquete frágil',
      ruta: 'Ruta 1',
      fechaInicio: '2023-05-20',
      fechaFin: '2023-05-25'
    };
    this.modalService.open(this.envioModalContent, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  saveEnvio() {
    if (this.isEditingEnvio) {
      console.log('Actualizando envío:', this.currentEnvio);
      alert('Envío actualizado: ' + JSON.stringify(this.currentEnvio));
    } else {
      console.log('Registrando nuevo envío:', this.currentEnvio);
      alert('Nuevo envío registrado: ' + JSON.stringify(this.currentEnvio));
    }
    this.modalService.dismissAll();
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