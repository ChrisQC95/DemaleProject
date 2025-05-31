import { Component } from '@angular/core';

interface Conductor {
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  celular: string;
  correo: string;
  tipoLicencia: string;
}

@Component({
  selector: 'app-conductores',
  templateUrl: './conductores.component.html',
  styleUrls: ['./conductores.component.scss']
})
export class ConductoresComponent {
  listaConductores: Conductor[] = [
    {
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
      nombres: 'Carlos',
      apellidos: 'García Pérez',
      celular: '987654321',
      correo: 'carlos@example.com',
      tipoLicencia: 'A1'
    },
    {
      tipoDocumento: 'DNI',
      numeroDocumento: '87654321',
      nombres: 'María',
      apellidos: 'Lopez Díaz',
      celular: '912345678',
      correo: 'maria@example.com',
      tipoLicencia: 'A2'
    }
  ];

  conductor: Conductor = this.crearConductorVacio();

  mostrarFormulario = false;
  editarIndex: number | null = null;

  crearConductorVacio(): Conductor {
    return {
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      celular: '',
      correo: '',
      tipoLicencia: ''
    };
  }

  abrirFormulario() {
    this.limpiarFormulario();
    this.mostrarFormulario = true;
    this.editarIndex = null;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.limpiarFormulario();
    this.editarIndex = null;
  }

  limpiarFormulario() {
    this.conductor = this.crearConductorVacio();
  }

  registrarConductor() {
    const c = this.conductor;
    if (
      c.tipoDocumento && c.numeroDocumento &&
      c.nombres && c.apellidos &&
      c.celular && c.correo && c.tipoLicencia
    ) {
      if (this.editarIndex !== null) {
        this.listaConductores[this.editarIndex] = { ...this.conductor };
        this.editarIndex = null;
      } else {
        this.listaConductores.push({ ...this.conductor });
      }
      this.cerrarFormulario();
    } else {
      alert('Por favor complete todos los campos.');
    }
  }

  editarConductor(index: number) {
    this.editarIndex = index;
    this.conductor = { ...this.listaConductores[index] };
    this.mostrarFormulario = true;
  }

  eliminarConductor(index: number) {
    if (confirm('¿Está seguro que desea eliminar este conductor?')) {
      this.listaConductores.splice(index, 1);
      if (this.editarIndex === index) {
        this.cerrarFormulario();
      }
    }
  }
}
