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
      Banners: {
        Row: {
          id: number
          Name: string | null
          Url: string | null
        }
        Insert: {
          id?: number
          Name?: string | null
          Url?: string | null
        }
        Update: {
          id?: number
          Name?: string | null
          Url?: string | null
        }
        Relationships: []
      }
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
          memberId: string | null
          nationalId: string | null
          phoneNumber: string | null
          role: Database["public"]["Enums"]["user_role"]
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
          memberId?: string | null
          nationalId?: string | null
          phoneNumber?: string | null
          role?: Database["public"]["Enums"]["user_role"]
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
          memberId?: string | null
          nationalId?: string | null
          phoneNumber?: string | null
          role?: Database["public"]["Enums"]["user_role"]
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
      MembershipBranches: {
        Row: {
          branchId: string
          membershipId: string
        }
        Insert: {
          branchId: string
          membershipId: string
        }
        Update: {
          branchId?: string
          membershipId?: string
        }
        Relationships: [
          {
            foreignKeyName: "MembershipBranches_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "Branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MembershipBranches_membershipId_fkey"
            columns: ["membershipId"]
            isOneToOne: false
            referencedRelation: "Memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      Memberships: {
        Row: {
          amount: number
          amountAfterDiscount: number
          createdAt: string
          durationInDays: number
          freezePeriod: number
          hasGroupFitness: boolean | null
          hasJacuzzi: boolean | null
          hasSteam: boolean | null
          hasSunna: boolean | null
          id: string
          inBodyCount: number | null
          modifiedAt: string
          name: string
          numberOfInvitations: number | null
          numberOfSessions: number | null
          numberOfVisits: number | null
          personalTrainerCount: number | null
          type: Database["public"]["Enums"]["membership_type"]
        }
        Insert: {
          amount: number
          amountAfterDiscount: number
          createdAt?: string
          durationInDays: number
          freezePeriod?: number
          hasGroupFitness?: boolean | null
          hasJacuzzi?: boolean | null
          hasSteam?: boolean | null
          hasSunna?: boolean | null
          id?: string
          inBodyCount?: number | null
          modifiedAt?: string
          name: string
          numberOfInvitations?: number | null
          numberOfSessions?: number | null
          numberOfVisits?: number | null
          personalTrainerCount?: number | null
          type: Database["public"]["Enums"]["membership_type"]
        }
        Update: {
          amount?: number
          amountAfterDiscount?: number
          createdAt?: string
          durationInDays?: number
          freezePeriod?: number
          hasGroupFitness?: boolean | null
          hasJacuzzi?: boolean | null
          hasSteam?: boolean | null
          hasSunna?: boolean | null
          id?: string
          inBodyCount?: number | null
          modifiedAt?: string
          name?: string
          numberOfInvitations?: number | null
          numberOfSessions?: number | null
          numberOfVisits?: number | null
          personalTrainerCount?: number | null
          type?: Database["public"]["Enums"]["membership_type"]
        }
        Relationships: []
      }
      PrivateSessionsBooking: {
        Row: {
          BookingDate: string | null
          branchId: string | null
          coachId: string | null
          created_at: string
          id: number
          Time: string | null
          userMembershipId: string | null
        }
        Insert: {
          BookingDate?: string | null
          branchId?: string | null
          coachId?: string | null
          created_at?: string
          id?: number
          Time?: string | null
          userMembershipId?: string | null
        }
        Update: {
          BookingDate?: string | null
          branchId?: string | null
          coachId?: string | null
          created_at?: string
          id?: number
          Time?: string | null
          userMembershipId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "PrivateSessionsBooking_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "Branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PrivateSessionsBooking_coachId_fkey"
            columns: ["coachId"]
            isOneToOne: false
            referencedRelation: "Staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PrivateSessionsBooking_userMembershipId_fkey"
            columns: ["userMembershipId"]
            isOneToOne: false
            referencedRelation: "UserMembership"
            referencedColumns: ["id"]
          },
        ]
      }
      ScheduledSession: {
        Row: {
          branchId: string | null
          createdAt: string
          createdBy: string | null
          endTime: string | null
          id: string
          scheduledDate: string | null
          sessionId: string
          startTime: string | null
        }
        Insert: {
          branchId?: string | null
          createdAt?: string
          createdBy?: string | null
          endTime?: string | null
          id?: string
          scheduledDate?: string | null
          sessionId: string
          startTime?: string | null
        }
        Update: {
          branchId?: string | null
          createdAt?: string
          createdBy?: string | null
          endTime?: string | null
          id?: string
          scheduledDate?: string | null
          sessionId?: string
          startTime?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ScheduledSession_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "Branch"
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
            foreignKeyName: "ScheduledSession_sessionId_fkey"
            columns: ["sessionId"]
            isOneToOne: false
            referencedRelation: "Sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      Services: {
        Row: {
          Contact: string | null
          Description: string | null
          id: number
          ImageUrl: string | null
          Title: string
        }
        Insert: {
          Contact?: string | null
          Description?: string | null
          id?: number
          ImageUrl?: string | null
          Title: string
        }
        Update: {
          Contact?: string | null
          Description?: string | null
          id?: number
          ImageUrl?: string | null
          Title?: string
        }
        Relationships: []
      }
      Sessions: {
        Row: {
          description: string | null
          id: string
          imageUrl: string | null
          isActive: boolean
          level: string | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          imageUrl?: string | null
          isActive?: boolean
          level?: string | null
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          imageUrl?: string | null
          isActive?: boolean
          level?: string | null
          name?: string
        }
        Relationships: []
      }
      SessionsBranches: {
        Row: {
          branchId: string | null
          sessionId: string | null
        }
        Insert: {
          branchId?: string | null
          sessionId?: string | null
        }
        Update: {
          branchId?: string | null
          sessionId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "SessionsBranches_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "Branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SessionsBranches_sessionId_fkey"
            columns: ["sessionId"]
            isOneToOne: false
            referencedRelation: "Sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      SheduleCoaches: {
        Row: {
          coachId: string
          scheduledSessionId: string
        }
        Insert: {
          coachId: string
          scheduledSessionId: string
        }
        Update: {
          coachId?: string
          scheduledSessionId?: string
        }
        Relationships: [
          {
            foreignKeyName: "SheduleCoaches_coachId_fkey"
            columns: ["coachId"]
            isOneToOne: false
            referencedRelation: "Staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SheduleCoaches_scheduledSessionId_fkey"
            columns: ["scheduledSessionId"]
            isOneToOne: true
            referencedRelation: "ScheduledSession"
            referencedColumns: ["id"]
          },
        ]
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
          branchId: string
          coachId: string | null
          createdAt: string
          createdBy: string | null
          endDate: string
          freezeEnd: string | null
          freezePeriod: number
          freezeStart: string | null
          hasGroupFitness: boolean
          hasJacuzzi: boolean
          hasSteam: boolean
          hasSunna: boolean
          id: string
          isActive: boolean
          isCanceled: boolean
          isFreeze: boolean
          memberId: string
          membershipId: string
          modifiedAt: string
          modifiedBy: string | null
          name: string
          numberOfInBody: number
          numberOfInvitations: number
          numberOfPersonalTrainer: number
          numberOfSessions: number | null
          numberOfVisits: number
          pricePaid: number
          remainingFreezePeriod: number | null
          remainingGroupSessions: number | null
          remainingInBody: number
          remainingInvitations: number
          remainingPersonalTrainer: number
          remainingPTSessions: number | null
          remainingVisits: number
          salesId: string | null
          startDate: string
          type: Database["public"]["Enums"]["membership_type"]
        }
        Insert: {
          branchId: string
          coachId?: string | null
          createdAt?: string
          createdBy?: string | null
          endDate: string
          freezeEnd?: string | null
          freezePeriod?: number
          freezeStart?: string | null
          hasGroupFitness: boolean
          hasJacuzzi: boolean
          hasSteam: boolean
          hasSunna: boolean
          id?: string
          isActive?: boolean
          isCanceled?: boolean
          isFreeze?: boolean
          memberId: string
          membershipId: string
          modifiedAt?: string
          modifiedBy?: string | null
          name: string
          numberOfInBody?: number
          numberOfInvitations?: number
          numberOfPersonalTrainer?: number
          numberOfSessions?: number | null
          numberOfVisits?: number
          pricePaid: number
          remainingFreezePeriod?: number | null
          remainingGroupSessions?: number | null
          remainingInBody?: number
          remainingInvitations?: number
          remainingPersonalTrainer?: number
          remainingPTSessions?: number | null
          remainingVisits?: number
          salesId?: string | null
          startDate: string
          type: Database["public"]["Enums"]["membership_type"]
        }
        Update: {
          branchId?: string
          coachId?: string | null
          createdAt?: string
          createdBy?: string | null
          endDate?: string
          freezeEnd?: string | null
          freezePeriod?: number
          freezeStart?: string | null
          hasGroupFitness?: boolean
          hasJacuzzi?: boolean
          hasSteam?: boolean
          hasSunna?: boolean
          id?: string
          isActive?: boolean
          isCanceled?: boolean
          isFreeze?: boolean
          memberId?: string
          membershipId?: string
          modifiedAt?: string
          modifiedBy?: string | null
          name?: string
          numberOfInBody?: number
          numberOfInvitations?: number
          numberOfPersonalTrainer?: number
          numberOfSessions?: number | null
          numberOfVisits?: number
          pricePaid?: number
          remainingFreezePeriod?: number | null
          remainingGroupSessions?: number | null
          remainingInBody?: number
          remainingInvitations?: number
          remainingPersonalTrainer?: number
          remainingPTSessions?: number | null
          remainingVisits?: number
          salesId?: string | null
          startDate?: string
          type?: Database["public"]["Enums"]["membership_type"]
        }
        Relationships: [
          {
            foreignKeyName: "UserMembership_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "Branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserMembership_coachId_fkey"
            columns: ["coachId"]
            isOneToOne: false
            referencedRelation: "Staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserMembership_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "Staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserMembership_memberId_fkey"
            columns: ["memberId"]
            isOneToOne: false
            referencedRelation: "Members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserMembership_membershipId_fkey"
            columns: ["membershipId"]
            isOneToOne: false
            referencedRelation: "Memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserMembership_modifiedBy_fkey"
            columns: ["modifiedBy"]
            isOneToOne: false
            referencedRelation: "Staff"
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
          branchId: string | null
          createdAt: string
          id: string
          scheduledSessionId: string
          userMemberShipId: string
        }
        Insert: {
          bookingDate: string
          branchId?: string | null
          createdAt?: string
          id?: string
          scheduledSessionId: string
          userMemberShipId: string
        }
        Update: {
          bookingDate?: string
          branchId?: string | null
          createdAt?: string
          id?: string
          scheduledSessionId?: string
          userMemberShipId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserSessions_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "Branch"
            referencedColumns: ["id"]
          },
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
      membership_type: "Individual" | "PrivateCoach" | "SessionBased"
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
