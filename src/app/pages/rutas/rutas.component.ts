import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

interface Ruta {
  codigoRuta: string;
  nombreRuta: string;
  observacion?: string;
}

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.scss']
})
export class RutasComponent implements OnInit {

  @ViewChild('rutaModal') private rutaModalContent: any;

  closeResult = '';
  isEditingRuta: boolean = false;
  currentRuta: Ruta = {
    codigoRuta: '',
    nombreRuta: '',
    observacion: ''
  };

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {}

  openRutaModal(content: any) {
    this.isEditingRuta = false;
    this.currentRuta = {
      codigoRuta: '',
      nombreRuta: '',
      observacion: ''
    };
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editRuta() {
    this.isEditingRuta = true;
    this.currentRuta = {
      codigoRuta: 'RUTA-001',
      nombreRuta: 'Ruta Lima - Arequipa',
      observacion: 'Ruta frecuente'
    };
    this.modalService.open(this.rutaModalContent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  saveRuta() {
    if (this.isEditingRuta) {
      console.log('Actualizando ruta:', this.currentRuta);
      alert('Ruta actualizada: ' + JSON.stringify(this.currentRuta));
    } else {
      console.log('Registrando nueva ruta:', this.currentRuta);
      alert('Nueva ruta registrada: ' + JSON.stringify(this.currentRuta));
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
