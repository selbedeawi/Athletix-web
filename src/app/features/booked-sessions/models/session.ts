
  
  
  interface ScheduledSession {
    id: string;
    endTime: string;
    branchId: string;
    createdAt: string;
    createdBy: string;
    sessionId: string;
    startTime: string;
    scheduledDate: string;
    SheduleCoaches: string;
  }
  
  interface Member {
    lastName: string | null;
    memberId: string | null;
    firstName: string;
    phoneNumber: string;
  }
  
  interface UserMembership {
    id: string;
    name: string;
    type: string;
    Members: Member;
    coachId: string | null;
    endDate: string;
    salesId: string | null;
    branchId: string;
    hasSteam: boolean;
    hasSunna: boolean;
    isActive: boolean;
    isFreeze: boolean;
    memberId: string;
    createdAt: string;
    createdBy: string;
    freezeEnd: string | null;
    pricePaid: number;
    startDate: string;
    hasJacuzzi: boolean;
    isCanceled: boolean;
    modifiedAt: string;
    modifiedBy: string;
    freezeStart: string | null;
    freezePeriod: number;
    membershipId: string;
    numberOfInBody: number;
    numberOfVisits: number;
    hasGroupFitness: boolean;
    remainingInBody: number;
    remainingVisits: number;
    numberOfSessions: number | null;
    numberOfInvitations: number;
    remainingInvitations: number;
    remainingFreezePeriod: number;
    remainingGroupSessions: number | null;
    numberOfPersonalTrainer: number;
    remainingPersonalTrainer: number;
  }
  
  export interface BookedSessionResponse {
    id: string;
    scheduledSessionId: string;
    userMemberShipId: string;
    bookingDate: string;
    createdAt: string;
    branchId: string | null;
    ScheduledSession: ScheduledSession;
    UserMembership: UserMembership;
  }
  