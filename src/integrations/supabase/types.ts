export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      invoices: {
        Row: {
          created_at: string
          created_by: string
          descripcion: string
          estado: string
          fecha: string
          id: string
          imagen_url: string | null
          limite_pago: string
          monto: number
          nombre_empresa: string
          numero_factura: string
          proveedor: string
          rif: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          descripcion: string
          estado?: string
          fecha: string
          id?: string
          imagen_url?: string | null
          limite_pago: string
          monto: number
          nombre_empresa: string
          numero_factura: string
          proveedor: string
          rif?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          descripcion?: string
          estado?: string
          fecha?: string
          id?: string
          imagen_url?: string | null
          limite_pago?: string
          monto?: number
          nombre_empresa?: string
          numero_factura?: string
          proveedor?: string
          rif?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          comprobante_url: string
          created_at: string
          created_by: string
          descripcion_pago: string | null
          fecha_pago: string
          id: string
          invoice_id: string
          monto_pagado: number
          updated_at: string
        }
        Insert: {
          comprobante_url: string
          created_at?: string
          created_by: string
          descripcion_pago?: string | null
          fecha_pago: string
          id?: string
          invoice_id: string
          monto_pagado: number
          updated_at?: string
        }
        Update: {
          comprobante_url?: string
          created_at?: string
          created_by?: string
          descripcion_pago?: string | null
          fecha_pago?: string
          id?: string
          invoice_id?: string
          monto_pagado?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          categoria: string | null
          contacto: string | null
          created_at: string
          direccion: string | null
          email: string | null
          id: string
          nombre: string | null
          nombre_empresa: string | null
          rif: string | null
          role: string
          telefono: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          categoria?: string | null
          contacto?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string | null
          nombre_empresa?: string | null
          rif?: string | null
          role: string
          telefono?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          categoria?: string | null
          contacto?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string | null
          nombre_empresa?: string | null
          rif?: string | null
          role?: string
          telefono?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_user: {
        Args: { input_username: string; input_password: string }
        Returns: {
          id: string
          user_id: string
          username: string
          role: string
          nombre: string
          telefono: string
          email: string
          direccion: string
          rif: string
          nombre_empresa: string
          contacto: string
          categoria: string
        }[]
      }
      create_user_profile: {
        Args: {
          input_username: string
          input_password: string
          input_role: string
          input_nombre?: string
          input_telefono?: string
          input_email?: string
          input_direccion?: string
          input_rif?: string
          input_nombre_empresa?: string
          input_contacto?: string
          input_categoria?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
