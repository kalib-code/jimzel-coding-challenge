export interface IDepartment {
  id: number;
  code_id: string;
  name: string;
  description?: string;
  can_transfer?: boolean;
  updated_by?: string;
  ip_address?: string;
  updated_at?: string;
}