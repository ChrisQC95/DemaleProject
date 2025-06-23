export interface ProductoResponse {
  // Common fields you might get back
  idProducto: number;           // The ID of the newly created product
  nombre: string;               // The name of the product
  mensaje?: string;             // A success message from the backend (optional)
  fechaIngreso?: string;        // Date of registration (if returned)
  // Add any other specific fields that your backend returns upon successful registration
  // For example:
  // estadoEnvioNombre?: string;
  // tipoProductoNombre?: string;
  // clienteNombre?: string;
  // trabajadorNombre?: string;
  // distritoNombre?: string;
  // ... and so on
}