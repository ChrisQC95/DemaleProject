export interface DocumentLookupResponse {
  type: string;         // "DNI", "RUC", "CEE"
  number: string;       // El número de documento consultado
  fullName?: string;    // Nombre completo o Razón Social (el '?' indica que es opcional, puede ser null)
  otherInfo?: string;   // Información adicional (opcional)
  success: boolean;     // true si la consulta fue exitosa, false si hubo un error
  errorMessage?: string; // Mensaje de error si success es false (opcional)
}