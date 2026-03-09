export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string | null
          date_issued: string | null
          description: string | null
          id: string
          image_url: string | null
          issuer: string | null
          published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_issued?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          issuer?: string | null
          published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_issued?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          issuer?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_history: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string | null
          icon: string | null
          id: string
          published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          icon?: string | null
          id?: string
          published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          icon?: string | null
          id?: string
          published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      internship_applications: {
        Row: {
          created_at: string | null
          domain_id: string
          end_date: string | null
          id: string
          start_date: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          domain_id: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          domain_id?: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_applications_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "internship_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_certificates: {
        Row: {
          application_id: string
          created_at: string | null
          domain_name: string
          duration_text: string
          id: string
          issue_date: string | null
          student_name: string
          user_id: string
        }
        Insert: {
          application_id: string
          created_at?: string | null
          domain_name: string
          duration_text: string
          id?: string
          issue_date?: string | null
          student_name: string
          user_id: string
        }
        Update: {
          application_id?: string
          created_at?: string | null
          domain_name?: string
          duration_text?: string
          id?: string
          issue_date?: string | null
          student_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_certificates_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "internship_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_domains: {
        Row: {
          created_at: string | null
          description: string | null
          duration_months: number
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_months?: number
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_months?: number
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      internship_submissions: {
        Row: {
          application_id: string
          feedback: string | null
          id: string
          status: string
          submission_url: string
          submitted_at: string | null
          task_id: string
        }
        Insert: {
          application_id: string
          feedback?: string | null
          id?: string
          status?: string
          submission_url: string
          submitted_at?: string | null
          task_id: string
        }
        Update: {
          application_id?: string
          feedback?: string | null
          id?: string
          status?: string
          submission_url?: string
          submitted_at?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_submissions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "internship_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internship_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "internship_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_tasks: {
        Row: {
          created_at: string | null
          description: string | null
          domain_id: string
          id: string
          title: string
          week_number: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          domain_id: string
          id?: string
          title: string
          week_number: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          domain_id?: string
          id?: string
          title?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "internship_tasks_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "internship_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_blocked: boolean | null
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_blocked?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_blocked?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          live_url: string | null
          published: boolean | null
          tech_stack: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          published?: boolean | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          published?: boolean | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
