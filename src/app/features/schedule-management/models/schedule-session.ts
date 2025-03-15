import { Tables } from "../../../../../database.types";
import { Sessions } from "../../sessions-list/models/sessions";
import { StaffAccount } from "../../staff-list/models/staff";

export class ScheduleSession implements Tables<"ScheduledSession"> {
    createdAt!: string;
    createdBy!: string | null;
    startTime!: string | null;
    endTime!: string | null;
    id!: string;
    isPrivate!: boolean;
    memberId!: string | null;
    scheduledDate!: string | null;
    sessionId!: string;
    branchId!: string | null;
    
    // FE only
    Sessions!:Sessions
    coachIds!: string[];
     SheduleCoaches?: {
    Staff: StaffAccount;
    slotId: string;
     }[];
}