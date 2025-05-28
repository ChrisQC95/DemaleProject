import { Component, OnInit } from '@angular/core';

interface Conductor {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  celular: string;
  distrito: string;
  pais: string;
  ciudad: string;
  direccion: string;
  correo?: string;
  tipoLicencia?: string;
  archivo?: File | null;
}

@Component({
  selector: 'app-conductores',
  templateUrl: './conductores.component.html',
  styleUrls: ['./conductores.component.scss']
})
export class ConductoresComponent implements OnInit {

  conductores: Conductor[] = [];
  searchQuery: string = '';
  filteredConductores: Conductor[] = [];

  mostrarFormulario = false;
  modoEdicion = false;

  nuevoConductor: any = {
    tipoDocumento: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    celular: '',
    tipoVia: '',
    direccion: '',
    numeroMunicipal: '',
    correo: '',
    tipoLicencia: '',
    archivo: null
  };

  conductorEditando: Conductor | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadConductores();
  }

  loadConductores(): void {
    this.conductores = [
      {
        id: 'CONDUCTOR001',
        tipoDocumento: 'DNI',
        numeroDocumento: '87534561',
        nombres: 'DOMENIK',
        apellidos: 'ZAPATA',
        fechaNacimiento: '1997-06-12',
        celular: '973126342',
        distrito: 'CALLAO',
        pais: 'PERÚ',
        ciudad: 'LIMA',
        direccion: 'AV. RETABLO',
        correo: 'domenik@example.com',
        tipoLicencia: 'A1',
        archivo: null
      },
      {
        id: 'CONDUCTOR002',
        tipoDocumento: 'DNI',
        numeroDocumento: '94576231',
        nombres: 'ROXETANA',
        apellidos: 'SUAREZ',
        fechaNacimiento: '1998-12-10',
        celular: '989127332',
        distrito: 'COMAS',
        pais: 'PERÚ',
        ciudad: 'LIMA',
        direccion: 'AV. RETABLO',
        correo: 'roxetana@example.com',
        tipoLicencia: 'B2',
        archivo: null
      }
    ];

    this.filteredConductores = [...this.conductores];
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredConductores = [...this.conductores];
      return;
    }

    this.filteredConductores = this.conductores.filter(c =>
      c.nombres.toLowerCase().includes(query) ||
      c.apellidos.toLowerCase().includes(query) ||
      c.numeroDocumento.includes(query) ||
      c.id.toLowerCase().includes(query)
    );
  }

  agregarConductor(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.resetearFormulario();
  }

  editarConductor(conductor: Conductor): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.conductorEditando = conductor;

    const partesDireccion = conductor.direccion.split(' ');
    this.nuevoConductor = {
      tipoDocumento: conductor.tipoDocumento,
      numeroDocumento: conductor.numeroDocumento,
      nombres: conductor.nombres,
      apellidos: conductor.apellidos,
      celular: conductor.celular,
      tipoVia: partesDireccion[0] || '',
      direccion: partesDireccion.slice(1, -1).join(' ') || '',
      numeroMunicipal: partesDireccion[partesDireccion.length - 1] || '',
      correo: conductor.correo || '',
      tipoLicencia: conductor.tipoLicencia || '',
      archivo: null
    };
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.resetearFormulario();
  }

  resetearFormulario(): void {
    this.nuevoConductor = {
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      celular: '',
      tipoVia: '',
      direccion: '',
      numeroMunicipal: '',
      correo: '',
      tipoLicencia: '',
      archivo: null
    };
    this.conductorEditando = null;
  }

  onArchivoSeleccionado(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.nuevoConductor.archivo = file;
      console.log('Archivo seleccionado:', file.name);
    }
  }

  guardarConductor(): void {
    if (this.modoEdicion && this.conductorEditando) {
      Object.assign(this.conductorEditando, {
        tipoDocumento: this.nuevoConductor.tipoDocumento,
        numeroDocumento: this.nuevoConductor.numeroDocumento,
        nombres: this.nuevoConductor.nombres,
        apellidos: this.nuevoConductor.apellidos,
        celular: this.nuevoConductor.celular,
        direccion: `${this.nuevoConductor.tipoVia} ${this.nuevoConductor.direccion} ${this.nuevoConductor.numeroMunicipal}`.trim(),
        correo: this.nuevoConductor.correo,
        tipoLicencia: this.nuevoConductor.tipoLicencia
      });
    } else {
      const nuevo = {
        id: 'CONDUCTOR' + (this.conductores.length + 1).toString().padStart(3, '0'),
        tipoDocumento: this.nuevoConductor.tipoDocumento,
        numeroDocumento: this.nuevoConductor.numeroDocumento,
        nombres: this.nuevoConductor.nombres,
        apellidos: this.nuevoConductor.apellidos,
        fechaNacimiento: '1990-01-01',
        celular: this.nuevoConductor.celular,  
        distrito: 'NO DEFINIDO',
        pais: 'PERÚ',
        ciudad: 'LIMA',
        direccion: `${this.nuevoConductor.tipoVia} ${this.nuevoConductor.direccion} ${this.nuevoConductor.numeroMunicipal}`.trim(),
        correo: this.nuevoConductor.correo,
        tipoLicencia: this.nuevoConductor.tipoLicencia,
        archivo: this.nuevoConductor.archivo
      };
      this.conductores.push(nuevo);
    }

    this.onSearch();
    this.cancelarFormulario();
  }

  eliminarConductor(id: string): void {
    this.conductores = this.conductores.filter(c => c.id !== id);
    this.onSearch();
  }
}   


