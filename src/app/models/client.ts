// shared/models/client.ts
export interface Client {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  occupation?: string;
  location?: string;
  interests?: string;
  marketingOptIn?: boolean;
}
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}
