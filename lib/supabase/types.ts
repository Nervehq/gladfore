export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'agent' | 'farmer';
export type OrderStatus = 'pending' | 'approved' | 'rejected';
export type PaymentType = 'down_payment' | 'installment';
export type RepaymentStatus = 'pending' | 'paid' | 'overdue';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          phone_number: string | null;
          national_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          full_name: string;
          phone_number?: string | null;
          national_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          phone_number?: string | null;
          national_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      farmers: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          phone_number: string;
          national_id: string;
          is_registered: boolean;
          linked_agent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          phone_number: string;
          national_id: string;
          is_registered?: boolean;
          linked_agent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          phone_number?: string;
          national_id?: string;
          is_registered?: boolean;
          linked_agent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          farmer_id: string;
          agent_id: string;
          total_cost: number;
          down_payment_required: number;
          down_payment_received: number;
          remaining_balance: number;
          status: OrderStatus;
          order_details: Json;
          approved_by: string | null;
          approved_at: string | null;
          approval_comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          agent_id: string;
          total_cost: number;
          down_payment_required: number;
          down_payment_received: number;
          remaining_balance: number;
          status?: OrderStatus;
          order_details?: Json;
          approved_by?: string | null;
          approved_at?: string | null;
          approval_comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          agent_id?: string;
          total_cost?: number;
          down_payment_required?: number;
          down_payment_received?: number;
          remaining_balance?: number;
          status?: OrderStatus;
          order_details?: Json;
          approved_by?: string | null;
          approved_at?: string | null;
          approval_comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          farmer_id: string;
          amount: number;
          payment_type: PaymentType;
          recorded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          farmer_id: string;
          amount: number;
          payment_type: PaymentType;
          recorded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          farmer_id?: string;
          amount?: number;
          payment_type?: PaymentType;
          recorded_by?: string;
          created_at?: string;
        };
      };
      repayment_schedules: {
        Row: {
          id: string;
          order_id: string;
          farmer_id: string;
          installment_number: number;
          due_date: string;
          amount_due: number;
          amount_paid: number;
          status: RepaymentStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          farmer_id: string;
          installment_number: number;
          due_date: string;
          amount_due: number;
          amount_paid?: number;
          status?: RepaymentStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          farmer_id?: string;
          installment_number?: number;
          due_date?: string;
          amount_due?: number;
          amount_paid?: number;
          status?: RepaymentStatus;
          created_at?: string;
        };
      };
    };
  };
}
