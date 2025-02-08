export enum APP_ROUTES {
  AUTH = 'auth',
  LOGIN = 'login',
  LOGIN_WITH_TOKEN = 'login/:token',
  RESET_PASSWORD = 'reset-password',
  CONFIRM_PASSWORD = 'reset/:passwordToken',
  RESEND_CONFIRM = 'resend-confirm',

  CREATE_ACCOUNT = 'create-account',

  FAMILY = 'family',
  ASSOCIATE = 'associate',
  COORDINATOR = 'coordinator',
  ADMIN = 'admin',

  FAMILY_DASHBOARD = 'dashboard',
  FAMILY_PROFILE = 'profile',
  FAMILY_MANAGE_PREFERENCES = 'manage-preferences',
  FAMILY_ASSOCIATES = 'associates',
  FAMILY_ADD_MEMBER = 'add-member',
  FAMILY_MEMBER_PROFILE = 'member',
  FAMILY_PRIMARY_PROFILE = 'primary-account',
  FAMILY_QUESTIONS = 'family_questions',

  ASSOCIATE_DASHBOARD = 'dashboard',
  ASSOCIATE_PROFILE = 'profile',
  ASSOCIATE_INFO = 'info',
  ASSOCIATE_CHECKLIST = 'checklist',
  ASSOCIATE_EXPERIENCE = 'experience',
  ASSOCIATE_AVAILABILITY = 'availability',
  ASSOCIATE_FAMILIES = 'families',
  RESOURCE_CENTRE = 'resource-Centre',

  COORDINATOR_PROFILE = 'profile',
  COORDINATOR_TASKS = 'tasks',
  COORDINATOR_USERS = 'users',
  COORDINATOR_MATCHING_TOOL = 'matching-tool',
  COORDINATOR_REPORT = 'report',

  ADMIN_COORDINATORS = 'coordinators',
  ADMIN_TRANSLATIONS = 'translations',
}
