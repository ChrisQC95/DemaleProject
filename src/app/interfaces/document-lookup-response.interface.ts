export interface DocumentLookupResponse {
  type: string;         
  number: string;       
  fullName?: string;    
  otherInfo?: string;   
  success: boolean;     
  errorMessage?: string;
}