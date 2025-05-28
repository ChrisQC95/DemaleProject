import { Component, OnInit } from '@angular/core';

interface Vehiculo {
  idVehiculo: number;
  placa: string;
  marca: string;
  modelo: string;
  capacidadKg: number;
  estado: string;
}

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {
  vehiculos: Vehiculo[] = [
    { idVehiculo: 1, placa: 'ABC-123', marca: 'Toyota', modelo: 'Hilux', capacidadKg: 1000, estado: 'Activo' },
    { idVehiculo: 2, placa: 'XYZ-789', marca: 'Ford', modelo: 'Ranger', capacidadKg: 1200, estado: 'En mantenimiento' },
    { idVehiculo: 3, placa: 'DEF-456', marca: 'Chevrolet', modelo: 'S10', capacidadKg: 1100, estado: 'Inactivo' },
  ];

  vehiculosFiltrados: Vehiculo[] = [];
  busqueda: string = '';
  filtroEstado: string = '';

  mostrarFormulario: boolean = false;
  editandoVehiculo: boolean = false;
  vehiculoActual: Vehiculo = this.nuevoVehiculoVacio();

  ngOnInit() {
    this.vehiculosFiltrados = [...this.vehiculos];
  }

  nuevoVehiculoVacio(): Vehiculo {
    return {
      idVehiculo: 0,
      placa: '',
      marca: '',
      modelo: '',
      capacidadKg: 0,
      estado: 'Activo'
    };
  }

  filtrarVehiculos() {
    const busq = this.busqueda.toLowerCase();
    this.vehiculosFiltrados = this.vehiculos.filter(v => {
      const coincideBusqueda =
        v.placa.toLowerCase().includes(busq) ||
        v.marca.toLowerCase().includes(busq) ||
        v.modelo.toLowerCase().includes(busq);
      const coincideEstado = this.filtroEstado ? v.estado === this.filtroEstado : true;
      return coincideBusqueda && coincideEstado;
    });
  }

  filtrarEstado(estado: string) {
    this.filtroEstado = estado;
    this.filtrarVehiculos();
  }

  agregarVehiculo() {
    this.vehiculoActual = this.nuevoVehiculoVacio();
    this.editandoVehiculo = false;
    this.mostrarFormulario = true;
  }

  editarVehiculo(vehiculo: Vehiculo) {
    this.vehiculoActual = { ...vehiculo };
    this.editandoVehiculo = true;
    this.mostrarFormulario = true;
  }

  guardarVehiculo() {
    if (this.editandoVehiculo) {
      const index = this.vehiculos.findIndex(v => v.idVehiculo === this.vehiculoActual.idVehiculo);
      if (index !== -1) {
        this.vehiculos[index] = { ...this.vehiculoActual };
      }
    } else {
      const nuevoId = this.vehiculos.length > 0 ? Math.max(...this.vehiculos.map(v => v.idVehiculo)) + 1 : 1;
      const nuevoVehiculo = { ...this.vehiculoActual, idVehiculo: nuevoId };
      this.vehiculos.push(nuevoVehiculo);
    }

    this.cancelarFormulario();
    this.filtrarVehiculos();
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.vehiculoActual = this.nuevoVehiculoVacio();
    this.editandoVehiculo = false;
  }

  eliminarVehiculo(id: number) {
    if (confirm('¿Está seguro que desea eliminar este vehículo?')) {
      this.vehiculos = this.vehiculos.filter(v => v.idVehiculo !== id);
      this.filtrarVehiculos();
    }
  }

  verDetalle(vehiculo: Vehiculo) {
    alert(`Detalle del vehículo:\nID: ${vehiculo.idVehiculo}\nPlaca: ${vehiculo.placa}`);
  }
}