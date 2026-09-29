export type Role = 'admin' | 'supervisor' | 'operative' | 'client';

export type ProductCategory = 'Químicos' | 'Herramientas' | 'Consumibles';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  currentStock: number;
  minStock: number;
  unit: string; // e.g. Litros, Galones, Unidades, Paquetes
  location?: string;
  sku: string;
  lastUpdated: string;
}

export type MovementType = 'entry' | 'exit';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  reason: string; // 'Compra', 'Asignación a servicio', 'Consumo operativo', 'Ajuste'
  responsible: string;
  date: string;
  serviceId?: string;
}

export type TaskPriority = 'Baja' | 'Media' | 'Alta';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  client: string;
  location: string;
  date: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string; // e.g. 'Carlos Mendoza', 'Ana Torres'
  description?: string;
  closingNote?: string;
  completedAt?: string;
}

export interface SurveyRating {
  id: string;
  clientName: string;
  serviceName: string;
  date: string;
  overallScore: number; // 1 to 5
  cleanQualityScore: number; // 1 to 5
  punctualityScore: number; // 1 to 5
  staffCareScore: number; // 1 to 5
  comments: string;
  staffAssigned?: string;
}

export interface SurveyConfig {
  welcomeMessage: string;
  enableQualityQuestion: boolean;
  enablePunctualityQuestion: boolean;
  enableStaffCareQuestion: boolean;
  enableComments: boolean;
  companyContactPhone: string;
}
