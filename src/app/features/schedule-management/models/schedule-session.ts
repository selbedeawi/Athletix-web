import { Tables } from "../../../../../database.types";
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
     coachIds!: string[];
     SheduleCoaches?: {
    Staff: StaffAccount;
    slotId: string;
     }[];
}