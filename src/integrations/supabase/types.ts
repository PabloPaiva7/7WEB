export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      carteira_clientes: {
        Row: {
          banco: string | null
          codigo: string | null
          contato: string | null
          contrato: string | null
          created_at: string
          data: string | null
          entrada: string | null
          escritorio: string | null
          id: string
          negociacao: string | null
          prazo: string | null
          resolucao: string | null
          situacao: string | null
          ultimo_pagamento: string | null
          upload_id: string | null
          valor_cliente: number | null
        }
        Insert: {
          banco?: string | null
          codigo?: string | null
          contato?: string | null
          contrato?: string | null
          created_at?: string
          data?: string | null
          entrada?: string | null
          escritorio?: string | null
          id?: string
          negociacao?: string | null
          prazo?: string | null
          resolucao?: string | null
          situacao?: string | null
          ultimo_pagamento?: string | null
          upload_id?: string | null
          valor_cliente?: number | null
        }
        Update: {
          banco?: string | null
          codigo?: string | null
          contato?: string | null
          contrato?: string | null
          created_at?: string
          data?: string | null
          entrada?: string | null
          escritorio?: string | null
          id?: string
          negociacao?: string | null
          prazo?: string | null
          resolucao?: string | null
          situacao?: string | null
          ultimo_pagamento?: string | null
          upload_id?: string | null
          valor_cliente?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "carteira_clientes_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "carteira_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      carteira_uploads: {
        Row: {
          data_upload: string
          erro_mensagem: string | null
          id: string
          mapeamento: Json | null
          nome_arquivo: string
          registros_importados: number
          status: Database["public"]["Enums"]["upload_status"] | null
        }
        Insert: {
          data_upload?: string
          erro_mensagem?: string | null
          id?: string
          mapeamento?: Json | null
          nome_arquivo: string
          registros_importados: number
          status?: Database["public"]["Enums"]["upload_status"] | null
        }
        Update: {
          data_upload?: string
          erro_mensagem?: string | null
          id?: string
          mapeamento?: Json | null
          nome_arquivo?: string
          registros_importados?: number
          status?: Database["public"]["Enums"]["upload_status"] | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          id: number
          name: string
          population: number | null
        }
        Insert: {
          id?: never
          name: string
          population?: number | null
        }
        Update: {
          id?: never
          name?: string
          population?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      upload_status: "pendente" | "processando" | "concluido" | "erro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
