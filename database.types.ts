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
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          allowScan: boolean
          id: string
          machineSerialNumber: string | null
          name: string
        }
        Insert: {
          allowScan?: boolean
          id?: string
          machineSerialNumber?: string | null
          name: string
        }
        Update: {
          allowScan?: boolean
          id?: string
          machineSerialNumber?: string | null
          name?: string
        }
        Relationships: []
      }
      DeviceAccess: {
        Row: {
          access_granted: boolean
          created_at: string
          device_serial: string
          enroll_id: number
          id: number
          userId: string
        }
        Insert: {
          access_granted: boolean
          created_at?: string
          device_serial: string
          enroll_id: number
          id?: number
          userId?: string
        }
        Update: {
          access_granted?: boolean
          created_at?: string
          device_serial?: string
          enroll_id?: number
          id?: number
          userId?: string
        }
        Relationships: []
      }
      deviceTokens: {
        Row: {
          created_at: string
          id: string
          platForm: string
          token: string
          userId: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          platForm: string
          token: string
          userId?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          platForm?: string
          token?: string
          userId?: string | null
        }
        Relationships: []
      }
      Members: {
        Row: {
          createdBy: string | null
          dateOfBirth: string | null
          email: string
          firstName: string
          gender: Database["public"]["Enums"]["user-gender"]
          id: string
          isActive: boolean
          isDeleted: boolean
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
          gender: Database["public"]["Enums"]["user-gender"]
          id: string
          isActive?: boolean
          isDeleted?: boolean
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
          gender?: Database["public"]["Enums"]["user-gender"]
          id?: string
          isActive?: boolean
          isDeleted?: boolean
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
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: number
          title: string | null
          userId: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: number
          title?: string | null
          userId?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: number
          title?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "notifications_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Members"
            referencedColumns: ["id"]
          },
        ]
      }
      PrivateSessionsBooking: {
        Row: {
          bookingDate: string
          branchId: string
          coachId: string
          createdAt: string
          id: string
          memberId: string
          time: string
          userMembershipId: string
        }
        Insert: {
          bookingDate: string
          branchId: string
          coachId: string
          createdAt?: string
          id?: string
          memberId: string
          time: string
          userMembershipId: string
        }
        Update: {
          bookingDate?: string
          branchId?: string
          coachId?: string
          createdAt?: string
          id?: string
          memberId?: string
          time?: string
          userMembershipId?: string
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
            foreignKeyName: "PrivateSessionsBooking_memberId_fkey"
            columns: ["memberId"]
            isOneToOne: false
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "PrivateSessionsBooking_memberId_fkey"
            columns: ["memberId"]
            isOneToOne: false
            referencedRelation: "Members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PrivateSessionsBooking_userMembershipId_fkey"
            columns: ["userMembershipId"]
            isOneToOne: false
            referencedRelation: "flattened_private_sessions_booking"
            referencedColumns: ["membership_id"]
          },
          {
            foreignKeyName: "PrivateSessionsBooking_userMembershipId_fkey"
            columns: ["userMembershipId"]
            isOneToOne: false
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["user_membership_id"]
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
          FullImage: string | null
          id: number
          ImageUrl: string | null
          Order: number | null
          Title: string
        }
        Insert: {
          Contact?: string | null
          Description?: string | null
          FullImage?: string | null
          id?: number
          ImageUrl?: string | null
          Order?: number | null
          Title: string
        }
        Update: {
          Contact?: string | null
          Description?: string | null
          FullImage?: string | null
          id?: number
          ImageUrl?: string | null
          Order?: number | null
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
            isOneToOne: false
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["scheduled_session_id"]
          },
          {
            foreignKeyName: "SheduleCoaches_scheduledSessionId_fkey"
            columns: ["scheduledSessionId"]
            isOneToOne: false
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
          isDeleted: boolean
          lastName: string
          phoneNumber: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          email: string
          firstName: string
          id: string
          isActive?: boolean
          isDeleted?: boolean
          lastName: string
          phoneNumber?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          email?: string
          firstName?: string
          id?: string
          isActive?: boolean
          isDeleted?: boolean
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
          numberOfPersonalTrainer: number | null
          numberOfSessions: number | null
          numberOfVisits: number
          pricePaid: number
          receiptNumber: string | null
          remainingFreezePeriod: number | null
          remainingGroupSessions: number | null
          remainingInBody: number
          remainingInvitations: number
          remainingPersonalTrainer: number
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
          numberOfPersonalTrainer?: number | null
          numberOfSessions?: number | null
          numberOfVisits?: number
          pricePaid: number
          receiptNumber?: string | null
          remainingFreezePeriod?: number | null
          remainingGroupSessions?: number | null
          remainingInBody?: number
          remainingInvitations?: number
          remainingPersonalTrainer?: number
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
          numberOfPersonalTrainer?: number | null
          numberOfSessions?: number | null
          numberOfVisits?: number
          pricePaid?: number
          receiptNumber?: string | null
          remainingFreezePeriod?: number | null
          remainingGroupSessions?: number | null
          remainingInBody?: number
          remainingInvitations?: number
          remainingPersonalTrainer?: number
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
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["member_id"]
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
          branchId: string
          createdAt: string
          id: string
          memberId: string | null
          scheduledSessionId: string
          userMemberShipId: string
        }
        Insert: {
          branchId: string
          createdAt?: string
          id?: string
          memberId?: string | null
          scheduledSessionId: string
          userMemberShipId: string
        }
        Update: {
          branchId?: string
          createdAt?: string
          id?: string
          memberId?: string | null
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
            foreignKeyName: "UserSessions_memberId_fkey"
            columns: ["memberId"]
            isOneToOne: false
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "UserSessions_memberId_fkey"
            columns: ["memberId"]
            isOneToOne: false
            referencedRelation: "Members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserSessions_scheduledSessionId_fkey"
            columns: ["scheduledSessionId"]
            isOneToOne: false
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["scheduled_session_id"]
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
            referencedRelation: "flattened_private_sessions_booking"
            referencedColumns: ["membership_id"]
          },
          {
            foreignKeyName: "UserSessions_userMemberShipId_fkey"
            columns: ["userMemberShipId"]
            isOneToOne: false
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["user_membership_id"]
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
      flattened_private_sessions_booking: {
        Row: {
          booking_branchid: string | null
          booking_createdat: string | null
          bookingDate: string | null
          branch_name: string | null
          coach_email: string | null
          coach_firstname: string | null
          coach_lastname: string | null
          coachId: string | null
          endDate: string | null
          member_email: string | null
          member_firstname: string | null
          member_lastname: string | null
          member_memberid: string | null
          member_nationalid: string | null
          member_phonenumber: string | null
          membership_createdat: string | null
          membership_id: string | null
          membership_name: string | null
          membership_startdate: string | null
          pricePaid: number | null
          private_booking_id: string | null
          time: string | null
          userMembershipId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "PrivateSessionsBooking_branchId_fkey"
            columns: ["booking_branchid"]
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
            referencedRelation: "flattened_private_sessions_booking"
            referencedColumns: ["membership_id"]
          },
          {
            foreignKeyName: "PrivateSessionsBooking_userMembershipId_fkey"
            columns: ["userMembershipId"]
            isOneToOne: false
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["user_membership_id"]
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
      flattened_user_sessions_full: {
        Row: {
          coach_ids: string | null
          coachId: string | null
          createdBy: string | null
          dateOfBirth: string | null
          email: string | null
          endDate: string | null
          endTime: string | null
          firstName: string | null
          freezeEnd: string | null
          freezePeriod: number | null
          freezeStart: string | null
          hasGroupFitness: boolean | null
          hasJacuzzi: boolean | null
          hasSteam: boolean | null
          hasSunna: boolean | null
          isCanceled: boolean | null
          isFirstTime: boolean | null
          isFreeze: boolean | null
          lastName: string | null
          member_createdby: string | null
          member_id: string | null
          member_isactive: boolean | null
          member_memberid: string | null
          member_role: Database["public"]["Enums"]["user_role"] | null
          memberId: string | null
          membership_branchid: string | null
          membership_createdat: string | null
          membership_isactive: boolean | null
          membership_name: string | null
          membership_startdate: string | null
          membership_type: Database["public"]["Enums"]["membership_type"] | null
          membershipId: string | null
          modifiedAt: string | null
          modifiedBy: string | null
          nationalId: string | null
          numberOfInBody: number | null
          numberOfInvitations: number | null
          numberOfPersonalTrainer: number | null
          numberOfSessions: number | null
          numberOfVisits: number | null
          phoneNumber: string | null
          pricePaid: number | null
          remainingFreezePeriod: number | null
          remainingGroupSessions: number | null
          remainingInBody: number | null
          remainingInvitations: number | null
          remainingPersonalTrainer: number | null
          remainingVisits: number | null
          salesId: string | null
          scheduled_session_branchid: string | null
          scheduled_session_createdat: string | null
          scheduled_session_createdby: string | null
          scheduled_session_id: string | null
          scheduledDate: string | null
          scheduledSessionId: string | null
          session_name: string | null
          sessionId: string | null
          shedule_coaches: Json | null
          startTime: string | null
          user_membership_id: string | null
          user_session_branchid: string | null
          user_session_createdat: string | null
          user_session_id: string | null
          userMemberShipId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Members_createdBy_fkey"
            columns: ["member_createdby"]
            isOneToOne: false
            referencedRelation: "Staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ScheduledSession_branchId_fkey"
            columns: ["scheduled_session_branchid"]
            isOneToOne: false
            referencedRelation: "Branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ScheduledSession_createdBy_fkey"
            columns: ["scheduled_session_createdby"]
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
          {
            foreignKeyName: "UserMembership_branchId_fkey"
            columns: ["membership_branchid"]
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
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["member_id"]
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
          {
            foreignKeyName: "UserSessions_branchId_fkey"
            columns: ["user_session_branchid"]
            isOneToOne: false
            referencedRelation: "Branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserSessions_scheduledSessionId_fkey"
            columns: ["scheduledSessionId"]
            isOneToOne: false
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["scheduled_session_id"]
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
            referencedRelation: "flattened_private_sessions_booking"
            referencedColumns: ["membership_id"]
          },
          {
            foreignKeyName: "UserSessions_userMemberShipId_fkey"
            columns: ["userMemberShipId"]
            isOneToOne: false
            referencedRelation: "flattened_user_sessions_full"
            referencedColumns: ["user_membership_id"]
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
    Functions: {
      book_pt_session: {
        Args: {
          p_membership_id: string
          p_branch_id: string
          p_coach_id: string
          p_booking_date: string
          p_time: string
        }
        Returns: {
          new_booking_id: string
          remaining_pt_sessions: number
        }[]
      }
      book_session: {
        Args: {
          p_branch_id: string
          p_membership_id: string
          p_scheduled_session_id: string
        }
        Returns: {
          new_user_session_id: string
          new_remaining_group_sessions: number
        }[]
      }
      cancel_book_session: {
        Args: { p_user_session_id: string }
        Returns: {
          canceled_user_session_id: string
          new_remaining_group_sessions: number
        }[]
      }
      cancel_private_session: {
        Args: { p_booking_id: string }
        Returns: {
          canceled_booking_id: string
          new_remaining_pt_sessions: number
        }[]
      }
      cancel_scheduled_session: {
        Args: { p_scheduled_session_id: string }
        Returns: undefined
      }
      daily_update_membership_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      deduct_membership_visit: {
        Args: { membership_id: string }
        Returns: undefined
      }
      get_active_members: {
        Args: { branch_id: string }
        Returns: {
          memberid: string
          membername: string
        }[]
      }
      get_branch_device: {
        Args: { member_id: string }
        Returns: {
          member_name: string
          member_text_id: string
          machine_serial_number: string
          user_id: string
        }[]
      }
      get_branch_serial: {
        Args: { p_branch_id: string }
        Returns: {
          branchserial: string
        }[]
      }
      get_branches_with_scan_permission: {
        Args: Record<PropertyKey, never>
        Returns: {
          branchid: string
          branchname: string
          machineserialnumber: string
          id: string
        }[]
      }
      update_staff_with_branches: {
        Args:
          | {
              staff_id: string
              first_name: string
              last_name: string
              is_active: boolean
              phone_number: string
              new_branch_ids: string[]
            }
          | {
              staff_id: string
              first_name: string
              last_name: string
              new_email: string
              is_active: boolean
              new_role: Database["public"]["Enums"]["user_role"]
              phone_number: string
              new_branch_ids: string[]
            }
          | {
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
      "user-gender": "male" | "female"
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
      membership_type: ["Individual", "PrivateCoach", "SessionBased"],
      user_role: [
        "SuperAdmin",
        "Sales",
        "Receptionist",
        "Coach",
        "SalesManager",
        "SessionManager",
        "Member",
      ],
      "user-gender": ["male", "female"],
    },
  },
} as const
