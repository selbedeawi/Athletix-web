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
      Branch: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      BranchMembership: {
        Row: {
          branchid: string
          membershipid: string
        }
        Insert: {
          branchid: string
          membershipid: string
        }
        Update: {
          branchid?: string
          membershipid?: string
        }
        Relationships: [
          {
            foreignKeyName: "BranchMembership_branchid_fkey"
            columns: ["branchid"]
            isOneToOne: false
            referencedRelation: "Branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BranchMembership_membershipid_fkey"
            columns: ["membershipid"]
            isOneToOne: false
            referencedRelation: "Memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      Members: {
        Row: {
          createdBy: string | null
          dateOfBirth: string | null
          email: string
          firstName: string
          id: string
          isActive: boolean
          isFirstTime: boolean
          lastName: string
          nationalId: string | null
          phoneNumber: string | null
          role: Database["public"]["Enums"]["user_role"]
          userName: string
        }
        Insert: {
          createdBy?: string | null
          dateOfBirth?: string | null
          email: string
          firstName: string
          id: string
          isActive?: boolean
          isFirstTime?: boolean
          lastName: string
          nationalId?: string | null
          phoneNumber?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          userName: string
        }
        Update: {
          createdBy?: string | null
          dateOfBirth?: string | null
          email?: string
          firstName?: string
          id?: string
          isActive?: boolean
          isFirstTime?: boolean
          lastName?: string
          nationalId?: string | null
          phoneNumber?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          userName?: string
        }
        Relationships: [
          {
            foreignKeyName: "Members_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "Staff"
            referencedColumns: ["id"]
          },
        ]
      }
      Memberships: {
        Row: {
          freezePeriod: number | null
          id: string
          invitations: number | null
          name: string
          numberOfSessions: number | null
          price: number
          type: string | null
          visits: number | null
        }
        Insert: {
          freezePeriod?: number | null
          id?: string
          invitations?: number | null
          name: string
          numberOfSessions?: number | null
          price: number
          type?: string | null
          visits?: number | null
        }
        Update: {
          freezePeriod?: number | null
          id?: string
          invitations?: number | null
          name?: string
          numberOfSessions?: number | null
          price?: number
          type?: string | null
          visits?: number | null
        }
        Relationships: []
      }
      ScheduledSession: {
        Row: {
          coachId: string | null
          createdAt: string
          createdBy: string | null
          endTime: string | null
          id: string
          isPrivate: boolean
          memberId: string | null
          scheduledDate: string | null
          sessionId: string
          startTime: string | null
        }
        Insert: {
          coachId?: string | null
          createdAt?: string
          createdBy?: string | null
          endTime?: string | null
          id?: string
          isPrivate?: boolean
          memberId?: string | null
          scheduledDate?: string | null
          sessionId: string
          startTime?: string | null
        }
        Update: {
          coachId?: string | null
          createdAt?: string
          createdBy?: string | null
          endTime?: string | null
          id?: string
          isPrivate?: boolean
          memberId?: string | null
          scheduledDate?: string | null
          sessionId?: string
          startTime?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ScheduledSession_coachId_fkey"
            columns: ["coachId"]
            isOneToOne: false
            referencedRelation: "Staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ScheduledSession_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "Staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ScheduledSession_memberId_fkey"
            columns: ["memberId"]
            isOneToOne: false
            referencedRelation: "Members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ScheduledSession_sessionId_fkey"
            columns: ["sessionId"]
            isOneToOne: false
            referencedRelation: "Sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      Sessions: {
        Row: {
          description: string | null
          id: string
          isActive: boolean
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          isActive?: boolean
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          isActive?: boolean
          name?: string
        }
        Relationships: []
      }
      Staff: {
        Row: {
          email: string
          firstName: string
          id: string
          isActive: boolean
          lastName: string
          phoneNumber: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          email: string
          firstName: string
          id: string
          isActive?: boolean
          lastName: string
          phoneNumber?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          email?: string
          firstName?: string
          id?: string
          isActive?: boolean
          lastName?: string
          phoneNumber?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      StaffBranch: {
        Row: {
          branchId: string
          staffId: string
        }
        Insert: {
          branchId: string
          staffId: string
        }
        Update: {
          branchId?: string
          staffId?: string
        }
        Relationships: [
          {
            foreignKeyName: "StaffBranch_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "Branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "StaffBranch_staffId_fkey"
            columns: ["staffId"]
            isOneToOne: false
            referencedRelation: "Staff"
            referencedColumns: ["id"]
          },
        ]
      }
      UserMembership: {
        Row: {
          actualFreezePeriod: number | null
          actualInvitations: number | null
          actualPrice: number
          actualSessions: number | null
          actualVisits: number | null
          expiryDate: string
          id: string
          isActive: boolean
          memberId: string
          memberShipId: string
          salesId: string | null
          startDate: string
        }
        Insert: {
          actualFreezePeriod?: number | null
          actualInvitations?: number | null
          actualPrice: number
          actualSessions?: number | null
          actualVisits?: number | null
          expiryDate: string
          id?: string
          isActive?: boolean
          memberId: string
          memberShipId: string
          salesId?: string | null
          startDate: string
        }
        Update: {
          actualFreezePeriod?: number | null
          actualInvitations?: number | null
          actualPrice?: number
          actualSessions?: number | null
          actualVisits?: number | null
          expiryDate?: string
          id?: string
          isActive?: boolean
          memberId?: string
          memberShipId?: string
          salesId?: string | null
          startDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserMembership_memberId_fkey"
            columns: ["memberId"]
            isOneToOne: false
            referencedRelation: "Members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserMembership_memberShipId_fkey"
            columns: ["memberShipId"]
            isOneToOne: false
            referencedRelation: "Memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserMembership_salesId_fkey"
            columns: ["salesId"]
            isOneToOne: false
            referencedRelation: "Staff"
            referencedColumns: ["id"]
          },
        ]
      }
      UserSessions: {
        Row: {
          bookingDate: string
          createdAt: string
          id: string
          scheduledSessionId: string
          userMemberShipId: string
        }
        Insert: {
          bookingDate: string
          createdAt?: string
          id?: string
          scheduledSessionId: string
          userMemberShipId: string
        }
        Update: {
          bookingDate?: string
          createdAt?: string
          id?: string
          scheduledSessionId?: string
          userMemberShipId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserSessions_scheduledSessionId_fkey"
            columns: ["scheduledSessionId"]
            isOneToOne: false
            referencedRelation: "ScheduledSession"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserSessions_userMemberShipId_fkey"
            columns: ["userMemberShipId"]
            isOneToOne: false
            referencedRelation: "UserMembership"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_staff_with_branches:
        | {
            Args: {
              staff_id: string
              first_name: string
              last_name: string
              is_active: boolean
              phone_number: string
              new_branch_ids: string[]
            }
            Returns: {
              updated_staff_id: string
              success: boolean
              message: string
            }[]
          }
        | {
            Args: {
              staff_id: string
              first_name: string
              last_name: string
              new_email: string
              is_active: boolean
              new_role: Database["public"]["Enums"]["user_role"]
              phone_number: string
              new_branch_ids: string[]
            }
            Returns: {
              updated_staff_id: string
              success: boolean
              message: string
            }[]
          }
        | {
            Args: {
              staff_id: string
              first_name: string
              last_name: string
              user_name: string
              email: string
              is_active: boolean
              role: Database["public"]["Enums"]["user_role"]
              phone_number: string
              date_of_birth: string
              national_id: string
              new_branch_ids: string[]
            }
            Returns: {
              updated_staff_id: string
              success: boolean
              message: string
            }[]
          }
    }
    Enums: {
      user_role:
        | "SuperAdmin"
        | "Sales"
        | "Receptionist"
        | "Coach"
        | "SalesManager"
        | "SessionManager"
        | "Member"
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
