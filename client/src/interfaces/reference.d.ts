export interface IReference {
  id: number;
  code_id: string;
  name: string;
  description?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IVendor extends IReference {}
export interface IPosition extends IReference {}
export interface IEmploymentType extends IReference {}
export interface IBank extends IReference {}
export interface IPayFrequency extends IReference {}
export interface IRateType extends IReference {}