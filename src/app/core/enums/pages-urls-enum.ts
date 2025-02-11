export enum APP_ROUTES {
  AUTH = "auth",
  LOGIN = "login",
  RESET_PASSWORD = "reset-password",
  CONFIRM_PASSWORD = "reset/:passwordToken",
  RESEND_CONFIRM = "resend-confirm",

  ADMIN = "admin",
  ADMIN_DASHBOARD = "admin-dashboard",
  MEMBERS_LIST = "members-list",
  STAFF_LIST = "staff-list",
  SESSIONS_LIST = "sessions-list",
  SCHEDULE_MANAGEMENT = "schedule-management",
  BOOKED_SESSIONS = "booked-sessions",

  SALES_MANAGER = "SALES_MANAGER",
  SESSION_MANAGER = "SESSION_MANAGER",
  SALES = "SALES",
  RECEPTIONIST = "RECEPTIONIST",
  COACH = "COACH",
  MEMBER = "MEMBER",
}
